// Garantie « mollets » dans les séances de jambes (14/11/2026, retour de l'utilisateur : « pour les séances jambes il y a peu ou pas de mollets » ; balayage :
// 461 séances BAS / LEGS sur 810 sans aucun mollet). Chaque séance BAS / LEGS reçoit, EN DERNIER, un exercice de mollets (2 séries, dose fixe, jamais de montée,
// message d'arrêt affiché) quand une fiche admissible existe : gastrocnémien (jambe tendue) dans la première séance de jambes, soléaire (genoux fléchis ou assis)
// dans la suivante, en alternance. Aucun plafond n'est relâché : mêmes garde-fous que les compléments (V-PLAF par séance, plafond hebdomadaire, plafonds de zone, durée,
// CAL-12 avec le cou). S'il manque de la place (8 exercices ou durée), le mollet remplace un accessoire de tronc, seulement si le plancher de core (CORE_FLOOR) tient encore.
// Débutant : permis (exercice au poids du corps, 2 séries plafonnées, jamais comme isolation de l'emplacement `iso_mollets` : STR-ISO-0 inchangé).
// Pas en reprise douce ni en semaine allégée. Valeurs NON SOURCÉES (choix coach / chef de projet). Annuler : CALVES.enabled = false.
import { CORE_FLOOR, CORRECTIF_COU, VOLUME } from './config';
import { countsInCoreFloor } from './core';
import { buildExercise } from './dose';
import { estimerDuree, type DurSession } from './duration';
import { isProtectedMuscle } from './plaf';
import { resolveFiche, type Candidate } from './safety';
import { isTwinOfUsed } from './slots';
import type { Fiche, GenExercise } from './types';
import { rotationStart } from './variety';
import { correctifExercise, isHeavyShoulderTrapExercise, zoneCapsOk, type FillDeps } from './zones-check';

export const CALVES = {
  enabled: true,
  sets: 2,
  stopMessage: 'Douleur au mollet, au tendon d’Achille ou à la cheville : arrête cet exercice. Descends lentement, sans rebond.',
} as const;

type Sess = DurSession<GenExercise>;
const isCalfFiche = (f: Fiche): boolean => f.schema === 'cheville_mollet' && f.musclesPrincipaux.includes('mollets');
/** Soléaire : genoux fléchis ou assis (le gastrocnémien travaille jambes tendues). */
const isSoleus = (id: string): boolean => /assis|genoux-flechis/.test(id);
const noHeavy = (tags: readonly string[]): boolean => !tags.some((t) => t === 'barre' || t === 'disques' || t === 'rack');

function pool(d: FillDeps): Candidate[] {
  const hit = d.ctx.memo.get('calves:pool') as Candidate[] | undefined;
  if (hit) return hit;
  const out: Candidate[] = [];
  for (const f of [...d.pool].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!isCalfFiche(f) || f.musclesPrincipaux.some(isProtectedMuscle)) continue;
    const base = resolveFiche(f, d.ctx).candidates.find((c) => c.fiche.id === f.id && !c.replaces && !c.adapted && !c.adaptations.length && noHeavy(c.variant.tags));
    if (base) out.push(base);
  }
  d.ctx.memo.set('calves:pool', out);
  return out;
}

const isCore = (e: GenExercise, d: FillDeps): boolean => { const f = d.ctx.fichesById.get(e.ficheId); return !!f && countsInCoreFloor(f); };
function coreFloorHolds(all: readonly Sess[], d: FillDeps): boolean {
  const per = all.map((s) => s.exercises.filter((e) => isCore(e, d)).reduce((a, e) => a + e.sets, 0));
  return per.filter((x) => x > 0).length >= CORE_FLOOR.sessions && per.reduce((a, b) => a + b, 0) >= CORE_FLOOR.sets;
}

/** Ajoute (en place) un exercice de mollets à chaque séance BAS / LEGS qui n'en a pas. */
export function addCalfGuarantee(sessions: Sess[], d: FillDeps, typeOf: (label: string) => string): void {
  const { ctx } = d;
  if (!CALVES.enabled || ctx.repriseActive || ctx.lightWeek) return;
  const cands = pool(d);
  if (!cands.length) return;
  const legs = sessions.filter((s) => ['BAS', 'LEGS'].includes(typeOf(s.label)));
  legs.forEach((s, idx) => {
    if (s.exercises.some((e) => e.musclesPrincipaux.includes('mollets'))) return;
    const wantSoleus = idx % 2 === 1;
    const weekIds = new Set(sessions.flatMap((x) => x.exercises.map((e) => e.ficheId)));
    const here = new Set(s.exercises.map((e) => e.ficheId));
    const typed = [...cands.filter((c) => isSoleus(c.fiche.id) === wantSoleus), ...cands.filter((c) => isSoleus(c.fiche.id) !== wantSoleus)];
    const fresh = typed.filter((c) => !weekIds.has(c.fiche.id));
    const order = fresh.length ? fresh : typed;
    const start = order.length > 1 ? rotationStart(order.length, 1, 1, 1) : 0;
    const hasNeck = s.exercises.some((e) => e.slot === 'correctif' && e.ficheId === CORRECTIF_COU.ficheId);
    for (let i = 0; i < order.length; i++) {
      const c = order[(start + i) % order.length];
      if (here.has(c.fiche.id) || isTwinOfUsed(c.fiche, here, ctx)) continue;
      const ex = correctifExercise(c, ctx);
      ex.sets = Math.min(CALVES.sets, buildExercise({ ...c, capped: true }, 'correctif', 'a', ctx).sets);
      ex.capped = true;
      ex.cappedLabel = CALVES.stopMessage;
      if (hasNeck && isHeavyShoulderTrapExercise(ex, ctx)) continue;
      const tryWith = (base: GenExercise[], checkCore = false): boolean => {
        const trial = { ...s, exercises: [...base, ex] };
        const all = sessions.map((x) => (x === s ? trial : x));
        if (trial.exercises.length > VOLUME.maxExercisesPerSession || estimerDuree(trial) > d.budget(s)) return false;
        if (!d.sessionOk(trial.exercises, 'auto') || !d.weekOk(all) || !zoneCapsOk(sessions, all, ctx) || (checkCore && !coreFloorHolds(all, d))) return false;
        s.exercises = trial.exercises;
        return true;
      };
      if (tryWith(s.exercises)) return;
      // Pas de place : le mollet passe avant un accessoire de tronc (le dernier, jamais sous le plancher de core), sinon avant l’exercice fonctionnel, sinon avant un correctif (jamais le cou).
      // Le tronc n'est jamais sacrifié : les séances désignées pour le core (D25, T-D25-16, core-ppl) le gardent ; le mollet prend la place de l'exercice fonctionnel, sinon d'un correctif.
      const victimSlots = ['fonctionnel', 'correctif'];
      const victims = victimSlots.flatMap((sl) => s.exercises.filter((e) => e.slot === sl && e.ficheId !== CORRECTIF_COU.ficheId).reverse());
      for (const v of victims) if (tryWith(s.exercises.filter((e) => e !== v), true)) return;
    }
  });
}
