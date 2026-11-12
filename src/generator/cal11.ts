// CAL-11 (knowledge/calibrage-kaggle.md §5, validé par `kine` le 12/11/2026 ; dose NON SOURCÉ) : compléments de fin de séance en PUSH / HAUT quand
// les deltoïdes sont au plafond. Aucun plafond n'est franchi : mêmes garde-fous que le correctif (sessionOk, weekOk, zoneCapsOk), la fiche
// ajoutée n'a aucun coefficient >= 0,5 sur epaules_*, dose fixe (2 séries, capped : jamais de montée de charge), signes d'arrêt affichés.
import { CAL11, CORE_MAX, CORE_SAFE_FAMILIES, CORE_WHEEL_IDS, CORRECTIF, TRONC_SCHEMAS, VOLUME } from './config';
import { coreFamilyOf } from './core';
import { levelIdx, type Ctx } from './context';
import { estimerDuree } from './duration';
import { isIsoSlot } from './isolation';
import { resolveFiche, type Candidate } from './safety';
import { isTwinOfUsed } from './slots';
import type { Fiche, FicheVariant, GenExercise } from './types';
import { correctifExercise, hasHeavyShoulderTrap, isHeavyShoulderTrapExercise, zoneCapsOk, type FillDeps } from './zones-check';
import { zoneCoefs, type ZoneFiche, type ZoneId } from '../zones/zones';
import type { DurSession } from './duration';

type Sess = DurSession<GenExercise>;

const SHOULDER_ZONES: readonly ZoneId[] = ['epaules_avant', 'epaules_cote', 'epaules_arriere'];
/** Zone de blessure liée à chaque ligne (niveau >= 1 ou douleur récente : aucun ajout). */
type Link = 'epaule' | 'dos';
interface Row {
  key: string;
  link: Link;
  /** La fiche entre-t-elle dans la ligne ? */
  fiche: (f: Fiche) => boolean;
  /** Variante admise (version par défaut). */
  variant?: (v: FicheVariant) => boolean;
  /** Refus si le poignet est gêné (niveau >= 1). */
  wristFree?: (f: Fiche) => boolean;
  reps?: { min: number; max: number; rir: number };
}

const ZONE = (f: Fiche): ReadonlyMap<ZoneId, number> => zoneCoefs(f as ZoneFiche);
const coef = (f: Fiche, z: ZoneId) => ZONE(f).get(z) ?? 0;
const hasLoadTag = (v: FicheVariant) => v.tags.some((t) => t === 'halteres' || t === 'kettlebell' || t === 'disques' || t === 'barre' || t === 'lest');

const ROWS: readonly Row[] = [
  {
    key: 'tronc', link: 'dos',
    fiche: (f) => TRONC_SCHEMAS.includes(f.schema) && coreFamilyOf(f) !== null && CORE_SAFE_FAMILIES.includes(coreFamilyOf(f)!) && !CORE_WHEEL_IDS.includes(f.id),
    wristFree: (f) => !CAL11.handSupportedCoreIds.includes(f.id),
  },
  {
    key: 'dentele_anterieur', link: 'epaule',
    fiche: (f) => CAL11.dentele.ids.includes(f.id) && coef(f, 'dentele_anterieur') >= 0.5,
    // Version murale ou genoux par défaut.
    variant: (v) => v.tags.includes('mur') || /genou/i.test(`${v.id} ${v.nom}`),
    wristFree: () => false,
    reps: { min: CAL11.dentele.repsMin, max: CAL11.dentele.repsMax, rir: CAL11.dentele.rir },
  },
  {
    key: 'trapezes_bas', link: 'epaule',
    fiche: (f) => coef(f, 'trapezes_bas') >= 0.5 && f.musclesPrincipaux.includes('trapezes'),
  },
  {
    key: 'coiffe_rotateurs', link: 'epaule',
    fiche: (f) => (CORRECTIF.ids.coiffe_rotateurs ?? []).includes(f.id) && coef(f, 'coiffe_rotateurs') >= 0.5,
    // Élastique le plus léger ou sans charge, jamais d'haltère.
    variant: (v) => !hasLoadTag(v),
    reps: { min: CAL11.coiffe.repsMin, max: CAL11.coiffe.repsMax, rir: CAL11.coiffe.rir },
  },
  {
    key: 'pectoraux', link: 'epaule',
    // Écarté sans point de deltoïdes ; sinon rien.
    fiche: (f) => /^ecarte/.test(f.id) && f.schema === 'poussee_h' && (coef(f, 'pectoraux_haut') >= 0.5 || coef(f, 'pectoraux_milieu_bas') >= 0.5),
  },
  // Triceps : EXCLU (kiné 12/11/2026 a refusé CAL-9 : coude, tendon, aucune source).
];

