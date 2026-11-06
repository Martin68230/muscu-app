// knowledge/adaptation-regles.md : une ligne par cas du tableau de décision (garder, +charge, +répétitions, +série, variante plus dure,
// redescendre, geler), gel douleur sur 2 séances, débutant après RIR 0, unilatéral, durées, grossesse, garde-fou D4.
import { describe, expect, it } from 'vitest';
import type { Level, SetLog, WorkoutSession } from '../../src/data/model';
import { d4OpenVariants, painFrozen, setRaise } from '../../src/session/adaptation';
import { proposeProgression, type ProgressionInput } from '../../src/session/history';
import { DROP_LIMIT_TEXT, PROGRESSION_TEXT } from '../../src/session/messages';
import { proposeHold, type ProgVariant } from '../../src/session/progression';
import { withProgression } from '../../src/session/progression-config';
import { echelonInfoFor, progVariants } from '../../src/session/progression-store';
import { completeSet, NEUTRAL_CONTEXT, startSession } from '../../src/session/engine';
import { D4_FICHE_DOSE, D4_FICHES, D4_NEVER } from '../../src/generator/config';
import { classAllowed, variantClass } from '../../src/generator/reps';
import { day as dayOf, ex } from './session-helpers';
import { byId, FICHES, mk as mkInput } from './generator-helpers';
import { buildCtx } from '../../src/generator/context';

let n = 0;
function log(o: Partial<SetLog> & { sessionId: string; completedAt: string }): SetLog {
  n++;
  return {
    id: `a${n}`, ownerId: 'u', createdAt: o.completedAt, updatedAt: o.completedAt, rev: 1, deletedAt: null, syncedAt: null,
    movementId: 'm', variantId: 'v', exerciseIndex: 0, setIndex: n, targetRepsMin: 8, targetRepsMax: 12, targetRir: 2,
    reps: 12, loadKg: 10, rir: 2, pain: false, comment: '', isWarmup: false, ...o,
  } as SetLog;
}
const day = (d: number) => `2026-10-${String(d).padStart(2, '0')}T10:00:00.000Z`;
/** Une séance de `count` séries ; `over` s'applique à toutes. */
const sess = (id: string, d: number, over: Partial<SetLog> = {}, count = 3) =>
  Array.from({ length: count }, (_, i) => log({ ...over, sessionId: id, completedAt: new Date(Date.parse(day(d)) + i * 60_000).toISOString() }));
const row = (id: string, d: number, o: Partial<WorkoutSession> = {}): WorkoutSession =>
  ({ id, status: 'faite', startedAt: day(d), endedAt: day(d), plannedDate: day(d).slice(0, 10), deletedAt: null, endReason: null, ...o }) as unknown as WorkoutSession;

const exo = ex({ variantId: 'v', movementId: 'm', sets: 3, repsMin: 8, repsMax: 12, rirTarget: 2 });
const eq = { dumbbellWeightsKg: [4, 6, 10, 12, 12.5, 15], kettlebellWeightsKg: [], platesKg: [] };
const base = (sets: SetLog[], o: Partial<ProgressionInput> = {}): ProgressionInput => ({
  exercise: exo, sets, pregnant: false, variantTags: ['halteres'], equipment: eq, level: 'intermediaire' as Level, echelon: 1, ...o,
});
const harder: ProgVariant[] = [
  { id: 'v', nom: 'Facile', echelon: 1, niveau: 'debutant', materielOk: true, rank: 0 },
  { id: 'v2', nom: 'Plus dure', echelon: 2, niveau: 'intermediaire', materielOk: true, rank: 0 },
];

