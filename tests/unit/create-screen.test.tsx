// @vitest-environment jsdom
// D28 étape 2 : écran « Créer une séance » (rendu, refus grossesse, Faire maintenant), lecteur (séance créée, historique réel, rotation intacte).
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { createSession, type CreatedSession, type CreateSessionRequest } from '../../src/generator';
import { CREER_SEANCE } from '../../src/generator/config';
import { list, setClock } from '../../src/data/repo';
import { NEUTRAL_CONTEXT } from '../../src/session/engine';
import { SessionController } from '../../src/session/store';
import { nextSession } from '../../src/session/program';
import { createContextOf, createdDay, createHistory, metaOf, scheduledOf, scheduleCreated, stopSignOf, upcomingDays, weekSetsOf } from '../../src/session/create-store';
import { validateRow } from '../../src/data/validate';
import { proposeProgression, withoutCreatedSets } from '../../src/session/history';
import { SummaryScreen } from '../../src/ui/screens/Summary';
import { CreateSessionView } from '../../src/ui/screens/CreateSession';
import { CalendarView } from '../../src/ui/screens/Calendar';
import { JumpPlayNotes } from '../../src/ui/session/CardioNotes';
import { FICHES, mk } from './generator-helpers';

afterEach(cleanup);

const NOW = new Date('2026-11-12T10:00:00.000Z');
const schemaOf = (id: string) => FICHES.find((f) => f.id === id)?.schema;
const home = () => mk({ profile: 'A0', extraTags: ['elastique', 'chaise'], level: 'intermediaire' });
const noop = async () => undefined;

const view = (o: Partial<Parameters<typeof CreateSessionView>[0]> = {}) =>
  render(<CreateSessionView input={home()} context={{}} now={() => NOW} onBack={() => undefined} onDoNow={noop} onSchedule={noop} {...o} />);

describe('Écran « Créer une séance » : choix', () => {
  it('zone, sport facultatif, durée, intensité ; matériel du profil affiché ; question chaise seulement si le tag chaise est au profil', () => {
    view();
    for (const n of ['Jambes', 'Haut du corps', 'Tronc', 'Corps entier', 'Aucun', 'Foot', 'Danse', 'Volley', 'Raquette', '20 min', '75 min', 'Douce', 'Modérée', 'Soutenue']) {
      expect(screen.getByRole('button', { name: n })).toBeTruthy();
    }
    expect(screen.getByText(/un élastique/)).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Ta chaise est-elle stable et calée contre un mur ?' })).toBeTruthy();
    // défaut : non
    expect(screen.getByRole('button', { name: 'Non' }).getAttribute('aria-pressed')).toBe('true');
    cleanup();
    const noChair = mk({ profile: 'A0', level: 'intermediaire' });
    noChair.equipment.disabledImplicit = ['chaise'];
    view({ input: noChair });
    expect(screen.queryByText('Ta chaise est-elle stable et calée contre un mur ?')).toBeNull();
    expect(screen.getByText(/Ton poids du corps/)).toBeTruthy();
  });

  it('profil incomplet : renvoie vers le profil, aucun choix', () => {
    const onEdit = vi.fn();
    view({ input: null, onEditProfile: onEdit });
    fireEvent.click(screen.getByRole('button', { name: 'Compléter mon profil' }));
    expect(onEdit).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Voir la séance' })).toBeNull();
  });
});

