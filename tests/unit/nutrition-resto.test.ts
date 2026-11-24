// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { spawnSync } from 'node:child_process';
// @ts-ignore -- idem
import fs from 'node:fs';
// @ts-ignore -- idem
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { list } from '../../src/data/repo';
import { OUT_KCAL_MAX } from '../../src/nutrition/config';
import type { FoodInfo } from '../../src/nutrition/catalog';
import type { DaySession } from '../../src/nutrition/day-targets';
import { finalNeeds } from '../../src/nutrition/final-needs';
import { dayStats, mealDayStates } from '../../src/nutrition/meals-calendar';
import type { Recipe } from '../../src/nutrition/plan';
import { buildShoppingList } from '../../src/nutrition/shopping';
import { confirmMealPlan, getNutritionProfile, saveEditedPlan, saveGeneratedPlan, saveNutritionProfile, setChecked, undoLastChange, getShoppingState, getMealPlan } from '../../src/nutrition/store';
import { assembleWeek, cleanOutKcal, restoKcal, setSlotOut, usableFixed, type EditCtx, type Prefs } from '../../src/nutrition/week-edit';
import { DEFAULT_MEAL_CONFIG, generateWeekPlan, sanitizeMealConfig, sanitizeOut, slotKeyOf, type WeekPlanResult } from '../../src/nutrition/week-plan';

