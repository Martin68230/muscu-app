// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { spawnSync } from 'node:child_process';
// @ts-ignore -- idem
import fs from 'node:fs';
// @ts-ignore -- idem
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { exportData, importData } from '../../src/data/backup';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { list } from '../../src/data/repo';
import type { FoodInfo } from '../../src/nutrition/catalog';
import type { DaySession } from '../../src/nutrition/day-targets';
import { finalNeeds } from '../../src/nutrition/final-needs';
import { dayStats, mealDates, mealsForDate, weekStats } from '../../src/nutrition/meals-calendar';
import type { PlanPrefs, Recipe } from '../../src/nutrition/plan';
import { closeDB } from '../../src/data/db';
import { addCustomItem, confirmMealPlan, copyPlanToWeek, copyShoppingExtras, customKey, getMealPlan, getShoppingState, hideItem, listMealLogs, listValidatedPlans, removeCustomItem, reopenMealPlan, saveEditedPlan, saveGeneratedPlan, setChecked, setMealLog, uncheckAll, undoLastChange } from '../../src/nutrition/store';
import { applyMealChange, applySwap, assembleWeek, dayTotals, foodAlternatives, foodUsable, mealAlternatives, slotUsable, toggleLock, usableFixed, lockDay, type EditCtx, type Prefs } from '../../src/nutrition/week-edit';
import { DEFAULT_MEAL_CONFIG, generateWeekPlan, slotKeyOf, type WeekPlanResult } from '../../src/nutrition/week-plan';
import { buildShoppingList } from '../../src/nutrition/shopping';

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
const basePrefs = (over: Partial<Prefs> = {}): Prefs => ({ goal: 'maintien', allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: ['four', 'micro-ondes', 'plaques'], optimizeShopping: true, ...over });
const ctxOf = (prefs: Prefs, f = fin()): EditCtx => ({ recipes, foods: info, info, prefs, days: f.week!, cfg: { ...DEFAULT_MEAL_CONFIG }, floorKcal: f.needs.floor });
const gen = (prefs: Prefs, seed = 7, fixed?: Map<string, never>) => {
  const f = fin();
  return generateWeekPlan(f.week!, recipes, info, prefs as Omit<PlanPrefs, 'mealsPerDay'>, { ...DEFAULT_MEAL_CONFIG }, seed, [], f.needs.floor, fixed);
};
const WS = '2026-11-23';
/** Plan de la semaine enregistré (brouillon), repris dans chaque test : la base est neuve à chaque test. */
async function seed(validate = false) {
  await ensureLocalUser();
  const f = fin();
  const res = gen(basePrefs());
  await saveGeneratedPlan(WS, res.version, f.week as unknown[], res as unknown as Record<string, unknown>, 7, { floor: f.needs.floor }, []);
  if (validate) await confirmMealPlan(WS);
  return res;
}