describe('Écran « Créer une séance » : résultat', () => {
  it('haut du corps : exercices avec séries et répétitions, échauffement, retour au calme, durée, avis ; Faire maintenant appelle le lancement', async () => {
    const onDoNow = vi.fn(async () => undefined);
    view({ onDoNow });
    fireEvent.click(screen.getByRole('button', { name: 'Haut du corps' }));
    fireEvent.click(screen.getByRole('button', { name: '45 min' }));
    fireEvent.click(screen.getByRole('button', { name: 'Voir la séance' }));
    expect(screen.getByRole('heading', { name: 'Ta séance' })).toBeTruthy();
    expect(screen.getByLabelText('Échauffement')).toBeTruthy();
    expect(screen.getByLabelText('Retour au calme')).toBeTruthy();
    expect(screen.getByLabelText('Exercices').textContent).toMatch(/\d+ × .*repos/);
    expect(screen.getByText(CREER_SEANCE.text.header)).toBeTruthy();
    expect(screen.getByText(CREER_SEANCE.text.notMedical)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Faire maintenant' }));
    await waitFor(() => expect(onDoNow).toHaveBeenCalledTimes(1));
    const [session, request, scheduledId] = onDoNow.mock.calls[0] as unknown as [CreatedSession, { zone: string; durationMin: number }, string | null];
    expect(session.zone).toBe('haut');
    expect(request).toMatchObject({ zone: 'haut', durationMin: 45 });
    expect(scheduledId).toBeNull();
  });

  it('grossesse : jambes refusées avec le message, séance du haut du corps proposée à la place ; aucun bouton Faire maintenant', () => {
    view({ input: mk({ profile: 'A0', extraTags: ['elastique'], preg: 'enceinte' }) });
    fireEvent.click(screen.getByRole('button', { name: 'Jambes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Voir la séance' }));
    expect(screen.getByText(CREER_SEANCE.text.pregnancy)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Faire maintenant' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Ajouter au calendrier' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Haut du corps' }));
    expect(screen.getByRole('button', { name: 'Faire maintenant' })).toBeTruthy();
  });

  it('jambes avec volley : sauts avec la consigne d’arrêt visible et les précautions en volet fermé', () => {
    view({ input: mk({ profile: 'A0', extraTags: ['elastique', 'chaise'], level: 'avance' }) });
    fireEvent.click(screen.getByRole('button', { name: 'Jambes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Volley' }));
    fireEvent.click(screen.getByRole('button', { name: 'Oui' }));
    fireEvent.click(screen.getByRole('button', { name: 'Voir la séance' }));
    const volet = document.querySelector('details.precautions');
    expect(volet).toBeTruthy();
    expect((volet as HTMLDetailsElement).open).toBe(false);
  });

  it('Ajouter au calendrier : un jour à venir au choix, séance recomposée pour ce jour', async () => {
    const onSchedule = vi.fn(async () => undefined);
    view({ onSchedule });
    fireEvent.click(screen.getByRole('button', { name: 'Tronc' }));
    fireEvent.click(screen.getByRole('button', { name: 'Voir la séance' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter au calendrier' }));
    const day = upcomingDays(NOW)[2];
    fireEvent.change(screen.getByLabelText('Quel jour ?'), { target: { value: day } });
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter ce jour' }));
    await waitFor(() => expect(onSchedule).toHaveBeenCalledTimes(1));
    expect((onSchedule.mock.calls[0] as unknown[])[2]).toBe(day);
    expect(screen.getByRole('status').textContent).toContain('séance ajoutée au calendrier');
  });
});

describe('Séance créée : lecteur, historique réel, rotation du programme', () => {
  const jambes = (): CreatedSession => {
    const input = home();
    const res = createSession(input, { zone: 'jambes', chairStable: true, durationMin: 30, intensity: 'moderee', todayIso: NOW.toISOString() }, {});
    if (!res.ok) throw new Error(res.message);
    return res.session;
  };

  it('Faire maintenant : ligne sans programme, marquée « créée », plan complet ; le programme actif n’est pas modifié', async () => {
    setClock(() => NOW);
    const s = jambes();
    const ctl = await SessionController.startCreated(createdDay(s), metaOf(s, { zone: 'jambes', sport: null, chairStable: true, durationMin: 30, intensity: 'moderee' }), NEUTRAL_CONTEXT, () => NOW.getTime());
    expect(ctl.created).toBe(true);
    const [row] = await list('sessions');
    expect(row).toMatchObject({ status: 'en_cours', programId: null, programDayIndex: null });
    expect(row.created?.heavyLegs).toBe(true);
    expect(row.plan?.exercises.length).toBeGreaterThan(0);
    expect(await list('programs')).toHaveLength(0);
    // reprise après fermeture : toujours « créée »
    const back = await SessionController.resume(ctl.sessionId, NEUTRAL_CONTEXT, () => NOW.getTime());
    expect(back.created).toBe(true);
  });

  it('historique alimenté : jambes lourdes faites -> nouvelle séance de jambes refusée (moins de 24 h), puis adoucie (moins de 48 h)', async () => {
    setClock(() => NOW);
    const s = jambes();
    const ctl = await SessionController.startCreated(createdDay(s), metaOf(s, { zone: 'jambes', sport: null, chairStable: true, durationMin: 30, intensity: 'moderee' }), NEUTRAL_CONTEXT, () => NOW.getTime());
    await ctl.endWarmup();
    await ctl.completeSet({ reps: 10, loadKg: null, rir: 3 });
    await ctl.finishSession();
    const [sessions, sets] = [await list('sessions'), await list('sets')];
    const items = createHistory({ sessions, sets, programs: [], schemaOf });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ heavyLegs: true });
    const at = (h: number) => new Date(NOW.getTime() + h * 3600 * 1000);
    const again = (h: number) => {
      const ctx = createContextOf({ sessions, sets, programs: [], schemaOf, activeProgram: null, now: at(h) });
      return createSession(home(), { zone: 'jambes', chairStable: true, durationMin: 30, intensity: 'moderee', todayIso: at(h).toISOString() }, ctx);
    };
    const r12 = again(12);
    expect(r12.ok).toBe(false);
    if (!r12.ok) expect(r12.code).toBe('jambes-trop-proches');
    const r30 = again(30);
    expect(r30.ok && r30.session.softened).toBe(true);
    const r80 = again(80);
    expect(r80.ok && r80.session.softened).toBe(false);
  });

  it('la séance créée n’avance pas la rotation A, B, C du programme', () => {
    const day = (i: number) => ({ dayIndex: i, label: `Séance ${i}`, exercises: [], weekday: i });
    const program = { id: 'p', days: [day(0), day(1), day(2)] } as unknown as Parameters<typeof nextSession>[0];
    const row = (o: object) => ({ id: 'x', deletedAt: null, plannedDate: '2026-11-10', startedAt: '2026-11-10T10:00:00Z', endedAt: '2026-11-10T11:00:00Z', ...o });
    const prog = row({ id: 'a', status: 'faite', programId: 'p', programDayIndex: 0 });
    const created = row({ id: 'b', status: 'faite', programId: null, programDayIndex: null, created: { heavyLegs: false, impact: false, contacts: 0, request: {} }, endedAt: '2026-11-11T11:00:00Z' });
    const next = nextSession(program, [prog, created] as never, Date.parse('2026-11-12T10:00:00Z'));
    expect(next?.dayIndex).toBe(1);
  });

  it('séance avec sauts du programme : contacts et sauts lus dans le plan', () => {
    const plan = { dayIndex: 0, label: 'Cardio sauts', exercises: [{ movementId: 'saut', variantId: 'v', role: 'cardio', jump: { soft: false, softVariantId: null, softNom: null, contacts: 60 } }] };
    const items = createHistory({
      sessions: [{ id: 's', deletedAt: null, status: 'faite', endedAt: '2026-11-11T10:00:00Z', plan, programId: 'p', programDayIndex: 0 }] as never,
      sets: [{ sessionId: 's', pain: true, completedAt: 'x', isWarmup: false }] as never, programs: [], schemaOf,
    });
    expect(items[0]).toMatchObject({ jumps: true, contacts: 60, impact: true, pain: true, heavyLegs: false });
  });

  it('calendrier : séance créée ajoutée, visible le jour choisi, sans toucher au programme', async () => {
    setClock(() => NOW);
    const s = jambes();
    const key = upcomingDays(NOW)[3];
    await scheduleCreated(createdDay(s), metaOf(s, { zone: 'jambes', sport: null, chairStable: true, durationMin: 30, intensity: 'moderee' }), key);
    const sched = scheduledOf(await list('sessions'), '2026-11-12');
    expect(sched).toHaveLength(1);
    expect(sched[0].dateKey).toBe(key);
    expect(await list('programs')).toHaveLength(0);
    const onPrepare = vi.fn();
    render(<CalendarView entries={[]} today={new Date(2026, 10, 12)} daysPerWeek={3} startKey={null} scheduled={sched} onPrepareCreated={onPrepare} onOpen={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`séance prévue`) }));
    fireEvent.click(screen.getByRole('button', { name: 'Préparer cette séance' }));
    expect(onPrepare).toHaveBeenCalledWith(sched[0]);
  });

  it('lecteur : la question « jambes lourdes ? » et la consigne d’arrêt des sauts sont celles des séances de cardio avec sauts', () => {
    const s = createSession(mk({ profile: 'A0', extraTags: ['elastique', 'chaise'], level: 'avance' }), { zone: 'jambes', sport: 'volley', chairStable: true, durationMin: 45, intensity: 'moderee', todayIso: NOW.toISOString() }, {});
    if (!s.ok) throw new Error(s.message);
    const jump = createdDay(s.session).exercises.find((e) => e.jump);
    if (!jump) return; // pas de saut possible avec ce profil : rien à afficher
    render(<JumpPlayNotes ex={jump} />);
    expect(document.querySelector('.stop-line')).toBeTruthy();
  });
});

// ----- Relecteur D28 : points 1, 2, 4, 5 -----
const musclesOf = (id: string) => {
  const f = FICHES.find((x) => x.id === id);
  return f ? { principaux: f.musclesPrincipaux, secondaires: f.musclesSecondaires } : undefined;
};
const sset = (sessionId: string, movementId: string, completedAt: string, o: object = {}) => ({ sessionId, movementId, completedAt, isWarmup: false, pain: false, exerciseIndex: 0, ...o });
const avance = () => mk({ profile: 'A0', extraTags: ['elastique', 'chaise'], level: 'avance' });
const volleyReq = (): CreateSessionRequest => ({ zone: 'jambes', sport: 'volley', chairStable: true, durationMin: 45, intensity: 'moderee', todayIso: NOW.toISOString() });

describe('Point 1 : plafond hebdomadaire alimenté par l’historique (programme ET séances créées)', () => {
  const quad = FICHES.find((f) => f.schema === 'squat')!;
  it('weekSetsOf : séries de travail des 7 derniers jours, pondérées ; échauffement, anciennes et supprimées ignorées', () => {
    const recent = new Date(NOW.getTime() - 2 * 86400000).toISOString();
    const old = new Date(NOW.getTime() - 9 * 86400000).toISOString();
    const sessions = [{ id: 'a', status: 'faite', deletedAt: null }, { id: 'b', status: 'faite', deletedAt: null, created: { heavyLegs: true, impact: false, contacts: 0, request: {} } }] as never;
    const sets = [sset('a', quad.id, recent), sset('b', quad.id, recent), sset('a', quad.id, recent, { isWarmup: true }), sset('a', quad.id, old), sset('a', quad.id, recent, { deletedAt: 'x' })] as never;
    const w = weekSetsOf({ sessions, sets, musclesOf, now: NOW });
    expect(w[quad.musclesPrincipaux[0]]).toBe(2);
  });
  it('plafond de 20 atteint : une séance de jambes est refusée (plafond hebdomadaire)', () => {
    const recent = new Date(NOW.getTime() - 2 * 86400000).toISOString();
    const sessions = [{ id: 'a', status: 'faite', deletedAt: null, endedAt: recent, plan: { exercises: [] }, programId: 'p', programDayIndex: 0 }] as never;
    const sets = Array.from({ length: 40 }, () => sset('a', quad.id, recent)) as never;
    const ctx = createContextOf({ sessions, sets, programs: [], schemaOf, musclesOf, activeProgram: null, now: NOW });
    expect(Math.max(...Object.values(ctx.weekSets ?? {}))).toBeGreaterThanOrEqual(20);
    const res = createSession(home(), { zone: 'jambes', chairStable: true, durationMin: 30, intensity: 'moderee', todayIso: NOW.toISOString() }, { ...ctx, sessions: [] });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.code).toBe('plafond-hebdomadaire');
  });
});

