// Export N15 (docs/nutrition-spec.md) : courses, repas et recettes de jours choisis, pour un proche ou pour coller dans une IA externe.
// PUR. Rien n'est envoyé par l'app : texte à copier ou JSON à enregistrer. L'export ne contient JAMAIS : nom, poids, poids cible, IMC, dépistage,
// pathologie, objectif (perte / prise), déficit, mode strict. Les régimes et allergènes ne sont exportés que s'ils sont cochés.

import { ALLERGEN_LABELS, type AllergenKey } from './allergens';
import { ARRONDI_GRAMMES, LIP_MIN_PCT_ENERGIE } from './config';
import type { DayTarget } from './day-targets';
import type { Recipe } from './plan';
import { buildShoppingList, RAYON_LABELS, RAYON_ORDER, type PlannedIngredient, type PurchaseUnit } from './shopping';
import type { WeekPlanResult, WeekSlot } from './week-plan';

export const PERSON2_KCAL_MIN = 1200;
export const PERSON2_KCAL_ALERT = 1500;
export const PERSON2_KCAL_MAX = 6000;
const DAYS_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const KIND_LABEL: Record<WeekSlot['kind'], string> = { 'petit-dej': 'Petit-déjeuner', dejeuner: 'Déjeuner', diner: 'Dîner', gouter: 'Goûter', encas: 'En-cas' };
const DIET_LABEL: Record<string, string> = { vegetarien: 'végétarien', vegetalien: 'végétalien', sans_porc: 'sans porc', sans_lactose: 'sans lactose', sans_gluten: 'sans gluten' };

export interface Person2 {
  kcal: number;
  prot: number;
  gluc: number;
  lip: number;
  allergens: AllergenKey[];
}

export interface ExportOptions {
  /** 7 booléens, lundi à dimanche. */
  days: boolean[];
  shopping: boolean;
  meals: boolean;
  /** Mes cibles du jour (kcal et macros de la personne qui exporte). */
  targets: boolean;
  /** Allergies et régimes à exclure (seulement ceux cochés). */
  exclusions: boolean;
  person2: Person2 | null;
  /** Modèle de demande pour une IA : masqué par l'appelant quand l'interrupteur IA est coupé (règle 9). */
  aiTemplate: boolean;
}

export interface Exclusions {
  allergens: AllergenKey[];
  diet: string[];
  severeAllergy: boolean;
}