describe('Table de décision, exercice chargé', () => {
  it('C1 redescendre : une série sous le bas de la fourchette -> un palier de moins (appliqué même en grossesse)', () => {
    const s = sess('a', 1, { loadKg: 12, reps: 6, rir: 1 });
    expect(proposeProgression(base(s))).toMatchObject({ action: 'baisse', loadKg: 10 });
    expect(proposeProgression(base(s, { pregnant: true }))).toMatchObject({ action: 'baisse', loadKg: 10 });
  });
  it('C2 garder : réserve sous la cible (RIR moyen = cible - 1) -> pas de « +1 répétition »', () => {
    const p = proposeProgression(base(sess('a', 1, { reps: 10, rir: 1 })));
    expect(p).toMatchObject({ action: 'garder', reason: 'reserve', text: PROGRESSION_TEXT.garderReserve });
    expect(p.text).not.toMatch(/répétition de plus/);
  });
  it('C3 +charge : toutes les séries au sommet à la réserve visée -> un seul cran au-dessus, <= +20 %', () => {
    expect(proposeProgression(base(sess('a', 1, { loadKg: 12.5 })))).toMatchObject({ action: 'hausse', loadKg: 15, reason: 'double_progression' });
  });
  it('C4 +répétitions : dans la fourchette, réserve conforme -> même charge, +1 répétition', () => {
    expect(proposeProgression(base(sess('a', 1, { reps: 10, rir: 2 })))).toMatchObject({ action: 'garder', loadKg: 10, text: PROGRESSION_TEXT.plusDeReps });
  });
  it('C6 plafond : un cran > +20 % n\'est jamais proposé (4 -> 6 kg) ; 2 crans non plus', () => {
    const p = proposeProgression(base(sess('a', 1, { loadKg: 4 })));
    expect(p).toMatchObject({ action: 'garder', reason: 'saut', loadKg: 4 });
    // 10 -> 12 (+20 %) oui ; jamais 12,5 (deux crans)
    expect(proposeProgression(base(sess('a', 1, { loadKg: 10 }))).loadKg).toBe(12);
  });
  it('C7 +1 série (proposition) quand le cran est trop grand : 2 séances au sommet, sous le plafond', () => {
    const two = ex({ variantId: 'v', movementId: 'm', sets: 2, repsMin: 8, repsMax: 12, rirTarget: 2 });
    const s = [...sess('a', 1, { loadKg: 4 }, 2), ...sess('b', 3, { loadKg: 4 }, 2)];
    const p = proposeProgression(base(s, { exercise: two }));
    expect(p).toMatchObject({ action: 'hausse', reason: 'serie', setsProposal: 3, loadKg: 4 });
    // une seule séance au sommet : pas encore
    expect(proposeProgression(base(sess('b', 3, { loadKg: 4 }, 2), { exercise: two })).reason).toBe('saut');
    // plafond de fiche à 2 séries : pas de 3e série
    expect(proposeProgression(base(s, { exercise: two, ficheMaxSets: 2 })).reason).toBe('saut');
  });
  it('C8 variante plus dure (proposition), seulement après +série impossible', () => {
    const s = [...sess('a', 1, { loadKg: 4 }), ...sess('b', 3, { loadKg: 4 })];
    const p = proposeProgression(base(s, { variants: harder }));
    expect(p).toMatchObject({ action: 'hausse', reason: 'variante', harderVariant: { variantId: 'v2', nom: 'Plus dure' }, loadKg: 4 });
    // niveau insuffisant : rien au-dessus
    expect(proposeProgression(base(s, { variants: harder, level: 'debutant' })).reason).not.toBe('variante');
  });
  it('geler : grossesse, plafond, reprise douce, symptôme, séance manquée -> aucune montée', () => {
    const s = sess('a', 1, { loadKg: 12.5 });
    expect(proposeProgression(base(s, { pregnant: true })).reason).toBe('grossesse');
    expect(proposeProgression(base(s, { exercise: { ...exo, capped: true } })).reason).toBe('plafond');
    expect(proposeProgression(base(s, { repriseActive: true })).reason).toBe('reprise');
    expect(proposeProgression(base(s, { frozenBySymptom: true })).reason).toBe('symptome');
    expect(proposeProgression(base(s, { missedSinceLast: true }))).toMatchObject({ action: 'garder', reason: 'manquee' });
  });
  it('grossesse : même « +1 répétition » est bloqué', () => {
    expect(proposeProgression(base(sess('a', 1, { reps: 10 }), { pregnant: true })).text).not.toBe(PROGRESSION_TEXT.plusDeReps);
  });
});

