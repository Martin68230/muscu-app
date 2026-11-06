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
// Référence régénérée le 31/10/2026 pour D34 (variété, docs/D34-bilan.md) après comparaison avant / après cas par cas : 493 cas sur 662 changent,
// tous par l'attribution des fiches à l'échelle de la semaine (même en ignorant le jeu 2) ; recouvrement maximal entre séances du même type
// en baisse dans 485 cas, en hausse dans aucun (5 -> 0 ou 1 dans 129 cas) ; jeu 2 (`alt`) ajouté. V-MSG-VOL apparaît dans 12 cas (A0,
// intermédiaire / avancé, 3 jours, 60 min et sans limite : grand dorsal 9,5 séries au lieu de 10 faute de fiches de tirage) et disparaît dans 3.
// Référence régénérée le 01/11/2026 pour le lot 11 de fiches (variété : curl-halteres, curl-elastique, elevation-laterale, charniere-dos-au-mur,
// bonjour-poids-du-corps, tirage-vertical-un-bras-elastique, developpe-epaules-elastique-alterne, developpe-sol-elastique ; générateur v1.8
// inchangé) après comparaison avant / après cas par cas (« avant » = mêmes fiches sans les 8 nouvelles : identique à l'ancienne référence
// pour les 662 cas) : 451 cas sur 662 changent, tous par la présence des nouvelles fiches : charnière seule 314, charnière + tirage vertical 48,
// charnière + poussée verticale + tirage vertical 24, tirage vertical seul 57, isolation (curl / élévation, 75 min) 1 ; 7 cas (avancé, A0,
// 30 min, 2 à 3 jours) n'ont aucun changement d'exercice : seul le texte V-MSG-DUREE nomme désormais la nouvelle fiche retirée faute de temps.
// Recouvrement maximal entre séances du même type : en baisse dans 89 cas, égal dans 362, en hausse dans aucun. V-MSG-VOL : aucun cas
// n'apparaît ni ne disparaît ; autres messages : V-MSG-ACHAT apparaît dans 8 cas, V-MSG-DUREE et V-MSG-FREQ disparaissent dans 8, V-MSG-PLANS
// dans 4 ; pénurie de variété disparaît dans 57 cas (tirage vertical), changée dans 97, pénurie salle inchangée. Contrôle de placement sur 2 916
// profils (grossesse, post-partum, chaque zone au niveau 1 à 3, 3 niveaux) : 5 780 placements des nouvelles fiches, aucune fiche placée
// malgré une case « retirer », une ligne grossesse « retirer », un niveau de variante supérieur à celui du profil, ni d'isolation en grossesse.
// Référence régénérée le 01/11/2026 pour la mesure provisoire B1 du contrôle des exemples de programmes : DOSE_LIMITS limite nordique-ischios et
// pompe-equilibre-mur à une réserve >= 2 et 2 séries au plus (config.ts) ; 87 cas sur 662 changent, tous de niveau avancé (RIR 1 de l'avancé et 3 séries
// sur ces deux fiches) ; aucun cas débutant ni intermédiaire ne change.
// Référence régénérée le 06/11/2026 (avis kiné, contrôle relecteur, décisions du chef de projet), comparée à celle du 05/11 ci-dessous,
// en deux étapes mesurées séparément : (1) épaules = somme des trois chefs du deltoïde au plafond de 20 / semaine (avec baisse des
// accessoires à 2 séries d'abord) et repos du pilier sport avancé 165 s : 489 cas sur 662 changent (débutant 144, intermédiaire 162,
// avancé 170, grossesse / cardio 13) ; (2) pilier chargé plafonné à 3 séries (PILLAR_CHARGED_MAX_SETS) : 445 cas (144 par niveau, 13).
// Contrôle sur le programme final (repetitions-regles.test.ts) : épaules <= 20, piliers chargés <= 3 séries, weekCapsOk vrai. Aucune D4
// placée sans historique (garde-fou d4Open vide dans la grille) : le garde-fou ne change pas la référence.
// Référence régénérée le 05/11/2026 (tâche « adaptation automatique » et décisions de l'utilisateur) : 190 cas sur 662 changent, aucun
// débutant. Intermédiaire : seulement sport (24/24) et endurance (24/24) : réserve 3 au lieu de 2, pilier sport 6-10 au lieu de 5-8
// (PROVISOIRE). Avancé : force (24/24, dont force+muscle+perte_gras) : repos du pilier de force 210 s (milieu de 180-240) au lieu de 180 ;
// autres objectifs (13-14 cas chacun) : nordique des ischios et pompe en équilibre retirées (D4_NEVER, garde-fou du D3 voisin non codé).
// Référence régénérée le 05/11/2026 pour deux causes, comparées séparément (empreintes « marqueurs seuls » puis « marqueurs + règles ») :
// (1) marqueurs unilatéraux UNILATERAL_MARKERS (champ perSide ; « un haltère » retiré, planche latérale, copenhague, unipodal, alterné) :
// 24 cas, tous profil F à 2 jours, intermédiaire 12 et avancé 12 (santé, endurance, sport, mobilité, 45 / 60 min / sans limite), par les
// durées estimées et l'ordre ; (2) R-REPS (knowledge/repetitions-regles.md : table rôle x objectif x niveau, classes D1-D4, règles du kiné) :
// 661 cas sur 662 (débutant 218, intermédiaire 216, avancé 218, défaut 9 ; seul « dos niveau 3 » est inchangé : programme refusé), dont 425
// par la dose seule (mêmes variantes) et 236 avec des variantes changées (pompe à un bras retirée, D4_NEVER : 47 ; exercices retirés ou
// ajoutés par la nouvelle durée : 83 programmes ont moins d'exercices, 132 plus ; D3 / D4 hors grossesse). Les 24 cas de (1) changent aussi
// par (2). Contrôles : aucun cas débutant n'a une série <= 5 répétitions ni un D3 (pompe au sol) en première séance ; D4 (pompe en
// équilibre, 2 x 2-5, réserve 3) seulement chez l'avancé ; traction toujours en réserve >= 2 ; réserve 1 seulement sur machine ou poulie.
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
