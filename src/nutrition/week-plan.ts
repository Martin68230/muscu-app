// Plan de repas de la SEMAINE (docs/nutrition-spec.md, annexe du 14/11/2026) : 7 jours d'un coup, repas optionnels, petit-déjeuner identique,
// recettes en lot, repas principaux qui absorbent le reste de la cible du jour. PUR, déterministe pour une graine.
// Les filtres durs (allergènes, régime, aliments évités, temps, matériel) sont ceux de plan.ts (`recipeAllowed`) : jamais assouplis.

import {
  ARRONDI_GRAMMES, BONUS_LOT, ENCAS_MAX_PAR_JOUR, NUTRITION_VERSION, PART_DEJEUNER, PART_OPTIONNEL, PART_OPTIONNEL_MAX, PIECES_MAX_PAR_PRISE,
  MAX_FOIS_RECETTE_SEMAINE, SCORE, SCORE_VARIETE, TOL_KCAL_JOUR, TOL_KCAL_OPTIONNEL, TOL_KCAL_REPAS, TOL_KCAL_REPLI,
} from './config';
import type { DayTarget } from './day-targets';
import { recipeAllowed, scaleRecipe, type DayCheck, type FoodMacros, type PlanPrefs, type Recipe } from './plan';
import type { PlannedIngredient, Rayon } from './shopping';

export type SlotKind = 'petit-dej' | 'dejeuner' | 'diner' | 'gouter' | 'encas';

/** Réglage des repas optionnels : un booléen par jour (lundi à dimanche), 0 à 2 en-cas par jour. */
export interface MealConfig {
  petitDej: boolean[];
  gouter: boolean[];
  encas: number[];
  /** Un seul petit-déjeuner pour toute la semaine. */
  petitDejIdentique: boolean;
  /** « Fabriquer N pièces » : remplace le nombre de pièces d'un lot (jamais en dessous du nécessaire). */
  lotOverride: Record<string, number>;
}

export const DEFAULT_MEAL_CONFIG: MealConfig = {
  petitDej: Array(7).fill(true),
  gouter: Array(7).fill(false),
  encas: Array(7).fill(0),
  petitDejIdentique: false,
  lotOverride: {},
};

/** Réglage valide : tableaux de 7, en-cas entre 0 et 2, jamais d'erreur à la lecture d'une ancienne sauvegarde. */
export function sanitizeMealConfig(c: Partial<MealConfig> | null | undefined): MealConfig {
  const bools = (a: unknown, d: boolean[]) => (Array.isArray(a) && a.length === 7 ? a.map((x) => x === true) : [...d]);
  const encas = Array.isArray(c?.encas) && c!.encas!.length === 7 ? c!.encas!.map((n) => Math.min(ENCAS_MAX_PAR_JOUR, Math.max(0, Math.round(Number(n) || 0)))) : [...DEFAULT_MEAL_CONFIG.encas];
  const lot: Record<string, number> = {};
  for (const [k, v] of Object.entries(c?.lotOverride ?? {})) if (Number.isFinite(v) && v > 0 && v <= 200) lot[k] = Math.round(v);
  return { petitDej: bools(c?.petitDej, DEFAULT_MEAL_CONFIG.petitDej), gouter: bools(c?.gouter, DEFAULT_MEAL_CONFIG.gouter), encas, petitDejIdentique: c?.petitDejIdentique === true, lotOverride: lot };
}

export interface WeekSlot {
  day: number;
  kind: SlotKind;
  /** 0 pour les en-cas : rang du créneau dans la journée (1er, 2e en-cas). */
  index: number;
  recipeId: string | null;
  /** Mise à l'échelle des ingrédients ajustables (recettes normales). */
  scale: number;
  /** Pièces mangées (recettes de lot), sinon 0. */
  pieces: number;
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
}

export interface LotInfo {
  recipeId: string;
  piece: string;
  /** Pièces nécessaires pour la semaine (somme des prises). */
  needed: number;
  /** Pièces à fabriquer : le plus grand de `needed` et du réglage de l'utilisateur. */
  pieces: number;
}