describe('Débutant', () => {
  it('C3 : critère tenu sur 2 séances valables de suite', () => {
    const one = sess('a', 1, { loadKg: 12.5 });
    expect(proposeProgression(base(one, { level: 'debutant' }))).toMatchObject({ action: 'garder', reason: 'attente' });
    const two = [...one, ...sess('b', 3, { loadKg: 12.5 })];
    expect(proposeProgression(base(two, { level: 'debutant' }))).toMatchObject({ action: 'hausse', loadKg: 15 });
  });
  it('niveau absent : lecture prudente (débutant)', () => {
    expect(proposeProgression({ ...base(sess('a', 1, { loadKg: 12.5 })), level: undefined }).reason).toBe('attente');
  });
  it('C1 RIR 0 : baisse, puis aucune montée avant 2 séances valables au bon RIR', () => {
    const fail = sess('a', 1, { loadKg: 15, reps: 12, rir: 0 });
    expect(proposeProgression(base(fail, { level: 'debutant' })).action).toBe('baisse');
    const one = [...fail, ...sess('b', 3, { loadKg: 12.5 })];
    expect(proposeProgression(base(one, { level: 'debutant' }))).toMatchObject({ action: 'garder', reason: 'apprentissage' });
    const two = [...one, ...sess('c', 5, { loadKg: 12.5 })];
    expect(proposeProgression(base(two, { level: 'debutant' }))).toMatchObject({ action: 'hausse', loadKg: 15 });
  });
  it('C7 : 2 -> 3 séries jamais avant 4 semaines et 8 séances, jamais sur une fiche technique ou D3 / D4', () => {
    const ok = { sets: 2, beginner: true, technicalOrHardClass: false, topRun: 2, followedMs: 29 * 86_400_000, doneSessions: 8 };
    expect(setRaise(ok)).toBe(3);
    expect(setRaise({ ...ok, followedMs: 20 * 86_400_000 })).toBeNull();
    expect(setRaise({ ...ok, doneSessions: 7 })).toBeNull();
    expect(setRaise({ ...ok, technicalOrHardClass: true })).toBeNull();
    expect(setRaise({ ...ok, beginner: false, sets: 3 })).toBeNull(); // plafond du rôle : 3
  });
});

describe('Gel douleur sur la zone (2 séances, toutes fiches)', () => {
  const zonesOf = (m: string) => (m === 'm' || m === 'b' ? ['epaule'] : m === 'c' ? ['genou'] : []);
  const opts = { zonesOfFiche: ['epaule'], zonesOfMovement: zonesOf };
  const painB = sess('p', 1, { movementId: 'b', variantId: 'vb', pain: true, painZone: 'epaule' }, 1);
  it('douleur sur une AUTRE fiche de la même zone : aucune montée', () => {
    const s = [...painB, ...sess('a', 3, { loadKg: 12.5 })];
    expect(proposeProgression(base(s, opts))).toMatchObject({ action: 'garder', reason: 'douleur', text: PROGRESSION_TEXT.douleurZone });
    // sans la carte des zones, l'ancienne règle (fiche seule) aurait proposé la hausse
    expect(proposeProgression(base(s)).action).toBe('hausse');
  });
  it('une séance sans exercice de la zone ne compte pas ; 2 séances qui la sollicitent sans gêne lèvent le gel', () => {
    const genou = sess('g', 2, { movementId: 'c', variantId: 'vc' }, 2);
    const s1 = [...painB, ...genou, ...sess('a', 3, { loadKg: 12.5 })];
    expect(proposeProgression(base(s1, opts)).reason).toBe('douleur');
    const s2 = [...s1, ...sess('b2', 5, { loadKg: 12.5 })];
    expect(proposeProgression(base(s2, opts))).toMatchObject({ action: 'hausse', loadKg: 15 });
  });
  it('douleur avant une absence : toujours active au retour', () => {
    expect(painFrozen({ movementId: 'm', zones: ['epaule'], sets: painB, zonesOfMovement: zonesOf })).toBe(true);
  });
  it('séance arrêtée sur un symptôme : ne lève pas le gel', () => {
    const s = [...painB, ...sess('x', 3), ...sess('y', 5)];
    const rows = [row('p', 1), row('x', 3, { endReason: 'symptome' }), row('y', 5)];
    expect(painFrozen({ movementId: 'm', zones: ['epaule'], sets: s, sessions: rows, zonesOfMovement: zonesOf })).toBe(true);
  });
  it('la douleur ne bloque jamais une baisse', () => {
    const s = [...painB, ...sess('a', 3, { loadKg: 12, reps: 6 })];
    expect(proposeProgression(base(s, opts)).action).toBe('baisse');
  });
});

