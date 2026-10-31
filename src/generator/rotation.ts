// D34 : rotation des accessoires d'une semaine à l'autre (knowledge/programmes-v3.md PV3-VAR-4, PV3-VAR-5 (d) et (e) ; écarts E-02, E-05).
// La semaine 1 (jeu 1) et la semaine 2 (jeu 2) sont générées par le même pipeline ; ici, chaque accessoire tournant reçoit la version
// du jeu 2 (`alt`) seulement si elle garde le nombre de séries, les répétitions et l'unité, si le jeu 2 respecte V-PLAF (séance), le
// plafond de 20 séries par semaine et le plancher de 10 (V-VOL) là où le jeu 1 les respecte, et s'il ne dure pas plus longtemps que la
// plus longue des deux semaines générées. Sinon l'emplacement reste sur la fiche du jeu 1. Les supersets sont décidés par jeu (E-05).
import type { Ctx } from './context';
import { VOLUME } from './config';
import { estimerDuree, type DurSession } from './duration';
import { makePlaf, musclesOf, sessionCapsOk, sessionVol, splitCapsOk, weekCapsOk } from './plaf';
import { typeOf } from './split';
import type { GenExercise, GenProgram, GenSession } from './types';
import { stepOf } from './variety';

const sameDose = (a: GenExercise, b: GenExercise) =>
  a.sets === b.sets && a.repsMin === b.repsMin && a.repsMax === b.repsMax && a.unit === b.unit && a.holdSec === b.holdSec;

/** Exercices joués une semaine paire (jeu 2), à partir des `alt` (sans supersets : ils sont recalculés par `jeu2Groups`). */
const jeu2Of = (s: GenSession, alts: Map<GenExercise, GenExercise>): GenExercise[] => s.exercises.map((e) => alts.get(e) ?? e);

/**
 * PV3-VAR-5 (e) : paires du jeu 2. Une paire du jeu 2 généré (s2) est gardée si chacun de ses membres est présent, à la même place
 * (emplacement) et avec la même fiche, dans le jeu 2 retenu ; sinon les exercices sont faits un par un (jamais une paire non vérifiée).
 */
function jeu2Groups(comp: GenExercise[], s2: GenSession): (string | null)[] {
  const bySlot = new Map(s2.exercises.map((e) => [e.slot, e]));
  const same = (x: GenExercise) => {
    const y = bySlot.get(x.slot);
    return !!y && y.ficheId === x.ficheId && y.variantId === x.variantId;
  };
  return comp.map((x) => {
    const y = bySlot.get(x.slot);
    if (!y || !same(x) || !y.supersetGroup) return null;
    const members = s2.exercises.filter((e) => e.supersetGroup === y.supersetGroup);
    const ok = members.every((m) => comp.some((c) => c.slot === m.slot && same(c)));
    return ok ? y.supersetGroup : null;
  });
}