const levelOf = (ctx: Ctx, key: string) => ctx.zones.find((z) => !z.isG && z.key === key)?.level ?? 0;
const ficheTouchesSensitive = (f: Fiche, ctx: Ctx) =>
  ctx.zones.some((z) => !z.isG && z.level >= 1 && Object.prototype.hasOwnProperty.call(f.securite.zones, z.key));
const workSets = (exs: readonly GenExercise[]) => exs.reduce((a, e) => a + (e.role === 'cardio' ? 0 : e.sets), 0);
const isCore = (e: GenExercise, ctx: Ctx) => {
  const f = ctx.fichesById.get(e.ficheId);
  return !!f && TRONC_SCHEMAS.includes(f.schema) && coreFamilyOf(f) !== null;
};

/** Profils exclus : débutant, grossesse, post-partum, reprise, semaine allégée. */
export const cal11Allowed = (ctx: Ctx): boolean =>
  CAL11.enabled && ctx.level !== 'debutant' && !ctx.pregnant && !ctx.postPartum && !ctx.repriseActive && !ctx.lightWeek;

/** Une ligne est fermée si la zone liée est gênée (niveau >= 1) ou a eu une douleur récente. */
const rowOpen = (r: Row, ctx: Ctx) => levelOf(ctx, r.link) < 1 && !ctx.recentPainZones.has(r.link);

/** Fiches de la ligne admissibles pour le profil, classées par niveau puis id (variante par défaut choisie). */
function rowCandidates(r: Row, ctx: Ctx, pool: readonly Fiche[]): Candidate[] {
  const key = `cal11:${r.key}`;
  const hit = ctx.memo.get(key) as Candidate[] | undefined;
  if (hit) return hit;
  const out: Candidate[] = [];
  const wrist = levelOf(ctx, 'poignet') >= 1;
  for (const f of [...pool].sort((a, b) => levelIdx(a.niveauMin) - levelIdx(b.niveauMin) || a.id.localeCompare(b.id))) {
    if (!r.fiche(f) || ficheTouchesSensitive(f, ctx)) continue;
    if (wrist && r.wristFree && !r.wristFree(f)) continue;
    // Condition de sécurité des deltoïdes : aucun coefficient >= 0,5 sur epaules_* (doute : refus).
    if (SHOULDER_ZONES.some((z) => coef(f, z) >= 0.5)) continue;
    // La fiche doit rester admissible sans adaptation ni remplacement ; la variante par défaut de la ligne est prise parmi celles du matériel.
    const base = resolveFiche(f, ctx).candidates.find((c) => c.fiche.id === f.id && !c.replaces && !c.adapted && !c.adaptations.length);
    if (!base) continue;
    const v = r.variant ? f.variantes.find((x) => r.variant!(x) && x.tags.every((t) => ctx.available.has(t)) && levelIdx(x.niveau) <= ctx.levelI) : base.variant;
    if (v) out.push({ ...base, variant: v });
  }
  ctx.memo.set(key, out);
  return out;
}

