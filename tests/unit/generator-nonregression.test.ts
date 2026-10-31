// Non-régression du générateur (B4, cardio) : pour les objectifs SANS cardio, le programme doit rester identique à celui
// produit avant l'ajout du cardio (empreintes enregistrées dans tests/fixtures/generator-baseline.json, générées par le
// code d'avant B4 avec WRITE_BASELINE=1). Si les fiches changent, régénérer la référence volontairement. Référence régénérée le 24/10/2026 après l'arrivée des fiches barre (lot 07) : seuls les programmes du profil F (salle) et 2 cas de grossesse changent.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { hashString } from '../../src/session/program';
import { mk, type MkOpts } from './generator-helpers';

// Référence régénérée le 30/10/2026 pour D25 (docs/D25-bilan.md) : seuls 6 cas changent, tous voulus : grossesse débutante (2 séances +
// jours légers, STR-REP-11), dos 2 et épaule 2 (aucune série ajoutée, STR-REP-14 a), épaule 3 (plafond hebdomadaire STR-REP-3), 4 jours
// (haut / bas au lieu de « HORS »). Les programmes corps entier à 2-3 jours sans ces réglages sont identiques (T-D25-21).
// Référence régénérée le 30/10/2026 pour D26 (core : plancher, familles, CORE-ORD-4 ; supersets SUP-0 à SUP-9) : changements voulus, docs/D26-bilan.md.
// Référence régénérée le 30/10/2026 pour D30 (docs/D30-bilan.md) : objectif sport (séance de cardio incluse, message), textes corrigés
// de knowledge/textes-d25-revue.md (« pas assez de place pour… », 4 jours), isolation STR-ISO (intermédiaire / avancé, objectif muscle).
// Référence régénérée le 31/10/2026 pour D32 (docs/D32-bilan.md) : toutes les empreintes changent par le seul nom affiché de
// l'échauffement (« Marche rapide continue », VARIANT_NAME_ALONE) ; à nom inchangé, 50 cas changent, tous voulus : force intermédiaire
// C / F (montée sur marche aux haltères légers jamais en 4-6), avancé en salle F (squat sur bosu en réserve 2, good morning et rowing
// Pendlay plafonnés à 3 séries, DOSE_LIMITS).
// Référence régénérée le 31/10/2026 pour D33 (docs/D33-bilan.md) après comparaison détaillée avant / après : 49 cas, tous voulus :
// 36 perte de gras à 3 jours (séance de cardio incluse par défaut, PV3-CAR-1 : message et blocs réduits à 1) ; 12 corps entier à 2 jours,
// intermédiaire, profils C et F, 60 min et sans limite (muscle, perte de gras, muscle + force) : plafond 12 (PV3-PLAF-1), un squat ajouté en
// séance B ; 4 jours : 2e charnière au poids du corps en BAS-A (G3). Le filtre « salle » ne change rien ici (réglage absent de la grille).
const FILE = 'tests/fixtures/generator-baseline.json';

function grid(): { key: string; o: MkOpts; goals?: { goalKey: string; rank: number }[] }[] {
  const out: { key: string; o: MkOpts; goals?: { goalKey: string; rank: number }[] }[] = [];
  const goalSets: [string, string[]][] = [
    ['muscle', []], ['force', []], ['sante', []], ['perte_gras', []], ['endurance', []], ['sport', []], ['mobilite', []],
    ['muscle', ['force']], ['force', ['muscle', 'perte_gras']],
  ];
  for (const [main, others] of goalSets)
    for (const days of [2, 3])
      for (const level of ['debutant', 'intermediaire', 'avance'] as const)
        for (const profile of ['A0', 'C', 'F'])
          for (const dur of [30, 45, 60, null]) {
            const o: MkOpts = { goal: main, days, level, profile, dur, place: profile === 'F' ? 'salle' : 'maison' };
            out.push({ key: `${main}+${others.join('+')}|${days}|${level}|${profile}|${dur}`, o, goals: [main, ...others].map((g, i) => ({ goalKey: g, rank: i + 1 })) });
          }
  for (const preg of ['enceinte', 'post_partum'] as const)
    for (const level of ['debutant', 'avance'] as const) out.push({ key: `preg:${preg}|${level}`, o: { preg, level, goal: 'muscle' } });
  for (const z of ['dos', 'genou', 'epaule'] as const)
    for (const l of [1, 2, 3] as const) out.push({ key: `inj:${z}${l}`, o: { injuries: [[z, l]], goal: 'muscle' } });
  out.push({ key: 'days:4', o: { days: 4 } });
  return out;
}

function fingerprint(g: ReturnType<typeof grid>[number]): string {
  const input = mk(g.o);
  if (g.goals) input.goals = g.goals;
  const r = generateProgram(input);
  // Projection sur les champs d'avant B4 (les champs ajoutés pour le cardio ne comptent pas).
  if (!r.ok) return hashString(JSON.stringify({ ok: false, code: r.code, messages: r.messages }));
  const p = r.program;
  const sessions = p.sessions.map((s) => ({
    label: s.label, weekday: s.weekday, warmup: s.warmup, exercises: s.exercises, estimatedSec: s.estimatedSec,
    estimatedMin: s.estimatedMin, removedCore: s.removedCore, overBudget: s.overBudget,
  }));
  return hashString(JSON.stringify({
    sessions, explanation: p.explanation, messages: p.messages, coverage: p.coverage, substitutes: p.substitutes, achat: p.achat,
    family: p.family, level: p.level, durationMin: p.durationMin, targetMin: p.targetMin, goalKey: p.goalKey, pregnancy: p.pregnancy,
  }));
}

describe('Non-régression du générateur pour les objectifs sans cardio (B4)', () => {
  // @ts-ignore -- process : Node
  const write = typeof process !== 'undefined' && process.env.WRITE_BASELINE === '1';
  it('les programmes sans cardio sont identiques à la référence d\'avant B4', () => {
    const cases = grid();
    const now: Record<string, string> = {};
    for (const c of cases) now[c.key] = fingerprint(c);
    if (write || !existsSync(FILE)) {
      writeFileSync(FILE, JSON.stringify(now, null, 0));
      return;
    }
    const ref = JSON.parse(readFileSync(FILE, 'utf8')) as Record<string, string>;
    const diff = Object.keys(ref).filter((k) => ref[k] !== now[k]);

    expect(diff).toEqual([]);
    expect(Object.keys(now).length).toBe(Object.keys(ref).length);
  }, 60_000);
});
