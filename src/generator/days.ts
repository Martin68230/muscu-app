// Choix des jours (V-JOURS §2.4) : jamais deux séances corps entier à moins de ~48 h (écarts circulaires >= 2 jours).
import { MIN_GAP_DAYS } from './config';

function combos(items: number[], k: number): number[][] {
  if (k === 0) return [[]];
  const out: number[][] = [];
  items.forEach((x, i) => {
    for (const rest of combos(items.slice(i + 1), k - 1)) out.push([x, ...rest]);
  });
  return out;
}

/** Écart minimal circulaire (différences successives + 7 + premier - dernier). */
export function minCircularGap(days: number[]): number {
  if (days.length < 2) return 0;
  const gaps = days.slice(1).map((d, i) => d - days[i]);
  gaps.push(7 + days[0] - days[days.length - 1]);
  return Math.min(...gaps);
}

/** Meilleure combinaison de k jours libres : écart minimal le plus grand, puis la plus petite dans l'ordre lexicographique. */
export function bestDays(blocked: number[], k: number): { days: number[]; minGap: number } | null {
  const free = [0, 1, 2, 3, 4, 5, 6].filter((d) => !blocked.includes(d));
  let best: { days: number[]; minGap: number } | null = null;
  for (const c of combos(free, k)) {
    const g = minCircularGap(c);
    if (!best || g > best.minGap) best = { days: c, minGap: g };
  }
  return best;
}

export type DaysChoice =
  | { ok: true; days: number[]; reduced: boolean }
  | { ok: false; suggestion: number | null };

export function chooseDays(blocked: number[], wanted: 2 | 3): DaysChoice {
  if (wanted === 3) {
    const b3 = bestDays(blocked, 3);
    if (b3 && b3.minGap >= MIN_GAP_DAYS) return { ok: true, days: b3.days, reduced: false };
  }
  const b2 = bestDays(blocked, 2);
  if (b2 && b2.minGap >= MIN_GAP_DAYS) return { ok: true, days: b2.days, reduced: wanted === 3 };
  return { ok: false, suggestion: suggestDay(blocked) };
}

/** V-MSG-JOURS2 : premier jour bloqué (lundi d'abord) qui donnerait un écart >= 2 jours avec un jour libre. */
export function suggestDay(blocked: number[]): number | null {
  const free = [0, 1, 2, 3, 4, 5, 6].filter((d) => !blocked.includes(d));
  for (const d of [...blocked].sort((a, b) => a - b)) {
    if (free.some((f) => minCircularGap([Math.min(d, f), Math.max(d, f)]) >= MIN_GAP_DAYS)) return d;
  }
  return null;
}
