// Repas d'une semaine validée posés sur le calendrier et dans l'historique (docs/nutrition-reprise.md). PUR : aucune lecture de base ici.

import type { MealLog, MealPlan } from '../data/model';
import { sanitizeOut, slotKeyOf, type WeekSlot } from './week-plan';
import { weekStartOf } from './weight-trend';

export function addDaysKey(key: string, n: number): string {
  return new Date(Date.parse(`${key}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
}

/** Créneaux enregistrés d'un plan (forme vérifiée : un plan importé abîmé n'affiche rien plutôt que de planter). */
export function planSlots(p: MealPlan): WeekSlot[] {
  const raw = (p.result as { slots?: unknown } | undefined)?.slots;
  const arr = Array.isArray(raw) ? raw : p.slots;
  const ok = (arr as unknown[]).filter((s): s is WeekSlot => !!s && typeof s === 'object' && typeof (s as WeekSlot).day === 'number' && (s as WeekSlot).day >= 0 && (s as WeekSlot).day <= 6 && typeof (s as WeekSlot).kind === 'string' && typeof (s as WeekSlot).kcal === 'number');
  // Repas pris ailleurs : énergie bornée et mode connu, jamais la valeur brute d'un plan importé.
  return ok.map((s) => {
    if (!s.out) return s;
    const o = sanitizeOut(s.out);
    if (!o) { const { out: _o, ...rest } = s; void _o; return rest; }
    return { ...s, out: o, kcal: o.kcal };
  });
}

export interface DayMeals { plan: MealPlan; day: number; date: string; slots: WeekSlot[]; /** Semaine pas encore validée : plan proposé. */ draft: boolean }

/** Repas d'un jour civil : semaine validée, ou (avec `includeDraft`) plan proposé pas encore validé. */
export function mealsForDate(plans: readonly MealPlan[], date: string, includeDraft = false): DayMeals | null {
  const ws = weekStartOf(date);
  const plan = plans.find((p) => p.weekStart === ws && p.status === 'valide') ?? (includeDraft ? plans.find((p) => p.weekStart === ws) : undefined);
  if (!plan) return null;
  const day = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${ws}T00:00:00Z`)) / 86_400_000);
  if (day < 0 || day > 6) return null;
  const slots = planSlots(plan).filter((s) => s.day === day && s.recipeId);
  return slots.length ? { plan, day, date, slots, draft: plan.status !== 'valide' } : null;
}

/** Dates (jours civils) qui ont des repas validés. */
export function mealDates(plans: readonly MealPlan[], includeDraft = false): Set<string> {
  const out = new Set<string>();
  for (const p of plans) {
    if (p.status !== 'valide' && !includeDraft) continue;
    for (const d of new Set(planSlots(p).filter((s) => s.recipeId).map((s) => s.day))) out.add(addDaysKey(p.weekStart, d));
  }
  return out;
}

/** État nutrition d'un jour pour l'affichage du calendrier : aucun repas, plan proposé, semaine validée, ou jour avec un repas pris ailleurs (resto, sauté, fait autrement). */
export type MealDayState = 'aucun' | 'plan' | 'valide' | 'resto';

export function mealDayStates(plans: readonly MealPlan[]): Map<string, MealDayState> {
  const out = new Map<string, MealDayState>();
  for (const p of plans) {
    const byDay = new Map<number, boolean>();
    for (const s of planSlots(p)) if (s.recipeId) byDay.set(s.day, (byDay.get(s.day) ?? false) || !!s.out);
    for (const [d, anyOut] of byDay) {
      const date = addDaysKey(p.weekStart, d);
      out.set(date, anyOut ? 'resto' : p.status === 'valide' ? 'valide' : 'plan');
    }
  }
  return out;
}

export function mealDayState(plans: readonly MealPlan[], date: string): MealDayState {
  return mealDayStates(plans).get(date) ?? 'aucun';
}

export interface DayStats {
  plannedKcal: number;
  plannedProt: number;
  /** Repas notés « fait » (ou « fait autrement »). */
  eatenKcal: number;
  eatenProt: number;
  meals: number;
  done: number;
  skipped: number;
}

/** Totaux du jour : le prévu, et ce qui est réellement mangé (fait = comme prévu ; écart = kcal saisies si connues, sinon le prévu). */
export function dayStats(slots: readonly WeekSlot[], logs: readonly MealLog[], date: string): DayStats {
  const st: DayStats = { plannedKcal: 0, plannedProt: 0, eatenKcal: 0, eatenProt: 0, meals: slots.length, done: 0, skipped: 0 };
  for (const s of slots) {
    st.plannedKcal += s.kcal;
    st.plannedProt += s.prot;
    // Repas pris ailleurs : compté comme mangé (estimation) ou sauté, sans rien à cocher.
    if (s.out) {
      if (s.out.mode === 'saute') st.skipped++;
      else { st.done++; st.eatenKcal += s.kcal; st.eatenProt += s.prot; }
      continue;
    }
    const l = logs.find((x) => x.date === date && x.slotKey === slotKeyOf(s));
    if (l?.state === 'fait') { st.done++; st.eatenKcal += s.kcal; st.eatenProt += s.prot; }
    else if (l?.state === 'ecart') {
      st.done++;
      const k = l.kcal ?? s.kcal;
      st.eatenKcal += k;
      st.eatenProt += s.kcal > 0 ? s.prot * (k / s.kcal) : 0;
    } else if (l?.state === 'pas_fait') st.skipped++;
  }
  return st;
}

export interface WeekStats { meals: number; done: number; skipped: number; avgKcal: number; avgProt: number; daysCount: number }

export function weekStats(plan: MealPlan, logs: readonly MealLog[]): WeekStats {
  const slots = planSlots(plan).filter((s) => s.recipeId);
  const days = [...new Set(slots.map((s) => s.day))];
  let kcal = 0, prot = 0, done = 0, skipped = 0;
  for (const d of days) {
    const st = dayStats(slots.filter((s) => s.day === d), logs, addDaysKey(plan.weekStart, d));
    kcal += st.plannedKcal; prot += st.plannedProt; done += st.done; skipped += st.skipped;
  }
  const n = Math.max(1, days.length);
  return { meals: slots.length, done, skipped, avgKcal: kcal / n, avgProt: prot / n, daysCount: days.length };
}
