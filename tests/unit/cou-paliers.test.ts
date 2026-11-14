// Progression du cou par paliers (kiné + relecteur 14/11/2026) : montée, plafonds, reculs, débutant plafonné, CAL-12 inchangé.
import { describe, expect, it } from 'vitest';
import { NECK_PROGRESSION as NP } from '../../src/generator/config';
import { applyNeckStage, neckStageFrom } from '../../src/session/neck-stage';

const DAY = 86_400_000;
const T0 = Date.parse('2026-01-05T10:00:00Z');
const neckEx = { movementId: 'renfo-cou-isometrique', variantId: 'renfo-cou-simple', sets: 1, repsMin: 2, repsMax: 2, restSec: 30, supersetGroup: null, rirTarget: 0, unit: 'sec', holdSec: 3, warmupSets: [], role: 'autre', slot: 'correctif', startLoadKg: null, capped: true, adaptation: null, substitut: false } as any;
const other = { ...neckEx, movementId: 'squat', slot: 'jambes_genou', capped: false } as any;
const day = (hold = 3) => ({ exercises: [other, { ...neckEx, holdSec: hold }] }) as any;

let n = 0;
const sess = (dayOffset: number, o: { status?: string; endReason?: string | null; pain?: boolean; felt?: number | null; hold?: number } = {}) => {
  const id = `s${n++}`;
  const at = new Date(T0 + dayOffset * DAY).toISOString();
  return {
    session: { id, deletedAt: null, status: o.status ?? 'faite', endReason: o.endReason ?? 'terminee', startedAt: at, endedAt: at, plannedDate: at, painExercises: o.pain ? [1] : [], plan: day(o.hold ?? 3) } as any,
    sets: [{ id: `set${id}`, sessionId: id, movementId: 'renfo-cou-isometrique', pain: !!o.pain, felt: o.felt === undefined ? 3 : o.felt, isWarmup: false, deletedAt: null, completedAt: at }] as any[],
  };
};
const run = (rows: ReturnType<typeof sess>[], o: { level?: string; injuries?: any[]; nowOffset?: number } = {}) =>
  neckStageFrom({ sessions: rows.map((r) => r.session), sets: rows.flatMap((r) => r.sets), injuries: o.injuries ?? [], level: o.level ?? 'intermediaire', nowMs: T0 + (o.nowOffset ?? 0) * DAY });

describe('Cou : paliers', () => {
  it('sans historique : palier 1 (dose actuelle inchangée)', () => {
    expect(run([])).toBe(1);
    expect(applyNeckStage(day(), 1)).toEqual(day());
  });
  it('3 séances propres + 14 jours + « encore » assez haut : palier 2 ; avant : palier 1', () => {
    expect(run([sess(0), sess(7)], { nowOffset: 8 })).toBe(1);
    expect(run([sess(0), sess(7), sess(14)], { nowOffset: 15 })).toBe(2);
    expect(run([sess(0), sess(3), sess(6)], { nowOffset: 7 })).toBe(1);
  });
  it('« encore X s » est un filtre : trop bas (5 s pour un maintien de 3 s) = pas de montée', () => {
    expect(run([sess(0, { felt: 1 }), sess(7, { felt: 1 }), sess(14, { felt: 1 })], { nowOffset: 15 })).toBe(1);
    expect(run([sess(0, { felt: null }), sess(7, { felt: null }), sess(14, { felt: null })], { nowOffset: 15 })).toBe(1);
  });
  it('une montée à la fois : 14 jours entre deux montées', () => {
    const a = [sess(0), sess(7), sess(14, { hold: 3 })];
    const more = [...a, sess(21, { hold: 5 }), sess(28, { hold: 5 }), sess(35, { hold: 5 })];
    expect(run(more, { nowOffset: 36 })).toBe(3);
    expect(run([...a, sess(15, { hold: 5 }), sess(16, { hold: 5 }), sess(17, { hold: 5 })], { nowOffset: 18 })).toBe(2);
  });
  it('douleur, symptôme ou séance interrompue : retour au palier 1', () => {
    const base = [sess(0), sess(7), sess(14)];
    expect(run([...base, sess(21, { pain: true })], { nowOffset: 22 })).toBe(1);
    expect(run([...base, sess(21, { endReason: 'symptome', status: 'en_cours' })], { nowOffset: 22 })).toBe(1);
    expect(run([...base, sess(21, { endReason: 'abandon', status: 'abandonnee' })], { nowOffset: 22 })).toBe(1);
  });
  it('plus de 21 jours sans cou : palier 1', () => {
    expect(run([sess(0), sess(7), sess(14)], { nowOffset: 15 })).toBe(2);
    expect(run([sess(0), sess(7), sess(14)], { nowOffset: 14 + 22 })).toBe(1);
  });
  it('gêne cou / épaule / dos (niveau >= 1) : palier 1', () => {
    const inj = (zone: string) => [{ zone, level: 1, active: true, deletedAt: null }];
    for (const z of ['cou', 'epaule', 'dos']) expect(run([sess(0), sess(7), sess(14)], { nowOffset: 15, injuries: inj(z) })).toBe(1);
    expect(run([sess(0), sess(7), sess(14)], { nowOffset: 15, injuries: inj('genou') })).toBe(2);
  });
  it('débutant : plafonné au palier 3 (2 séries de 5 s)', () => {
    const rows: ReturnType<typeof sess>[] = [];
    for (let i = 0; i < 12; i++) rows.push(sess(i * 7, { hold: NP.stages[Math.min(i < 3 ? 0 : i < 6 ? 1 : i < 9 ? 2 : 3, 3)].holdSec }));
    expect(run(rows, { level: 'debutant', nowOffset: 12 * 7 - 6 })).toBeLessThanOrEqual(NP.beginnerMaxStage);
    expect(run(rows, { level: 'intermediaire', nowOffset: 12 * 7 - 6 })).toBe(4);
  });
});

describe('Cou : dose appliquée et plafonds', () => {
  it('chaque palier respecte 8 s, 2 séries, 3 maintiens, 48 s cumulées, 6 min', () => {
    for (let st = 1; st <= NP.stages.length; st++) {
      const e = applyNeckStage(day(), st).exercises[1];
      expect(e.holdSec).toBeLessThanOrEqual(NP.maxHoldSec);
      expect(e.sets).toBeLessThanOrEqual(2);
      expect(e.repsMax).toBeLessThanOrEqual(3);
      expect(e.sets * e.repsMax * (e.holdSec ?? 0)).toBeLessThanOrEqual(NP.maxCumulSec);
      expect(e.sets * (e.repsMax * ((e.holdSec ?? 0) + 5) + 60)).toBeLessThanOrEqual(NP.maxSessionSec);
    }
  });
  it('message d\'arrêt conservé et texte du palier (pression légère, montée) affichés ; les autres exercices ne bougent pas', () => {
    const d = applyNeckStage(day(), 3);
    expect(d.exercises[0]).toEqual(other);
    expect(d.exercises[1].cappedLabel).toContain('Arrête tout de suite');
    expect(d.exercises[1].cappedLabel).toContain('Palier 3 sur 4');
    expect(d.exercises[1].cappedLabel).toContain('jamais au maximum');
    expect(d.exercises[1].cappedLabel).toContain('3 séances sans gêne et 14 jours');
  });
  it('séance sans cou : jour inchangé', () => {
    const d = { exercises: [other] } as any;
    expect(applyNeckStage(d, 4)).toBe(d);
  });
});
