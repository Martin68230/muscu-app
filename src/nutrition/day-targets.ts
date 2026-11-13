// Besoins jour par jour selon les séances de la semaine (docs/nutrition-spec.md §6 ; nutrition-rules.md B, K).
// Fonctions PURES. La somme des kcal de la semaine égale toujours 7 x la cible moyenne ; aucun jour sous le plancher.

import {
  AJUSTEMENT_JOUR_MAX_KCAL, COEF_JOUR, GLUC_MIN_GKG, JOUR_LOURD_MIN, LIP_MIN_GKG, LIP_MIN_PCT_ENERGIE, PROT_GKG, SESSION_TYPES_LOURDS,
  VAR_PROT,
} from './config';
import type { GoalKind } from './needs';

export type DayType = 'repos' | 'leger' | 'moyen' | 'lourd' | 'intense';

/** Une séance de la journée, telle que lue dans le programme et l'historique (aucune charge, aucun détail). */
export interface DaySession {
  kind: 'muscu' | 'cardio' | 'sport' | 'leger';
  /** CE, HAUT, BAS, PUSH, PULL, LEGS pour la musculation. */
  sessionType?: string;
  minutes: number;
  /** Match ou sortie longue (sport) : jour « intense ». */
  match?: boolean;
}

/**
 * Type de jour. Une séance sautée ou reportée ne doit pas être passée ici (le jour devient un repos) ;
 * une séance faite non prévue y est ajoutée. Reprise douce : passer kind 'leger'.
 */
export function dayTypeOf(sessions: readonly DaySession[]): DayType {
  if (!sessions.length) return 'repos';
  if (sessions.some((s) => s.match)) return 'intense';
  const muscu = sessions.filter((s) => s.kind === 'muscu');
  const longCardio = sessions.some((s) => (s.kind === 'cardio' || s.kind === 'sport') && s.minutes >= JOUR_LOURD_MIN);
  if (longCardio) return 'intense';
  if (
    sessions.length >= 2 ||
    muscu.some((s) => s.minutes >= JOUR_LOURD_MIN || (s.sessionType !== undefined && SESSION_TYPES_LOURDS.includes(s.sessionType)))
  ) {
    return 'lourd';
  }
  if (muscu.length) return 'moyen';
  return 'leger';
}

export interface DayTarget {
  type: DayType;
  kcal: number;
  protG: number;
  lipG: number;
  glucG: number;
  /** Signalements non bloquants : glucides sous le minimum du type de jour, jour ramené au plancher. */
  flags: ('glucides_bas' | 'plancher')[];
}

export interface WeekInput {
  /** 7 types de jour, lundi à dimanche. */
  types: readonly DayType[];
  /** Cible moyenne par jour (kcal), déjà au-dessus du plancher. */
  avgKcal: number;
  /** Plancher du jour (kcal) : jamais franchi. */
  floorKcal: number;
  kg: number;
  goal: GoalKind;
}

/** Répartit la semaine : poids relatifs normalisés, écart de jour borné, plancher respecté, moyenne conservée. */
export function weekTargets(input: WeekInput): DayTarget[] | null {
  const { types, avgKcal, floorKcal, kg, goal } = input;
  if (types.length !== 7 || !(avgKcal > 0) || !(kg > 0) || !Number.isFinite(floorKcal) || !Number.isFinite(avgKcal) || avgKcal < floorKcal - 1e-9) return null;

  // 1) poids relatifs normalisés pour une moyenne exactement 1
  const raw = types.map((t) => COEF_JOUR[t]);
  const meanRaw = raw.reduce((s, x) => s + x, 0) / 7;
  const total = avgKcal * 7;
  let kcal = raw.map((c) => (c / meanRaw) * avgKcal);

  // 2) bornes : écart de jour <= AJUSTEMENT_JOUR_MAX, jamais sous le plancher ; on redistribue le surplus ou le manque sur les jours libres
  const lo = Math.max(floorKcal, avgKcal - AJUSTEMENT_JOUR_MAX_KCAL);
  const hi = avgKcal + AJUSTEMENT_JOUR_MAX_KCAL;
  const bound = new Array<boolean>(7).fill(false);
  for (let iter = 0; iter < 10; iter++) {
    kcal = kcal.map((k, i) => (bound[i] ? k : Math.min(hi, Math.max(lo, k))));
    for (let i = 0; i < 7; i++) if (kcal[i] <= lo + 1e-9 || kcal[i] >= hi - 1e-9) bound[i] = true;
    const diff = total - kcal.reduce((s, x) => s + x, 0);
    if (Math.abs(diff) < 1e-6) break;
    const free = bound.map((b, i) => (b ? -1 : i)).filter((i) => i >= 0);
    if (!free.length) break;
    for (const i of free) kcal[i] += diff / free.length;
  }

  // Dernier garde-fou : la moyenne doit être conservée et aucun jour hors bornes ; sinon, aucun chiffre (échec sûr).
  kcal = kcal.map((k) => Math.min(hi, Math.max(lo, k)));
  if (Math.abs(kcal.reduce((s, x) => s + x, 0) - total) > 1 || kcal.some((k) => !Number.isFinite(k))) return null;

  // 3) protéines : base g/kg, +VAR_PROT sur le jour le plus lourd et le lendemain, compensé sur les autres jours (moyenne conservée)
  const protBase = PROT_GKG[goal] * kg;
  const order = types.map((t, i) => ({ i, c: COEF_JOUR[t] })).sort((a, b) => b.c - a.c || a.i - b.i);
  const heavy = order[0].c > COEF_JOUR.repos && order[0].c >= COEF_JOUR.lourd ? [order[0].i, (order[0].i + 1) % 7] : [];
  const up = [...new Set(heavy)];
  const prot = new Array<number>(7).fill(protBase);
  if (up.length) {
    const gain = protBase * VAR_PROT;
    for (const i of up) prot[i] = protBase + gain;
    // En perte, les autres jours restent à la base (jamais sous 2,2 g/kg) : la moyenne monte légèrement, dans la plage permise (<= 3,0).
    // Sinon (maintien, prise : plage 1,6-2,2), la moyenne est conservée en abaissant un peu les autres jours.
    if (goal !== 'perte') {
      const others = [0, 1, 2, 3, 4, 5, 6].filter((i) => !up.includes(i));
      for (const i of others) prot[i] = protBase - (gain * up.length) / others.length;
    }
  }

  // 4) lipides stables, glucides = le reste
  const lipBase = Math.max(LIP_MIN_GKG * kg, (LIP_MIN_PCT_ENERGIE * avgKcal) / 9);
  return types.map((t, i) => {
    const flags: DayTarget['flags'] = [];
    const k = kcal[i];
    if (k <= floorKcal + 1e-6) flags.push('plancher');
    const glucG = Math.max(0, (k - 4 * prot[i] - 9 * lipBase) / 4);
    if (glucG < GLUC_MIN_GKG[t] * kg) flags.push('glucides_bas');
    return { type: t, kcal: k, protG: prot[i], lipG: lipBase, glucG, flags };
  });
}
