// Plan de repas de la SEMAINE (docs/nutrition-spec.md, annexe du 14/11/2026) : 7 jours d'un coup, repas optionnels, petit-déjeuner identique,
// recettes en lot, repas principaux qui absorbent le reste de la cible du jour. PUR, déterministe pour une graine.
// Les filtres durs (allergènes, régime, aliments évités, temps, matériel) sont ceux de plan.ts (`recipeAllowed`) : jamais assouplis.

import {
  ARRONDI_GRAMMES, BONUS_LOT, OUT_KCAL_MAX, OUT_SPLIT, ECHELLE_MAX, ECHELLE_MAX_PRINCIPAL, ENCAS_AUTO_MAX_KCAL, ENCAS_MAX_PAR_JOUR, SEUIL_ECART_KCAL, NUTRITION_VERSION, PART_DEJEUNER, PART_OPTIONNEL, PART_OPTIONNEL_MAX, PIECES_MAX_PAR_PRISE,
  MAX_FOIS_RECETTE_SEMAINE, SCORE, SCORE_VARIETE, TOL_KCAL_JOUR, TOL_KCAL_OPTIONNEL, TOL_KCAL_PRINCIPAL_ELARGIE, TOL_KCAL_REPAS, TOL_KCAL_REPLI,
} from './config';
import type { DayTarget } from './day-targets';
import { recipeAllowed, scaleRecipe, type DayCheck, type FoodMacros, type PlanPrefs, type Recipe } from './plan';
import type { PlannedIngredient, Rayon } from './shopping';
import type { AllergenKey } from './allergens';

export type SlotKind = 'petit-dej' | 'dejeuner' | 'diner' | 'gouter' | 'encas';

/** Réglage des repas optionnels : un booléen par jour (lundi à dimanche), 0 à 2 en-cas par jour. */
export interface MealConfig {
  petitDej: boolean[];
  /** Déjeuner et dîner par jour (tableau « Quels repas je prends ? ») : décoché = repas non planifié, la cible du jour passe sur les autres. */
  lunch: boolean[];
  dinner: boolean[];
  gouter: boolean[];
  encas: number[];
  /** Un seul petit-déjeuner pour toute la semaine. */
  petitDejIdentique: boolean;
  /** Complète automatiquement un jour sous la cible (goûter puis en-cas), jamais au-dessus de la cible ; désactivable. */
  completerAuto: boolean;
  /** « Fabriquer N pièces » : remplace le nombre de pièces d'un lot (jamais en dessous du nécessaire). */
  lotOverride: Record<string, number>;
  /** Repas imposés AVANT la génération : clé `jour-type-rang` -> id de recette (jamais appliqué si la recette ne respecte pas les filtres). */
  imposed: Record<string, string>;
  /** Jour des courses (0 = lundi) ou null : rappel sur l'Accueil. */
  shoppingDay: number | null;
}

export const DEFAULT_MEAL_CONFIG: MealConfig = {
  petitDej: Array(7).fill(true),
  lunch: Array(7).fill(true),
  dinner: Array(7).fill(true),
  gouter: Array(7).fill(false),
  encas: Array(7).fill(0),
  petitDejIdentique: false,
  completerAuto: true,
  lotOverride: {},
  imposed: {},
  shoppingDay: null,
};

const SLOT_KEY_RE = /^[0-6]-(petit-dej|dejeuner|diner|gouter|encas)-[0-2]$/;

/** Clé d'un repas du plan : `jour-type-rang` (jour 0 = lundi). */
export const slotKeyOf = (s: { day: number; kind: SlotKind; index: number }): string => `${s.day}-${s.kind}-${s.index}`;