describe('Unilatéral : le côté faible décide', () => {
  const uni = ex({ variantId: 'v', movementId: 'm', sets: 2, repsMin: 8, repsMax: 12, rirTarget: 2, unit: 'reps_par_cote' });
  const sides = (id: string, d: number, right: Partial<SetLog>) => [
    ...sess(id, d, { loadKg: 12.5, side: 'gauche' }, 2),
    ...sess(id, d, { loadKg: 12.5, side: 'droite', ...right }, 2).map((s, i) => ({ ...s, completedAt: new Date(Date.parse(day(d)) + (10 + i) * 60_000).toISOString() })),
  ];
  it('montée seulement si les DEUX côtés sont au sommet', () => {
    expect(proposeProgression(base(sides('a', 1, { reps: 11 }), { exercise: uni })).action).not.toBe('hausse');
    expect(proposeProgression(base(sides('a', 1, {}), { exercise: uni }))).toMatchObject({ action: 'hausse', loadKg: 15 });
  });
  it('descente dès qu\'UN côté est sous le bas de la fourchette', () => {
    expect(proposeProgression(base(sides('a', 1, { reps: 6 }), { exercise: uni })).action).toBe('baisse');
  });
});

describe('Échelons (poids du corps)', () => {
  const bwEx = ex({ variantId: 'w1', movementId: 'm', sets: 2, repsMin: 8, repsMax: 15, rirTarget: 3, startLoadKg: null });
  const vars: ProgVariant[] = [1, 2].map((e) => ({ id: `w${e}`, nom: `W${e}`, echelon: e, niveau: 'debutant', materielOk: true, rank: 0 }));
  const bw = (s: SetLog[], o: Partial<ProgressionInput> = {}) =>
    proposeProgression({ exercise: bwEx, sets: s, pregnant: false, echelon: 1, bodyweight: { variants: vars, level: 'intermediaire' }, ...o });
  const at = (id: string, d: number, o: Partial<SetLog> = {}) => sess(id, d, { loadKg: null, echelon: 1, variantId: 'w1', targetRepsMin: 8, targetRepsMax: 15, targetRir: 3, reps: 15, rir: 3, ...o }, 2);
  it('E2 montée d\'un échelon après 2 séances ; 1 séance : on garde (pas de répétition au-delà du haut)', () => {
    expect(bw(at('a', 1))).toMatchObject({ action: 'garder', reason: 'attente' });
    expect(bw([...at('a', 1), ...at('b', 3)])).toMatchObject({ action: 'hausse', echelon: 2 });
  });
  it('E2 bloquée par une douleur sur la zone (autre fiche) ou une séance manquée', () => {
    const s = [...at('a', 1), ...at('b', 3), ...sess('p', 4, { movementId: 'z', variantId: 'vz', pain: true, painZone: 'genou' }, 1)];
    expect(bw(s, { zonesOfFiche: ['genou'], zonesOfMovement: (m) => (m === 'z' || m === 'm' ? ['genou'] : []) }).action).toBe('garder');
    expect(bw([...at('a', 1), ...at('b', 3)], { missedSinceLast: true }).reason).toBe('manquee');
  });
  it('E3 / C2 : réserve sous la cible -> garder, sans « une répétition de plus »', () => {
    expect(bw(at('a', 1, { reps: 10, rir: 2 }))).toMatchObject({ reason: 'reserve', text: PROGRESSION_TEXT.garderVersion });
    expect(bw(at('a', 1, { reps: 10, rir: 3 })).text).toBe(PROGRESSION_TEXT.plusDeRepsVersion);
  });
});