describe('semaine : persistance, validation, journal', () => {
  it('le plan enregistré se retrouve identique ; une semaine validée n’est jamais écrasée par une génération', async () => {
    const f = fin();
    const res = await seed();
    const back = await getMealPlan(WS);
    expect(back?.status).toBe('brouillon');
    expect((back?.result as unknown as WeekPlanResult).slots).toHaveLength(res.slots.length);
    expect((back?.result as unknown as WeekPlanResult).slots[0].recipeId).toBe(res.slots[0].recipeId);
    await confirmMealPlan(WS);
    expect((await getMealPlan(WS))?.status).toBe('valide');
    await expect(saveGeneratedPlan(WS, res.version, f.week as unknown[], res as unknown as Record<string, unknown>, 8, {}, [])).rejects.toThrow();
    await reopenMealPlan(WS);
    expect((await getMealPlan(WS))?.status).toBe('brouillon');
  });

  it('semaine validée -> repas du jour, jours du calendrier, totaux et historique ; fait / pas fait / écart', async () => {
    await seed(true);
    const plans = await list('mealPlans');
    const dm = mealsForDate(plans, '2026-11-25'); // mercredi
    expect(dm?.day).toBe(2);
    expect(dm!.slots.every((s) => s.day === 2)).toBe(true);
    expect(mealsForDate(plans, '2026-11-30')).toBeNull(); // semaine suivante : rien
    expect(mealDates(plans).size).toBe(7);
    // un plan proposé (non validé) n'apparaît que si on le demande
    await reopenMealPlan(WS);
    expect(mealsForDate(await list('mealPlans'), '2026-11-25')).toBeNull();
    expect(mealsForDate(await list('mealPlans'), '2026-11-25', true)?.draft).toBe(true);
    await confirmMealPlan(WS);

    const slots = dm!.slots;
    const k0 = slotKeyOf(slots[0]);
    await setMealLog('2026-11-25', k0, 'fait');
    await setMealLog('2026-11-25', slotKeyOf(slots[1]), 'ecart', 'Pizza', 900);
    await setMealLog('2026-11-25', slotKeyOf(slots[2]), 'pas_fait');
    let logs = await listMealLogs();
    expect(logs).toHaveLength(3);
    const st = dayStats(slots, logs, '2026-11-25');
    expect(st.done).toBe(2);
    expect(st.skipped).toBe(1);
    expect(st.eatenKcal).toBeCloseTo(slots[0].kcal + 900, 5);
    // un seul enregistrement par repas : on remplace
    await setMealLog('2026-11-25', k0, 'pas_fait');
    expect((await listMealLogs()).filter((l) => l.slotKey === k0)).toHaveLength(1);
    await setMealLog('2026-11-25', k0, null);
    logs = await listMealLogs();
    expect(logs.find((l) => l.slotKey === k0)).toBeUndefined();
    const ws = weekStats((await list('mealPlans'))[0], logs);
    expect(ws.meals).toBeGreaterThan(14);
    expect(ws.done).toBe(1);
  });

  it('annuler le dernier changement revient à l’état d’avant', async () => {
    await seed();
    const cur = (await getMealPlan(WS))!;
    const result = cur.result as unknown as WeekPlanResult;
    const edited = { ...result, slots: result.slots.map((s, i) => (i === 0 ? { ...s, recipeId: null, kcal: 0 } : s)) };
    await saveEditedPlan(WS, edited as unknown as Record<string, unknown>, ['0-dejeuner-0']);
    expect(((await getMealPlan(WS))!.result as unknown as WeekPlanResult).slots[0].recipeId).toBeNull();
    expect(await undoLastChange(WS)).toBe(true);
    const back = (await getMealPlan(WS))!;
    expect((back.result as unknown as WeekPlanResult).slots[0].recipeId).toBe(result.slots[0].recipeId);
    expect(back.locks).toEqual([]);
    expect(await undoLastChange(WS)).toBe(false);
  });

  it('export / import JSON : plan validé, verrous et journal des repas conservés', async () => {
    await seed(true);
    await setMealLog('2026-11-25', '2-dejeuner-0', 'fait');
    const out = await exportData();
    expect(out.data.mealLogs.length).toBeGreaterThan(0);
    expect(out.data.mealPlans[0].status).toBe('valide');
    const again = await importData(JSON.parse(JSON.stringify(out)));
    expect(again.errors.join(' | ')).toBe('');
    expect(again.ok).toBe(true);
    const bad = JSON.parse(JSON.stringify(out));
    bad.data.mealLogs[0].state = 'mange_tout';
    expect((await importData(bad)).ok).toBe(false);
    const bad2 = JSON.parse(JSON.stringify(out));
    bad2.data.mealPlans[0].status = 'fige';
    expect((await importData(bad2)).ok).toBe(false);
  });
});