/** Réglage valide : tableaux de 7, en-cas entre 0 et 2, jamais d'erreur à la lecture d'une ancienne sauvegarde. */
export function sanitizeMealConfig(c: Partial<MealConfig> | null | undefined): MealConfig {
  const bools = (a: unknown, d: boolean[]) => (Array.isArray(a) && a.length === 7 ? a.map((x) => x === true) : [...d]);
  const encas = Array.isArray(c?.encas) && c!.encas!.length === 7 ? c!.encas!.map((n) => Math.min(ENCAS_MAX_PAR_JOUR, Math.max(0, Math.round(Number(n) || 0)))) : [...DEFAULT_MEAL_CONFIG.encas];
  const lot: Record<string, number> = {};
  for (const [k, v] of Object.entries(c?.lotOverride ?? {})) if (Number.isFinite(v) && v > 0 && v <= 200) lot[k] = Math.round(v);
  const imposed: Record<string, string> = {};
  for (const [k, v] of Object.entries(c?.imposed ?? {})) if (SLOT_KEY_RE.test(k) && typeof v === 'string' && v.length > 0 && v.length <= 120) imposed[k] = v;
  return { petitDej: bools(c?.petitDej, DEFAULT_MEAL_CONFIG.petitDej), lunch: bools(c?.lunch, DEFAULT_MEAL_CONFIG.lunch), dinner: bools(c?.dinner, DEFAULT_MEAL_CONFIG.dinner), gouter: bools(c?.gouter, DEFAULT_MEAL_CONFIG.gouter), encas, petitDejIdentique: c?.petitDejIdentique === true, completerAuto: c?.completerAuto !== false, lotOverride: lot, imposed, shoppingDay: Number.isInteger(c?.shoppingDay) && (c!.shoppingDay as number) >= 0 && (c!.shoppingDay as number) <= 6 ? (c!.shoppingDay as number) : null };
}

/** Un aliment remplacé dans une recette (« Changer un aliment ») : mêmes calories, allergènes de l'aliment d'arrivée gardés pour le contrôle. */
export interface Swap {
  from: string;
  to: string;
  nom: string;
  grammes: number;
  rayon: Rayon;
  allergenes: AllergenKey[];
}

/** Repas pris ailleurs que dans le plan, pour CE jour seulement : restaurant / extérieur, repas sauté, ou déjà fait autrement. Les kcal sont une ESTIMATION. */
export type OutMode = 'resto' | 'saute' | 'autrement';
export interface SlotOut {
  mode: OutMode;
  /** Repère choisi pour un repas au restaurant (estimation). */
  level?: 'leger' | 'normal' | 'copieux';
  /** Énergie estimée du repas (0 si sauté). */
  kcal: number;
}