/**
 * Ajouts CAL-11 en fin de séance PUSH / HAUT (après correctifs, zones grises et remplissage), dans l'ordre tronc, dentelé antérieur,
 * trapèzes bas, coiffe, pectoraux. Modifie `sessions` en place.
 */
export function addCal11(sessions: Sess[], d: FillDeps, typeOf: (label: Sess['label']) => string): void {
  const { ctx, pool } = d;
  if (!cal11Allowed(ctx)) return;
  for (const s of sessions) {
    if (!CAL11.types.includes(typeOf(s.label))) continue;
    let added = 0;
    let addedSets = 0;
    for (const row of ROWS) {
      if (added >= CAL11.maxExercises || addedSets + CAL11.setsPerAdd > CAL11.maxSets) break;
      if (!rowOpen(row, ctx)) continue;
      if (d.budget(s) - estimerDuree(s) < CAL11.minFreeSec) break;
      const weekIds = new Set(sessions.flatMap((x) => x.exercises.map((e) => e.ficheId)));
      for (const c of rowCandidates(row, ctx, pool)) {
        if (weekIds.has(c.fiche.id) || isTwinOfUsed(c.fiche, new Set(s.exercises.map((e) => e.ficheId)), ctx)) continue;
        const ex = correctifExercise(c, ctx);
        ex.sets = CAL11.setsPerAdd;
        ex.capped = true;
        ex.cappedLabel = CAL11.stopMessage;
        // Dose imposée quelle que soit l'unité en répétitions ; une fiche en secondes ne peut pas porter cette dose : refusée.
        if (row.reps && ex.unit === 'sec') continue;
        if (row.reps) {
          ex.repsMin = row.reps.min;
          ex.repsMax = row.reps.max;
          ex.rirTarget = row.reps.rir;
        }
        const trial = { ...s, exercises: [...s.exercises, ex] };
        const all = sessions.map((x) => (x === s ? trial : x));
        // Cou dans la séance : tout ajout lourd (CAL-12, ou poussée comme la pompe plus) est refusé.
        const hasNeck = s.exercises.some((e) => e.slot === 'correctif' && e.ficheId === 'renfo-cou-isometrique');
        // Avis kiné : coiffe, dentelé, gainage sur les mains et tout élastique comptent comme lourds avec le cou.
        if (hasNeck && (
          isHeavyShoulderTrapExercise(ex, ctx) || hasHeavyShoulderTrap(trial, ctx) || c.fiche.schema.startsWith('poussee') ||
          row.key === 'coiffe_rotateurs' || row.key === 'dentele_anterieur' || CAL11.handSupportedCoreIds.includes(c.fiche.id) || ex.tags.includes('elastique')
        )) continue;
        if (row.key === 'tronc') {
          const coreSets = s.exercises.filter((e) => isCore(e, ctx)).reduce((a, e) => a + e.sets, 0);
          const coreWeek = sessions.reduce((a, x) => a + x.exercises.filter((e) => isCore(e, ctx)).reduce((b, e) => b + e.sets, 0), 0);
          if (coreSets + ex.sets > CORE_MAX.setsPerSession || coreWeek + ex.sets > CORE_MAX.setsPerWeek) continue;
        }
        // Plafond de 2 isolations par séance (PV3-ISO) : les ajouts ont le slot correctif, ils comptent tous comme une isolation de plus.
        if (s.exercises.filter((e) => isIsoSlot(e.slot) || e.slot === 'correctif').length + 1 > 2) continue;
        if (trial.exercises.length > VOLUME.maxExercisesPerSession || workSets(trial.exercises) > CAL11.maxSessionSets) continue;
        if (estimerDuree(trial) > d.budget(s)) continue;
        if (!d.sessionOk(trial.exercises, 'auto') || !d.weekOk(all) || !zoneCapsOk(sessions, all, ctx)) continue;
        s.exercises = trial.exercises;
        added++;
        addedSets += ex.sets;
        break;
      }
    }
  }
}
