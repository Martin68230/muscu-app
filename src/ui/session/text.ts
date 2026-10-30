// Textes affichés par les écrans de séance : jamais d'identifiant brut (tout vient des fiches).
import type { PlannedExercise } from '../../data/model';
import { ficheOfId, type Fiche, type Variante } from '../../data/fiches';
import { fmtKg } from '../../session/messages';

export { fmtKg };

export function ficheOf(all: Fiche[], ex: PlannedExercise): Fiche | undefined {
  return ficheOfId(all, ex.movementId) ?? ficheOfId(all, ex.variantId);
}
export function exName(all: Fiche[], ex: PlannedExercise): string {
  return ficheOf(all, ex)?.nom ?? 'Exercice';
}
export function variantOf(all: Fiche[], ex: PlannedExercise): Variante | undefined {
  return ficheOf(all, ex)?.variantes.find((v) => v.id === ex.variantId);
}

/** « 1 min 30 », « 45 s ». */
export function durationText(sec: number): string {
  if (sec < 60) return `${sec} s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m} min ${s} s` : `${m} min`;
}

/** « 10-15 répétitions · réserve 3 », « 20 s », « 8-10 répétitions par côté ». */
export function targetText(ex: PlannedExercise): string {
  if (ex.jump) return `${ex.sets} × ${ex.repsMax} ${ex.jump.soft ? 'répétitions, sans saut' : 'sauts'} · repos ${ex.restSec} s`;
  if (ex.role === 'cardio') return `${durationText(ex.holdSec ?? 0)} · effort ${ex.intensity === 'facile' ? 'facile' : 'modéré'}`;
  if (ex.unit === 'sec') return `${ex.holdSec ?? ex.repsMin} s`;
  const range = ex.repsMin === ex.repsMax ? `${ex.repsMin}` : `${ex.repsMin}-${ex.repsMax}`;
  if (ex.unit === 'reps_par_cote') return `${range} répétitions par côté`;
  return `${range} répétitions · réserve ${ex.rirTarget}`;
}

/** Ligne de la liste d'aperçu : « 3 × 10-15 · repos 1 min 30 ». */
export function lineText(ex: PlannedExercise): string {
  // Cardio (B4) : durée et effort modéré (OMS : 5-6 sur 10, cardio-regles.md §2), pas de série ni de repos.
  if (ex.jump) return `${ex.sets} séries de ${ex.repsMax} ${ex.jump.soft ? 'répétitions, version sans saut' : 'sauts, réception douce'} · repos ${ex.restSec} s en marchant`;
  if (ex.role === 'cardio') return `${durationText(ex.holdSec ?? 0)} · ${ex.intensity === 'facile' ? 'effort facile' : 'effort modéré (5-6 sur 10)'}${ex.slowEndMin ? `, ${ex.slowEndMin} dernières min lentes` : ''}`;
  const t = ex.unit === 'sec' ? `${ex.holdSec ?? ex.repsMin} s` : ex.repsMin === ex.repsMax ? `${ex.repsMin}` : `${ex.repsMin}-${ex.repsMax}`;
  const unit = ex.unit === 'reps_par_cote' ? ' par côté' : '';
  return `${ex.sets} × ${t}${unit} · repos ${durationText(ex.restSec)}`;
}

export function parseNumber(text: string): number | null {
  const n = Number(text.trim().replace(',', '.'));
  return text.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null;
}

/** Matériel pour lequel la saisie d'une charge a un sens même sans charge de départ. */
const LOADABLE = ['halteres', 'kettlebell', 'barre', 'barre_ez', 'disques', 'sac_a_dos', 'bidons_ou_sacs', 'lest', 'sac_de_sable', 'poulie', 'machine'];
export const isLoadable = (v: Variante | undefined): boolean => !!v && v.tags.some((t) => LOADABLE.includes(t));