/** Repas pris ailleurs lu depuis un plan enregistré ou importé : mode connu et énergie bornée (0 à OUT_KCAL_MAX), sinon ignoré (le repas redevient « à la maison »). */
export function sanitizeOut(o: unknown): SlotOut | null {
  if (!o || typeof o !== 'object') return null;
  const x = o as Partial<SlotOut>;
  if (x.mode !== 'resto' && x.mode !== 'saute' && x.mode !== 'autrement') return null;
  const k = typeof x.kcal === 'number' && Number.isFinite(x.kcal) ? Math.min(OUT_KCAL_MAX, Math.max(0, Math.round(x.kcal))) : 0;
  return { mode: x.mode, ...(x.level === 'leger' || x.level === 'normal' || x.level === 'copieux' ? { level: x.level } : {}), kcal: x.mode === 'saute' ? 0 : k };
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
  /** Goûter / en-cas ajouté automatiquement pour combler un manque de plus du seuil (désactivable dans les réglages). */
  auto?: boolean;
  /** Aliments remplacés par l'utilisateur (recettes normales seulement). */
  swaps?: Swap[];
  /** Repas pris ailleurs (resto, sauté, autrement) : la recette reste gardée pour pouvoir remettre « à la maison ». */
  out?: SlotOut;
  /** Échelle d'origine de la recette avant un rééquilibrage du jour (pour revenir en arrière). */
  baseScale?: number;
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

export interface Pick {
  r: Recipe;
  swaps?: Swap[];
  out?: SlotOut;
  baseScale?: number;
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

/**
 * Composition d'un créneau : lignes d'ingrédients (grammes) et macros. Recette normale = grammes mis à l'échelle (ajustables) puis aliments remplacés ;
 * recette de lot = ingrédients d'une pièce x pièces (les remplacements ne s'appliquent pas aux lots). Null si un aliment est inconnu.
 */
export function composeSlot(r: Recipe, s: { scale: number; pieces: number; swaps?: Swap[] }, foods: ReadonlyMap<string, FoodMacros>) {
  if (r.lot) {
    const p = perPiece(r, foods);
    if (!p) return null;
    return { kcal: p.kcal * s.pieces, prot: p.prot * s.pieces, gluc: p.gluc * s.pieces, lip: p.lip * s.pieces, lines: [] as { code: string; nom: string; grammes: number; rayon: Rayon; swapped: boolean }[] };
  }
  let kcal = 0, prot = 0, gluc = 0, lip = 0;
  const lines: { code: string; nom: string; grammes: number; rayon: Rayon; swapped: boolean }[] = [];
  for (const i of r.ingredients) {
    const sw = s.swaps?.find((x) => x.from === i.code);
    const code = sw ? sw.to : i.code;
    const f = foods.get(code);
    if (!f) return null;
    const g = sw ? sw.grammes : i.ajustable ? Math.round((i.grammes * s.scale) / ARRONDI_GRAMMES) * ARRONDI_GRAMMES || ARRONDI_GRAMMES : i.grammes;
    kcal += (f.kcal * g) / 100; prot += (f.prot * g) / 100; gluc += (f.gluc * g) / 100; lip += (f.lip * g) / 100;
    lines.push({ code, nom: sw ? sw.nom : i.nom, grammes: g, rayon: sw ? sw.rayon : i.rayon, swapped: !!sw });
  }
  return { kcal, prot, gluc, lip, lines };
}

/** Meilleure prise d'une recette pour une cible : pièces entières pour un lot, mise à l'échelle sinon. */
export function pickFor(r: Recipe, foods: ReadonlyMap<string, FoodMacros>, target: number, tol: number, maxScale?: number): Pick | null {
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
  const s = scaleRecipe(r, foods, target, maxScale);
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

export const repasOf = (k: SlotKind): Recipe['repas'] => (k === 'petit-dej' ? 'petit-dej' : k === 'gouter' || k === 'encas' ? 'collation' : 'dejeuner-diner');

export function generateWeekPlan(
  days: readonly DayTarget[],
  recipes: readonly Recipe[],
  foods: ReadonlyMap<string, FoodMacros>,
  prefs: Omit<PlanPrefs, 'mealsPerDay'>,
  cfgIn: Partial<MealConfig> | null,
  seed: number,
  previousRecipeIds: readonly string[],
  floorKcal: number,
  /** Repas verrouillés à garder tels quels (l'appelant a vérifié qu'ils respectent les filtres du moment). */
  fixed: ReadonlyMap<string, WeekSlot> = new Map(),
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
    for (const fs of fixed.values()) if (fs.day === day && fs.kind !== 'dejeuner' && fs.kind !== 'diner' && !optional.some((o) => o.kind === fs.kind && o.index === fs.index)) optional.push({ kind: fs.kind, index: fs.index, share: 0 });
    const fixedPick = (kind: SlotKind, index: number): (Pick & { auto?: boolean }) | null => {
      const fs = fixed.get(`${day}-${kind}-${index}`);
      const r = fs?.recipeId ? recipes.find((x) => x.id === fs.recipeId) : undefined;
      if (!fs || !r || !recipeAllowed(r, pf)) return null;
      const c = composeSlot(r, fs, foods);
      if (!c) return null;
      // Repas pris ailleurs : énergie estimée, aucun ingrédient (ni courses), la recette reste gardée.
      const fo = sanitizeOut(fs.out);
      if (fo) {
        const k = fo.kcal;
        return { r, scale: fs.scale, pieces: fs.pieces, kcal: k, prot: (k * OUT_SPLIT.prot) / 4, gluc: (k * OUT_SPLIT.gluc) / 4, lip: (k * OUT_SPLIT.lip) / 9, err: 0, lines: [], out: fo, ...(fs.baseScale ? { baseScale: fs.baseScale } : {}), ...(fs.auto ? { auto: true } : {}) };
      }
      return { r, scale: fs.scale, pieces: fs.pieces, kcal: c.kcal, prot: c.prot, gluc: c.gluc, lip: c.lip, err: 0, lines: c.lines.map((l) => ({ code: l.code, nom: l.nom, grammes: l.grammes, rayon: l.rayon })), ...(fs.swaps?.length ? { swaps: fs.swaps } : {}), ...(fs.auto ? { auto: true } : {}) };
    };
    const imposedPick = (kind: SlotKind, index: number, target: number, maxScale?: number): Pick | null => {
      const id = cfg.imposed[`${day}-${kind}-${index}`];
      const r = id ? allowed.find((x) => x.id === id) : undefined;
      if (!r || r.repas !== repasOf(kind)) return null;
      return pickFor(r, foods, target, TOL_KCAL_REPLI, maxScale);
    };
    const usedToday = new Set<string>();
    const protToday = new Set<string>();
    const fecToday = new Set<string>();
    const done: WeekSlot[] = [];
    const push = (kind: SlotKind, index: number, pk: Pick | null, auto = false) => {
      const s: WeekSlot = pk
        ? { day, kind, index, recipeId: pk.r.id, scale: pk.scale, pieces: pk.pieces, kcal: pk.kcal, prot: pk.prot, gluc: pk.gluc, lip: pk.lip, ...(auto ? { auto: true } : {}), ...(pk.swaps?.length ? { swaps: pk.swaps } : {}), ...(pk.out ? { out: pk.out } : {}), ...(pk.baseScale ? { baseScale: pk.baseScale } : {}) }
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

    // Choix d'une recette pour un goûter / en-cas / petit-déjeuner ; maxKcal = plafond dur (jamais au-dessus), carb = préférer les glucides.
    const chooseOptional = (kind: SlotKind, index: number, target: number, maxKcal?: number, carb = false): Pick | null => {
      const want = repasOf(kind);
      const key = `${kind}-${index}`;
      const chosenLot = lotFor.get(key);
      let best: { pk: Pick; score: number } | null = null;
      for (const r of allowed) {
        if (r.repas !== want || usedToday.has(r.id)) continue;
        if (chosenLot && r.lot && r.id !== chosenLot.id) continue; // un seul lot par créneau sur la semaine
        const pk = pickFor(r, foods, target, r.lot || kind !== 'petit-dej' ? TOL_KCAL_OPTIONNEL : TOL_KCAL_REPAS);
        if (!pk) continue;
        if (maxKcal !== undefined && pk.kcal > maxKcal + 1e-9) continue;
        let score = -pk.err * SCORE.ecartKcal + basketScore(pk) + rnd() * SCORE.bruit;
        if (carb && pk.kcal > 0) score += (SCORE.glucidesCompl * 4 * pk.gluc) / pk.kcal;
        if (r.lot) score += BONUS_LOT + (chosenLot?.id === r.id ? BONUS_LOT : 0);
        else score -= (usedMain.get(r.id) ?? 0) * SCORE.repetition - (previousRecipeIds.includes(r.id) ? SCORE.repetitionSemaineDerniere : 0);
        if (!best || score > best.score) best = { pk, score };
      }
      if (best?.pk.r.lot) lotFor.set(key, best.pk.r);
      return best?.pk ?? null;
    };

    // 1) repas optionnels d'abord (cibles nominales)
    for (const o of optional) {
      const fx = fixedPick(o.kind, o.index);
      if (fx) { push(o.kind, o.index, fx, fx.auto); continue; }
      const target = d.kcal * o.share;
      const imp = imposedPick(o.kind, o.index, target);
      if (imp) { push(o.kind, o.index, imp); continue; }
      if (o.kind === 'petit-dej' && fixedBreakfast) { push(o.kind, o.index, pickFor(fixedBreakfast, foods, target, TOL_KCAL_REPAS)); continue; }
      push(o.kind, o.index, chooseOptional(o.kind, o.index, target));
    }

    // 2) repas principaux : ils absorbent le reste de la cible du jour (déjeuner puis dîner)
    const eaten = done.reduce((s, x) => s + x.kcal, 0);
    const rest = Math.max(0, d.kcal - eaten);
    const mainOn = { dejeuner: cfg.lunch[day], diner: cfg.dinner[day] };
    const fixedMain = { dejeuner: mainOn.dejeuner ? fixedPick('dejeuner', 0) : null, diner: mainOn.diner ? fixedPick('diner', 0) : null };
    for (const kind of ['dejeuner', 'diner'] as const) {
      if (!mainOn[kind]) continue; // repas non pris ce jour-là : jamais planifié
      const fm = fixedMain[kind];
      if (fm) { push(kind, 0, fm); continue; }
      const other = fixedMain[kind === 'dejeuner' ? 'diner' : 'dejeuner'];
      const otherOn = mainOn[kind === 'dejeuner' ? 'diner' : 'dejeuner'];
      // Un seul repas principal ce jour-là : il porte tout le reste de la cible, dans une portion plus large (jamais au-delà de ECHELLE_MAX).
      const target = other ? Math.max(0, rest - other.kcal) : otherOn ? rest * (kind === 'dejeuner' ? PART_DEJEUNER : 1 - PART_DEJEUNER) : rest;
      const mainScale = otherOn ? ECHELLE_MAX_PRINCIPAL : ECHELLE_MAX;
      let best: { pk: Pick; score: number } | null = null;
      const imp = target > 0 ? imposedPick(kind, 0, target, mainScale) : null;
      if (imp) { push(kind, 0, imp); continue; }
      if (target > 0) {
        // Ordre des essais : dans la tolérance du repas ET sous le plafond de répétition, puis dans la tolérance sans le plafond, puis repli sur la
        // recette la plus proche (le jour sera signalé « écart »). Jamais une case vide si une recette autorisée existe.
        const passes: { tol: number; cap: boolean }[] = [
          { tol: TOL_KCAL_REPAS, cap: true }, { tol: TOL_KCAL_PRINCIPAL_ELARGIE, cap: true }, { tol: TOL_KCAL_REPAS, cap: false }, { tol: TOL_KCAL_REPLI, cap: true }, { tol: TOL_KCAL_REPLI, cap: false },
        ];
        for (const { tol, cap } of passes) {
          for (const r of allowed) {
            if (r.repas !== 'dejeuner-diner' || usedToday.has(r.id)) continue;
            if (cap && (usedMain.get(r.id) ?? 0) >= MAX_FOIS_RECETTE_SEMAINE) continue;
            const pk = pickFor(r, foods, target, tol, mainScale);
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
    // 3) jour sous la cible de plus du seuil : goûter puis en-cas ajoutés (actifs par défaut, désactivables), jamais au-dessus de la cible du jour.
    // La cible du jour est déjà bornée par le plafond de sécurité (surplus, déficit, plancher) : l'ajout ne la dépasse jamais.
    if (cfg.completerAuto && !done.some((s) => !s.recipeId)) {
      const free: { kind: SlotKind; index: number }[] = [];
      if (!cfg.gouter[day]) free.push({ kind: 'gouter', index: 0 });
      for (let i = cfg.encas[day]; i < ENCAS_MAX_PAR_JOUR; i++) free.push({ kind: 'encas', index: i });
      free.splice(0, free.length, ...free.filter((o) => !done.some((s) => s.kind === o.kind && s.index === o.index)));
      free.forEach((o, k) => {
        const eaten = done.reduce((t, x) => t + x.kcal, 0);
        const gap = d.kcal - eaten;
        // Sous le plancher : on complète même si le manque est petit ; le plancher passe avant la cible (marge de ±5 % du jour, jamais plus).
        const belowFloor = eaten < floorKcal - 1e-9;
        if (gap <= SEUIL_ECART_KCAL && !belowFloor) return;
        const need = Math.max(1, Math.min(free.length - k, Math.ceil(gap / ENCAS_AUTO_MAX_KCAL)));
        const cap = Math.min(ENCAS_AUTO_MAX_KCAL, Math.max(gap, 0) + (belowFloor ? d.kcal * TOL_KCAL_JOUR : 0));
        const pk = chooseOptional(o.kind, o.index, Math.min(ENCAS_AUTO_MAX_KCAL, Math.max(gap, 1) / need), cap, true);
        if (pk) push(o.kind, o.index, pk, true);
      });
    }
    protYesterday = protToday;
    fecYesterday = fecToday;
  });
  // Ordre d'affichage dans la journée : petit-déjeuner, 1er en-cas, déjeuner, goûter, 2e en-cas, dîner.
  const rank = (s: WeekSlot) => (s.kind === 'petit-dej' ? 0 : s.kind === 'encas' && s.index === 0 ? 1 : s.kind === 'dejeuner' ? 2 : s.kind === 'gouter' ? 3 : s.kind === 'encas' ? 4 : 5);
  slots.sort((a, b) => a.day - b.day || rank(a) - rank(b));

  // Lots : pièces nécessaires = somme des prises ; fabriquées = max(nécessaire, réglage). Courses = pièces du lot x ingrédients d'une pièce.
  const lotMap = new Map<string, LotInfo>();
  for (const s of slots) {
    if (!s.recipeId || !s.pieces || s.out) continue;
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
    const manque = d.kcal - kcal;
    return { day, kcal, targetKcal: d.kcal, status, belowFloor, missingKcal: manque > SEUIL_ECART_KCAL ? manque : 0 };
  });
  return { version: NUTRITION_VERSION, slots, lots, days: checks, ingredients };
}