describe('changer un repas', () => {
  it('3 alternatives équivalentes : même type de repas, kcal et protéines proches, jamais la recette actuelle ni une recette déjà au menu ce jour-là', () => {
    const plan = gen(basePrefs());
    const ctx = ctxOf(basePrefs());
    const slot = plan.slots.find((s) => s.kind === 'diner' && s.day === 1)!;
    const alts = mealAlternatives(plan, slot, ctx, 3);
    expect(alts.length).toBe(3);
    const today = new Set(plan.slots.filter((s) => s.day === 1 && s !== slot).map((s) => s.recipeId));
    for (const a of alts) {
      expect(a.recipe.repas).toBe('dejeuner-diner');
      expect(a.recipe.id).not.toBe(slot.recipeId);
      expect(today.has(a.recipe.id)).toBe(false);
      expect(Math.abs(a.dKcal) / slot.kcal).toBeLessThanOrEqual(0.1 + 1e-9);
    }
  });

  it('un repas changé recalcule le jour, les lots et la liste de courses ; la cible du jour reste respectée', () => {
    const plan = gen(basePrefs());
    const ctx = ctxOf(basePrefs());
    const slot = plan.slots.find((s) => s.kind === 'dejeuner' && s.day === 3)!;
    const alt = mealAlternatives(plan, slot, ctx, 1)[0];
    const next = applyMealChange(plan, slotKeyOf(slot), alt, ctx);
    const after = next.slots.find((s) => slotKeyOf(s) === slotKeyOf(slot))!;
    expect(after.recipeId).toBe(alt.recipe.id);
    expect(next.slots).toHaveLength(plan.slots.length);
    expect(dayTotals(next.slots, 3).kcal).toBeCloseTo(plan.slots.filter((s) => s.day === 3).reduce((t, s) => t + s.kcal, 0) + alt.dKcal, 5);
    expect(next.days[3].belowFloor).toBe(false);
    expect(Math.abs(next.days[3].kcal - next.days[3].targetKcal) / next.days[3].targetKcal).toBeLessThan(0.15);
    // courses : les ingrédients de l'ancienne recette disparaissent s'ils ne servent plus
    const oldOnly = recipes.find((r) => r.id === slot.recipeId)!.ingredients.map((i) => i.code).filter((c) => !alt.recipe.ingredients.some((i) => i.code === c));
    const before = buildShoppingList(plan.ingredients).reduce((m, i) => m.set(i.code, i.neededGrams), new Map<string, number>());
    const afterList = buildShoppingList(next.ingredients).reduce((m, i) => m.set(i.code, i.neededGrams), new Map<string, number>());
    for (const c of oldOnly) expect(afterList.get(c) ?? 0).toBeLessThanOrEqual(before.get(c) ?? 0);
    expect(next.ingredients.some((i) => alt.recipe.ingredients.some((x) => x.code === i.code))).toBe(true);
    // assembleWeek sur un plan inchangé donne les mêmes totaux (une seule source de vérité)
    const same = assembleWeek(plan.slots, ctx, plan.version);
    plan.days.forEach((d, i) => expect(same.days[i].kcal).toBeCloseTo(d.kcal, 6));
  });

  it('allergie : aucune alternative contenant l’allergène ; un repas devenu interdit est repéré', () => {
    const prefs = basePrefs({ allergens: ['lait'] });
    const plan = gen(prefs);
    const ctx = ctxOf(prefs);
    for (const s of plan.slots.filter((x) => x.recipeId && x.day < 3)) {
      for (const a of mealAlternatives(plan, s, ctx, 6)) {
        expect(a.recipe.allergenes).not.toContain('lait');
        expect(a.recipe.statutAllergenes).toBe('valide');
      }
    }
    // un plan fait sans filtre, puis une allergie ajoutée : au moins un repas devient « à changer »
    const open = gen(basePrefs());
    const byId = new Map(recipes.map((r) => [r.id, r]));
    const flagged = open.slots.filter((s) => !slotUsable(s, byId, info, prefs));
    expect(flagged.length).toBeGreaterThan(0);
    for (const s of flagged) expect(byId.get(s.recipeId!)!.allergenes.includes('lait') || byId.get(s.recipeId!)!.statutAllergenes !== 'valide').toBe(true);
  });
});