describe('Point 4 : douleur et arrêt des sauts = verrou (aucun saut)', () => {
  const jumpPlan = { exercises: [{ movementId: 'saut', variantId: 'v', role: 'cardio', jump: { soft: false, softVariantId: null, softNom: null, contacts: 60 } }] };
  const base = { id: 's', deletedAt: null, status: 'faite', endedAt: new Date(NOW.getTime() - 4 * 86400000).toISOString(), plan: jumpPlan, programId: 'p', programDayIndex: 0 };
  it('référence : sans douleur, volley avancé = sauts', () => {
    const r = createSession(avance(), volleyReq(), {});
    expect(r.ok && !!r.session.jumps).toBe(true);
  });
  it('douleur à la dernière séance de sauts (14 jours) : aucun saut, avec la raison', () => {
    const items = createHistory({ sessions: [base] as never, sets: [{ sessionId: 's', pain: true, completedAt: 'x', isWarmup: false, exerciseIndex: 0 }] as never, programs: [], schemaOf });
    const r = createSession(avance(), volleyReq(), { sessions: items });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.session.jumps).toBeNull();
      expect(r.session.contacts).toBe(0);
      expect(r.warnings.map((w) => w.text).join(' ')).toContain('une douleur à ta dernière séance de sauts');
    }
  });
  it('arrêt des sauts (exercice de sauts passé) : stopSignRecent vrai -> aucun saut ; au-delà de 14 jours : plus de verrou', () => {
    const skipped = { ...base, skippedExercises: [0] } as never;
    expect(stopSignOf({ sessions: [skipped], sets: [], now: NOW })).toBe(true);
    expect(stopSignOf({ sessions: [base] as never, sets: [], now: NOW })).toBe(false);
    expect(stopSignOf({ sessions: [{ ...base, endReason: 'symptome' }] as never, sets: [], now: NOW })).toBe(true);
    expect(stopSignOf({ sessions: [{ ...base, skippedExercises: [0], endedAt: new Date(NOW.getTime() - 20 * 86400000).toISOString() }] as never, sets: [], now: NOW })).toBe(false);
    const ctx = createContextOf({ sessions: [skipped], sets: [], programs: [], schemaOf, activeProgram: null, now: NOW });
    expect(ctx.stopSignRecent).toBe(true);
    const r = createSession(avance(), volleyReq(), ctx);
    expect(r.ok && r.session.jumps === null && r.session.contacts === 0).toBe(true);
  });
});