// @ts-ignore
const ROOT: string = (globalThis as any).process.cwd();
let recipes: Recipe[] = [];
let info = new Map<string, FoodInfo>();
beforeAll(() => {
  const r = spawnSync('node', ['tools/build-recettes.mjs'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`build-recettes a échoué : ${r.stderr}`);
  recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/recettes.json'), 'utf8')).recettes as Recipe[];
  const ali = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/aliments.json'), 'utf8')).aliments as Record<string, unknown>[];
  info = new Map(ali.map((a) => [String(a.code), {
    code: String(a.code), nom: String(a.nom), kcal: Number(a.kcal), prot: Number(a.prot), gluc: Number(a.gluc), lip: Number(a.lip), perissable: !!a.perissable, gardeManger: !!a.gardeManger,
    unite: null, conditionnementG: null, famille: String(a.famille), rayon: a.rayon as FoodInfo['rayon'], allergenes: a.allergenes as FoodInfo['allergenes'],
    statutAllergenes: a.statutAllergenes as FoodInfo['statutAllergenes'], regimesIncompatibles: a.regimesIncompatibles as string[],
  }]));
}, 60_000);

const clean = { grossesse: 'non', allaitement: 'non', postPartum: 'non', maladie: 'non', rapportAlimentation: 'non', medicament: 'non' } as const;
const L: DaySession[] = [{ kind: 'muscu', sessionType: 'LEGS', minutes: 80 }];
const H: DaySession[] = [{ kind: 'muscu', sessionType: 'HAUT', minutes: 50 }];
const fin = () => {
  const f = finalNeeds({ answers: { ...clean }, body: { sex: 'homme', kg: 75, cm: 178, age: 30 }, sessionsPerWeek: 3, goal: 'maintien', pace: 'standard', adjust: 0, gel: false, days: [L, [], H, [], L, [], []] });
  if (f.status !== 'ok' || !f.week) throw new Error('cible impossible');
  return f;
};
const prefs: Prefs = { goal: 'maintien', allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: ['four', 'micro-ondes', 'plaques'], optimizeShopping: true };
const ctx = (cfg = { ...DEFAULT_MEAL_CONFIG }): EditCtx => ({ recipes, foods: info, info, prefs, days: fin().week!, cfg, floorKcal: fin().needs.floor });
const gen = (cfg = { ...DEFAULT_MEAL_CONFIG }, fixed?: Map<string, never>) => generateWeekPlan(fin().week!, recipes, info, prefs as never, cfg, 7, [], fin().needs.floor, fixed);
const WS = '2026-11-23';
const find = (p: WeekPlanResult, day: number, kind: string) => p.slots.find((s) => s.day === day && s.kind === kind)!;
const dayKcal = (p: WeekPlanResult, day: number) => p.slots.filter((s) => s.day === day).reduce((t, s) => t + s.kcal, 0);

describe('repas pris ailleurs, pour ce jour seulement', () => {
  it('un repas au restaurant sort du plan et des courses, le jour est rééquilibré et reste dans la cible', () => {
    const plan = gen();
    const c = ctx();
    const dinner = find(plan, 2, 'diner');
    const r = recipes.find((x) => x.id === dinner.recipeId)!;
    const next = setSlotOut(plan, slotKeyOf(dinner), { mode: 'resto', level: 'normal', kcal: restoKcal('diner', 'normal') }, c);
    const after = find(next, 2, 'diner');
    expect(after.out?.kcal).toBe(900);
    expect(after.kcal).toBe(900);
    expect(after.recipeId).toBe(dinner.recipeId); // la recette est gardée pour pouvoir revenir
    // les ingrédients du repas disparaissent des courses (sauf s'ils servent ailleurs)
    const elsewhere = new Set(next.slots.filter((s) => s !== after && s.recipeId && !s.out).flatMap((s) => recipes.find((x) => x.id === s.recipeId)!.ingredients.map((i) => i.code)));
    for (const i of r.ingredients) if (!elsewhere.has(i.code) && !r.lot) expect(next.ingredients.some((x) => x.code === i.code)).toBe(false);
    expect(next.ingredients.length).toBeLessThan(plan.ingredients.length);
    // les autres repas du jour ont absorbé la différence : jour proche de la cible, jamais sous le plancher
    expect(next.days[2].belowFloor).toBe(false);
    const target = c.days[2].kcal;
    expect(Math.abs(dayKcal(next, 2) - target) / target).toBeLessThan(0.08);
    // les autres jours ne bougent pas
    for (const d of [0, 1, 3, 4, 5, 6]) expect(dayKcal(next, d)).toBeCloseTo(dayKcal(plan, d), 6);
    // portions réalistes : jamais au-delà de x1,3 ni sous x0,5
    for (const s of next.slots.filter((x) => x.day === 2 && !x.out && x.scale)) { expect(s.scale).toBeLessThanOrEqual(1.3 + 1e-9); expect(s.scale).toBeGreaterThanOrEqual(0.5 - 1e-9); }
  });

  it('remettre à la maison rend exactement le plan d’origine (portions comprises)', () => {
    const plan = gen();
    const c = ctx();
    const key = slotKeyOf(find(plan, 4, 'dejeuner'));
    const out = setSlotOut(plan, key, { mode: 'saute', kcal: 0 }, c);
    expect(find(out, 4, 'dejeuner').kcal).toBe(0);
    const back = setSlotOut(out, key, null, c);
    expect(find(back, 4, 'dejeuner').out).toBeUndefined();
    back.slots.forEach((s, i) => { expect(s.kcal).toBeCloseTo(plan.slots[i].kcal, 6); expect(s.scale).toBeCloseTo(plan.slots[i].scale, 9); expect(s.baseScale).toBeUndefined(); });
    expect(back.ingredients.length).toBe(plan.ingredients.length);
  });

  it('sauter tous les repas d’un jour passe sous le plancher : signalé, jamais caché ; un resto copieux montre l’écart', () => {
    const plan = gen();
    const c = ctx();
    let p = plan;
    for (const s of plan.slots.filter((x) => x.day === 1)) p = setSlotOut(p, slotKeyOf(s), { mode: 'saute', kcal: 0 }, c);
    expect(p.days[1].belowFloor).toBe(true);
    expect(p.days[1].status).toBe('sous_plancher');
    const big = setSlotOut(plan, slotKeyOf(find(plan, 0, 'dejeuner')), { mode: 'resto', level: 'copieux', kcal: restoKcal('dejeuner', 'copieux') }, c);
    expect(big.days[0].kcal).toBeGreaterThan(0);
    const t = c.days[0].kcal;
    // soit le jour tient la cible, soit l'écart est signalé (statut) : jamais « ok » en dehors de la tolérance
    if (Math.abs(big.days[0].kcal - t) / t > 0.05) expect(big.days[0].status).not.toBe('ok');
  });

  it('les coches de courses sont conservées quand un repas passe au restaurant', async () => {
    await ensureLocalUser();
    const f = fin();
    const plan = gen();
    await saveGeneratedPlan(WS, plan.version, f.week as unknown[], plan as unknown as Record<string, unknown>, 7, { floor: f.needs.floor }, []);
    await confirmMealPlan(WS);
    const items = buildShoppingList(plan.ingredients).filter((i) => !i.pantry);
    await setChecked(WS, items[0].code, true);
    const next = setSlotOut(plan, slotKeyOf(find(plan, 3, 'diner')), { mode: 'resto', kcal: 800 }, ctx());
    await saveEditedPlan(WS, next as unknown as Record<string, unknown>, []);
    expect((await getShoppingState(WS))?.checked).toEqual([items[0].code]);
    // annulable
    expect(await undoLastChange(WS)).toBe(true);
    const back = (await getMealPlan(WS))!.result as unknown as WeekPlanResult;
    expect(find(back, 3, 'diner').out).toBeUndefined();
  });

  it('énergie saisie bornée ; repères par type de repas', () => {
    expect(cleanOutKcal(-1)).toBeNull();
    expect(cleanOutKcal(OUT_KCAL_MAX + 1)).toBeNull();
    expect(cleanOutKcal(Number.NaN)).toBeNull();
    expect(cleanOutKcal(850.4)).toBe(850);
    expect(restoKcal('diner', 'leger')).toBeLessThan(restoKcal('diner', 'copieux'));
    expect(restoKcal('petit-dej', 'normal')).toBeLessThan(restoKcal('dejeuner', 'normal'));
  });

  it('un repas ailleurs verrouillé survit à la régénération ; états du jour pour le calendrier ; compté comme mangé', () => {
    const plan = gen();
    const c = ctx();
    const key = slotKeyOf(find(plan, 5, 'diner'));
    const out = setSlotOut(plan, key, { mode: 'resto', level: 'leger', kcal: 600 }, c);
    const fixed = usableFixed(out, [key], c);
    expect(fixed.get(key)?.out?.kcal).toBe(600);
    const again = generateWeekPlan(c.days, recipes, info, prefs as never, { ...DEFAULT_MEAL_CONFIG }, 99, [], c.floorKcal, fixed as never);
    expect(find(again, 5, 'diner').out?.mode).toBe('resto');
    expect(find(again, 5, 'diner').kcal).toBe(600);
    const row = { id: 'x', status: 'valide', weekStart: WS, slots: [], result: out } as never;
    const states = mealDayStates([row]);
    expect(states.get('2026-11-28')).toBe('resto');
    expect(states.get('2026-11-24')).toBe('valide');
    expect(states.get('2026-12-10')).toBeUndefined();
    const st = dayStats(out.slots.filter((s) => s.day === 5), [], '2026-11-28');
    expect(st.done).toBe(1);
    expect(st.eatenKcal).toBe(600);
  });
});

describe('quels repas je prends ? (tableau du générateur)', () => {
  it('seuls les repas cochés sont générés ; le repas principal restant porte la cible dans la plage permise', () => {
    const cfg = sanitizeMealConfig({ ...DEFAULT_MEAL_CONFIG, lunch: [true, false, true, true, true, true, true], dinner: [true, true, true, true, true, false, true], petitDej: [false, false, false, false, false, true, true] });
    const p = gen(cfg);
    expect(p.slots.some((s) => s.day === 1 && s.kind === 'dejeuner')).toBe(false);
    expect(p.slots.some((s) => s.day === 5 && s.kind === 'diner')).toBe(false);
    expect(p.slots.some((s) => s.day === 0 && s.kind === 'petit-dej')).toBe(false);
    expect(p.slots.some((s) => s.day === 6 && s.kind === 'petit-dej')).toBe(true);
    const lone = find(p, 1, 'diner');
    expect(lone.scale).toBeLessThanOrEqual(1.75 + 1e-9);
    expect(p.days.every((d) => !d.belowFloor)).toBe(true);
    // un seul repas ce jour-là : plus grand qu'un dîner ordinaire
    expect(lone.kcal).toBeGreaterThan(find(p, 0, 'diner').kcal);
  });

  it('le choix est mémorisé avec le profil pour la semaine suivante (et un ancien profil garde tout coché)', async () => {
    await ensureLocalUser();
    const cfg = sanitizeMealConfig({ ...DEFAULT_MEAL_CONFIG, dinner: [true, true, true, true, true, false, true] });
    await saveNutritionProfile({ mealConfig: cfg as unknown as Record<string, unknown> });
    const back = sanitizeMealConfig((await getNutritionProfile())!.mealConfig as never);
    expect(back.dinner[5]).toBe(false);
    expect(back.lunch.every(Boolean)).toBe(true);
    const old = sanitizeMealConfig({ petitDej: Array(7).fill(true), gouter: Array(7).fill(false), encas: Array(7).fill(0) } as never);
    expect(old.lunch.every(Boolean)).toBe(true);
    expect(old.dinner.every(Boolean)).toBe(true);
    expect(await list('nutritionProfiles')).toHaveLength(1);
  });
});

describe('plan enregistré ou importé avec un repas ailleurs abîmé', () => {
  it('énergie absente, négative, énorme ou mode inconnu : jamais de NaN ni de total trompeur ; le plancher reste signalé', () => {
    const plan = gen();
    const c = ctx();
    const abimes: unknown[] = [{}, { mode: 'resto', kcal: -1e9 }, { mode: 'resto', kcal: 1e9 }, { mode: 'resto', kcal: 'beaucoup' }, { mode: 'inconnu', kcal: 500 }];
    for (const out of abimes) {
      const slots = plan.slots.map((s) => (s.day === 1 && s.kind === 'diner' ? { ...s, out: out as never } : s));
      const re = assembleWeek(slots, c, plan.version);
      for (const d of re.days) { expect(Number.isFinite(d.kcal)).toBe(true); expect(d.kcal).toBeGreaterThanOrEqual(0); }
      const s = re.slots.find((x) => x.day === 1 && x.kind === 'diner')!;
      expect(Number.isFinite(s.kcal)).toBe(true);
      expect(s.kcal).toBeLessThanOrEqual(OUT_KCAL_MAX);
      expect(sanitizeOut(out) === null || sanitizeOut(out)!.kcal <= OUT_KCAL_MAX).toBe(true);
    }
    // un jour vidé par des repas sautés est signalé sous le plancher, jamais « ok »
    let p = plan;
    for (const s of plan.slots.filter((x) => x.day === 3)) p = assembleWeek(p.slots.map((x) => (x === s || (x.day === 3 && x.kind === s.kind && x.index === s.index) ? { ...x, out: { mode: 'saute', kcal: -5 } as never } : x)), c, plan.version);
    expect(p.days[3].belowFloor).toBe(true);
  });
});
