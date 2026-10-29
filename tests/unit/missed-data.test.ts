// Séance manquée, étape 1 : modèle de données (seance-manquee-v1.md section D), validation et anciennes sauvegardes.
import { describe, expect, it } from 'vitest';
import { create, list, update } from '../../src/data/repo';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { exportData, importData, wipeAllData } from '../../src/data/backup';
import { validateRow } from '../../src/data/validate';
import { DEFAULT_REPRISE, repriseOf } from '../../src/session/missed-config';

const base = (id: string) => ({ id, ownerId: 'u', createdAt: '2026-10-01T10:00:00.000Z', updatedAt: '2026-10-01T10:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null });
const session = (extra: Record<string, unknown> = {}) => ({
  ...base('s1'), programId: 'p', programDayIndex: 0, plannedDate: '2026-10-26', status: 'sautee', startedAt: null, endedAt: null, note: '', ...extra,
});

describe('modèle « séance manquée » (SM-D1 à SM-D4)', () => {
  it('ancienne séance sans les nouveaux champs : valide', () => {
    expect(validateRow('sessions', session({ status: 'faite' }))).toEqual([]);
  });

  it('nouvelles raisons et champs de décalage : valides', () => {
    expect(validateRow('sessions', session({ endReason: 'renonce', decidedAt: '2026-10-27T08:00:00.000Z' }))).toEqual([]);
    expect(validateRow('sessions', session({ endReason: 'pas_bien', decidedAt: '2026-10-27T08:00:00.000Z' }))).toEqual([]);
    expect(validateRow('sessions', session({ status: 'reportee', originDate: '2026-10-26', postponedTo: '2026-10-27', decidedAt: '2026-10-27T08:00:00.000Z' }))).toEqual([]);
    expect(validateRow('sessions', session({ status: 'prevue', plannedDate: '2026-10-27', originDate: '2026-10-26', dejaDecalee: true }))).toEqual([]);
  });

  it('raison, statut ou date inconnus : refusés', () => {
    expect(validateRow('sessions', session({ endReason: 'flemme' })).length).toBeGreaterThan(0);
    expect(validateRow('sessions', session({ status: 'ratee' })).length).toBeGreaterThan(0);
    expect(validateRow('sessions', session({ originDate: 'lundi' })).length).toBeGreaterThan(0);
    expect(validateRow('sessions', session({ dejaDecalee: 'oui' })).length).toBeGreaterThan(0);
  });

  it('réponses à la carte (missedAnswers) : format vérifié', () => {
    const prog = { ...base('p'), templateKey: null, name: 'P', split: 'corps_entier', startDate: '2026-10-01', weeks: 4, active: true, days: [] };
    expect(validateRow('programs', prog)).toEqual([]);
    expect(validateRow('programs', { ...prog, missedAnswers: { '2026-10-26': { reponse: 'decaler', at: '2026-10-27T08:00:00.000Z' } } })).toEqual([]);
    expect(validateRow('programs', { ...prog, missedAnswers: { '2026-10-26': { reponse: 'oublier', at: 'x' } } }).length).toBe(1);
    expect(validateRow('programs', { ...prog, missedAnswers: { lundi: { reponse: 'sauter', at: 'x' } } }).length).toBe(1);
  });

  it('état de reprise : valeurs permises seulement', () => {
    const prof = {
      ...base('pr'), displayName: '', adultConfirmedAt: null, healthDisclaimerAcceptedAt: null, level: null, daysPerWeek: 3, blockedWeekdays: [],
      sessionDurationMin: null, sports: [], heightCm: null, aiEnabled: false,
    };
    expect(validateRow('profile', prof)).toEqual([]);
    expect(validateRow('profile', { ...prof, reprise: { ...DEFAULT_REPRISE, palier: 2, actif: true, refKg: { v: 20 } } })).toEqual([]);
    expect(validateRow('profile', { ...prof, reprise: { palier: 7 } }).length).toBe(1);
    expect(validateRow('profile', { ...prof, reprise: { palierMin: 1 } }).length).toBe(1);
    expect(validateRow('profile', { ...prof, reprise: { refKg: { v: -3 } } }).length).toBe(1);
    expect(validateRow('profile', { ...prof, reprise: { depuis: 'hier' } }).length).toBe(1);
  });

  it('repriseOf : valeur par défaut pour une ancienne sauvegarde, champs manquants complétés', () => {
    expect(repriseOf({})).toEqual(DEFAULT_REPRISE);
    expect(repriseOf(null)).toEqual(DEFAULT_REPRISE);
    const r = repriseOf({ reprise: { palier: 2, actif: true } });
    expect(r).toEqual({ ...DEFAULT_REPRISE, palier: 2, actif: true });
    r.refKg.x = 1;
    expect(DEFAULT_REPRISE.refKg).toEqual({});
  });

  it('export puis import : séance sautée, décalage et reprise conservés', async () => {
    const p = await ensureLocalUser();
    await update('profile', p.id, { reprise: { ...DEFAULT_REPRISE, palier: 2, actif: true, palierMin: 2, apresMalaise: true } });
    await create('sessions', {
      programId: 'p', programDayIndex: 0, plannedDate: '2026-10-26', status: 'reportee', startedAt: null, endedAt: null, note: '',
      originDate: '2026-10-26', postponedTo: '2026-10-27', decidedAt: '2026-10-27T08:00:00.000Z',
    });
    const file = await exportData();
    await wipeAllData();
    const res = await importData(JSON.parse(JSON.stringify(file)));
    expect(res.ok).toBe(true);
    const [prof] = await list('profile');
    expect(prof.reprise?.palier).toBe(2);
    expect(prof.reprise?.apresMalaise).toBe(true);
    const [s] = await list('sessions');
    expect(s.postponedTo).toBe('2026-10-27');
  });
});