export function mergeRotation(p1: GenProgram, p2: GenProgram, ctx: Ctx): void {
  // Grossesse : aucune rotation (P-GROS ne veut pas de fiche neuve à étalonner, PV3-VAR-5 (d)).
  if (ctx.pregnant) return;
  const plaf = makePlaf(ctx, 'slot');
  const pairs = p1.sessions.map((s1) => ({ s1, s2: p2.sessions.find((x) => x.label === s1.label) ?? null }));
  const alts = new Map<GenExercise, GenExercise>();
  for (const { s1, s2 } of pairs) {
    if (!s2) continue;
    for (const e of s1.exercises) {
      if (e.role === 'cardio' || stepOf(e.slot, s1.label) < 3) continue; // piliers, noyau, tronc : jamais de rotation de semaine
      if (e.capped) continue; // PV3-VAR-5 (d) : accessoire sous plafond P-CAP : fixe
      const e2 = s2.exercises.find((x) => x.slot === e.slot);
      if (!e2 || e2.ficheId === e.ficheId || e2.capped || !sameDose(e, e2)) continue;
      alts.set(e, e2);
    }
  }
  const dur = (s: GenSession, ex: GenExercise[]): number =>
    estimerDuree({ label: s.label, days: p1.sessions.length, level: p1.level, pregnant: false, exercises: ex, e1Sec: 0, e2Count: 0 } as DurSession<GenExercise>);
  const capsOk = (s: GenSession, ex: GenExercise[]) => (typeOf(s.label) === 'CE' ? sessionCapsOk({ exercises: ex }, plaf) : splitCapsOk(ex, plaf));
  const w1 = p1.sessions.map((s) => ({ exercises: s.exercises }));
  const count = (w: { exercises: readonly GenExercise[] }[]) => {
    const m = new Map<string, number>();
    for (const s of w) for (const e of s.exercises) m.set(e.ficheId, (m.get(e.ficheId) ?? 0) + 1);
    return m;
  };
  const occ1 = count(w1);
  const occP2 = count(p2.sessions);
  const vol1 = new Map(musclesOf(w1).map((m) => [m, w1.reduce((a, s) => a + sessionVol(s, m), 0)]));
  const valid = (): boolean => {
    for (const { s1, s2 } of pairs) {
      const comp = jeu2Of(s1, alts);
      if (new Set(comp.map((e) => e.ficheId)).size !== comp.length) return false; // jamais deux fois la même fiche dans une séance
      if (capsOk(s1, s1.exercises) && !capsOk(s1, comp)) return false;
      if (s2 && s1.estimatedSec + dur(s1, comp) - dur(s1, s1.exercises) > Math.max(s1.estimatedSec, s2.estimatedSec)) return false;
    }
    const w2 = p1.sessions.map((s) => ({ exercises: jeu2Of(s, alts) }));
    // PV3-VAR-2 : le mélange des deux jeux ne crée aucune répétition de fiche dans la semaine que ni le jeu 1 ni le jeu 2 généré n'avaient.
    const occ2 = count(w2);
    for (const [id, n] of occ2) if (n > Math.max(occ1.get(id) ?? 0, occP2.get(id) ?? 0, 1)) return false;
    if (weekCapsOk(w1) && !weekCapsOk(w2)) return false;
    for (const m of musclesOf(w1)) {
      if ((vol1.get(m) ?? 0) >= VOLUME.targetMuscle && w2.reduce((a, s) => a + sessionVol(s, m), 0) < VOLUME.targetMuscle) return false;
    }
    return true;
  };
  // Ajout un par un (accessoires d'indice 2, puis >= 3, isolations, fonctionnel ; séance la plus tôt d'abord) : un échange n'est gardé
  // que si le jeu 2 reste dans les règles ; sinon l'emplacement reste sur la fiche du jeu 1.
  const order = [...alts.entries()]
    .map(([e, e2]) => ({ e, e2, step: stepOf(e.slot, p1.sessions.find((s) => s.exercises.includes(e))!.label), at: p1.sessions.findIndex((s) => s.exercises.includes(e)) }))
    .sort((a, b) => a.step - b.step || a.at - b.at);
  alts.clear();
  for (const { e, e2 } of order) {
    alts.set(e, e2);
    if (!valid()) alts.delete(e);
  }
  // Écriture des `alt` : fiche différente et / ou paire différente dans le jeu 2.
  for (const { s1, s2 } of pairs) {
    if (!s2) continue;
    const comp = jeu2Of(s1, alts);
    const groups = jeu2Groups(comp, s2);
    s1.exercises = s1.exercises.map((e, i) => {
      const x = comp[i];
      const rotated = x !== e;
      if (!rotated && groups[i] === e.supersetGroup) return e;
      const alt: GenExercise = { ...x, supersetGroup: groups[i], ...(rotated ? { rotation: true } : {}) };
      delete alt.alt;
      return { ...e, alt, ...(rotated ? { rotation: true } : {}) };
    });
  }
  p1.penurieVariete = [...new Set([...(p1.penurieVariete ?? []), ...(p2.penurieVariete ?? [])])].sort();
}