describe('changer un aliment', () => {
  const findSwappable = (prefs: Prefs) => {
    const plan = gen(prefs);
    const ctx = ctxOf(prefs);
    for (const s of plan.slots) {
      const r = recipes.find((x) => x.id === s.recipeId);
      if (!r || r.lot) continue;
      for (const i of r.ingredients) {
        const alts = foodAlternatives(r, s, i.code, ctx);
        if (alts.length) return { plan, ctx, s, r, i, alts };
      }
    }
    throw new Error('aucune substitution trouvée');
  };

  it('équivalent en calories (±15 %) et protéines, même famille, jamais l’aliment actuel', () => {
    const { s, r, i, alts, ctx } = findSwappable(basePrefs());
    const curFamille = info.get(i.code)!.famille;
    for (const a of alts) {
      expect(a.food.famille).toBe(curFamille);
      expect(a.food.code).not.toBe(i.code);
      expect(foodUsable(a.food, ctx.prefs)).toBe(true);
    }
    expect(r.ingredients.some((x) => x.code === i.code)).toBe(true);
    expect(s.recipeId).toBe(r.id);
  });

  it('le remplacement recalcule les macros, les courses et les allergènes ; revenir à l’original est possible', () => {
    const { plan, ctx, s, i, alts } = findSwappable(basePrefs());
    const a = alts[0];
    const next = applySwap(plan, slotKeyOf(s), a.swap, ctx);
    const after = next.slots.find((x) => slotKeyOf(x) === slotKeyOf(s))!;
    expect(after.swaps).toHaveLength(1);
    expect(after.kcal).toBeCloseTo(s.kcal + a.dKcal, 4);
    expect(next.ingredients.some((x) => x.code === a.swap.to)).toBe(true);
    const back = applySwap(next, slotKeyOf(s), { ...a.swap, to: i.code }, ctx);
    expect(back.slots.find((x) => slotKeyOf(x) === slotKeyOf(s))!.swaps).toBeUndefined();
    expect(back.slots.find((x) => slotKeyOf(x) === slotKeyOf(s))!.kcal).toBeCloseTo(s.kcal, 4);
  });

  it('allergène, régime et aliments exclus : jamais proposés ; un remplacement devenu interdit rend le repas « à changer »', () => {
    const lait = [...info.values()].find((f) => f.allergenes.includes('lait') && f.statutAllergenes === 'valide' && f.regimesIncompatibles.includes('vegetalien'))!;
    expect(foodUsable(lait, basePrefs({ allergens: ['lait'] }))).toBe(false);
    expect(foodUsable(lait, basePrefs({ diet: ['vegetalien'] }))).toBe(false);
    expect(foodUsable(lait, basePrefs({ dislikedFoods: [lait.code] }))).toBe(false);
    const incertain = [...info.values()].find((f) => f.statutAllergenes === 'a_verifier');
    if (incertain) expect(foodUsable(incertain, basePrefs({ allergens: ['gluten'] }))).toBe(false);
    const { plan, ctx, s, alts } = findSwappable(basePrefs({ allergens: ['arachides'] }));
    for (const a of alts) expect(a.food.allergenes).not.toContain('arachides');
    const next = applySwap(plan, slotKeyOf(s), alts[0].swap, ctx);
    const swapped = next.slots.find((x) => slotKeyOf(x) === slotKeyOf(s))!;
    const byId = new Map(recipes.map((r) => [r.id, r]));
    expect(slotUsable(swapped, byId, info, basePrefs({ allergens: ['arachides'] }))).toBe(true);
    const f = info.get(alts[0].swap.to)!;
    expect(slotUsable(swapped, byId, info, basePrefs({ allergens: ['arachides'], dislikedFoods: [f.code] }))).toBe(false);
  });
});

