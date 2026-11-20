// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { spawnSync } from 'node:child_process';
// @ts-ignore -- idem
import fs from 'node:fs';
// @ts-ignore -- idem
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import type { DaySession } from '../../src/nutrition/day-targets';
import { buildExport, checkPerson2, type ExportOptions } from '../../src/nutrition/export-plan';
import { finalNeeds } from '../../src/nutrition/final-needs';
import type { FoodMacros, Recipe } from '../../src/nutrition/plan';
import { DEFAULT_MEAL_CONFIG, generateWeekPlan } from '../../src/nutrition/week-plan';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ROOT: string = (globalThis as any).process.cwd();
let recipes: Recipe[] = [];
let foods = new Map<string, FoodMacros>();
let units: Record<string, { label: string; grams: number }> = {};
beforeAll(() => {
  const r = spawnSync('node', ['tools/build-recettes.mjs'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`build-recettes a échoué : ${r.stderr}`);
  recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/recettes.json'), 'utf8')).recettes as Recipe[];
  const ali = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/aliments.json'), 'utf8')).aliments as Record<string, unknown>[];
  foods = new Map(ali.map((a) => [String(a.code), { code: String(a.code), kcal: Number(a.kcal), prot: Number(a.prot), gluc: Number(a.gluc), lip: Number(a.lip), perissable: !!a.perissable, gardeManger: !!a.gardeManger }]));
  units = {};
  for (const a of ali) { const u = a.unite as { label: string; grammes: number } | null; if (u) units[String(a.code)] = { label: u.label, grams: u.grammes }; }
}, 60_000);

const clean = { grossesse: 'non', allaitement: 'non', postPartum: 'non', maladie: 'non', rapportAlimentation: 'non', medicament: 'non' } as const;
const sem: DaySession[][] = [[{ kind: 'muscu', sessionType: 'LEGS', minutes: 60 }], [], [{ kind: 'muscu', sessionType: 'HAUT', minutes: 50 }], [], [], [], []];
const opts = (o: Partial<ExportOptions> = {}): ExportOptions => ({ days: Array(7).fill(true), shopping: true, meals: true, targets: true, exclusions: true, person2: null, aiTemplate: false, ...o });

function setup() {
  const f = finalNeeds({ answers: { ...clean }, body: { sex: 'homme', kg: 83.7, cm: 181, age: 31 }, sessionsPerWeek: 3, goal: 'perte', pace: 'standard', adjust: 0, gel: false, days: sem });
  if (f.status !== 'ok' || !f.week) throw new Error('besoins refusés');
  const plan = generateWeekPlan(f.week, recipes, foods, { goal: 'perte', allergens: ['arachides'], allergenFree: [], diet: ['sans_porc'], dislikedFoods: [], maxCookMin: null, appliances: ['four', 'micro-ondes', 'plaques'], optimizeShopping: true }, DEFAULT_MEAL_CONFIG, 4, [], f.needs.floor);
  return { f, plan, map: new Map(recipes.map((r) => [r.id, r])) };
}

describe('export N15', () => {
  it('ne contient ni poids, ni IMC, ni objectif, ni déficit, ni dépistage', () => {
    const { f, plan, map } = setup();
    const r = buildExport(plan, map, units, opts(), f.week, { allergens: ['arachides'], diet: ['sans_porc'], severeAllergy: false });
    const all = r.text + JSON.stringify(r.json);
    for (const bad of ['83,7', '83.7', 'taille', 'IMC', 'perte', 'prise de', 'déficit', 'dépistage', 'grossesse', 'objectif', 'strict']) expect(all.toLowerCase(), bad).not.toContain(bad.toLowerCase());
    expect(r.text).toContain('LISTE DE COURSES');
    expect(r.text).toContain('allergène Arachides');
  });

  it('jours choisis : seuls ces jours et leurs courses sont exportés', () => {
    const { f, plan, map } = setup();
    const days = [true, false, false, false, false, false, false];
    const r = buildExport(plan, map, units, opts({ days }), f.week, { allergens: [], diet: [], severeAllergy: false });
    expect(r.text).toContain('LUNDI');
    expect(r.text).not.toContain('MARDI');
    const full = buildExport(plan, map, units, opts(), f.week, { allergens: [], diet: [], severeAllergy: false });
    expect(r.text.length).toBeLessThan(full.text.length);
  });

  it('modèle IA : absent sauf demande, ne retire jamais un allergène', () => {
    const { f, plan, map } = setup();
    const sans = buildExport(plan, map, units, opts(), f.week, { allergens: [], diet: [], severeAllergy: false });
    expect(sans.text).not.toContain('MODÈLE DE DEMANDE');
    const avec = buildExport(plan, map, units, opts({ aiTemplate: true }), f.week, { allergens: [], diet: [], severeAllergy: false });
    expect(avec.text).toContain('Ne retire jamais un allergène');
  });

  it('personne 2 : sous 1 200 kcal refusé, alerte sous 1 500, macros incohérentes refusées', () => {
    expect(checkPerson2({ kcal: 1100, prot: 80, gluc: 120, lip: 40, allergens: [] }).ok).toBe(false);
    const bas = checkPerson2({ kcal: 1400, prot: 80, gluc: 150, lip: 55, allergens: [] });
    expect(bas.ok).toBe(true);
    expect(bas.warnings.length).toBe(1);
    expect(checkPerson2({ kcal: 2000, prot: 10, gluc: 10, lip: 10, allergens: [] }).ok).toBe(false);
    expect(checkPerson2({ kcal: NaN, prot: 80, gluc: 150, lip: 55, allergens: [] }).ok).toBe(false);
    expect(checkPerson2({ kcal: 2000, prot: 100, gluc: 250, lip: 70, allergens: [] }).ok).toBe(true);
  });

  it('personne 2 : refusée = pas d’export de ses cibles ; valide = coefficient et conflits d’allergènes signalés', () => {
    const { f, plan, map } = setup();
    const refus = buildExport(plan, map, units, opts({ person2: { kcal: 900, prot: 60, gluc: 100, lip: 30, allergens: [] } }), f.week, { allergens: [], diet: [], severeAllergy: false });
    expect(refus.text).not.toContain('Personne 2');
    const ok = buildExport(plan, map, units, opts({ person2: { kcal: 2000, prot: 100, gluc: 250, lip: 70, allergens: ['lait', 'gluten'] } }), f.week, { allergens: [], diet: [], severeAllergy: false });
    expect(ok.text).toContain('Personne 2');
    expect(ok.conflicts.length).toBeGreaterThan(0);
    expect(ok.text).toContain('ATTENTION');
  });
});
