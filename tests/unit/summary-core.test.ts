import { describe, expect, it } from 'vitest';
import type { PlannedExercise, SetLog, WorkoutSession } from '../../src/data/model';
import { withProgression } from '../../src/session/progression-config';
import { computeSummary, type Summary } from '../../src/session/summary';
import { summaryText, type SummaryNames } from '../../src/session/summary-texts';
import { at, ex, session, sets } from './progression-helpers';

const names: SummaryNames = { fiche: (id) => ({ pompe: 'Pompe', squat: 'Squat', rowing: 'Rowing' } as Record<string, string>)[id] ?? 'Exercice', variant: () => 'Pompe au sol' };
const withPlan = (id: string, d: number, exs: PlannedExercise[], o: Partial<WorkoutSession> = {}): WorkoutSession => ({ ...session(id, d, o), plan: { dayIndex: 0, label: 'A', exercises: exs } });
const run = (s: WorkoutSession, all: SetLog[], others: WorkoutSession[] = [], extra = {}): Summary => computeSummary({ session: s, sets: all, sessions: [s, ...others], ...extra });
const bw = (id: string, d: number, o: Partial<SetLog> & { count?: number } = {}) => sets(id, d, { echelon: 3, rir: 3, reps: 15, ...o });

describe('indicateurs (V-BILAN-1 à 6)', () => {
  it('T23 : durée 18:00:00 -> 18:46:30 = 47 min ; plus de 3 h = non fiable', () => {
    const s = withPlan('a', 1, [ex(3)], { startedAt: '2026-09-02T18:00:00.000Z', endedAt: '2026-09-02T18:46:30.000Z' });
    expect(run(s, bw('a', 1)).durationMin).toBe(47);
    const long = withPlan('b', 1, [ex(3)], { startedAt: '2026-09-02T10:00:00.000Z', endedAt: '2026-09-02T14:10:00.000Z' });
    const r = run(long, bw('b', 1));
    expect(r.durationReliable).toBe(false);
  });
  it('T24 : repos moyen sur les repos pris (sauté exclu) ; moins de 2 -> « — » (null)', () => {
    const s = withPlan('a', 1, [ex(5)]);
    const rows = bw('a', 1, { count: 5 });
    [90, 100, 110, null].forEach((v, i) => (rows[i].restTakenSec = v));
    expect(run(s, rows).restAvgSec).toBe(100);
    const one = bw('a', 1, { count: 3 });
    one[0].restTakenSec = 90;
    expect(run(withPlan('a', 1, [ex(3)]), one).restAvgSec).toBeNull();
  });
  it('T24 : sans restTakenSec, l’indicateur devient « temps entre deux séries »', () => {
    const r = run(withPlan('a', 1, [ex(3)]), bw('a', 1));
    expect(r.restKind).toBe('entre');
    const t = summaryText(r, { names });
    expect(t.stats.map((x) => x.label)).toContain('Temps entre deux séries');
    expect(t.stats.map((x) => x.label)).not.toContain('Repos moyen');
  });
  it('T25 : échauffement ignoré ; maintien en secondes séparé des répétitions ; côtés additionnés', () => {
    const s = withPlan('a', 1, [ex(3), ex(2, { movementId: 'gainage', unit: 'sec', holdSec: 30, repsMin: 0, repsMax: 0 })]);
    const rows = [...bw('a', 1), ...sets('a', 1, { count: 2, movementId: 'gainage', holdSec: 30, reps: null, rir: null, echelon: null, setIndex: 3 }), ...sets('a', 1, { count: 1, isWarmup: true, reps: 20 })];
    const r = run(s, rows);
    expect(r).toMatchObject({ repsDone: 45, repsPlanned: 45, holdDoneSec: 60, holdPlannedSec: 60, setsDone: 5, setsPlanned: 5 });
    const sided = withPlan('c', 1, [ex(1, { unit: 'reps_par_cote', repsMax: 10 })]);
    expect(run(sided, [...sets('c', 1, { count: 1, side: 'gauche', reps: 9 }), ...sets('c', 1, { count: 1, side: 'droite', reps: 8 })]).repsDone).toBe(17);
  });
  it('T26 : tonnage 3 x 10 reps à 12 kg = 360 ; poids du corps non compté ; sans charge -> absent', () => {
    const s = withPlan('a', 1, [ex(3, { movementId: 'rowing' })]);
    expect(run(s, sets('a', 1, { movementId: 'rowing', loadKg: 12, reps: 10 })).tonnageKg).toBe(360);
    expect(run(withPlan('b', 1, [ex(3)]), bw('b', 1)).tonnageKg).toBeNull();
  });
});