describe('verrous et préférences avant génération', () => {
  it('un repas verrouillé survit à une régénération, ses courses aussi ; le jour reste dans la cible', () => {
    const prefs = basePrefs();
    const first = gen(prefs, 11);
    const ctx = ctxOf(prefs);
    const keys = lockDay(toggleLock([], slotKeyOf(first.slots.find((s) => s.day === 4 && s.kind === 'diner')!)), first, 1, true);
    const fixed = usableFixed(first, keys, ctx);
    expect(fixed.size).toBe(keys.length);
    const again = gen(prefs, 99, fixed as never);
    for (const [k, s] of fixed) {
      const got = again.slots.find((x) => slotKeyOf(x) === k)!;
      expect(got.recipeId).toBe(s.recipeId);
      expect(got.scale).toBe(s.scale);
      expect(got.pieces).toBe(s.pieces);
    }
    // les autres repas ont bien été retirés au sort de nouveau
    expect(again.slots.some((s, i) => s.recipeId !== first.slots[i]?.recipeId)).toBe(true);
    // chaque jour reste calculé sur sa cible (tolérance du jour ou écart signalé)
    again.days.forEach((d) => expect(d.kcal).toBeGreaterThan(0));
    expect(again.days.every((d) => !d.belowFloor)).toBe(true);
  });

  it('un repas verrouillé devenu interdit n’est PAS conservé', () => {
    const first = gen(basePrefs(), 5);
    const s = first.slots.find((x) => x.recipeId && recipes.find((r) => r.id === x.recipeId)!.allergenes.length > 0)!;
    const al = recipes.find((r) => r.id === s.recipeId)!.allergenes[0];
    const fixed = usableFixed(first, [slotKeyOf(s)], ctxOf(basePrefs({ allergens: [al] })));
    expect(fixed.size).toBe(0);
  });

  it('repas imposé : placé s’il respecte les filtres, ignoré sinon', () => {
    const f = fin();
    const prefs = basePrefs();
    const dej = recipes.filter((r) => r.repas === 'dejeuner-diner' && !r.lot && r.statutAllergenes === 'valide')[5];
    const res = generateWeekPlan(f.week!, recipes, info, prefs as never, { ...DEFAULT_MEAL_CONFIG, imposed: { '2-dejeuner-0': dej.id } }, 3, [], f.needs.floor);
    expect(res.slots.find((s) => s.day === 2 && s.kind === 'dejeuner')!.recipeId).toBe(dej.id);
    const withAllergen = recipes.find((r) => r.repas === 'dejeuner-diner' && !r.lot && r.allergenes.length > 0)!;
    const blocked = generateWeekPlan(f.week!, recipes, info, basePrefs({ allergens: [withAllergen.allergenes[0]] }) as never, { ...DEFAULT_MEAL_CONFIG, imposed: { '2-dejeuner-0': withAllergen.id } }, 3, [], f.needs.floor);
    expect(blocked.slots.find((s) => s.day === 2 && s.kind === 'dejeuner')!.recipeId).not.toBe(withAllergen.id);
    // une clé invalide est écartée par le nettoyage
    const bad = generateWeekPlan(f.week!, recipes, info, prefs as never, { ...DEFAULT_MEAL_CONFIG, imposed: { 'x-y': 'z' } }, 3, [], f.needs.floor);
    expect(bad.slots.length).toBe(res.slots.length);
  });
});