describe('Durées (maintiens)', () => {
  const cfg = withProgression({ hold: { enabled: true, perSchema: { gainage: { startBeginnerSec: 20, startOtherSec: 30, stepSec: 10, capSec: 45 } } } });
  const hold = (id: string, d: number, o: Partial<SetLog> = {}) => sess(id, d, { loadKg: null, reps: null, rir: null, holdSec: 30, ...o }, 2);
  const input = (s: SetLog[], o = {}) => ({ movementId: 'm', schema: 'gainage', holdSec: 30, sets: s, pregnant: false, capped: false, fallbackPlanned: 2, cfg, ...o });
  it('2 séances tenues -> +5 s au plus (même si le pas configuré est plus grand)', () => {
    expect(proposeHold(input([...hold('a', 1), ...hold('b', 3)]))).toBe(35);
  });
  it('une position dégradée avant la cible, une douleur ou un symptôme : aucune montée', () => {
    expect(proposeHold(input([...hold('a', 1), ...hold('b', 3, { holdSec: 25 })]))).toBeNull();
    expect(proposeHold(input([...hold('a', 1), ...hold('b', 3, { pain: true })]))).toBeNull();
    const rows = [row('a', 1), row('b', 3, { endReason: 'symptome' })];
    expect(proposeHold(input([...hold('a', 1), ...hold('b', 3)], { sessions: rows }))).toBeNull();
  });
  it('grossesse ou gel : durée figée', () => {
    expect(proposeHold(input([...hold('a', 1), ...hold('b', 3)], { pregnant: true }))).toBeNull();
    expect(proposeHold(input([...hold('a', 1), ...hold('b', 3)], { frozen: true }))).toBeNull();
  });
  it('[kine] allumé par défaut ; plafond = le plus bas de la ligne, de la fiche, 30 s après charge lourde, 20 s P-GROS', () => {
    const two = [...hold('a', 1), ...hold('b', 3)];
    expect(proposeHold({ ...input(two), cfg: undefined })).toBe(35);
    expect(proposeHold(input(two, { maxSec: 30 }))).toBeNull(); // déjà à 30 s après une charge lourde
    expect(proposeHold(input(two, { maxSec: 32 }))).toBe(32);
  });
  it('[kine] par proposeProgression : reprise douce, grossesse (20 s), charge lourde (30 s), fourchette du niveau', () => {
    const plank = ex({ variantId: 'v', movementId: 'm', unit: 'sec', holdSec: 30, sets: 2, startLoadKg: null });
    const two = [...hold('a', 1), ...hold('b', 3)];
    const p = (o: Partial<ProgressionInput> = {}) =>
      proposeProgression({ exercise: plank, sets: two, pregnant: false, holdSchema: 'gainage', level: 'avance', ...o });
    expect(p().holdSec).toBe(35);
    expect(p({ repriseActive: true }).holdSec).toBeUndefined();
    expect(p({ pregnant: true }).holdSec).toBeUndefined();
    expect(p({ holdMaxSec: 30 }).holdSec).toBeUndefined();
    expect(p({ level: 'debutant' }).holdSec).toBeUndefined(); // fourchette débutant : 30 s au plus
    expect(p({ exercise: { ...plank, capped: true } }).holdSec).toBeUndefined();
  });
});

