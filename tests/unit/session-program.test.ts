import { describe, expect, it } from 'vitest';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { create, list, update } from '../../src/data/repo';
import { importData, exportData } from '../../src/data/backup';
import type { Program, WorkoutSession } from '../../src/data/model';
import { computeInputsHash, ensureActiveProgram, getActiveProgram, nextSession, programPreview } from '../../src/session/program';
import { FICHES, mk, PROFILES } from './generator-helpers';

const MON = Date.parse('2026-10-26T08:00:00.000Z'); // lundi

async function seedProfile(over: { days?: number; level?: 'debutant' | 'intermediaire' | 'avance'; complete?: boolean } = {}) {
  const profile = await ensureLocalUser();
  await update('profile', profile.id, {
    level: over.level ?? 'intermediaire', daysPerWeek: over.days ?? 3, sessionDurationMin: 45, place: 'maison',
    profileCompletedAt: over.complete === false ? null : '2026-10-20T10:00:00.000Z',
  });
  const [eq] = await list('equipment');
  await update('equipment', eq.id, { preset: 'perso', tags: PROFILES.C.tags, dumbbellWeightsKg: [2, 4, 6, 8, 10] });
  await create('goals', { goalKey: 'muscle', rank: 1 });
  return { profile, eqId: eq.id };
}