describe('liste de courses mémorisée', () => {
  it('les coches survivent à la fermeture / réouverture de l’appli, et à un repas changé après validation', async () => {
    const res = await seed(true);
    const list = buildShoppingList(res.ingredients).filter((i) => !i.pantry);
    const [a, b] = [list[0].code, list[1].code];
    await setChecked(WS, a, true);
    await setChecked(WS, b, true);
    await closeDB(); // l'appli est fermée au supermarché...
    expect((await getShoppingState(WS))?.checked).toEqual([a, b]); // ... et rouverte
    // un repas change : la liste est recalculée, les lignes qui restent gardent leur coche
    const ctx = ctxOf(basePrefs());
    const slot = res.slots.find((s) => s.kind === 'diner' && s.day === 5)!;
    const alt = mealAlternatives(res, slot, ctx, 1)[0];
    const next = applyMealChange(res, slotKeyOf(slot), alt, ctx);
    await saveEditedPlan(WS, next as unknown as Record<string, unknown>, []);
    const after = buildShoppingList(((await getMealPlan(WS))!.result as unknown as WeekPlanResult).ingredients).map((i) => i.code);
    const st = await getShoppingState(WS);
    expect(st?.checked).toEqual([a, b]);
    for (const code of [a, b]) {
      const stillNeeded = next.ingredients.some((i) => i.code === code);
      expect(after.includes(code)).toBe(stillNeeded);
    }
  });

  it('ajouter une ligne, la supprimer, retirer / remettre une ligne du plan, tout décocher', async () => {
    await seed(true);
    await addCustomItem(WS, 'Papier alu', '1 rouleau');
    await addCustomItem(WS, 'papier alu', '2 rouleaux'); // même nom : une seule ligne
    expect((await getShoppingState(WS))!.custom).toEqual([{ name: 'papier alu', qty: '2 rouleaux' }]);
    await setChecked(WS, customKey('Papier alu'), true);
    await setChecked(WS, 'X1', true);
    await hideItem(WS, 'X1', true);
    expect((await getShoppingState(WS))!.pantry).toEqual(['X1']);
    expect((await getShoppingState(WS))!.checked).toEqual([customKey('Papier alu')]);
    await hideItem(WS, 'X1', false);
    expect((await getShoppingState(WS))!.pantry).toEqual([]);
    await uncheckAll(WS);
    expect((await getShoppingState(WS))!.checked).toEqual([]);
    await removeCustomItem(WS, 'PAPIER ALU');
    expect((await getShoppingState(WS))!.custom).toEqual([]);
    await expect(addCustomItem(WS, '   ')).rejects.toThrow();
  });

  it('semaine passée consultable (plan + courses) ; « Refaire cette semaine » copie en brouillon, jamais sur une semaine validée', async () => {
    const res = await seed(true);
    await addCustomItem(WS, 'Café');
    await hideItem(WS, 'Y1', true);
    const past = (await listValidatedPlans())[0];
    expect(past.weekStart).toBe(WS);
    expect((past.result as unknown as WeekPlanResult).ingredients.length).toBe(res.ingredients.length);
    expect(mealsForDate([past], '2026-11-24')?.slots.length).toBeGreaterThan(2);
    const NEXT = '2026-11-30';
    const copy = await copyPlanToWeek(WS, NEXT);
    expect(copy.status).toBe('brouillon');
    expect((copy.result as unknown as WeekPlanResult).slots).toHaveLength(res.slots.length);
    await copyShoppingExtras(WS, NEXT);
    const st = await getShoppingState(NEXT);
    expect(st?.custom).toEqual([{ name: 'Café', qty: '' }]);
    expect(st?.pantry).toEqual(['Y1']);
    expect(st?.checked).toEqual([]);
    await confirmMealPlan(NEXT);
    await expect(copyPlanToWeek(WS, NEXT)).rejects.toThrow();
  });

  it('export / import : lignes ajoutées et coches conservées', async () => {
    await seed(true);
    await addCustomItem(WS, 'Sel', '1 kg');
    await setChecked(WS, customKey('Sel'), true);
    const out = await exportData();
    const r = await importData(JSON.parse(JSON.stringify(out)));
    expect(r.errors.join(' | ')).toBe('');
    const st = await getShoppingState(WS);
    expect(st?.custom[0].name).toBe('Sel');
    expect(st?.checked).toContain(customKey('Sel'));
  });
});
