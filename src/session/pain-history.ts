// Évolution de la douleur d'une séance à l'autre sur un même exercice (idée utilisateur du 25/11/2026, spéc. kiné du 27/11/2026,
// knowledge/adaptation-regles.md §5.1). Lecture seule des séries déjà enregistrées dans IndexedDB : aucune saisie, rien en ligne.
// La série d'arrêt n'est jamais lue comme une intensité ; on ne dit jamais « en amélioration » ni « guéri ».
import type { InjuryZone, SetLog, WorkoutSession } from '../data/model';
import { ZONE_LABEL } from '../data/labels';
import { dateKey, sessionDate } from './calendar';
import { PAIN_S1_TEXT } from './messages';

/** Nombre de séances montrées (fenêtre PROVISOIRE, §5.1). */
export const PAIN_WINDOW = 8;

export const PAIN_TREND_TEXT = {
  repetee: 'Douleur répétée sur cet exercice',
  derniere: 'Douleur à la dernière séance',
  aucune: 'Pas de douleur sur les dernières séances',
} as const;
export const painFreeSinceText = (n: number): string => `${n} ${n > 1 ? 'séances' : 'séance'} sans douleur depuis la dernière`;
export const PAIN_2_OF_3_TEXT = 'Tu as eu mal à 2 des 3 dernières séances sur cet exercice. Consulte un professionnel de santé si la douleur revient.';
export const PAIN_RECURS_TEXT = 'La douleur revient sur cet exercice. Consulte un professionnel de santé avant de le refaire.';
/** 3 douleurs ou plus sur les 8, aucune sur les 3 dernières (relecteur 27/11) : ne pas contredire « N séances sans douleur ». */
export const PAIN_PAST_TEXT = 'Tu as eu mal à 3 séances ou plus sur les 8 dernières. Si la douleur revient, consulte un professionnel de santé.';
export const PAIN_FROZEN_TEXT = 'Progression en pause pour cette zone.';
/** Signes d'alerte S2 (regles-securite-communes.md), rappel permanent ; pas de numéro d'urgence ici (U1 réservé à S3, C4, G6). */
export const PAIN_ALERT_TEXT = 'Gonflement, douleur après une chute ou un choc, douleur la nuit, fièvre, perte de force, engourdissement ou fourmillements : consulte sans attendre.';
export const PAIN_NOT_MEDICAL_TEXT = 'Cet historique n’est pas un avis médical et ne pose aucun diagnostic.';

export interface PainRow {
  sessionId: string;
  dateKey: string;
  /** Séries de travail faites sur cet exercice (une série « par côté » compte une fois). */
  series: number;
  pain: boolean;
  /** Numéro (1, 2…) de la série où la douleur a été signalée ; null si à l'échauffement. */
  painSerie: number | null;
  painWarmup: boolean;
  painZone: InjuryZone | 'inconnu' | null;
  painSide: 'gauche' | 'droite' | null;
}

export interface PainHistory {
  /** Plus récente en premier, au plus PAIN_WINDOW séances. */
  rows: PainRow[];
  anyPain: boolean;
  /** null sous 2 séances. */
  trend: string | null;
  consult: string | null;
}

// Une douleur signalée à l'échauffement compte (relecteur 27/11) ; seules les séries de travail sont comptées comme « séries ».
const isDone = (s: SetLog): boolean => !!s.completedAt && !s.deletedAt;

export function painHistory(movementId: string, sets: readonly SetLog[], sessions: readonly WorkoutSession[]): PainHistory {
  // Séances importées d'un CSV (D19) ignorées ; séances créées, arrêtées ou interrompues gardées : une douleur y reste une douleur.
  const ok = new Map(sessions.filter((s) => !s.deletedAt && !s.imported && s.status !== 'en_cours').map((s) => [s.id, s]));
  const by = new Map<string, SetLog[]>();
  for (const s of sets) {
    if (!isDone(s) || s.movementId !== movementId || !ok.has(s.sessionId)) continue;
    by.set(s.sessionId, [...(by.get(s.sessionId) ?? []), s]);
  }
  const all: (PainRow & { at: number })[] = [...by.entries()].map(([id, list]) => {
    const idx = [...new Set(list.filter((s) => !s.isWarmup).map((s) => s.setIndex))].sort((a, b) => a - b);
    const first = list.filter((s) => s.pain).sort((a, b) => Number(!a.isWarmup) - Number(!b.isWarmup) || a.setIndex - b.setIndex || (a.completedAt! < b.completedAt! ? -1 : 1))[0];
    const d = sessionDate(ok.get(id)!);
    return {
      sessionId: id, dateKey: dateKey(d), at: d.getTime(), series: idx.length, pain: !!first,
      painSerie: first && !first.isWarmup ? idx.indexOf(first.setIndex) + 1 : null, painWarmup: !!first?.isWarmup, painZone: first ? first.painZone ?? 'inconnu' : null, painSide: first?.side ?? null,
    };
  });
  const rows = all.sort((a, b) => b.at - a.at).slice(0, PAIN_WINDOW).map(({ at: _at, ...r }) => r);
  const anyPain = rows.some((r) => r.pain);
  const last3 = rows.slice(0, 3).filter((r) => r.pain).length;
  let trend: string | null = null;
  if (rows.length >= 2) {
    if (last3 >= 2) trend = PAIN_TREND_TEXT.repetee;
    else if (rows[0].pain) trend = PAIN_TREND_TEXT.derniere;
    else if (anyPain) trend = painFreeSinceText(rows.findIndex((r) => r.pain));
    else trend = PAIN_TREND_TEXT.aucune;
  }
  const total = rows.filter((r) => r.pain).length;
  const consult = total >= 3 ? (last3 >= 1 ? PAIN_RECURS_TEXT : PAIN_PAST_TEXT)
    : rows.length >= 2 && rows[0].pain && rows[1].pain ? PAIN_S1_TEXT
    : last3 >= 2 ? PAIN_2_OF_3_TEXT
    : null;
  return { rows, anyPain, trend, consult };
}

export function painRowText(r: PainRow): string {
  if (!r.pain) return `Sans douleur · ${r.series} ${r.series > 1 ? 'séries' : 'série'}`;
  const zone = !r.painZone || r.painZone === 'inconnu' ? 'zone non précisée' : ZONE_LABEL[r.painZone];
  const side = r.painSide ? ` (côté ${r.painSide})` : '';
  const when = r.painWarmup ? 'à l’échauffement' : `à la série ${r.painSerie}`;
  return `Douleur (${zone}) ${when}${side} · exercice arrêté`;
}

/** Exercices avec au moins une douleur dans leurs PAIN_WINDOW dernières séances. */
export function exercisesWithPain(sets: readonly SetLog[], sessions: readonly WorkoutSession[]): string[] {
  const ids = [...new Set(sets.filter((s) => s.pain && isDone(s)).map((s) => s.movementId))];
  return ids.filter((id) => painHistory(id, sets, sessions).anyPain);
}
