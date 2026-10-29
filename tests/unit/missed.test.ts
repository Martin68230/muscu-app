// Séance manquée, reportée, sautée et reprise douce : cas d'essai E1 à E27 de knowledge/seance-manquee-v1.md §8 (entrées et sorties exactes).
(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'Europe/Paris';
import { describe, expect, it } from 'vitest';
import type { PlannedExercise, Program, ProgramDay, RepriseState, SetLog, WorkoutSession } from '../../src/data/model';
import {
  addDays, applyRepriseToDay, isValidRepriseSession, joursAbsence, lastMuscuKey, missedCard, missedDays, onPasBien, onSecurityAck,
  palierFromDays, postponeRows, realGapOk, repriseAtEnd, repriseAtStart, repriseLoad, shiftedDays, showT12, skipRow, withAnswer, type MissedContext,
} from '../../src/session/missed';
import { DEFAULT_REPRISE } from '../../src/session/missed-config';
import { MISSED_TEXT, allMissedTexts } from '../../src/session/missed-texts';
import { nextSession } from '../../src/session/program';
import { buildEntries, dayMark, MARK_GLYPH, MARK_TEXT, plannedDates, plannedMark } from '../../src/session/calendar';

// ----- Fabriques -----
let seq = 0;
const exo = (over: Partial<PlannedExercise> = {}): PlannedExercise => ({
  movementId: 'm', variantId: 'v', sets: 3, repsMin: 8, repsMax: 12, restSec: 90, supersetGroup: null, rirTarget: 2, unit: 'reps', holdSec: null,
  warmupSets: [], role: 'autre', slot: 'poussee_2', startLoadKg: 20, capped: false, adaptation: null, substitut: false, ...over,
});
const day = (i: number, weekday: number, label: string): ProgramDay => ({ dayIndex: i, label, weekday, exercises: [exo()], estimatedMin: 45 });
const program = (weekdays: number[], extra: Partial<Program> = {}): Program => ({
  id: 'prog', ownerId: 'u', createdAt: '2026-09-01T08:00:00.000Z', updatedAt: '2026-09-01T08:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null,
  templateKey: null, name: 'P', split: 'corps_entier', startDate: '2026-09-01', weeks: 4, active: true,
  days: weekdays.map((w, i) => day(i, w, 'ABC'[i])), ...extra,
});
const at = (key: string, h: number, m = 0): Date => {
  const [y, mo, d] = key.split('-').map(Number);
  return new Date(y, mo - 1, d, h, m);
};
const row = (over: Partial<WorkoutSession>): WorkoutSession => ({
  id: `s${++seq}`, ownerId: 'u', createdAt: '2026-09-01T08:00:00.000Z', updatedAt: '2026-09-01T08:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null,
  programId: 'prog', programDayIndex: 0, plannedDate: '2026-09-01', status: 'faite', startedAt: null, endedAt: null, note: '', ...over,
});
/** Séance faite ce jour-là, 18:00 à 19:00 (conventions §8). */
const done = (p: Program, i: number, key: string, extra: Partial<WorkoutSession> = {}): WorkoutSession =>
  row({ programId: p.id, programDayIndex: i, plannedDate: key, status: 'faite', startedAt: at(key, 18).toISOString(), endedAt: at(key, 19).toISOString(), endReason: 'terminee', plan: p.days[i], ...extra });
const set = (sessionId: string, over: Partial<SetLog> = {}): SetLog => ({
  id: `x${++seq}`, ownerId: 'u', createdAt: '2026-09-01T08:00:00.000Z', updatedAt: '2026-09-01T08:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null,
  sessionId, movementId: 'm', variantId: 'v', exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12, reps: 10, loadKg: 20, rir: 2, pain: false,
  comment: '', completedAt: '2026-09-01T18:10:00.000Z', isCalibration: false, isWarmup: false, ...over,
});
const fromRow = (r: Omit<WorkoutSession, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'rev' | 'deletedAt' | 'syncedAt'>): WorkoutSession => row(r);
const ctx = (p: Program, sessions: WorkoutSession[], now: Date, extra: Partial<MissedContext> = {}): MissedContext => ({
  program: p, sessions, sets: [], profile: { blockedWeekdays: [], daysPerWeek: p.days.length, pregnancy: null }, injuries: [], consulteActive: false, now, ...extra,
});
const dumbbells = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

// Semaine de référence : lundi 2 novembre 2026 au dimanche 8 novembre (aucun changement d'heure).
const MON = '2026-11-02', TUE = '2026-11-03', WED = '2026-11-04', THU = '2026-11-05', FRI = '2026-11-06', SAT = '2026-11-07';
const PREV_THU = '2026-10-29', PREV_FRI = '2026-10-30';

describe('SM-2 à SM-5 : carte et jours proposés', () => {
  const p2 = program([0, 3]); // lundi A, jeudi B
  const p3 = program([0, 2, 4]); // lundi A, mercredi B, vendredi C

  it('E1 : 2 jours, lundi manqué, ouverture mardi : carte « lundi », A, jours proposés [mardi]', () => {
    const s = [done(p2, 1, PREV_THU)];
    expect(missedDays(p2, s, [], TUE)).toEqual([MON]);
    const card = missedCard(ctx(p2, s, at(TUE, 9)));
    expect(card).toEqual({ day: MON, dayIndex: 0, nom: 'A', jour: 'lundi', jours: [TUE] });
    expect(MISSED_TEXT.t1(card!.jour)).toBe("Ta séance de lundi n'a pas eu lieu.");
  });

  it('E2 : E1 avec mardi bloqué : aucun jour, « Décaler » absent (T-11)', () => {
    const card = missedCard(ctx(p2, [done(p2, 1, PREV_THU)], at(TUE, 9), { profile: { blockedWeekdays: [1], daysPerWeek: 2, pregnancy: null } }));
    expect(card?.jours).toEqual([]);
  });

  it('E3 : 3 jours, lundi manqué, ouverture mardi : carte, aucun jour (mercredi planifié à 1 jour)', () => {
    const card = missedCard(ctx(p3, [done(p3, 2, PREV_FRI)], at(TUE, 9)));
    expect(card?.day).toBe(MON);
    expect(card?.jours).toEqual([]);
  });

  it('E4 : lundi et mercredi faits, vendredi manqué, ouverture samedi : C, [samedi] (dimanche à 1 jour du lundi suivant)', () => {
    const s = [done(p3, 0, MON), done(p3, 1, WED)];
    expect(missedDays(p3, s, [], SAT)).toEqual([FRI]);
    expect(missedCard(ctx(p3, s, at(SAT, 9)))).toEqual({ day: FRI, dayIndex: 2, nom: 'C', jour: 'vendredi', jours: [SAT] });
  });

  it('E5 : « Décaler » lundi -> mardi : lignes O et N, calendrier, rotation après la séance faite le mardi', () => {
    const [o, n] = postponeRows(p2, 0, MON, TUE, at(TUE, 9).toISOString());
    expect(o).toMatchObject({ status: 'reportee', plannedDate: MON, programDayIndex: 0, originDate: MON, postponedTo: TUE });
    expect(o.decidedAt).toBeTruthy();
    expect(n).toMatchObject({ status: 'prevue', plannedDate: TUE, programDayIndex: 0, originDate: MON, dejaDecalee: true });
    expect(withAnswer(p2, MON, 'decaler', 'x')[MON].reponse).toBe('decaler');
    const base = [done(p2, 1, PREV_THU)];
    const sO = fromRow(o), sN = fromRow(n);
    const s = [...base, sO, sN];
    const entries = buildEntries(s, []);
    const planned = new Set(plannedDates([0, 3], '2026-09-01', '2026-11-15'));
    const shifted = shiftedDays(p2, s);
    expect(dayMark(entries, MON)).toBe('reportee');
    expect(MARK_TEXT.reportee).toBe('Reportée');
    expect(MARK_GLYPH.reportee).toBe('↷');
    expect(plannedMark(TUE, planned, entries, TUE, shifted)).toBe('prevue');
    expect(nextSession(p2, s, at(TUE, 9).getTime())?.scheduledToday).toBe(true);
    expect(missedCard(ctx(p2, s, at(TUE, 10)))).toBeNull(); // missedAnswers + R = lundi
    // La séance A est faite le mardi (ligne N réutilisée).
    const doneN = { ...sN, status: 'faite' as const, startedAt: at(TUE, 18).toISOString(), endedAt: at(TUE, 19).toISOString(), plan: p2.days[0] };
    const after = [...base, sO, doneN];
    expect(nextSession(p2, after, at(WED, 9).getTime())?.dayIndex).toBe(1);
    expect(dayMark(buildEntries(after, []), MON)).toBe('reportee');
  });

  it('E6 : E5 sans séance le mardi, ouverture mercredi : mardi « Non faite », lundi « Reportée », aucune carte, A reste la prochaine', () => {
    const [o, n] = postponeRows(p2, 0, MON, TUE, at(TUE, 9).toISOString());
    const s = [done(p2, 1, PREV_THU), fromRow(o), fromRow(n)];
    const entries = buildEntries(s, []);
    const planned = new Set(plannedDates([0, 3], '2026-09-01', '2026-11-15'));
    expect(plannedMark(TUE, planned, entries, WED, shiftedDays(p2, s))).toBe('non_faite');
    expect(dayMark(entries, MON)).toBe('reportee');
    expect(missedDays(p2, s, [], WED)).toEqual([]);
    expect(missedCard(ctx(p2, s, at(WED, 9)))).toBeNull();
    expect(nextSession(p2, s, at(WED, 9).getTime())?.dayIndex).toBe(0);
  });

  it('E7 : « La faire quand je peux » : seule la réponse est écrite, carte non réaffichée, A reste la prochaine, lundi « Non faite »', () => {
    const s = [done(p2, 1, PREV_THU)];
    const p = { ...p2, missedAnswers: withAnswer(p2, MON, 'quand_je_peux', at(TUE, 9).toISOString()) };
    expect(missedCard(ctx(p, s, at(WED, 9)))).toBeNull();
    expect(nextSession(p, s, at(WED, 9).getTime())?.dayIndex).toBe(0);
    const planned = new Set(plannedDates([0, 3], '2026-09-01', '2026-11-15'));
    expect(plannedMark(MON, planned, buildEntries(s, []), WED)).toBe('non_faite');
  });

  it('E9 : « Sauter » confirmé : ligne sautee / renonce, « Sautée » (»), rotation vers B, T-10 puis T-12 (2 jours)', () => {
    const r = skipRow(p2, 0, MON, 'renonce', at(TUE, 9).toISOString());
    expect(r).toMatchObject({ status: 'sautee', endReason: 'renonce', plannedDate: MON, programDayIndex: 0, startedAt: null, endedAt: null });
    expect(r.decidedAt).toBeTruthy();
    const s = [done(p2, 1, PREV_THU), fromRow(r)];
    expect(dayMark(buildEntries(s, []), MON)).toBe('sautee_choix');
    expect(MARK_TEXT.sautee_choix).toBe('Sautée');
    expect(MARK_GLYPH.sautee_choix).toBe('»');
    expect(nextSession(p2, s, at(TUE, 10).getTime())?.dayIndex).toBe(1);
    expect(showT12(p2)).toBe(true);
    expect(showT12(p3)).toBe(false);
  });

  it('« Arrêtée » reste distincte de « Sautée » (abandon, symptôme)', () => {
    const s = [row({ status: 'sautee', endReason: 'abandon', plannedDate: MON, startedAt: at(MON, 18).toISOString(), endedAt: at(MON, 18, 20).toISOString() })];
    expect(dayMark(buildEntries(s, []), MON)).toBe('arretee');
  });

  it('E10 : 12 jours sans séance (dernière un samedi), ouverture jeudi : N = 5, aucune carte ; palier 1, -20 % puis -10 %, T-13 sans T-19', () => {
    const today = '2026-11-12';
    const s = [done(p3, 0, '2026-10-31')];
    expect(missedDays(p3, s, [], today)).toHaveLength(5);
    expect(missedCard(ctx(p3, s, at(today, 9)))).toBeNull();
    const last = lastMuscuKey(s);
    expect(joursAbsence(last, today)).toBe(12);
    const st = repriseAtStart(DEFAULT_REPRISE, 12, today, last);
    expect(st.state).toMatchObject({ palier: 1, actif: true, depuis: today, valables: 0 });
    expect(st.texts).toEqual([MISSED_TEXT.T13]);
    expect(repriseLoad(20, 1, 1, dumbbells)).toBe(16);
    expect(repriseLoad(20, 1, 2, dumbbells)).toBe(18);
    const { day: d } = applyRepriseToDay(p3.days[0], { start: st, sets: [set('old')], loadsFor: () => dumbbells });
    expect(d.exercises[0].sets).toBe(3); // aucun retrait de série au palier 1
    expect(d.exercises[0].startLoadKg).toBe(16);
    expect(d.exercises[0].reprise).toEqual({ calibration: true, noRaise: true, maxKg: null });
  });

  it('E11 : 40 jours, exercice « autre » 3 séries à 20 kg : palier 3, 14 / 16 / 18 kg, 2 séries, T-20 + T-19 une fois, puis fin de reprise', () => {
    const today = '2026-12-01';
    const old = done(p3, 0, '2026-10-22');
    const sets = [set(old.id, { completedAt: at('2026-10-22', 18, 10).toISOString() })];
    let st = repriseAtStart(DEFAULT_REPRISE, 40, today, '2026-10-22');
    expect(st.state.palier).toBe(3);
    expect(st.texts).toEqual([MISSED_TEXT.T20, MISSED_TEXT.T19]);
    expect(st.state.conseilVuLe).toBe(today);
    let r = applyRepriseToDay(p3.days[0], { start: st, sets, loadsFor: () => dumbbells });
    expect(r.day.exercises[0].startLoadKg).toBe(14);
    expect(r.day.exercises[0].sets).toBe(2);
    expect(r.day.estimatedMin).toBeLessThanOrEqual(45);
    let state = { ...st.state, refKg: r.refKg };
    // Séance 1 avec une douleur : non valable, la suivante reste à 14 kg.
    const s1pain = done(p3, 0, today, { plan: r.day });
    const painSets = [set(s1pain.id, { loadKg: 14, pain: true, completedAt: at(today, 18, 10).toISOString() })];
    const afterPain = repriseAtEnd(state, s1pain, painSets);
    expect(afterPain.valables).toBe(0);
    st = repriseAtStart(afterPain, 0, '2026-12-03', today);
    expect(st.texts).toEqual([]);
    r = applyRepriseToDay(p3.days[0], { start: st, sets: [...sets, ...painSets], loadsFor: () => dumbbells });
    expect(r.day.exercises[0].startLoadKg).toBe(14);
    // Trois séances valables : 14, 16, 18 kg.
    state = afterPain;
    const loads: number[] = [];
    let all = [...sets];
    for (let k = 0; k < 3; k++) {
      const key = addDays('2026-12-03', k * 2);
      const start = repriseAtStart(state, 2, key, k ? addDays(key, -2) : today);
      const ap = applyRepriseToDay(p3.days[0], { start, sets: all, loadsFor: () => dumbbells });
      loads.push(ap.day.exercises[0].startLoadKg!);
      const sess = done(p3, 0, key, { plan: ap.day });
      const ss = [set(sess.id, { loadKg: ap.day.exercises[0].startLoadKg, isCalibration: true, completedAt: at(key, 18, 10).toISOString() })];
      all = [...all, ...ss];
      state = repriseAtEnd({ ...start.state, refKg: ap.refKg }, sess, ss);
    }
    expect(loads).toEqual([14, 16, 18]);
    expect(state.valables).toBe(3);
    expect(state.actif).toBe(false);
    expect(state.refKg).toEqual({});
    // Séance 4 : hors reprise, rien n'est changé (progression normale depuis la charge finale, pas de retour à 20 kg ici).
    const st4 = repriseAtStart(state, 2, '2026-12-09', '2026-12-07');
    expect(st4.state.actif).toBe(false);
    expect(applyRepriseToDay(p3.days[0], { start: st4, sets: all, loadsFor: () => dumbbells }).day).toBe(p3.days[0]);
  });

  it('E12 : séance terminée sur un symptôme : aucune carte (grossesse ou non), sécurité à lire, plancher 2', () => {
    const sym = row({ programDayIndex: 0, plannedDate: MON, status: 'sautee', endReason: 'symptome', startedAt: at(MON, 18).toISOString(), endedAt: at(MON, 18, 30).toISOString(), plan: p3.days[0] });
    const st = repriseAtEnd(DEFAULT_REPRISE, sym, []);
    expect(st).toMatchObject({ securiteALire: true, palierMin: 2 });
    for (const pregnancy of [null, 'enceinte'] as const) {
      expect(missedCard(ctx(p3, [sym], at(THU, 9), { profile: { blockedWeekdays: [], daysPerWeek: 3, pregnancy, reprise: st } }))).toBeNull();
    }
  });

  it('E13 : séance faite avec une série douloureuse : N = 1 mais aucune carte ; palier 0', () => {
    const s = done(p3, 0, MON);
    const sets = [set(s.id, { pain: true })];
    expect(missedDays(p3, [s], sets, THU)).toEqual([WED]);
    expect(missedCard(ctx(p3, [s], at(THU, 9), { sets }))).toBeNull();
    expect(palierFromDays(3)).toBe(0);
  });

  it('E14 : symptôme lundi, bouton T-22 pressé, démarrage mercredi : palier 2 imposé, -20 %, T-14', () => {
    const sun = '2026-11-01';
    const sym = row({ programDayIndex: 0, plannedDate: MON, status: 'sautee', endReason: 'symptome', startedAt: at(MON, 18).toISOString(), endedAt: at(MON, 18, 30).toISOString(), plan: p3.days[0] });
    let st = repriseAtEnd(DEFAULT_REPRISE, sym, []);
    expect(missedCard(ctx(p3, [done(p3, 2, sun), sym], at(WED, 9), { profile: { blockedWeekdays: [], daysPerWeek: 3, pregnancy: null, reprise: st } }))).toBeNull();
    st = onSecurityAck(st);
    expect(st.securiteALire).toBe(false);
    const sessions = [done(p3, 2, sun), sym];
    const j = joursAbsence(lastMuscuKey(sessions), WED);
    expect(j).toBe(3);
    const start = repriseAtStart(st, j, WED, sun);
    expect(start.state).toMatchObject({ palier: 2, actif: true, valables: 0, palierMin: 0 });
    expect(start.texts).toEqual([MISSED_TEXT.T14]);
    expect(repriseLoad(20, 2, 1, dumbbells)).toBe(16);
  });

  it('E15 : grossesse cochée : aucune carte, rotation inchangée', () => {
    const s = [done(p3, 0, MON)];
    expect(missedDays(p3, s, [], THU)).toEqual([WED]);
    expect(missedCard(ctx(p3, s, at(THU, 9), { profile: { blockedWeekdays: [], daysPerWeek: 3, pregnancy: 'enceinte' } }))).toBeNull();
    expect(missedCard(ctx(p3, s, at(THU, 9), { profile: { blockedWeekdays: [], daysPerWeek: 3, pregnancy: 'post_partum' } }))).toBeNull();
    expect(nextSession(p3, s, at(THU, 9).getTime())?.dayIndex).toBe(1);
  });

  it('E16 : grossesse, débutante, 40 jours : 1 série gardée (G5 l’emporte sur K5), charge = min(14 kg, plafond G5)', () => {
    const st = repriseAtStart(DEFAULT_REPRISE, 40, '2026-12-01', '2026-10-22');
    const g5 = { ...p3.days[0], exercises: [exo({ sets: 1, capped: true, startLoadKg: 10 })] };
    const r = applyRepriseToDay(g5, { start: st, sets: [set('old')], loadsFor: () => dumbbells });
    expect(r.day.exercises[0].sets).toBe(1);
    expect(r.day.exercises[0].startLoadKg).toBe(10);
    expect(st.texts).toEqual([MISSED_TEXT.T20, MISSED_TEXT.T19]);
    expect(st.texts.join(' ')).not.toMatch(/grossesse|enceinte/i);
  });

  it('E17 : 16 jours, « autre » 3 séries à 20 kg : palier 2, 16 kg puis 18 kg, 2 séries, T-14', () => {
    const st = repriseAtStart(DEFAULT_REPRISE, 16, '2026-11-20', '2026-11-04');
    expect(st.state.palier).toBe(2);
    expect(st.texts).toEqual([MISSED_TEXT.T14]);
    const r1 = applyRepriseToDay(p3.days[0], { start: st, sets: [set('old')], loadsFor: () => dumbbells });
    expect([r1.day.exercises[0].startLoadKg, r1.day.exercises[0].sets]).toEqual([16, 2]);
    const st2 = repriseAtStart({ ...st.state, valables: 1, refKg: r1.refKg }, 2, '2026-11-22', '2026-11-20');
    const r2 = applyRepriseToDay(p3.days[0], { start: st2, sets: [set('old'), set('r1', { loadKg: 16, completedAt: '2026-11-20T17:10:00.000Z' })], loadsFor: () => dumbbells });
    expect([r2.day.exercises[0].startLoadKg, r2.day.exercises[0].sets]).toEqual([18, 2]);
  });

  it('pilier jamais réduit, jamais sous 2 séries, cardio inchangé', () => {
    const st = repriseAtStart(DEFAULT_REPRISE, 20, '2026-11-20', '2026-10-31');
    const d = { ...p3.days[0], exercises: [exo({ role: 'pilier', sets: 3 }), exo({ sets: 2 }), exo({ role: 'cardio', sets: 1, startLoadKg: null, unit: 'sec', holdSec: 600 })] };
    const r = applyRepriseToDay(d, { start: st, sets: [], loadsFor: () => dumbbells });
    expect(r.day.exercises.map((e) => e.sets)).toEqual([3, 2, 1]);
    expect(r.day.exercises[2]).toBe(d.exercises[2]);
    expect(r.day.exercises[0].startLoadKg).toBe(2); // C0 inconnue : charge légère
  });

  it('E18 : 30 jours : T-20 et T-19 une seule fois, les séances suivantes n’affichent plus rien', () => {
    const st = repriseAtStart(DEFAULT_REPRISE, 30, '2026-11-30', '2026-10-31');
    expect(st.state.palier).toBe(3);
    expect(st.texts).toEqual([MISSED_TEXT.T20, MISSED_TEXT.T19]);
    expect(repriseAtStart({ ...st.state, valables: 1 }, 2, '2026-12-02', '2026-11-30').texts).toEqual([]);
  });

  it('E19 : « Je ne me sens pas bien » mardi : aucune carte mercredi ni jeudi ; jeudi palier 2, T-14 + T-19 ; lundi « Sautée »', () => {
    const base = [done(p3, 2, PREV_FRI)];
    const r = skipRow(p3, 0, MON, 'pas_bien', at(TUE, 9).toISOString());
    expect(r).toMatchObject({ status: 'sautee', endReason: 'pas_bien', plannedDate: MON, programDayIndex: 0 });
    const s = [...base, fromRow(r)];
    const p = { ...p3, missedAnswers: withAnswer(p3, MON, 'sauter', at(TUE, 9).toISOString()) };
    const st = onPasBien(DEFAULT_REPRISE);
    expect(st).toMatchObject({ palierMin: 2, apresMalaise: true });
    const prof = { blockedWeekdays: [], daysPerWeek: 3, pregnancy: null, reprise: st };
    expect(missedDays(p, s, [], WED)).toEqual([]);
    expect(missedCard(ctx(p, s, at(WED, 9), { profile: prof }))).toBeNull();
    expect(missedDays(p, s, [], THU)).toEqual([WED]);
    expect(missedCard(ctx(p, s, at(THU, 9), { profile: prof }))).toBeNull();
    // même sans le drapeau, la ligne la plus récente « pas_bien » suffit
    expect(missedCard(ctx(p, s, at(THU, 9)))).toBeNull();
    const j = joursAbsence(lastMuscuKey(s), THU);
    expect(j).toBe(6);
    const start = repriseAtStart(st, j, THU, PREV_FRI);
    expect(start.state).toMatchObject({ palier: 2, actif: true, palierMin: 0, apresMalaise: false, conseilVuLe: THU });
    expect(start.texts).toEqual([MISSED_TEXT.T14, MISSED_TEXT.T19]);
    expect(dayMark(buildEntries(s, []), MON)).toBe('sautee_choix');
  });

  it('E20 : aucun texte ne contient un mot interdit ni un émoji', () => {
    const banned = ['raté', 'ratée', 'ratés', 'retard', 'rattraper', 'échec', 'pas de souci', "ce n'est pas grave", 'vite', 'normal', 'normale', 'courage', 'guéri', 'récupéré', 'sans risque', 'tu peux reprendre', 'tu dois', 'il faut', 'content de te revoir', 'prêt·e'];
    for (const t of allMissedTexts()) {
      for (const w of banned) expect(new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'iu').test(t), `${w} dans « ${t} »`).toBe(false);
      expect(/\p{Extended_Pictographic}/u.test(t)).toBe(false);
    }
  });

  it('E21 : « quand je peux » lundi, A faite mercredi, vendredi manqué : carte « vendredi » avec B (rotation), [samedi]', () => {
    const p = { ...p3, missedAnswers: withAnswer(p3, MON, 'quand_je_peux', 'x') };
    const s = [done(p, 0, WED)];
    expect(missedCard(ctx(p, s, at(SAT, 9)))).toEqual({ day: FRI, dayIndex: 1, nom: 'B', jour: 'vendredi', jours: [SAT] });
  });

  it('E22 : reprise palier 2 active, 1 valable, 2 jours d’absence : état inchangé, 18 kg, aucun message', () => {
    const st0: RepriseState = { ...DEFAULT_REPRISE, palier: 2, actif: true, valables: 1, msgVu: true, refKg: { v: 20 } };
    const st = repriseAtStart(st0, 2, '2026-11-22', '2026-11-20');
    expect(st.state.valables).toBe(1);
    expect(st.created).toBe(false);
    expect(st.texts).toEqual([]);
    const r = applyRepriseToDay(p3.days[0], { start: st, sets: [set('r1', { loadKg: 16 })], loadsFor: () => dumbbells });
    expect(r.day.exercises[0].startLoadKg).toBe(18);
  });

  it('E23 : séance de reprise dont toutes les séries sont d’étalonnage : valable', () => {
    const s = done(p3, 0, MON);
    const sets = [set(s.id, { isCalibration: true }), set(s.id, { isCalibration: true, setIndex: 1 })];
    expect(isValidRepriseSession(s, sets)).toBe(true);
    expect(repriseAtEnd({ ...DEFAULT_REPRISE, palier: 2, actif: true }, s, sets).valables).toBe(1);
    // séries d'échauffement seules : pas valable ; symptôme : pas valable
    expect(isValidRepriseSession(s, [set(s.id, { isWarmup: true })])).toBe(false);
    expect(isValidRepriseSession({ ...s, endReason: 'symptome' }, sets)).toBe(false);
  });

  it('E24 : « Sauter » depuis l’aperçu de B un mardi : ligne du jour, rotation vers C, aucune carte ensuite', () => {
    const s0 = [done(p3, 0, MON)];
    const r = skipRow(p3, 1, TUE, 'renonce', at(TUE, 9).toISOString());
    expect(r).toMatchObject({ status: 'sautee', endReason: 'renonce', plannedDate: TUE, programDayIndex: 1 });
    const s = [...s0, fromRow(r)];
    expect(nextSession(p3, s, at(TUE, 10).getTime())?.dayIndex).toBe(2);
    expect(missedCard(ctx(p3, s, at(WED, 9)))).toBeNull();
  });

  it('E25 : malaise pendant une reprise déjà active : état inchangé, T-19 seul, même si déjà lu', () => {
    const st0: RepriseState = { ...DEFAULT_REPRISE, palier: 2, actif: true, valables: 1, msgVu: true, refKg: { v: 20 } };
    const today = '2026-11-20', last = '2026-11-16';
    const a = repriseAtStart(onPasBien(st0), 4, today, last);
    expect(a.created).toBe(false);
    expect(a.state).toMatchObject({ palier: 2, valables: 1, apresMalaise: false, palierMin: 0, conseilVuLe: today });
    expect(a.texts).toEqual([MISSED_TEXT.T19]);
    const b = repriseAtStart(onPasBien({ ...st0, conseilVuLe: last }), 4, today, last);
    expect(b.texts).toEqual([MISSED_TEXT.T19]);
    expect(b.state.conseilVuLe).toBe(today);
    const c = repriseAtStart({ ...st0, conseilVuLe: last }, 4, today, last);
    expect(c.texts).toEqual([]);
    expect(c.state.conseilVuLe).toBe(last);
  });

  it('T-19 non ré-affiché si déjà lu pendant la même absence (conseilVuLe >= dernière séance), sans malaise', () => {
    const st = repriseAtStart({ ...DEFAULT_REPRISE, conseilVuLe: '2026-10-25' }, 40, '2026-12-01', '2026-10-22');
    expect(st.texts).toEqual([MISSED_TEXT.T20]);
  });

  it('E26 : 400 jours : palier 4, C0 ignorée, étalonnage complet depuis la charge légère, T-15 + T-19', () => {
    const st = repriseAtStart(DEFAULT_REPRISE, 400, '2026-12-01', '2025-10-27');
    expect(st.state.palier).toBe(4);
    expect(st.c0Ignored).toBe(true);
    expect(st.texts).toEqual([MISSED_TEXT.T15, MISSED_TEXT.T19]);
    const r = applyRepriseToDay(p3.days[0], { start: st, sets: [set('old')], loadsFor: () => dumbbells });
    expect(r.refKg).toEqual({});
    expect(r.day.exercises[0].startLoadKg).toBe(2);
    expect(r.day.exercises[0].reprise).toEqual({ calibration: true, noRaise: false, maxKg: null });
  });

  it('E27 : palier 4, séance 1 : départ à la charge légère, plafond C0 20 kg ; séance 2 : charge finale, garder / descendre ; jamais de descenteKg', () => {
    const loads = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
    const st = repriseAtStart(DEFAULT_REPRISE, 60, '2026-12-01', '2026-10-02');
    const r = applyRepriseToDay(p3.days[0], { start: st, sets: [set('old')], loadsFor: () => loads });
    expect(r.day.exercises[0].startLoadKg).toBe(6);
    expect(r.day.exercises[0].reprise).toEqual({ calibration: true, noRaise: false, maxKg: 20 });
    const s1 = done(p3, 0, '2026-12-01', { plan: r.day });
    const s1sets = [set(s1.id, { loadKg: 20, isCalibration: true, completedAt: at('2026-12-01', 18, 30).toISOString() })];
    const end = repriseAtEnd({ ...st.state, refKg: r.refKg }, s1, s1sets);
    expect(end.descenteKg).toEqual({});
    const st2 = repriseAtStart(end, 2, '2026-12-03', '2026-12-01');
    const r2 = applyRepriseToDay(p3.days[0], { start: st2, sets: [set('old'), ...s1sets], loadsFor: () => loads });
    expect(r2.day.exercises[0].startLoadKg).toBe(20);
    expect(r2.day.exercises[0].reprise).toEqual({ calibration: true, noRaise: true, maxKg: null });
  });
});

