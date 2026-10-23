// Étalonnage (V-ETAL §5.2) et proposition après douleur (R4, §6.8 point 2). Fonctions pures pour le lecteur de séance (F5).
import type { InjuryZone } from '../data/model';
import { CALIBRATION, PAIN_SESSIONS_FOR_PROPOSAL } from './config';

export interface CalibrationInput {
  /** Réserve saisie ; le bouton « 4+ » vaut 4. */
  rir: number;
  reps: number;
  repsMin: number;
  repsMax: number;
  rirTarget: number;
  /** Plafond (R2, charge:legere, grossesse) : jamais de hausse. */
  capped: boolean;
  /** « Ça fait mal » : arrêt de l'exercice (R4). */
  pain: boolean;
  /** Charge actuelle (null = poids du corps ou élastique : on raisonne en échelons). */
  loadKg: number | null;
  availableLoadsKg: number[];
  echelon?: number;
  availableEchelons?: number[];
}
export interface CalibrationStep {
  action: 'hausse' | 'baisse' | 'garder' | 'arret';
  loadKg: number | null;
  echelon: number | null;
}

/**
 * Série suivante : réserve >= min(cible + 2, 4) et répétitions >= haut de fourchette -> poids (ou échelon) supérieur,
 * sauf si capped ; réserve <= cible - 2 ou répétitions < bas de fourchette -> inférieur (toujours permis) ; sinon garder.
 */
export function nextCalibrationStep(i: CalibrationInput): CalibrationStep {
  const ech = i.echelon ?? null;
  if (i.pain) return { action: 'arret', loadKg: i.loadKg, echelon: ech };
  const rir = Math.min(i.rir, CALIBRATION.rirButtonMax);
  const up = rir >= Math.min(i.rirTarget + CALIBRATION.raiseMargin, CALIBRATION.rirButtonMax) && i.reps >= i.repsMax;
  const down = rir <= i.rirTarget - CALIBRATION.lowerMargin || i.reps < i.repsMin;
  const loads = [...i.availableLoadsKg].sort((a, b) => a - b);
  const echs = [...(i.availableEchelons ?? [])].sort((a, b) => a - b);
  const move = (dir: 1 | -1): CalibrationStep | null => {
    if (i.loadKg !== null) {
      const next = dir > 0 ? loads.find((l) => l > i.loadKg!) : [...loads].reverse().find((l) => l < i.loadKg!);
      return next === undefined ? null : { action: dir > 0 ? 'hausse' : 'baisse', loadKg: next, echelon: ech };
    }
    if (ech === null) return null;
    const next = dir > 0 ? echs.find((e) => e > ech) : [...echs].reverse().find((e) => e < ech);
    return next === undefined ? null : { action: dir > 0 ? 'hausse' : 'baisse', loadKg: null, echelon: next };
  };
  if (down) return move(-1) ?? { action: 'garder', loadKg: i.loadKg, echelon: ech };
  if (up && !i.capped) return move(1) ?? { action: 'garder', loadKg: i.loadKg, echelon: ech };
  return { action: 'garder', loadKg: i.loadKg, echelon: ech };
}

export type PainZone = InjuryZone | 'inconnu';
export interface PainProposal {
  zone: InjuryZone;
  from: number;
  to: number;
}

/**
 * §6.8 point 2 : deux séances consécutives avec « ça fait mal » sur la même zone -> l'app PROPOSE de passer la zone
 * au niveau 2 (si 0 ou 1) ou 3 (si 2) ; rien n'est changé sans confirmation. Zone « je ne sais pas » : message S1.
 * `sessions` : zones douloureuses de chaque séance, de la plus ancienne à la plus récente.
 */
export function painProposals(
  sessions: readonly PainZone[][],
  currentLevels: Readonly<Partial<Record<InjuryZone, number>>>,
): { proposals: PainProposal[]; s1Message: boolean } {
  const n = PAIN_SESSIONS_FOR_PROPOSAL;
  const last = sessions.slice(-n);
  if (last.length < n) return { proposals: [], s1Message: false };
  const inAll = (z: PainZone) => last.every((s) => s.includes(z));
  const zones = [...new Set(last[last.length - 1])].filter((z) => z !== 'inconnu' && inAll(z)) as InjuryZone[];
  const proposals = zones
    .map((zone) => {
      const from = currentLevels[zone] ?? 0;
      return { zone, from, to: from <= 1 ? 2 : 3 };
    })
    .filter((p) => p.from < 3);
  return { proposals, s1Message: inAll('inconnu') };
}