describe('Garde-fou D4 : 2 séances au haut du D3 voisin [kine 05/11/2026]', () => {
  // Séance de la variante voisine : toutes les séries au haut de la fourchette (cible enregistrée), réserve 2.
  const top = (id: string, d: number, movementId: string, variantId: string, o: Partial<SetLog> = {}) =>
    sess(id, d, { movementId, variantId, loadKg: null, reps: 10, targetRepsMin: 5, targetRepsMax: 10, targetRir: 2, rir: 2, ...o }, 2);
  const open = (sets: SetLog[], allowed = true, sessions?: WorkoutSession[]) => d4OpenVariants({ fiches: FICHES, sets, sessions, allowed });
  const ancrage = { extraTags: ['partenaire_ou_ancrage'] };
  it('sans historique : aucune D4, même à l\'avancé ; traction à un bras toujours dans D4_NEVER', () => {
    expect(open([])).toEqual([]);
    expect(D4_NEVER).toEqual(['traction-un-bras']);
    const ctx = buildCtx(mkInput({ level: 'avance', goal: 'muscle', ...ancrage }));
    for (const id of ['nordique-ischios', 'pompe-equilibre-mur', 'pompe-un-bras'])
      for (const v of byId(id).variantes) expect(classAllowed(byId(id), v, ctx), v.id).toBe(false);
  });
  it('nordique : 2 séances au haut du curl ischios à une jambe -> le premier échelon de la nordique s\'ouvre, pas les suivants', () => {
    const v = 'curl-ischios-serviette-une-jambe';
    expect(open(top('a', 1, 'curl-ischios-serviette', v))).toEqual([]); // une seule séance
    const two = [...top('a', 1, 'curl-ischios-serviette', v), ...top('b', 3, 'curl-ischios-serviette', v)];
    expect(open(two)).toEqual(['nordique-ischios-court']);
    // pas au haut (9 < 10) ou réserve 1 : rien
    expect(open([...top('a', 1, 'curl-ischios-serviette', v), ...top('b', 3, 'curl-ischios-serviette', v, { reps: 9 })])).toEqual([]);
    expect(open([...top('a', 1, 'curl-ischios-serviette', v), ...top('b', 3, 'curl-ischios-serviette', v, { rir: 1 })])).toEqual([]);
    // l'autre variante (pont, échelon 1) ne compte pas
    expect(open([...top('a', 1, 'curl-ischios-serviette', 'curl-ischios-serviette-pont'), ...top('b', 3, 'curl-ischios-serviette', 'curl-ischios-serviette-pont')])).toEqual([]);
    // non avancé, grossesse ou reprise : l'appelant passe allowed = false
    expect(open(two, false)).toEqual([]);
    // le générateur place la variante ouverte à l'avancé, pas à l'intermédiaire
    const f = byId('nordique-ischios');
    const court = f.variantes.find((x) => x.id === 'nordique-ischios-court')!;
    expect(classAllowed(f, court, buildCtx({ ...mkInput({ level: 'avance', goal: 'muscle', ...ancrage }), options: { d4Open: open(two) } }))).toBe(true);
    expect(classAllowed(f, court, buildCtx({ ...mkInput({ level: 'intermediaire', goal: 'muscle', ...ancrage }), options: { d4Open: open(two) } }))).toBe(false);
    expect(classAllowed(f, court, buildCtx({ ...mkInput({ level: 'avance', goal: 'muscle', ...ancrage }), options: { d4Open: open(two), repriseActive: true } }))).toBe(false);
  });
  it('le droit se referme dès qu\'une douleur touche la zone, et revient après 2 séances sans gêne qui la sollicitent', () => {
    const v = 'curl-ischios-serviette-une-jambe';
    const two = [...top('a', 1, 'curl-ischios-serviette', v), ...top('b', 3, 'curl-ischios-serviette', v)];
    const pain = sess('p', 4, { movementId: 'squat-arriere-barre', variantId: 'x', pain: true, painZone: 'genou' }, 1);
    expect(open([...two, ...pain])).toEqual([]);
    const after = [...two, ...pain, ...top('c', 5, 'curl-ischios-serviette', v), ...top('d', 7, 'curl-ischios-serviette', v)];
    expect(open(after)).toEqual(['nordique-ischios-court']);
  });
  it('symptôme dans une des 2 séances : ne compte pas', () => {
    const v = 'curl-ischios-serviette-une-jambe';
    const two = [...top('a', 1, 'curl-ischios-serviette', v), ...top('b', 3, 'curl-ischios-serviette', v)];
    expect(open(two, true, [row('a', 1), row('b', 3, { endReason: 'symptome' })])).toEqual([]);
  });
  it('pompe à un bras : voisine pompe archer ; la variante au sol seulement après 2 séances au haut de la chaise', () => {
    const archer = [...top('a', 1, 'pompe-archer', 'pompe-archer-sol'), ...top('b', 3, 'pompe-archer', 'pompe-archer-sol')];
    expect(open(archer)).toEqual(['pompe-un-bras-chaise']);
    const chaise = [...top('c', 5, 'pompe-un-bras', 'pompe-un-bras-chaise', { targetRir: 3, rir: 3, targetRepsMax: 8, reps: 8 }), ...top('d', 7, 'pompe-un-bras', 'pompe-un-bras-chaise', { targetRir: 3, rir: 3, targetRepsMax: 8, reps: 8 })];
    expect(open([...archer, ...chaise])).toEqual(['pompe-un-bras-chaise', 'pompe-un-bras-sol']);
    // pompe en équilibre : voisine pompe piquée pieds surélevés (plus haut échelon : pieds sur une chaise)
    const pique = [...top('e', 1, 'pompe-piquee-pieds-sureleves', 'pompe-piquee-pieds-chaise'), ...top('f', 3, 'pompe-piquee-pieds-sureleves', 'pompe-piquee-pieds-chaise')];
    expect(open(pique)).toEqual(['pompe-equilibre-mur-pieds']);
  });
  it('dose D4 : pompe à un bras 4-8 par côté, 2 séries au plus, réserve 3 ; traction à un bras 1-5, 2 séries', () => {
    expect(D4_FICHE_DOSE['pompe-un-bras']).toEqual({ reps: [4, 8], maxSets: 2, minRir: 3 });
    expect(D4_FICHE_DOSE['traction-un-bras']).toEqual({ reps: [1, 5], maxSets: 2, minRir: 3 });
    expect(D4_FICHES['pompe-un-bras']).toEqual(['poignet', 'coude', 'epaule']);
  });
});

