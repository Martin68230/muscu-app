// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { spawnSync } from 'node:child_process';
// @ts-ignore -- idem
import fs from 'node:fs';
// @ts-ignore -- idem
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { ENCAS_AUTO_MAX_KCAL, SEUIL_ECART_KCAL } from '../../src/nutrition/config';
import type { DaySession } from '../../src/nutrition/day-targets';
import { finalNeeds } from '../../src/nutrition/final-needs';
import type { FoodMacros, PlanPrefs, Recipe } from '../../src/nutrition/plan';
import { DEFAULT_MEAL_CONFIG, generateWeekPlan, type WeekPlanResult } from '../../src/nutrition/week-plan';

// Balayage d'écart entre la cible finale (final-needs.ts) et le plan de la semaine, sur les VRAIES recettes et aliments
// (demande du 14/11/2026 : « c'est quasiment tout le temps sous la cible de calories »).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ROOT: string = (globalThis as any).process.cwd();
let recipes: Recipe[] = [];
let foods = new Map<string, FoodMacros>();
beforeAll(() => {
  const r = spawnSync('node', ['tools/build-recettes.mjs'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`build-recettes a échoué : ${r.stderr}`);
  recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/recettes.json'), 'utf8')).recettes as Recipe[];
  const ali = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/aliments.json'), 'utf8')).aliments as Record<string, unknown>[];
  foods = new Map(ali.map((a) => [String(a.code), { code: String(a.code), kcal: Number(a.kcal), prot: Number(a.prot), gluc: Number(a.gluc), lip: Number(a.lip), perissable: !!a.perissable, gardeManger: !!a.gardeManger }]));
}, 60_000);

const clean = { grossesse: 'non', allaitement: 'non', postPartum: 'non', maladie: 'non', rapportAlimentation: 'non', medicament: 'non' } as const;
const L: DaySession[] = [{ kind: 'muscu', sessionType: 'LEGS', minutes: 80 }];
const H: DaySession[] = [{ kind: 'muscu', sessionType: 'HAUT', minutes: 50 }];
const PROGRAMMES: Record<string, DaySession[][]> = { repos: [[], [], [], [], [], [], []], mixte: [L, [], H, [], L, [], []], legere: [H, H, H, H, H, H, []] };
const prefs = (goal: PlanPrefs['goal']): Omit<PlanPrefs, 'mealsPerDay'> => ({ goal, allergens: [], allergenFree: [], diet: [], dislikedFoods: [], maxCookMin: null, appliances: ['four', 'micro-ondes', 'plaques'], optimizeShopping: true });

interface Mesure { profil: string; cible: number; dK: number; dP: number; dG: number; dL: number; manque: number; joursManque: number; plans: WeekPlanResult[]; floor: number }
function balayage(completerAuto: boolean): Mesure[] {
  const out: Mesure[] = [];
  for (const kg of [55, 65, 75, 85, 95]) for (const goal of ['prise', 'maintien', 'perte'] as const) for (const sex of ['homme', 'femme'] as const) for (const pk of Object.keys(PROGRAMMES)) {
    const f = finalNeeds({ answers: { ...clean }, body: { sex, kg, cm: Math.round((sex === 'homme' ? 150 : 140) + kg * 0.45), age: 30 }, sessionsPerWeek: pk === 'repos' ? 0 : 3, goal, pace: 'standard', adjust: 0, gel: false, days: PROGRAMMES[pk] });
    if (f.status !== 'ok' || !f.week) continue;
    let dK = 0, dP = 0, dG = 0, dL = 0, manque = 0, jm = 0, n = 0;
    const plans: WeekPlanResult[] = [];
    for (let seed = 1; seed <= 3; seed++) {
      const p = generateWeekPlan(f.week, recipes, foods, prefs(goal), { ...DEFAULT_MEAL_CONFIG, completerAuto }, seed, [], f.needs.floor);
      plans.push(p);
      p.days.forEach((d, i) => {
        const s = p.slots.filter((x) => x.day === i);
        const t = f.week![i];
        dK += d.kcal - t.kcal; dP += s.reduce((a, x) => a + x.prot, 0) - t.protG; dG += s.reduce((a, x) => a + x.gluc, 0) - t.glucG; dL += s.reduce((a, x) => a + x.lip, 0) - t.lipG;
        manque += d.missingKcal ?? 0; if ((d.missingKcal ?? 0) > 0) jm++;
        n++;
      });
    }
    out.push({ profil: `${kg} kg ${goal} ${sex} ${pk}`, cible: f.kcal, dK: dK / n, dP: dP / n, dG: dG / n, dL: dL / n, manque: manque / n, joursManque: jm / n, plans, floor: f.needs.floor });
  }
  return out;
}
const moy = (a: Mesure[], k: 'dK' | 'dP' | 'dG' | 'dL') => a.reduce((s, m) => s + m[k], 0) / a.length;

describe('écart cible / plan : balayage de profils (55 à 95 kg, 3 objectifs, 2 sexes, 3 types de semaine)', () => {
  it('sans complément, le plan est en moyenne sous la cible ; avec, l’écart tombe sous le seuil', () => {
    const sans = balayage(false);
    const avec = balayage(true);
    const ligne = (n: string, a: Mesure[]) => `${n} : kcal ${moy(a, 'dK').toFixed(0)}, prot ${moy(a, 'dP').toFixed(0)} g, gluc ${moy(a, 'dG').toFixed(0)} g, lip ${moy(a, 'dL').toFixed(0)} g (${a.length} profils)`;
    // eslint-disable-next-line no-console
    console.log(`${ligne('SANS complément', sans)}\n${ligne('AVEC complément', avec)}`);
    expect(moy(sans, 'dK')).toBeLessThan(-SEUIL_ECART_KCAL);
    expect(moy(avec, 'dK')).toBeGreaterThan(-SEUIL_ECART_KCAL / 2);
    expect(moy(avec, 'dK')).toBeLessThan(1);
    // Aucun profil ne reste en moyenne au-delà du seuil.
    for (const m of avec) expect(m.dK, m.profil).toBeGreaterThan(-SEUIL_ECART_KCAL);
  });

  it('le complément ne dépasse jamais la cible du jour, ni le plafond d’un en-cas, ni le plancher', () => {
    const avec = balayage(true);
    let nAuto = 0;
    for (const m of avec) for (const p of m.plans) {
      p.days.forEach((d, i) => {
        const s = p.slots.filter((x) => x.day === i);
        expect(d.belowFloor, `${m.profil} jour ${i}`).toBe(false);
        const autos = s.filter((x) => x.auto);
        nAuto += autos.length;
        for (const a of autos) expect(a.kcal, `${m.profil} jour ${i}`).toBeLessThanOrEqual(ENCAS_AUTO_MAX_KCAL + 1e-6);
        // Jamais au-dessus de la cible, sauf pour remonter au plancher (le plancher passe avant, marge de 5 % au plus).
        const avant = d.kcal - autos.reduce((t, x) => t + x.kcal, 0);
        if (autos.length) expect(d.kcal, `${m.profil} jour ${i}`).toBeLessThanOrEqual(avant < m.floor ? d.targetKcal * 1.05 + 1e-6 : d.targetKcal + 1e-6);
        expect(s.filter((x) => x.kind === 'gouter').length).toBeLessThanOrEqual(1);
        expect(s.filter((x) => x.kind === 'encas').length).toBeLessThanOrEqual(2);
        // « il manque X kcal » : montré dès que le manque dépasse le seuil, jamais sinon.
        const manque = d.targetKcal - d.kcal;
        expect(d.missingKcal ?? 0, `${m.profil} jour ${i}`).toBe(manque > SEUIL_ECART_KCAL ? manque : 0);
      });
    }
    expect(nAuto).toBeGreaterThan(0);
  });

  it('complément désactivé : aucun goûter ni en-cas ajouté, le réglage de l’utilisateur est respecté', () => {
    for (const m of balayage(false)) for (const p of m.plans) expect(p.slots.some((s) => s.auto), m.profil).toBe(false);
  });

  it('l’écart restant est visible quand on ne peut pas combler (cible très haute, filtres stricts)', () => {
    const f = finalNeeds({ answers: { ...clean }, body: { sex: 'homme', kg: 95, cm: 190, age: 25 }, sessionsPerWeek: 5, goal: 'prise', pace: 'ferme', adjust: 0, gel: false, days: PROGRAMMES.mixte });
    if (f.status !== 'ok' || !f.week) throw new Error('besoins refusés');
    // Un seul en-cas autorisé par jour (cfg) et cuisine limitée à 15 min : le plan ne peut pas tout combler.
    const p = generateWeekPlan(f.week, recipes, foods, { ...prefs('prise'), maxCookMin: 15, allergens: ['lait', 'gluten', 'fruits_a_coque'] }, { ...DEFAULT_MEAL_CONFIG, completerAuto: true }, 1, [], f.needs.floor);
    for (const d of p.days) if (d.status !== 'incomplet') expect(d.missingKcal ?? 0).toBe(d.targetKcal - d.kcal > SEUIL_ECART_KCAL ? d.targetKcal - d.kcal : 0);
  });
});
