// Compléments de fin de séance PUSH / PULL / LEGS (13/11/2026, avis coach + kiné ; dose et choix PROVISOIRES / NON SOURCÉS) : à 5 jours, ces séances restaient à
// 35-45 min. Seulement pour les profils aux plafonds relevés (intermédiaire / avancé sans blessure, douleur récente, grossesse, reprise, santé : raisedCaps),
// sur des muscles NON protégés, en isolation à faible fatigue, 2 à 3 séries à dose fixe (jamais de montée), 3 exercices au plus par séance, jamais deux fois la même
// fiche dans la semaine. Mêmes garde-fous que le correctif / CAL-11 : sessionOk (V-PLAF, CAL-12), weekOk (24 / 20 selon le muscle ; les secondaires protégés comptent
// 0,5), plafonds de zone. Annuler : COMPLEMENTS.enabled = false.
import { CAL11, CHARGEABLE_TAGS, CORE_MAX, CORE_SAFE_FAMILIES, CORE_WHEEL_IDS, CORRECTIF, CORRECTIF_COU, COMPLEMENTS, FIXED_LOAD_TAGS, TRONC_SCHEMAS, VOLUME } from './config';
import { coreFamilyOf } from './core';
import { buildExercise } from './dose';
import { estimerDuree } from './duration';
import { isProtectedMuscle, raisedCaps } from './plaf';
import { resolveFiche, type Candidate } from './safety';
import { isTwinOfUsed } from './slots';
import type { Fiche, GenExercise } from './types';
import { correctifExercise, isHeavyShoulderTrapExercise, zoneCapsOk, type FillDeps } from './zones-check';
import type { DurSession } from './duration';

type Sess = DurSession<GenExercise>;
interface Row { key: string; fiche: (f: Fiche) => boolean; variantOk?: (tags: readonly string[]) => boolean; sets: number }

const isMollets = (f: Fiche) => f.schema === 'cheville_mollet' && f.musclesPrincipaux.includes('mollets');
// Pas de charge sur les épaules / trapèzes (barre) ni d'haltères lourds en fin de PUSH / PULL (avis kiné) : poids du corps, machine, élastique.
const lightTags = (tags: readonly string[]) => !tags.some((t) => t === 'barre' || t === 'disques' || t === 'rack');

// Bas du corps en fin de PUSH / PULL (kiné : leg curl, pont fessier ou hip thrust sans barre ; jamais de charnière lourde ni de squat) : charnière légère, la règle des 2 charnières par séance reste appliquée.
// Charnière légère seulement : aucune charge externe (relecteur 14/11/2026 : la première charnière d'une séance est exemptée de « sans charge » par hingesOk).
const noLoad = (tags: readonly string[]) => lightTags(tags) && !tags.some((t) => CHARGEABLE_TAGS.includes(t) || FIXED_LOAD_TAGS.includes(t) || t === 'halteres' || t === 'kettlebell' || t === 'lest' || t.startsWith('sac'));
const ischios: Row = { key: 'ischios', fiche: (f) => /^curl-ischios/.test(f.id) && f.musclesPrincipaux.length === 1 && f.musclesPrincipaux[0] === 'ischios', variantOk: noLoad, sets: 2 };
const fessiers: Row = { key: 'fessiers', fiche: (f) => /^(pont-fessier|hip-thrust)/.test(f.id) && f.musclesPrincipaux.length === 1 && f.musclesPrincipaux[0] === 'fessiers', variantOk: noLoad, sets: 2 };

const ROWS: Record<string, readonly Row[]> = {
  PUSH: [
    { key: 'pectoraux', fiche: (f) => /^ecarte/.test(f.id) && f.schema === 'poussee_h' && f.musclesPrincipaux.length === 1 && f.musclesPrincipaux[0] === 'pectoraux', sets: 2 },
    { key: 'mollets', fiche: isMollets, variantOk: lightTags, sets: 3 },
    {
      key: 'tronc', sets: 2,
      // Gainage / anti-rotation sans appui sur les mains, sans roue ni rotation chargée (kiné) ; levée de T-D25-02 pour ces seules fiches.
      fiche: (f) => (f.schema === 'gainage' || f.schema === 'anti_rotation') && coreFamilyOf(f) !== null && CORE_SAFE_FAMILIES.includes(coreFamilyOf(f)!)
        && !CORE_WHEEL_IDS.includes(f.id) && !CAL11.handSupportedCoreIds.includes(f.id),
    },
    ischios, fessiers,
  ],
  PULL: [
    { key: 'grand_dorsal', fiche: (f) => /bras-tendus/.test(f.id) && f.musclesPrincipaux.length === 1 && f.musclesPrincipaux[0] === 'grand_dorsal', sets: 2 },
    { key: 'mollets', fiche: isMollets, variantOk: lightTags, sets: 3 },
    fessiers, ischios,
  ],
  LEGS: [
    { key: 'mollets', fiche: isMollets, sets: 3 },
    { key: 'abducteurs', fiche: (f) => (CORRECTIF.ids.abducteurs ?? []).includes(f.id), sets: 2 },
  ],
};