describe('Contrôle relecteur : jamais de D3 en première séance pour un débutant (proposition et étalonnage)', () => {
  const ctxOf = (history: { variantId: string; loadKg: null; completedAt: string; pain: boolean }[] = []) =>
    buildCtx({ ...mkInput({ level: 'debutant', goal: 'muscle', profile: 'A0' }), history });
  const pompe = byId('pompe');
  const genoux = pompe.variantes.find((v) => v.id === 'pompe-genoux')!;
  const sol = pompe.variantes.find((v) => v.id === 'pompe-sol')!;
  const plan = ex({ variantId: genoux.id, movementId: 'pompe', startLoadKg: null, repsMin: 8, repsMax: 15, rirTarget: 3 });
  it('première séance : la pompe au sol (D3) n\'est ni « up » de l\'étalonnage ni proposable', () => {
    const ctx = ctxOf();
    expect(variantClass(pompe, sol)).toBe(3);
    expect(progVariants(pompe, ctx).find((v) => v.id === sol.id)!.materielOk).toBe(false);
    const info = echelonInfoFor(plan, { ctx, sets: [], sessions: [], events: [] })!;
    expect(info.calibration).toBe(true);
    expect(info.up?.variantId).not.toBe(sol.id);
    // en séance : la meilleure première série ne monte pas vers un D3
    const d = dayOf([plan]);
    const r = completeSet(d, startSession(d, 0), { reps: 15, rir: 4 }, { ...NEUTRAL_CONTEXT, echelonInfo: () => info }, 1000);
    expect(r.echelonChange?.variantId ?? null).not.toBe(sol.id);
  });
  it('avec un historique de l\'exercice, la pompe au sol redevient possible (règle du générateur)', () => {
    const ctx = ctxOf([{ variantId: genoux.id, loadKg: null, completedAt: '2026-10-01T10:00:00Z', pain: false }]);
    expect(progVariants(pompe, ctx).find((v) => v.id === sol.id)!.materielOk).toBe(true);
  });
  it('version plus dure jamais proposée pour un exercice adapté par une blessure', () => {
    const s = [...sess('a', 1, { loadKg: 4 }), ...sess('b', 3, { loadKg: 4 })];
    const adapted = { ...exo, adaptation: { kind: 'amplitude' } } as unknown as typeof exo;
    expect(proposeProgression(base(s, { exercise: adapted, variants: harder })).reason).not.toBe('variante');
  });
});