describe('Point 5 : champ « created » validé', () => {
  const row = (created: unknown) => ({
    id: 'x', ownerId: 'l', createdAt: '2026-11-12T10:00:00.000Z', updatedAt: '2026-11-12T10:00:00.000Z', rev: 1, deletedAt: null, syncedAt: null,
    programId: null, programDayIndex: null, plannedDate: '2026-11-12', status: 'faite', startedAt: null, endedAt: null, note: '', created,
  });
  const good = { heavyLegs: true, impact: false, contacts: 40, request: { zone: 'jambes' } };
  it('valide : accepté', () => expect(validateRow('sessions', row(good))).toEqual([]));
  it('invalide : refusé (booléen, contacts hors 0-120, NaN, request manquant, pas un objet)', () => {
    for (const bad of [{ ...good, heavyLegs: 'oui' }, { ...good, impact: 1 }, { ...good, contacts: -1 }, { ...good, contacts: 500 }, { ...good, contacts: Number.NaN }, { ...good, request: null }, 'x', 5]) {
      expect(validateRow('sessions', row(bad)).join(' ')).toContain('created');
    }
  });
  it('lecture prudente d’une méta illisible déjà stockée : jambes lourdes, impact, contacts = 0 et douleur (aucun saut), jamais NaN', () => {
    const items = createHistory({
      sessions: [{ id: 's', deletedAt: null, status: 'faite', endedAt: '2026-11-11T10:00:00Z', created: { heavyLegs: 'x', impact: null, contacts: Number.NaN, request: {} } }] as never,
      sets: [], programs: [], schemaOf,
    });
    expect(items[0]).toMatchObject({ heavyLegs: true, impact: true, jumps: true, contacts: 0, pain: true });
    // et plus aucun saut jusqu'à expiration des 14 jours
    const r = createSession(avance(), { ...volleyReq(), todayIso: new Date(Date.parse('2026-11-11T10:00:00Z') + 3 * 86400000).toISOString() }, { sessions: items });
    expect(r.ok && r.session.jumps === null).toBe(true);
  });
});