function candidates(row: Row, d: FillDeps, type: string): Candidate[] {
  const key = `complement:${type}:${row.key}`;
  const hit = d.ctx.memo.get(key) as Candidate[] | undefined;
  if (hit) return hit;
  const out: Candidate[] = [];
  for (const f of [...d.pool].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!row.fiche(f) || f.musclesPrincipaux.some(isProtectedMuscle)) continue; // jamais un groupe protégé en muscle principal
    const base = resolveFiche(f, d.ctx).candidates.find((c) => c.fiche.id === f.id && !c.replaces && !c.adapted && !c.adaptations.length && (!row.variantOk || row.variantOk(c.variant.tags)));
    if (base) out.push(base);
  }
  d.ctx.memo.set(key, out);
  return out;
}

/** Ajoute les compléments aux séances PUSH / PULL / LEGS (en place). */
export function addComplements(sessions: Sess[], d: FillDeps, typeOf: (label: string) => string): void {
  const { ctx } = d;
  if (!COMPLEMENTS.enabled || !raisedCaps(ctx) || ctx.pregnant || ctx.postPartum || ctx.repriseActive || ctx.lightWeek) return;
  for (const s of sessions) {
    const type = typeOf(s.label);
    const rows = ROWS[type];
    if (!rows) continue;
    let added = 0;
    for (const row of rows) {
      if (added >= COMPLEMENTS.maxPerSession) break;
      if (d.budget(s) - estimerDuree(s) < COMPLEMENTS.minFreeSec) break;
      if (s.exercises.length >= VOLUME.maxExercisesPerSession) break;
      const weekIds = new Set(sessions.flatMap((x) => x.exercises.map((e) => e.ficheId)));
      for (const c of candidates(row, d, type)) {
        if (weekIds.has(c.fiche.id) || isTwinOfUsed(c.fiche, new Set(s.exercises.map((e) => e.ficheId)), ctx)) continue;
        const ex = correctifExercise(c, ctx);
        // Jamais plus de séries que la dose de la fiche (base sous plafond P-CAP) : 2 à 3 séries au plus.
        ex.sets = Math.min(row.sets, buildExercise({ ...c, capped: true }, 'correctif', 'a', ctx).sets);
        ex.capped = true; // dose fixe : jamais de série ni de charge en plus
        ex.cappedLabel = COMPLEMENTS.stopMessage; // signes d'arrêt affichés (avis kiné)
        // CAL-12 (relecteur 14/11/2026) : dans une séance qui a le cou, tout complément lourd d'épaules / trapèzes (gainage, poussée, tirage, élastique) est refusé.
        const hasNeck = s.exercises.some((e) => e.slot === 'correctif' && e.ficheId === CORRECTIF_COU.ficheId);
        if (hasNeck && (isHeavyShoulderTrapExercise(ex, ctx) || c.fiche.schema.startsWith('poussee') || c.fiche.schema.startsWith('tirage') || ex.tags.includes('elastique'))) continue;
        // Tronc : mêmes plafonds de core que CAL-11 (par séance et par semaine).
        if (row.key === 'tronc') {
          const isCore = (e: GenExercise) => { const f = ctx.fichesById.get(e.ficheId); return !!f && TRONC_SCHEMAS.includes(f.schema) && coreFamilyOf(f) !== null; };
          const coreSets = s.exercises.filter(isCore).reduce((a, e) => a + e.sets, 0);
          const coreWeek = sessions.reduce((a, x) => a + x.exercises.filter(isCore).reduce((b, e) => b + e.sets, 0), 0);
          if (coreSets + ex.sets > CORE_MAX.setsPerSession || coreWeek + ex.sets > CORE_MAX.setsPerWeek) continue;
        }
        const trial = { ...s, exercises: [...s.exercises, ex] };
        const all = sessions.map((x) => (x === s ? trial : x));
        if (estimerDuree(trial) > d.budget(s)) continue;
        if (!d.sessionOk(trial.exercises, 'auto') || !d.weekOk(all) || !zoneCapsOk(sessions, all, ctx)) continue;
        s.exercises = trial.exercises;
        added++;
        break;
      }
    }
  }
}