describe('Contrôle relecteur : 2 paliers de baisse au plus par séance (étalonnage chargé)', () => {
  it('3e baisse refusée : on garde la charge et le message propose une version plus facile ou d\'arrêter', () => {
    const e = ex({ variantId: 'c', movementId: 'c', sets: 4, repsMin: 8, repsMax: 12, rirTarget: 2, startLoadKg: 14 });
    const d = dayOf([e]);
    const ctx = { ...NEUTRAL_CONTEXT, isCalibration: () => true, availableLoadsKg: () => [4, 6, 8, 10, 12, 14] };
    let st = startSession(d, 0);
    const loads: number[] = [];
    let last: ReturnType<typeof completeSet> | null = null;
    for (const [k, kg] of [14, 12, 10].entries()) {
      last = completeSet(d, st, { reps: 5, loadKg: kg, rir: 0 }, ctx, 1000 * (k + 1));
      st = last.state;
      loads.push(last.suggestion!.loadKg!);
    }
    expect(loads).toEqual([12, 10, 10]);
    expect(last!.dropLimit).toBe(true);
    expect(DROP_LIMIT_TEXT).toMatch(/version plus facile/);
    expect(DROP_LIMIT_TEXT).not.toMatch(/[A-Z]\d|_/);
  });
});

describe('Étalonnage chargé : plafond du saut entre deux séries (décision utilisateur 05/11/2026, PROVISOIRE)', () => {
  const run = (movementId: string, loads: number[], kg: number, rir: number, extra: Partial<typeof NEUTRAL_CONTEXT> = {}) => {
    const e = ex({ variantId: movementId, movementId, sets: 3, repsMin: 8, repsMax: 12, rirTarget: 2, startLoadKg: kg });
    const d = dayOf([e]);
    const ctx = { ...NEUTRAL_CONTEXT, isCalibration: () => true, availableLoadsKg: () => loads, ...extra };
    return completeSet(d, startSession(d, 0), { reps: 12, loadKg: kg, rir }, ctx, 1000).suggestion!;
  };
  const DB = [2, 4, 5, 6, 8, 10, 12, 15, 20];
  it('aucun saut au-delà du plafond, sur tous les paliers (techniques lourds +20 %, autres +50 %)', () => {
    for (const [id, cap] of [['squat-arriere-barre', 0.2], ['curl-halteres', 0.5]] as const)
      for (const kg of DB) {
        const s = run(id, DB, kg, 4);
        expect(s.loadKg! <= kg * (1 + cap) + 1e-9, `${id} ${kg} -> ${s.loadKg}`).toBe(true);
        const next = DB.find((l) => l > kg);
        if (s.action === 'hausse') expect(s.loadKg).toBe(next); // un seul cran
      }
  });
  it('depuis l\'haltère le plus léger : 2 -> 4 kg (+100 %) refusé', () => {
    expect(run('curl-halteres', [2, 4, 6], 2, 4)).toMatchObject({ action: 'garder', loadKg: 2 });
    expect(run('curl-halteres', [4, 6, 8], 4, 4)).toMatchObject({ action: 'hausse', loadKg: 6 }); // +50 % : permis
    expect(run('squat-arriere-barre', [40, 42.5, 50], 40, 4)).toMatchObject({ action: 'hausse', loadKg: 42.5 });
    expect(run('squat-arriere-barre', [40, 50], 40, 4)).toMatchObject({ action: 'garder', loadKg: 40 }); // +25 %
  });
  it('série précédente pas propre (réserve 3) ou gel douleur : pas de montée', () => {
    expect(run('curl-halteres', [8, 10], 8, 3).action).toBe('garder');
    expect(run('curl-halteres', [8, 10], 8, 4, { raiseFrozen: () => true }).action).toBe('garder');
    expect(run('curl-halteres', [8, 10], 8, 4).action).toBe('hausse');
  });
});
