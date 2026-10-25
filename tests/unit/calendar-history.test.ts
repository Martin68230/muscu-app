// F7 : historique, calendrier, régularité. Heure LOCALE (Europe/Paris), semaine du lundi, changement d'heure du 25/10/2026.
(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'Europe/Paris';
import { describe, expect, it } from 'vitest';
import type { SetLog, WorkoutSession } from '../../src/data/model';
import {
  buildEntries, dateKey, dayDiff, dayMark, groupByMonth, isDone, mondayKey, monthSummary, regularity, relativeDay,
} from '../../src/session/calendar';

let n = 0;
function sess(startedAt: string, o: Partial<WorkoutSession> = {}): WorkoutSession {
  n++;
  return {
    id: `s${n}`, ownerId: 'u', createdAt: startedAt, updatedAt: startedAt, rev: 1, deletedAt: null, syncedAt: null,
    programId: 'p', programDayIndex: 0, plannedDate: startedAt.slice(0, 10), status: 'faite', startedAt,
    endedAt: new Date(Date.parse(startedAt) + 45 * 60000).toISOString(), note: '', endReason: 'terminee', plan: { dayIndex: 0, label: 'Haut du corps', exercises: [] },
    ...o,
  } as WorkoutSession;
}
function sets(sessionId: string, count: number, pain = false): SetLog[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${sessionId}-${i}`, sessionId, movementId: 'm', variantId: 'v', exerciseIndex: 0, setIndex: i, reps: 10, loadKg: 20, rir: 2,
    pain: pain && i === 0, comment: '', completedAt: '2026-10-20T10:00:00Z', targetRepsMin: 8, targetRepsMax: 12, deletedAt: null,
  })) as unknown as SetLog[];
}

describe('fuseau et changement d’heure', () => {
  it('le fuseau de test est Paris', () => {
    expect(new Date('2026-07-01T12:00:00Z').getTimezoneOffset()).toBe(-120);
    expect(new Date('2026-12-01T12:00:00Z').getTimezoneOffset()).toBe(-60);
  });
  it('jour local autour du passage à l’heure d’hiver (25/10/2026)', () => {
    // 02:30 heure d’été, 23:30 heure d’hiver : même jour ; 00:30 le 26 : jour suivant (en UTC ce serait le 25).
    expect(dateKey(new Date('2026-10-25T00:30:00Z'))).toBe('2026-10-25');
    expect(dateKey(new Date('2026-10-25T22:30:00Z'))).toBe('2026-10-25');
    expect(dateKey(new Date('2026-10-25T23:30:00Z'))).toBe('2026-10-26');
  });
  it('écarts en jours civils et semaines du lundi autour du 25/10/2026', () => {
    expect(dayDiff('2026-10-24', '2026-10-26')).toBe(2);
    expect(mondayKey(new Date(2026, 9, 25))).toBe('2026-10-19'); // dimanche de la semaine à 25 h
    expect(mondayKey(new Date(2026, 9, 26))).toBe('2026-10-26');
    expect(mondayKey(new Date(2026, 9, 19))).toBe('2026-10-19');
  });
  it('série de semaines sans trou à travers le changement d’heure', () => {
    const ss = [sess('2026-10-13T08:00:00Z'), sess('2026-10-20T08:00:00Z'), sess('2026-10-27T08:00:00Z')];
    const e = buildEntries(ss, ss.flatMap((s) => sets(s.id, 3)));
    expect(regularity(e, new Date(2026, 9, 28, 9), 3).streakWeeks).toBe(3);
    // la semaine du 26 sans séance ne casse pas la série tant qu’elle est en cours
    expect(regularity(buildEntries(ss.slice(0, 2), ss.slice(0, 2).flatMap((s) => sets(s.id, 3))), new Date(2026, 9, 26, 9), 3).streakWeeks).toBe(2);
  });
});

describe('entrées d’historique', () => {
  it('marques : faite, douleur, abandon, symptôme, reportée ; prévues et en cours exclues ; plus récent d’abord', () => {
    const a = sess('2026-10-01T08:00:00Z');
    const b = sess('2026-10-03T08:00:00Z');
    const c = sess('2026-10-05T08:00:00Z', { status: 'sautee', endReason: 'abandon' });
    const d = sess('2026-10-07T08:00:00Z', { status: 'sautee', endReason: 'symptome' });
    const r = sess('2026-10-09T08:00:00Z', { status: 'reportee', endReason: null });
    const p = sess('2026-10-11T08:00:00Z', { status: 'prevue', endReason: null });
    const x = sess('2026-10-12T08:00:00Z', { status: 'en_cours', endReason: null });
    const gone = sess('2026-10-13T08:00:00Z', { deletedAt: '2026-10-14T00:00:00Z' });
    const all = [...sets(a.id, 4), ...sets(b.id, 2, true), ...sets(d.id, 2)];
    const e = buildEntries([a, b, c, d, r, p, x, gone], all);
    expect(e.map((v) => v.mark)).toEqual(['reportee', 'symptome', 'arretee', 'douleur', 'faite']);
    expect(e[4]).toMatchObject({ setsDone: 4, durationMin: 45, label: 'Haut du corps' });
    // aucun chiffre de performance pour une séance arrêtée
    expect(e[1]).toMatchObject({ setsDone: 0, durationMin: null });
    expect(e[2]).toMatchObject({ setsDone: 0, durationMin: null });
  });
  it('une séance « faite » sans aucune série est traitée comme arrêtée', () => {
    expect(buildEntries([sess('2026-10-01T08:00:00Z')], [])[0].mark).toBe('arretee');
  });
  it('regroupement par mois, mois récents d’abord', () => {
    const ss = [sess('2026-09-30T08:00:00Z'), sess('2026-10-02T08:00:00Z'), sess('2026-10-20T08:00:00Z')];
    const g = groupByMonth(buildEntries(ss, ss.flatMap((s) => sets(s.id, 1))));
    expect(g.map((m) => [m.month, m.entries.length])).toEqual([['2026-10', 2], ['2026-09', 1]]);
  });
  it('statut d’un jour : la sécurité l’emporte, plusieurs séances un même jour', () => {
    const a = sess('2026-10-05T07:00:00Z');
    const b = sess('2026-10-05T16:00:00Z');
    const e = buildEntries([a, b], [...sets(a.id, 3), ...sets(b.id, 3, true)]);
    expect(dayMark(e, '2026-10-05')).toBe('douleur');
    expect(dayMark(e, '2026-10-06')).toBeNull();
  });
});

describe('synthèse du mois', () => {
  const ss = [sess('2026-10-05T07:00:00Z'), sess('2026-10-05T16:00:00Z'), sess('2026-10-12T07:00:00Z'), sess('2026-10-14T07:00:00Z', { status: 'sautee', endReason: 'abandon' })];
  const e = buildEntries(ss, ss.flatMap((s) => sets(s.id, 3)));
  it('deux séances le même jour comptent une fois ; l’abandon ne compte pas', () => {
    expect(monthSummary(e, 2026, 9, { daysPerWeek: 3, startKey: '2026-10-01', today: new Date(2026, 9, 31) }).done).toBe(2);
  });
  it('prévues = jours/semaine proportionnels, depuis le début de l’usage, jusqu’à aujourd’hui', () => {
    expect(monthSummary(e, 2026, 9, { daysPerWeek: 3, startKey: '2026-10-01', today: new Date(2026, 9, 31) }).planned).toBe(13); // 31 j x 3 / 7
    expect(monthSummary(e, 2026, 9, { daysPerWeek: 3, startKey: '2026-10-01', today: new Date(2026, 9, 14) }).planned).toBe(6); // 14 j
    expect(monthSummary(e, 2026, 9, { daysPerWeek: 3, startKey: '2026-10-22', today: new Date(2026, 9, 31) }).planned).toBe(4); // 10 j
  });
  it('inconnu avant le début, dans le futur ou sans jours par semaine : null (pas de pourcentage)', () => {
    expect(monthSummary(e, 2026, 8, { daysPerWeek: 3, startKey: '2026-10-01', today: new Date(2026, 9, 31) }).planned).toBeNull();
    expect(monthSummary(e, 2026, 10, { daysPerWeek: 3, startKey: '2026-10-01', today: new Date(2026, 9, 31) }).planned).toBeNull();
    expect(monthSummary(e, 2026, 9, { daysPerWeek: null, startKey: '2026-10-01', today: new Date(2026, 9, 31) }).planned).toBeNull();
  });
});

describe('régularité hebdomadaire', () => {
  const today = new Date(2026, 9, 28, 12); // mercredi
  it('aucune séance : rien de chiffré', () => {
    const r = regularity([], today, 3);
    expect(r).toMatchObject({ hasAny: false, doneThisWeek: 0, streakWeeks: 0, lastKey: null });
  });
  it('compte les jours (pas les séances) de la semaine du lundi, séance du dimanche précédent exclue', () => {
    const ss = [sess('2026-10-25T20:00:00Z'), sess('2026-10-26T07:00:00Z'), sess('2026-10-26T17:00:00Z'), sess('2026-10-28T07:00:00Z')];
    const r = regularity(buildEntries(ss, ss.flatMap((s) => sets(s.id, 2))), today, 3);
    expect(r.doneThisWeek).toBe(2); // lundi 26 (deux séances) et mercredi 28
    expect(r.streakWeeks).toBe(2); // semaine du 19 (dimanche 25) et semaine du 26
    expect(r.plannedPerWeek).toBe(3);
    expect(r.lastKey).toBe('2026-10-28');
  });
  it('un abandon ou un symptôme ne compte pas ; une semaine vide interrompt la série', () => {
    const ss = [sess('2026-10-28T07:00:00Z', { status: 'sautee', endReason: 'abandon' }), sess('2026-10-13T07:00:00Z')];
    const e = buildEntries(ss, ss.flatMap((s) => sets(s.id, 2)));
    const r = regularity(e, today, null);
    expect(r.doneThisWeek).toBe(0);
    expect(r.streakWeeks).toBe(0); // semaines du 26 et du 19 sans séance faite
    expect(r.plannedPerWeek).toBeNull();
    expect(e.filter(isDone).length).toBe(1);
  });
  it('dates relatives', () => {
    expect(relativeDay('2026-10-28', today)).toBe('aujourd’hui');
    expect(relativeDay('2026-10-27', today)).toBe('hier');
    expect(relativeDay('2026-10-24', today)).toBe('il y a 4 jours');
    expect(relativeDay('2026-10-07', today)).toBe('il y a 3 semaines');
  });
});