export interface WeekPlanResult {
  version: string;
  slots: WeekSlot[];
  lots: LotInfo[];
  days: DayCheck[];
  /** Grammes crus pour la liste de courses (lots multipliés par le nombre de pièces du lot). */
  ingredients: PlannedIngredient[];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Arrondi vers le HAUT : une quantité de courses ne descend jamais sous le besoin. */
export const ceilG = (g: number) => Math.ceil(g / ARRONDI_GRAMMES - 1e-9) * ARRONDI_GRAMMES || ARRONDI_GRAMMES;

interface Pick {
  r: Recipe;
  scale: number;
  pieces: number;
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
  err: number;
  lines: { code: string; nom: string; grammes: number; rayon: Rayon }[];
}

function perPiece(r: Recipe, foods: ReadonlyMap<string, FoodMacros>) {
  let kcal = 0, prot = 0, gluc = 0, lip = 0;
  for (const i of r.ingredients) {
    const f = foods.get(i.code);
    if (!f) return null;
    kcal += (f.kcal * i.grammes) / 100; prot += (f.prot * i.grammes) / 100; gluc += (f.gluc * i.grammes) / 100; lip += (f.lip * i.grammes) / 100;
  }
  return { kcal, prot, gluc, lip };
}

/** Meilleure prise d'une recette pour une cible : pièces entières pour un lot, mise à l'échelle sinon. */
function pickFor(r: Recipe, foods: ReadonlyMap<string, FoodMacros>, target: number, tol: number): Pick | null {
  if (!Number.isFinite(target) || target <= 0) return null;
  if (r.lot) {
    const p = perPiece(r, foods);
    if (!p || p.kcal <= 0) return null;
    let best: Pick | null = null;
    for (let n = 1; n <= PIECES_MAX_PAR_PRISE; n++) {
      const err = Math.abs(p.kcal * n - target) / target;
      if (err <= tol && (!best || err < best.err)) best = { r, scale: 1, pieces: n, kcal: p.kcal * n, prot: p.prot * n, gluc: p.gluc * n, lip: p.lip * n, err, lines: [] };
    }
    return best;
  }
  const s = scaleRecipe(r, foods, target);
  if (!s) return null;
  const err = Math.abs(s.kcal - target) / target;
  if (err > tol) return null;
  return { r, scale: s.scale, pieces: 0, kcal: s.kcal, prot: s.prot, gluc: s.gluc, lip: s.lip, err, lines: s.lines };
}

/** Parts nominales des repas optionnels d'un jour ; le total est plafonné. */
function optionalShares(day: number, cfg: MealConfig): { kind: SlotKind; index: number; share: number }[] {
  const out: { kind: SlotKind; index: number; share: number }[] = [];
  if (cfg.petitDej[day]) out.push({ kind: 'petit-dej', index: 0, share: PART_OPTIONNEL.petitDej });
  if (cfg.gouter[day]) out.push({ kind: 'gouter', index: 0, share: PART_OPTIONNEL.gouter });
  for (let i = 0; i < cfg.encas[day]; i++) out.push({ kind: 'encas', index: i, share: PART_OPTIONNEL.encas });
  const total = out.reduce((s, x) => s + x.share, 0);
  if (total > PART_OPTIONNEL_MAX) for (const x of out) x.share = (x.share * PART_OPTIONNEL_MAX) / total;
  return out;
}

const repasOf = (k: SlotKind): Recipe['repas'] => (k === 'petit-dej' ? 'petit-dej' : k === 'gouter' || k === 'encas' ? 'collation' : 'dejeuner-diner');

export function generateWeekPlan(
  days: readonly DayTarget[],
  recipes: readonly Recipe[],
  foods: ReadonlyMap<string, FoodMacros>,
  prefs: Omit<PlanPrefs, 'mealsPerDay'>,
  cfgIn: Partial<MealConfig> | null,
  seed: number,
  previousRecipeIds: readonly string[],
  floorKcal: number,
): WeekPlanResult {
  // Cibles invalides : aucun plan (jamais un jour « ok » calculé sur NaN) ; le plancher est obligatoire.
  if (!Number.isFinite(floorKcal) || days.length !== 7 || days.some((d) => !Number.isFinite(d.kcal) || d.kcal <= 0)) throw new Error('Cible invalide : plan impossible');
  const cfg = sanitizeMealConfig(cfgIn);
  const rnd = mulberry32(seed);
  const pf = { ...prefs, mealsPerDay: 3 as const };
  const allowed = recipes.filter((r) => recipeAllowed(r, pf));
  const usedMain = new Map<string, number>();
  // Rotation : usage de chaque protéine et féculent dans la semaine, et ceux de la veille.
  const protWeek = new Map<string, number>();
  const fecWeek = new Map<string, number>();
  let protYesterday = new Set<string>();
  let fecYesterday = new Set<string>();
  const basket = new Set<string>();
  const slots: WeekSlot[] = [];
  const lines: { slot: WeekSlot; lines: Pick['lines'] }[] = [];

  const basketScore = (p: Pick) => {
    if (!prefs.optimizeShopping) return 0;
    let s = 0;
    for (const l of p.lines) {
      const f = foods.get(l.code);
      if (f?.gardeManger) continue;
      s += basket.has(l.code) ? SCORE.dejaDansPanier : f?.perissable ? -SCORE.nouveauPerissable : -SCORE.nouveauNonPerissable;
    }
    return s;
  };

  // Petit-déjeuner identique : une recette qui convient TOUS les jours actifs (écart moyen minimal).
  let fixedBreakfast: Recipe | null = null;
  if (cfg.petitDejIdentique) {
    const dayList = days.map((d, i) => ({ d, i })).filter(({ i }) => cfg.petitDej[i]);
    let best: { r: Recipe; score: number } | null = null;
    for (const r of allowed.filter((x) => x.repas === 'petit-dej' && !x.lot)) {
      let tot = 0, okAll = true;
      for (const { d, i } of dayList) {
        const share = optionalShares(i, cfg).find((x) => x.kind === 'petit-dej')!.share;
        const p = pickFor(r, foods, d.kcal * share, TOL_KCAL_REPAS);
        if (!p) { okAll = false; break; }
        tot += p.err;
      }
      if (!okAll || !dayList.length) continue;
      const score = -tot / dayList.length + rnd() * 0.01 - (previousRecipeIds.includes(r.id) ? 0.05 : 0);
      if (!best || score > best.score) best = { r, score };
    }
    fixedBreakfast = best?.r ?? null;
  }
  // Lots de goûter / en-cas : même recette de lot choisie une fois par rang de créneau (préparation en lot).
  const lotFor = new Map<string, Recipe>();

  days.forEach((d, day) => {
    const optional = optionalShares(day, cfg);
    const usedToday = new Set<string>();
    const protToday = new Set<string>();
    const fecToday = new Set<string>();
    const done: WeekSlot[] = [];
    const push = (kind: SlotKind, index: number, pk: Pick | null) => {
      const s: WeekSlot = pk
        ? { day, kind, index, recipeId: pk.r.id, scale: pk.scale, pieces: pk.pieces, kcal: pk.kcal, prot: pk.prot, gluc: pk.gluc, lip: pk.lip }
        : { day, kind, index, recipeId: null, scale: 0, pieces: 0, kcal: 0, prot: 0, gluc: 0, lip: 0 };
      slots.push(s);
      done.push(s);
      if (pk) {
        usedToday.add(pk.r.id);
        if (kind === 'dejeuner' || kind === 'diner') {
          if (pk.r.sourceProteines) { protToday.add(pk.r.sourceProteines); protWeek.set(pk.r.sourceProteines, (protWeek.get(pk.r.sourceProteines) ?? 0) + 1); }
          if (pk.r.sourceGlucides) { fecToday.add(pk.r.sourceGlucides); fecWeek.set(pk.r.sourceGlucides, (fecWeek.get(pk.r.sourceGlucides) ?? 0) + 1); }
        }
        if (!pk.r.lot) { usedMain.set(pk.r.id, (usedMain.get(pk.r.id) ?? 0) + 1); lines.push({ slot: s, lines: pk.lines }); for (const l of pk.lines) basket.add(l.code); }
        else for (const i of pk.r.ingredients) basket.add(i.code);
      }
    };

    // 1) repas optionnels d'abord (cibles nominales)
    for (const o of optional) {
      const target = d.kcal * o.share;
      const want = repasOf(o.kind);
      if (o.kind === 'petit-dej' && fixedBreakfast) { push(o.kind, o.index, pickFor(fixedBreakfast, foods, target, TOL_KCAL_REPAS)); continue; }
      const key = `${o.kind}-${o.index}`;
      const chosenLot = lotFor.get(key);
      let best: { pk: Pick; score: number } | null = null;
      for (const r of allowed) {
        if (r.repas !== want || usedToday.has(r.id)) continue;
        if (chosenLot && r.lot && r.id !== chosenLot.id) continue; // un seul lot par créneau sur la semaine
        const pk = pickFor(r, foods, target, r.lot || o.kind !== 'petit-dej' ? TOL_KCAL_OPTIONNEL : TOL_KCAL_REPAS);
        if (!pk) continue;
        let score = -pk.err * SCORE.ecartKcal + basketScore(pk) + rnd() * SCORE.bruit;
        if (r.lot) score += BONUS_LOT + (chosenLot?.id === r.id ? BONUS_LOT : 0);
        else score -= (usedMain.get(r.id) ?? 0) * SCORE.repetition - (previousRecipeIds.includes(r.id) ? SCORE.repetitionSemaineDerniere : 0);
        if (!best || score > best.score) best = { pk, score };
      }
      if (best?.pk.r.lot) lotFor.set(key, best.pk.r);
      push(o.kind, o.index, best?.pk ?? null);
    }

    // 2) repas principaux : ils absorbent le reste de la cible du jour (déjeuner puis dîner)
    const eaten = done.reduce((s, x) => s + x.kcal, 0);
    const rest = Math.max(0, d.kcal - eaten);
    for (const kind of ['dejeuner', 'diner'] as const) {
      const target = rest * (kind === 'dejeuner' ? PART_DEJEUNER : 1 - PART_DEJEUNER);
      let best: { pk: Pick; score: number } | null = null;
      if (target > 0) {
        // Ordre des essais : dans la tolérance du repas ET sous le plafond de répétition, puis dans la tolérance sans le plafond, puis repli sur la
        // recette la plus proche (le jour sera signalé « écart »). Jamais une case vide si une recette autorisée existe.
        const passes: { tol: number; cap: boolean }[] = [
          { tol: TOL_KCAL_REPAS, cap: true }, { tol: TOL_KCAL_REPAS, cap: false }, { tol: TOL_KCAL_REPLI, cap: true }, { tol: TOL_KCAL_REPLI, cap: false },
        ];
        for (const { tol, cap } of passes) {
          for (const r of allowed) {
            if (r.repas !== 'dejeuner-diner' || usedToday.has(r.id)) continue;
            if (cap && (usedMain.get(r.id) ?? 0) >= MAX_FOIS_RECETTE_SEMAINE) continue;
            const pk = pickFor(r, foods, target, tol);
            if (!pk) continue;
            const p = r.sourceProteines ?? '';
            const g = r.sourceGlucides ?? '';
            let rot = 0;
            if (p) rot += (protYesterday.has(p) ? SCORE_VARIETE.memeSourceVeille : 0) + (protToday.has(p) ? SCORE_VARIETE.memeSourceMemeJour : 0) + (protWeek.get(p) ?? 0) * SCORE_VARIETE.parUsageSemaine;
            if (g) rot += (fecYesterday.has(g) ? SCORE_VARIETE.memeSourceVeille : 0) + (fecToday.has(g) ? SCORE_VARIETE.memeSourceMemeJour : 0) + (fecWeek.get(g) ?? 0) * SCORE_VARIETE.parUsageSemaine;
            const score = -pk.err * SCORE.ecartKcal - (usedMain.get(r.id) ?? 0) * SCORE.repetition - rot - (previousRecipeIds.includes(r.id) ? SCORE.repetitionSemaineDerniere : 0) + basketScore(pk) + rnd() * SCORE.bruit;
            if (!best || score > best.score) best = { pk, score };
          }
          if (best) break;
        }
      }
      push(kind, 0, best?.pk ?? null);
    }
    protYesterday = protToday;
    fecYesterday = fecToday;
  });

  // Lots : pièces nécessaires = somme des prises ; fabriquées = max(nécessaire, réglage). Courses = pièces du lot x ingrédients d'une pièce.
  const lotMap = new Map<string, LotInfo>();
  for (const s of slots) {
    if (!s.recipeId || !s.pieces) continue;
    const r = recipes.find((x) => x.id === s.recipeId)!;
    const cur = lotMap.get(r.id) ?? { recipeId: r.id, piece: (r as Recipe & { piece?: string | null }).piece ?? 'pièce', needed: 0, pieces: 0 };
    cur.needed += s.pieces;
    lotMap.set(r.id, cur);
  }
  const lots = [...lotMap.values()].map((l) => ({ ...l, pieces: Math.max(l.needed, cfg.lotOverride[l.recipeId] ?? 0) }));

  const ingredients: PlannedIngredient[] = [];
  for (const { lines: ls } of lines) for (const l of ls) ingredients.push({ code: l.code, name: l.nom, grams: l.grammes, rayon: l.rayon, pantry: foods.get(l.code)?.gardeManger });
  for (const l of lots) {
    const r = recipes.find((x) => x.id === l.recipeId)!;
    for (const i of r.ingredients) ingredients.push({ code: i.code, name: i.nom, grams: ceilG(i.grammes * l.pieces), rayon: i.rayon, pantry: foods.get(i.code)?.gardeManger });
  }

  // Contrôles finaux : allergènes re-vérifiés, énergie du jour, plancher.
  for (const s of slots) {
    if (!s.recipeId) continue;
    const r = recipes.find((x) => x.id === s.recipeId);
    if (!r || !recipeAllowed(r, pf)) throw new Error(`Plan invalide : ${s.recipeId} ne respecte pas les filtres`);
  }
  const checks: DayCheck[] = days.map((d, day) => {
    const mine = slots.filter((s) => s.day === day);
    const kcal = mine.reduce((t, s) => t + s.kcal, 0);
    let status: DayCheck['status'] = 'ok';
    const belowFloor = kcal < floorKcal - 1e-9;
    if (mine.some((s) => !s.recipeId)) status = 'incomplet';
    else if (belowFloor) status = 'sous_plancher';
    else if (Math.abs(kcal - d.kcal) / d.kcal > TOL_KCAL_JOUR) status = 'ecart';
    return { day, kcal, targetKcal: d.kcal, status, belowFloor };
  });
  return { version: NUTRITION_VERSION, slots, lots, days: checks, ingredients };
}