describe('Point 2 : séance créée = aucune progression, jamais base du programme', () => {
  it('withoutCreatedSets : séries d’une séance créée écartées (sauf douleur)', () => {
    const sessions = [{ id: 'c', created: {} }, { id: 'p' }] as never;
    const sets = [{ sessionId: 'c', pain: false }, { sessionId: 'c', pain: true }, { sessionId: 'p', pain: false }] as never;
    const out = withoutCreatedSets({ sets, sessions }).sets as unknown as { sessionId: string }[];
    expect(out).toHaveLength(2);
    expect(out.filter((x) => x.sessionId === 'c')).toHaveLength(1);
  });
  it('la dernière fois d’un exercice du programme ignore la séance créée', () => {
    const ex = { movementId: 'm', variantId: 'v', sets: 3, repsMin: 8, repsMax: 12, restSec: 90, supersetGroup: null, rirTarget: 2, unit: 'reps', holdSec: null, warmupSets: [], role: 'autre', slot: 's', startLoadKg: 10, capped: false, adaptation: null, substitut: false } as never;
    const mkSet = (sessionId: string, loadKg: number, at: string) => ({ id: sessionId + at, sessionId, movementId: 'm', variantId: 'v', exerciseIndex: 0, setIndex: 0, reps: 10, loadKg, rir: 2, pain: false, isWarmup: false, completedAt: at, targetRepsMin: 8, targetRepsMax: 12, deletedAt: null });
    const sets = [mkSet('p', 10, '2026-11-01T10:00:00Z'), mkSet('c', 50, '2026-11-10T10:00:00Z')] as never;
    const sessions = [{ id: 'p', status: 'faite', deletedAt: null, endedAt: '2026-11-01T11:00:00Z', startedAt: '2026-11-01T10:00:00Z' }, { id: 'c', status: 'faite', deletedAt: null, created: {}, endedAt: '2026-11-10T11:00:00Z', startedAt: '2026-11-10T10:00:00Z' }] as never;
    const p = proposeProgression({ exercise: ex, sets, sessions, pregnant: false } as never);
    expect(p.loadKg === null || p.loadKg < 50).toBe(true);
  });
  it('bilan d’une séance créée terminée : aucune proposition « La prochaine fois »', async () => {
    setClock(() => NOW);
    const s = createSession(home(), { zone: 'haut', chairStable: true, durationMin: 30, intensity: 'moderee', todayIso: NOW.toISOString() }, {});
    if (!s.ok) throw new Error(s.message);
    const ctl = await SessionController.startCreated(createdDay(s.session), metaOf(s.session, { zone: 'haut', sport: null, chairStable: true, durationMin: 30, intensity: 'moderee' }), NEUTRAL_CONTEXT, () => NOW.getTime());
    await ctl.endWarmup();
    await ctl.completeSet({ reps: 10, loadKg: 5, rir: 2 });
    await ctl.finishSession();
    const data = { fiches: FICHES, input: null, pregnant: false, equipment: null, bodyweightOf: () => undefined, sets: [], sessions: [] } as never;
    render(<SummaryScreen ctl={ctl} data={data} pregnancy={null} onClose={() => undefined} />);
    await waitFor(() => expect(document.querySelector('h1,h2')).toBeTruthy());
    expect(document.body.textContent).not.toMatch(/La prochaine fois/);
  });
});