export interface Person2Check {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

/** Contrôles de la personne 2 : plancher 1 200 kcal (refus), alerte jusqu'à 1 500, plausibilité des macros. Aucun déficit n'est calculé. */
export function checkPerson2(p: Person2): Person2Check {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nums = [p.kcal, p.prot, p.gluc, p.lip];
  if (nums.some((n) => !Number.isFinite(n) || n < 0)) return { ok: false, errors: ['Une valeur est vide ou invalide.'], warnings };
  if (p.kcal < PERSON2_KCAL_MIN) errors.push('Cette valeur est trop basse pour être exportée : sous 1 200 kcal par jour, parle à un professionnel de santé.');
  else if (p.kcal < PERSON2_KCAL_ALERT) warnings.push('Cible basse (moins de 1 500 kcal) : un professionnel de santé peut t’aider à la valider.');
  if (p.kcal > PERSON2_KCAL_MAX) errors.push('Cette valeur est trop haute pour être exportée.');
  if (!errors.length) {
    const atwater = 4 * p.prot + 4 * p.gluc + 9 * p.lip;
    if (Math.abs(atwater - p.kcal) / p.kcal > 0.2) errors.push('Les protéines, glucides et lipides ne correspondent pas aux calories (écart de plus de 20 %).');
    if (p.lip * 9 < LIP_MIN_PCT_ENERGIE * p.kcal) errors.push('Les lipides sont sous 20 % de l’énergie : trop bas pour être exportés.');
    if (p.prot < 40) errors.push('Les protéines sont sous 40 g par jour : trop bas pour être exportés.');
  }
  return { ok: errors.length === 0, errors, warnings };
}

/** Grammes d'un ingrédient pour un créneau (même règle que l'écran) : pièces x grammes d'une pièce pour un lot, sinon grammes de base mis à l'échelle (ajustables). */
export function slotLines(r: Recipe, s: Pick<WeekSlot, 'scale' | 'pieces'>): { code: string; nom: string; g: number; rayon: PlannedIngredient['rayon'] }[] {
  return r.ingredients.map((i) => ({
    code: i.code,
    nom: i.nom,
    rayon: i.rayon,
    g: r.lot ? Math.ceil((i.grammes * s.pieces) / ARRONDI_GRAMMES - 1e-9) * ARRONDI_GRAMMES : i.ajustable ? Math.round((i.grammes * s.scale) / ARRONDI_GRAMMES) * ARRONDI_GRAMMES || ARRONDI_GRAMMES : i.grammes,
  }));
}

export interface ExportResult {
  text: string;
  json: Record<string, unknown>;
  /** Repas du plan qui contiennent un allergène de la personne 2 : à adapter, jamais cachés. */
  conflicts: string[];
}

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');

export function buildExport(
  plan: WeekPlanResult,
  recipes: ReadonlyMap<string, Recipe>,
  units: Readonly<Record<string, PurchaseUnit>>,
  opts: ExportOptions,
  targets: readonly DayTarget[] | null,
  excl: Exclusions,
): ExportResult {
  const days = opts.days.map((d, i) => (d ? i : -1)).filter((i) => i >= 0);
  const p2 = opts.person2 && checkPerson2(opts.person2).ok ? opts.person2 : null;
  const lines: string[] = ['PLAN DE REPAS (export de l’app, sans donnée personnelle)', ''];
  const json: Record<string, unknown> = { format: 'muscu-app-nutrition-export-1', jours: [] as unknown[] };
  const conflicts: string[] = [];
  const planned: PlannedIngredient[] = [];

  if (opts.exclusions && (excl.allergens.length || excl.diet.length)) {
    const a = excl.allergens.map((k) => ALLERGEN_LABELS[k].label);
    const d = excl.diet.map((k) => DIET_LABEL[k] ?? k);
    lines.push(`À EXCLURE : ${[...a.map((x) => `allergène ${x}`), ...d].join(', ')}.`, '');
    json.exclusions = { allergenes: excl.allergens, regimes: excl.diet };
  }

  for (const di of days) {
    const day = plan.days[di];
    const slots = plan.slots.filter((s) => s.day === di);
    const dayJson: Record<string, unknown> = { jour: DAYS_LONG[di], repas: [] as unknown[] };
    lines.push(`=== ${DAYS_LONG[di].toUpperCase()} ===`);
    if (opts.targets && targets?.[di]) {
      const t = targets[di];
      lines.push(`Mes cibles : ${fmt(t.kcal)} kcal · protéines ${fmt(t.protG)} g · glucides ${fmt(t.glucG)} g · lipides ${fmt(t.lipG)} g`);
      dayJson.cibles = { kcal: Math.round(t.kcal), proteines: Math.round(t.protG), glucides: Math.round(t.glucG), lipides: Math.round(t.lipG) };
    }
    const ratio = p2 && day.kcal > 0 ? p2.kcal / day.kcal : 1;
    if (p2) {
      lines.push(`Personne 2 : ${fmt(p2.kcal)} kcal · protéines ${fmt(p2.prot)} g · glucides ${fmt(p2.gluc)} g · lipides ${fmt(p2.lip)} g`);
      dayJson.personne2 = { kcal: Math.round(p2.kcal), proteines: Math.round(p2.prot), glucides: Math.round(p2.gluc), lipides: Math.round(p2.lip), coefficient_assiette: Math.round(ratio * 100) / 100 };
    }
    for (const s of slots) {
      const r = s.recipeId ? recipes.get(s.recipeId) : undefined;
      const label = s.kind === 'encas' ? `En-cas ${s.index + 1}` : KIND_LABEL[s.kind];
      if (!r) { lines.push(`- ${label} : (aucune recette)`); continue; }
      const ls = slotLines(r, s);
      for (const l of ls) {
        planned.push({ code: l.code, name: l.nom, grams: l.g, rayon: l.rayon });
        if (p2) planned.push({ code: l.code, name: l.nom, grams: l.g * ratio, rayon: l.rayon });
      }
      if (p2 && r.allergenes.some((a) => p2.allergens.includes(a))) conflicts.push(`${DAYS_LONG[di]} · ${label} : ${r.nom}`);
      if (opts.meals) {
        const portion = s.pieces ? `${s.pieces} ${r.piece ?? 'pièce'}${s.pieces > 1 ? 's' : ''}` : '1 portion';
        lines.push(`- ${label} : ${r.nom} (${portion}, ${fmt(s.kcal)} kcal · P ${fmt(s.prot)} g · G ${fmt(s.gluc)} g · L ${fmt(s.lip)} g)`);
        if (r.allergenes.length) lines.push(`  Allergènes : ${r.allergenes.map((a) => ALLERGEN_LABELS[a].label).join(', ')}`);
        lines.push(`  Ingrédients (moi) : ${ls.map((l) => `${l.nom} ${l.g} g`).join(', ')}`);
        if (p2) lines.push(`  Ingrédients (personne 2, à ajuster) : ${ls.map((l) => `${l.nom} ${Math.round((l.g * ratio) / ARRONDI_GRAMMES) * ARRONDI_GRAMMES} g`).join(', ')}`);
        for (const [k, e] of (r.etapes ?? []).entries()) lines.push(`  ${k + 1}. ${e}`);
        (dayJson.repas as unknown[]).push({ creneau: label, recette: r.nom, portions: s.pieces || 1, kcal: Math.round(s.kcal), allergenes: r.allergenes, ingredients: ls.map((l) => ({ nom: l.nom, grammes: l.g })), etapes: r.etapes ?? [] });
      }
    }
    lines.push('');
    (json.jours as unknown[]).push(dayJson);
  }

  if (opts.shopping) {
    const list = buildShoppingList(planned, units);
    lines.push('=== LISTE DE COURSES ===');
    const jsonShop: unknown[] = [];
    for (const ray of RAYON_ORDER) {
      const items = list.filter((i) => i.rayon === ray && !i.pantry);
      if (!items.length) continue;
      lines.push(RAYON_LABELS[ray]);
      for (const i of items) {
        lines.push(`- ${i.name} : ${i.units ? `${i.units.count} × ${i.units.label}` : `${i.buyGrams} g`}`);
        jsonShop.push({ rayon: ray, nom: i.name, quantite: i.units ? `${i.units.count} × ${i.units.label}` : `${i.buyGrams} g` });
      }
    }
    lines.push('');
    json.courses = jsonShop;
  }

  if (conflicts.length) lines.push('ATTENTION : ces repas contiennent un allergène de la personne 2, à remplacer :', ...conflicts.map((c) => `- ${c}`), '');
  if (opts.aiTemplate) {
    lines.push(
      '=== MODÈLE DE DEMANDE POUR UNE IA ===',
      p2
        ? 'Adapte les quantités de chaque assiette à ces deux personnes (cibles ci-dessus), mélange ou fusionne les repas pour respecter les deux objectifs, recalcule les macros et la liste de courses.'
        : 'Reprends ces repas et recalcule les macros et la liste de courses si je change une quantité.',
      'Ne retire jamais un allergène à exclure, ne remplace aucun ingrédient sans le signaler, et signale tout doute. Je vérifierai moi-même les allergènes : tu ne remplaces ni l’étiquette ni un professionnel de santé.',
      '',
    );
  }
  lines.push('Vérifie toujours les allergènes sur les étiquettes. Ce n’est pas un avis médical.');
  return { text: lines.join('\n'), json, conflicts };
}