describe('programme actif', () => {
  it('profil incomplet : pas de programme', async () => {
    await seedProfile({ complete: false });
    const r = await ensureActiveProgram(FICHES);
    expect(r).toMatchObject({ ok: false, code: 'PROFIL' });
  });

  it('génère et enregistre un seul programme actif, avec empreinte, explication de 2 lignes, durée et messages', async () => {
    await seedProfile();
    const r = await ensureActiveProgram(FICHES, { todayIso: '2026-10-26' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.regenerated).toBe(true);
    const p = r.program;
    expect(p.active).toBe(true);
    expect(p.days).toHaveLength(3);
    expect(p.inputsHash).toMatch(/^[0-9a-f]+$/);
    expect(p.explanation).toHaveLength(2);
    expect(p.days[0].estimatedMin).toBeGreaterThan(0);
    expect(p.days[0].warmup).toBeDefined();
    expect(Array.isArray(p.messages)).toBe(true);
    expect(programPreview(p).days).toHaveLength(3);
    expect(await list('programs')).toHaveLength(1);
  });

  it('mêmes entrées : le programme enregistré est rendu sans régénération', async () => {
    await seedProfile();
    const a = await ensureActiveProgram(FICHES);
    const b = await ensureActiveProgram(FICHES);
    expect(a.ok && b.ok && !b.regenerated && b.program.id === a.program.id).toBe(true);
    expect(await list('programs')).toHaveLength(1);
  });

  it('le profil change (niveau, matériel, blessure, jours) : régénération, l’ancien programme est gardé mais inactif', async () => {
    const { profile, eqId } = await seedProfile();
    const first = await ensureActiveProgram(FICHES);
    if (!first.ok) throw new Error('attendu ok');

    await update('profile', profile.id, { level: 'debutant' });
    const second = await ensureActiveProgram(FICHES);
    expect(second.ok && second.regenerated).toBe(true);

    await update('equipment', eqId, { tags: PROFILES.A.tags });
    const third = await ensureActiveProgram(FICHES);
    expect(third.ok && third.regenerated).toBe(true);

    await create('injuries', { zone: 'genou', side: null, level: 3, note: '', active: true });
    const fourth = await ensureActiveProgram(FICHES);
    expect(fourth.ok && fourth.regenerated).toBe(true);

    const all = await list('programs');
    expect(all).toHaveLength(4);
    expect(all.filter((p) => p.active)).toHaveLength(1);
    expect((await getActiveProgram())?.id).toBe(fourth.ok ? fourth.program.id : '');
    const hashes = new Set(all.map((p) => p.inputsHash));
    expect(hashes.size).toBe(4);
  });

  it('jours non gérés (4 par semaine) : aucun programme actif, message clair', async () => {
    const { profile } = await seedProfile();
    await ensureActiveProgram(FICHES);
    await update('profile', profile.id, { daysPerWeek: 4 });
    const r = await ensureActiveProgram(FICHES);
    expect(r).toMatchObject({ ok: false, code: 'HORS' });
    expect(r.ok ? [] : r.messages.map((m) => m.id)).toContain('V-MSG-HORS');
    expect(await getActiveProgram()).toBeUndefined();
  });

  it('empreinte stable : l’ordre des listes ne compte pas, un champ qui compte la change', () => {
    const a = mk({ profile: 'C', blocked: [5, 6] });
    const b = mk({ profile: 'C', blocked: [6, 5] });
    expect(computeInputsHash(a)).toBe(computeInputsHash(b));
    expect(computeInputsHash(mk({ profile: 'C', days: 2 }))).not.toBe(computeInputsHash(a));
    expect(computeInputsHash(mk({ profile: 'C', preg: 'enceinte' }))).not.toBe(computeInputsHash(a));
    expect(computeInputsHash(mk({ profile: 'C', injuries: [['genou', 1]] }))).not.toBe(computeInputsHash(a));
  });

  it('une sauvegarde avec programme (nouveaux champs) s’exporte et se réimporte ; une ancienne sans ces champs reste valide', async () => {
    await seedProfile();
    await ensureActiveProgram(FICHES);
    const file = await exportData();
    expect((await importData(file)).ok).toBe(true);
    const old = structuredClone(file);
    for (const p of old.data.programs) {
      delete (p as Partial<Program>).inputsHash;
      delete (p as Partial<Program>).explanation;
      delete (p as Partial<Program>).messages;
    }
    expect((await importData(old)).ok).toBe(true);
  });
});

describe('séance du jour (rotation A, B, C)', () => {
  const prog = (n = 3): Program => ({
    id: 'p1', days: Array.from({ length: n }, (_v, i) => ({ dayIndex: i, label: `Séance ${'ABC'[i]}`, exercises: [], weekday: [0, 2, 4][i] })),
  } as unknown as Program);
  const done = (dayIndex: number, endedAt: string, status: WorkoutSession['status'] = 'faite', programId = 'p1'): WorkoutSession =>
    ({ id: `s${dayIndex}${endedAt}`, programId, programDayIndex: dayIndex, status, endedAt, startedAt: endedAt, plannedDate: endedAt.slice(0, 10), deletedAt: null } as WorkoutSession);

  it('première séance : A ; puis B, C, A dans l’ordre', () => {
    expect(nextSession(prog(), [], MON)?.dayIndex).toBe(0);
    expect(nextSession(prog(), [done(0, '2026-10-19T09:00:00.000Z')], MON)?.dayIndex).toBe(1);
    expect(nextSession(prog(), [done(0, '2026-10-19T09:00:00.000Z'), done(1, '2026-10-21T09:00:00.000Z')], MON)?.dayIndex).toBe(2);
    expect(nextSession(prog(), [done(2, '2026-10-23T09:00:00.000Z')], MON)?.dayIndex).toBe(0);
  });

  it('2 jours : A, B, A…', () => {
    expect(nextSession(prog(2), [done(1, '2026-10-23T09:00:00.000Z')], MON)?.dayIndex).toBe(0);
  });

  it('une séance abandonnée, sautée ou d’un autre programme n’avance pas la rotation', () => {
    expect(nextSession(prog(), [done(0, '2026-10-19T09:00:00.000Z', 'sautee')], MON)?.dayIndex).toBe(0);
    expect(nextSession(prog(), [done(0, '2026-10-19T09:00:00.000Z', 'faite', 'ancien')], MON)?.dayIndex).toBe(0);
  });

  it('moins de 48 h après la dernière séance : avertissement « trop tôt » (jamais de séance double)', () => {
    const last = done(0, '2026-10-25T20:00:00.000Z');
    const soon = nextSession(prog(), [last], MON)!;
    expect(soon.tooSoon).toBe(true);
    expect(soon.availableAtMs).toBe(Date.parse('2026-10-27T20:00:00.000Z'));
    expect(nextSession(prog(), [last], Date.parse('2026-10-28T08:00:00.000Z'))!.tooSoon).toBe(false);
    expect(nextSession(prog(), [], MON)!.tooSoon).toBe(false);
  });

  it('indique si la séance est prévue aujourd’hui (jour de la semaine du programme)', () => {
    expect(nextSession(prog(), [], MON)!.scheduledToday).toBe(true); // A = lundi
    expect(nextSession(prog(), [done(0, '2026-10-19T09:00:00.000Z')], MON)!.scheduledToday).toBe(false); // B = mercredi
  });
});


describe('séance complète sur un vrai programme généré (avec supersets)', () => {
  it('enchaîne toutes les étapes jusqu’à la fin, échauffement compris, sans erreur', async () => {
    const { buildSteps, currentView, NEUTRAL_CONTEXT } = await import('../../src/session/engine');
    const { SessionController } = await import('../../src/session/store');
    const { generateProgram, toProgramDays } = await import('../../src/generator');
    const gen = generateProgram(mk({ profile: 'E', level: 'avance', dur: 75, options: { gagnerDuTemps: true } }));
    if (!gen.ok) throw new Error('attendu ok');
    const days = toProgramDays(gen.program);
    expect(days.some((d) => d.exercises.some((e) => e.supersetGroup))).toBe(true);
    const prog = await create('programs', {
      templateKey: 't', name: 'T', split: 'corps_entier', startDate: '2026-10-26', weeks: 4, active: true,
      days: days.map((d, i) => ({ ...d, warmup: { generalSec: 120, general: null, mobility: [{ ficheId: 'x', variantId: 'x', nom: 'x', sec: 45 }], cooldown: null }, weekday: i })),
    });
    let t = MON;
    const ctl = await SessionController.start(prog, 0, NEUTRAL_CONTEXT, () => t);
    expect(ctl.view().phase).toBe('echauffement');
    await ctl.endWarmup();
    const expected = buildSteps(days[0].exercises).filter((s) => s.kind === 'work').length;
    let n = 0;
    while (ctl.view().phase === 'exercices') {
      const ex = ctl.view().exercise!;
      const wasWarmup = ctl.view().isWarmupSet;
      await ctl.completeSet({ reps: ex.unit === 'sec' ? null : ex.repsMax, loadKg: ctl.view().loadKg, rir: 2, holdSec: ex.holdSec });
      if (ctl.state.rest) t += ctl.state.rest.totalMs;
      if (!wasWarmup) n++;
      if (n > 200) throw new Error('boucle');
    }
    expect(n).toBe(expected);
    const row = await ctl.finishSession();
    expect(row.status).toBe('faite');
    expect(currentView(days[0], ctl.state).progress.done).toBe(expected);
  });
});