describe('cas limites', () => {
  it('changement d’heure du 25/10/2026 : jours civils et 48 h réelles', () => {
    expect(joursAbsence('2026-10-24', '2026-10-26')).toBe(2);
    expect(joursAbsence('2026-10-15', '2026-10-25')).toBe(10);
    expect(palierFromDays(joursAbsence('2026-10-15', '2026-10-25'))).toBe(1);
    // Vendredi 23 à 22:00 -> dimanche 25 à 21:30 : 47 h 30 à l'horloge, mais 48 h 30 réelles (heure d'hiver).
    expect(realGapOk(new Date(2026, 9, 23, 22, 0).getTime(), new Date(2026, 9, 25, 21, 30).getTime())).toBe(true);
    expect(realGapOk(new Date(2026, 9, 23, 22, 0).getTime(), new Date(2026, 9, 25, 20, 30).getTime())).toBe(false);
    // Programme dimanche / mercredi : dimanche 25 manqué, ouverture lundi 26 : carte « dimanche ».
    const p = program([6, 2]);
    const card = missedCard(ctx(p, [done(p, 1, '2026-10-21')], at('2026-10-26', 9)));
    expect(card?.day).toBe('2026-10-25');
    expect(card?.jour).toBe('dimanche');
  });

  it('séance déjà décalée une fois : plus de « Décaler » pour elle', () => {
    const p2 = program([0, 3]);
    const [o, n] = postponeRows(p2, 0, MON, TUE, 'x');
    // La ligne N (A, mardi) est encore en attente ; un autre jour manqué plus tard ne propose pas de nouveau décalage de A.
    const s = [done(p2, 1, PREV_THU), fromRow(o), fromRow(n)];
    const card = missedCard(ctx({ ...p2, missedAnswers: withAnswer(p2, MON, 'decaler', 'x') }, s, at('2026-11-06', 9)));
    expect(card?.day).toBe(THU);
    expect(card?.dayIndex).toBe(0);
    expect(card?.jours).toEqual([]);
  });

  it('jamais deux séances le même jour, jamais à moins de 2 jours, plafond hebdomadaire et jours bloqués respectés', () => {
    const p3 = program([0, 2, 4]);
    for (const blocked of [[], [5], [5, 6]]) {
      const s = [done(p3, 0, MON), done(p3, 1, WED)];
      const card = missedCard(ctx(p3, s, at(SAT, 9), { profile: { blockedWeekdays: blocked, daysPerWeek: 3, pregnancy: null } }));
      for (const j of card?.jours ?? []) {
        expect(blocked).not.toContain((new Date(j).getDay() + 6) % 7);
        expect(s.some((x) => x.plannedDate === j)).toBe(false);
      }
    }
    // plafond : 2 séances par semaine demandées alors que lundi et mercredi sont faits -> aucun jour
    const s = [done(p3, 0, MON), done(p3, 1, WED)];
    expect(missedCard(ctx(p3, s, at(SAT, 9), { profile: { blockedWeekdays: [], daysPerWeek: 2, pregnancy: null } }))?.jours).toEqual([]);
  });

  it('« La faire quand je peux » ne change pas la rotation ; « Sauter » l’avance d’un cran', () => {
    const p3 = program([0, 2, 4]);
    const s = [done(p3, 0, MON)];
    expect(nextSession({ ...p3, missedAnswers: withAnswer(p3, WED, 'quand_je_peux', 'x') }, s, at(THU, 9).getTime())?.dayIndex).toBe(1);
    expect(nextSession(p3, [...s, fromRow(skipRow(p3, 1, WED, 'renonce', at(THU, 9).toISOString()))], at(THU, 10).getTime())?.dayIndex).toBe(2);
  });

  it('valables ne baisse jamais ; charge jamais au-dessus de C0 ; calcul en entiers (20 kg x 70 % = 14 kg)', () => {
    expect(repriseLoad(20, 3, 1, dumbbells)).toBe(14);
    expect(repriseLoad(20, 3, 1, [])).toBe(14);
    expect(repriseLoad(7, 1, 1, dumbbells)).toBe(4);
    expect(repriseLoad(3, 1, 1, [4, 6])).toBeLessThanOrEqual(3);
    const st = { ...DEFAULT_REPRISE, palier: 2 as const, actif: true, valables: 1 };
    const s = done(program([0]), 0, MON);
    expect(repriseAtEnd(st, s, [set(s.id, { pain: true })]).valables).toBe(1);
  });
});