describe('comparaison avec la dernière séance du même jour (V-BILAN-7)', () => {
  const prev = (reps: number, count = 3) => ({ s: withPlan('p', 0, [ex(count)]), rows: bw('p', 0, { reps, count }) });
  const cmp = (curReps: number, ref: { s: WorkoutSession; rows: SetLog[] }, count = 3) => run(withPlan('a', 3, [ex(count)]), [...bw('a', 3, { reps: curReps, count }), ...ref.rows], [ref.s]);
  it('T27 : première séance -> « première fois », aucun écart', () => {
    const r = run(withPlan('a', 1, [ex(3)]), bw('a', 1));
    expect(r).toMatchObject({ status: 'premiere', comparison: null, isFirst: true });
    expect(summaryText(r, { names }).paragraphs.join(' ')).toContain('on pourra comparer');
  });
  it('T27 : 1,9 % -> similaire ; +7,9 % -> un peu plus (texte de la spécification) ; séries +1 similaire, +2 affiché', () => {
    // 3 séries : 164 vs 161 n’est pas faisable avec 3 séries ; on reprend les proportions avec des totaux voisins
    const near = cmp(15, { s: withPlan('p', 0, [ex(3)]), rows: bw('p', 0, { reps: 15 }).map((x, i) => ({ ...x, reps: i === 0 ? 14 : 15 })) });
    expect(near.comparison?.verdict).toBe('similaire'); // 45 contre 44 : 2,3 %
    const more = run(withPlan('a', 3, [ex(3, { repsMax: 20 })]), [...bw('a', 3, { reps: 20 }), ...bw('p', 0, { reps: 18 })], [withPlan('p', 0, [ex(3)])]);
    expect(more.comparison).toMatchObject({ verdict: 'plus', repsDelta: 6 });
    const t = summaryText(more, { names });
    expect(t.comparison[0]).toMatch(/Un peu plus que la dernière fois \(\+6 répétitions, environ \+11/);
    const sets4 = cmp(15, prev(15, 3), 4);
    expect(sets4.comparison?.setsVerdict).toBe('similaire');
    const sets5 = run(withPlan('a', 3, [ex(5)]), [...bw('a', 3, { count: 5 }), ...bw('p', 0, { count: 3 })], [withPlan('p', 0, [ex(3)])]);
    expect(sets5.comparison?.setsDelta).toBe(2);
    expect(sets5.comparison?.setsVerdict).toBe('plus');
  });
  it('T27 : programme régénéré, 1 exercice commun sur 2 -> comparaison limitée à lui ; référence abandonnée ignorée', () => {
    const refEx = [ex(3), ex(3, { movementId: 'squat', variantId: 'sq' })];
    const p = { ...withPlan('p', 0, refEx), programId: 'ancien' };
    const rows = [...bw('p', 0, { reps: 12 }), ...sets('p', 0, { count: 3, movementId: 'squat', variantId: 'sq', loadKg: 20, reps: 10, echelon: null, setIndex: 3 })];
    const cur = withPlan('a', 3, [ex(3), ex(3, { movementId: 'rowing', variantId: 'rw' })]);
    const r = run(cur, [...bw('a', 3, { reps: 15 }), ...sets('a', 3, { count: 3, movementId: 'rowing', variantId: 'rw', loadKg: 10, reps: 10, echelon: null, setIndex: 3 }), ...rows], [p]);
    expect(r.comparison).toMatchObject({ commonExercises: 1, repsDelta: 9 });
    const abandoned = { ...withPlan('z', 1, [ex(3)]), status: 'sautee' as const, endReason: 'abandon' as const };
    expect(run(withPlan('a', 3, [ex(3)]), [...bw('a', 3), ...bw('z', 1)], [abandoned]).comparison).toBeNull();
  });
  it('seuil de similitude et de séries lus dans la configuration', () => {
    const ref = { s: withPlan('p', 0, [ex(3)]), rows: bw('p', 0, { reps: 14 }) };
    const strict = cmp(15, ref);
    expect(strict.comparison?.verdict).toBe('plus'); // 3/42 = 7,1 %
    const loose = computeSummary({ session: withPlan('a', 3, [ex(3)]), sets: [...bw('a', 3, { reps: 15 }), ...ref.rows], sessions: [ref.s], cfg: withProgression({ bilan: { similarPercent: 10 } }) });
    expect(loose.comparison?.verdict).toBe('similaire');
  });
});

describe('records (V-BILAN-8)', () => {
  const ref = (rows: SetLog[]) => ({ s: withPlan('p', 0, [ex(3)]), rows });
  const cur = (rows: SetLog[], p: ReturnType<typeof ref>, o: Partial<WorkoutSession> = {}) => run(withPlan('a', 3, [ex(3)], o), [...rows, ...p.rows], [p.s]);
  it('T28 : séance d’arrivée (étalonnage) à l’échelon 4 : aucun record ; séance valable suivante : record d’échelon, un seul', () => {
    const p = ref(bw('p', 0, { echelon: 3 }));
    expect(cur(bw('a', 3, { echelon: 4, reps: 10, isCalibration: true }), p).records).toEqual([]);
    const ok = cur(bw('a', 3, { echelon: 4, reps: 10 }), p);
    expect(ok.records).toHaveLength(1);
    expect(ok.records[0]).toMatchObject({ kind: 'echelon' });
    expect(cur(bw('a', 3, { echelon: 4, reps: 9 }), p).records).toEqual([]);
    // échelon 4 déjà atteint antérieurement (autre variante, même échelon) : pas de nouveau record d’échelon
    const p4 = ref(bw('p', 0, { echelon: 4, reps: 10 }));
    expect(cur(bw('a', 3, { echelon: 4, reps: 10, variantId: 'autre' }), p4).records).toEqual([]);
  });
  it('T29 : charge 14 kg x 10 après 12 kg (même variante) : record ; variante nouvelle : aucun ; douleur, étalonnage, capped, grossesse : aucun', () => {
    const load = (o: Partial<SetLog>) => sets('a', 3, { loadKg: 14, reps: 10, rir: 2, targetRir: 2, targetRepsMin: 8, targetRepsMax: 12, echelon: null, variantId: 'v', ...o });
    const p = ref(sets('p', 0, { loadKg: 12, reps: 10, rir: 2, targetRir: 2, targetRepsMin: 8, targetRepsMax: 12, echelon: null, variantId: 'v' }));
    expect(cur(load({}), p).records[0]).toMatchObject({ kind: 'charge', loadKg: 14 });
    expect(cur(load({ variantId: 'neuf' }), p).records).toEqual([]);
    expect(cur(load({ pain: true }), p).records).toEqual([]);
    expect(cur(load({ isCalibration: true }), p).records).toEqual([]);
    expect(cur(load({ capped: true }), p).records).toEqual([]);
    expect(computeSummary({ session: withPlan('a', 3, [ex(3)]), sets: [...load({}), ...p.rows], sessions: [p.s], pregnancy: 'enceinte' }).records).toEqual([]);
  });
  it('T30 : 13 répétitions contre 12 : record ; 16 (> haut) : aucun ; priorité échelon > charge > répétitions', () => {
    const p = ref(bw('p', 0, { reps: 12 }));
    expect(cur(bw('a', 3, { reps: 13, targetRepsMax: 15 }), p).records[0]).toMatchObject({ kind: 'repetitions', reps: 13 });
    expect(cur(bw('a', 3, { reps: 16 }), p).records).toEqual([]);
    const mixed = [...bw('a', 3, { reps: 13, count: 1 }), ...bw('a', 3, { echelon: 4, reps: 11, count: 2, setIndex: 1 })];
    const r = cur(mixed, p);
    expect(r.records).toHaveLength(1);
    expect(r.records[0].kind).toBe('echelon');
  });
  it('T39 : réserve 0 ou sous max(cible - 1, 1) : aucun record ; maintien au-dessus du plafond : aucun', () => {
    const p = ref(bw('p', 0, { reps: 12 }));
    expect(cur(bw('a', 3, { reps: 14, rir: 0 }), p).records).toEqual([]);
    expect(cur(bw('a', 3, { reps: 14, rir: 1, targetRir: 3 }), p).records).toEqual([]);
    expect(cur(bw('a', 3, { reps: 14, rir: 2, targetRir: 3 }), p).records).toHaveLength(1);
    const hold = (v: number, d: number, id: string) => sets(id, d, { holdSec: v, reps: null, rir: null, echelon: null, count: 1, movementId: 'gainage' });
    const ph = { s: withPlan('p', 0, [ex(1, { movementId: 'gainage', unit: 'sec' })]), rows: hold(30, 0, 'p') };
    const okH = run(withPlan('a', 3, [ex(1, { movementId: 'gainage', unit: 'sec' })]), [...hold(40, 3, 'a'), ...ph.rows], [ph.s]);
    expect(okH.records[0]).toMatchObject({ kind: 'duree' });
    const tooLong = run(withPlan('a', 3, [ex(1, { movementId: 'gainage', unit: 'sec' })]), [...hold(50, 3, 'a'), ...ph.rows], [ph.s]);
    expect(tooLong.records).toEqual([]);
  });
});

describe('statuts, grossesse, déterminisme (V-BILAN-9, V-BILAN-G)', () => {
  const p0 = { s: withPlan('p', 0, [ex(3)]), rows: bw('p', 0) };
  it('T31 : séance avec douleur : séries douloureuses listées, aucun record dessus, message sans reproche', () => {
    const s = withPlan('a', 3, [ex(3)]);
    const r = run(s, [...bw('a', 3, { count: 1, reps: 15 }), ...bw('a', 3, { count: 1, pain: true, setIndex: 1 }), ...p0.rows], [p0.s]);
    expect(r.status).toBe('douleur');
    expect(r.painful).toEqual([{ movementId: 'pompe', count: 1 }]);
    expect(r.setsDone).toBe(2); // §3.1 : les séries douloureuses font partie des séries faites
    expect(r.repsDone).toBe(30);
    expect(r.records).toEqual([]);
    const t = summaryText(r, { names, hasGentler: () => true });
    const txt = t.paragraphs.join(' ');
    expect(txt).toContain('Tu as signalé une douleur sur : Pompe');
    expect(txt).toContain('On te proposera une version plus douce.');
    expect(txt).not.toMatch(/aurais dû|seulement/);
    expect(summaryText(r, { names, hasGentler: () => false }).paragraphs.join(' ')).toContain('On garde cette version, sans chercher à monter.');
    expect(t.stats.map((x) => x.value).join(' ')).not.toMatch(/sur \d/);
    expect(t.stats.find((x) => x.label === 'Séries')?.value).toBe('2 faites');
    expect(summaryText({ ...r, setsDone: 1 }, { names, hasGentler: () => true }).stats.find((x) => x.label === 'Séries')?.value).toBe('1 faite');
  });
  it('T32/T41 : abandon et symptôme : aucun chiffre, aucun record ; textes de sécurité', () => {
    const ab = run({ ...withPlan('a', 3, [ex(3)]), status: 'sautee', endReason: 'abandon' }, []);
    expect(ab).toMatchObject({ status: 'abandon', comparison: null, records: [], setsDone: 0 });
    const ta = summaryText(ab, { names });
    expect(ta.stats).toEqual([]);
    expect(ta.paragraphs.join(' ')).toContain('on reprendra quand tu veux');
    const sy = run({ ...withPlan('a', 3, [ex(3)]), status: 'sautee', endReason: 'symptome' }, bw('a', 3, { count: 2 }), [p0.s]);
    expect(sy.status).toBe('symptome');
    const ts = summaryText(sy, { names });
    expect(ts.safetyFirst).toBe(true);
    expect(ts.stats).toEqual([]);
    expect(ts.paragraphs.join(' ')).not.toMatch(/bravo|reprendra quand tu veux/i);
    expect(ts.paragraphs.join(' ')).toContain('avis d’un professionnel de santé');
    // bilan jamais utilisé comme référence
    expect(run(withPlan('b', 5, [ex(3)]), [...bw('b', 5), ...bw('a', 3)], [{ ...withPlan('a', 3, [ex(3)]), status: 'sautee', endReason: 'symptome' }]).comparison).toBeNull();
  });
  it('T41 : séance écourtée : aucune invitation à rattraper', () => {
    const r = run(withPlan('a', 3, [ex(4)]), bw('a', 3, { count: 2 }), [p0.s]);
    expect(r.status).toBe('ecourtee');
    const txt = summaryText(r, { names }).paragraphs.join(' ');
    expect(txt).toContain('n’est pas à rattraper');
    expect(txt).not.toMatch(/on reprend le reste|double/i);
  });
  it('T33 : grossesse : durée + séries faites seulement ; aucune comparaison, record, tonnage, répétitions', () => {
    const rows = sets('a', 3, { loadKg: 10, reps: 12, rir: 3 });
    const r = computeSummary({ session: withPlan('a', 3, [ex(3)]), sets: [...rows, ...p0.rows], sessions: [p0.s], pregnancy: 'enceinte' });
    expect(r).toMatchObject({ status: 'grossesse', comparison: null, records: [], tonnageKg: null, repsDone: null, restAvgSec: null });
    const t = summaryText(r, { names, pregnancy: 'enceinte' });
    expect(t.stats.map((x) => x.label)).toEqual(['Durée', 'Séries faites']);
    expect(t.paragraphs.join(' ')).toContain('Tu as fait attention à toi, c’est l’essentiel.');
    expect(summaryText(r, { names, pregnancy: 'post_partum' }).paragraphs.join(' ')).toContain('Reprendre progressivement, à ton rythme.');
  });
  it('T34 : déterminisme : mêmes séries = même bilan', () => {
    const args = [withPlan('a', 3, [ex(3)]), [...bw('a', 3, { reps: 14 }), ...p0.rows], [p0.s]] as [WorkoutSession, SetLog[], WorkoutSession[]];
    expect(JSON.stringify(run(...args))).toBe(JSON.stringify(run(...args)));
  });
  it('aucun texte du bilan ne contient de code de règle, « sourc » ni identifiant brut', () => {
    const r = run(withPlan('a', 3, [ex(3)]), [...bw('a', 3, { reps: 15, echelon: 4 }), ...p0.rows], [p0.s]);
    const t = summaryText(r, { names });
    const all = [t.title, ...t.paragraphs, ...t.stats.map((x) => `${x.label} ${x.value}`), ...t.comparison, ...t.records, ...t.details].join(' ');
    expect(all.length).toBeGreaterThan(20);
    expect(all).not.toMatch(/V-[A-Z]+|sourc|\bp[0-9]\b|[a-z]+-[a-z]+-[a-z]+|calorie/i);
    expect(at(0)).toBeTruthy();
  });
});
