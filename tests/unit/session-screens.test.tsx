// @vitest-environment jsdom
// F5 partie B : écrans de séance (accueil, aperçu, lecteur, repos, douleur, symptôme, fin, reprise), horloge simulée.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { create, list, setClock, update } from '../../src/data/repo';
import type { PlannedExercise, Profile, Program, ProgramDay } from '../../src/data/model';
import { loadFiches, setFichesForTests, type Fiche } from '../../src/data/fiches';
import { ensureActiveProgram } from '../../src/session/program';
import { SessionController, findResumable } from '../../src/session/store';
import { buildSteps } from '../../src/session/engine';
import { Home } from '../../src/ui/screens/Home';
import { SessionPlayer } from '../../src/ui/screens/Player';
import { PreviewView, SessionPreview } from '../../src/ui/screens/Preview';
import { loadPlayerData } from '../../src/ui/session/launch';
import { resetSoundForTests, unlockSound } from '../../src/ui/session/sound';
import { resetWakeLockForTests } from '../../src/ui/session/wakelock';
import { exName } from '../../src/ui/session/text';
import { ZONE_LABEL } from '../../src/data/labels';
import { FICHES, PROFILES } from './generator-helpers';
import { day as mkDay, ex as mkEx, fakeClock } from './session-helpers';

// ----- Faux navigateur : son, écran allumé, visibilité -----
let oscillators = 0;
let resumes = 0;
class FakeAudio {
  state = 'suspended';
  destination = {};
  currentTime = 0;
  resume() {
    resumes++;
    this.state = 'running';
    return Promise.resolve();
  }
  createOscillator() {
    oscillators++;
    return { frequency: { value: 0 }, connect() {}, start() {}, stop() {} };
  }
  createGain() {
    return { gain: { value: 0 }, connect() {} };
  }
}
let visibility: 'visible' | 'hidden' = 'visible';
function setVisibility(v: 'visible' | 'hidden') {
  visibility = v;
  document.dispatchEvent(new Event('visibilitychange'));
}
function setWakeLock(kind: 'ok' | 'absent' | 'rejects') {
  const sentinel = { release: vi.fn(async () => undefined), addEventListener: vi.fn() };
  const request = vi.fn(async () => {
    if (kind === 'rejects') throw new Error('refusé');
    return sentinel;
  });
  Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: kind === 'absent' ? undefined : { request } });
  return { sentinel, request };
}

beforeEach(() => {
  oscillators = 0;
  resumes = 0;
  visibility = 'visible';
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibility });
  vi.stubGlobal('AudioContext', FakeAudio);
  resetSoundForTests();
  resetWakeLockForTests();
  setFichesForTests(FICHES as unknown as Fiche[]);
  setWakeLock('ok');
  location.hash = '';
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  setFichesForTests(null);
});

// ----- Mise en place -----
async function seed(o: { days?: number; preg?: 'enceinte' | null; neck?: boolean; complete?: boolean; tags?: string[]; level?: 'debutant' | 'intermediaire' } = {}) {
  const profile = await ensureLocalUser();
  const p = await update('profile', profile.id, {
    level: o.level ?? 'intermediaire', daysPerWeek: o.days ?? 3, sessionDurationMin: 45, place: 'maison',
    pregnancy: o.preg ?? null, profileCompletedAt: o.complete === false ? null : '2026-10-20T10:00:00.000Z',
  });
  const [eq] = await list('equipment');
  await update('equipment', eq.id, { preset: 'perso', tags: o.tags ?? PROFILES.C.tags, dumbbellWeightsKg: [2, 4, 6, 8, 10] });
  await create('goals', { goalKey: 'muscle', rank: 1 });
  if (o.neck) await create('injuries', { zone: 'cou', side: null, level: 1, note: '', active: true });
  return p as Profile;
}

async function handmade(days: ProgramDay[]): Promise<Program> {
  return create('programs', { templateKey: 'test', name: 'Test', split: 'corps_entier', startDate: '2026-10-26', weeks: 4, active: true, days });
}

async function mount(program: Program, profile: Profile, opts: { dayIndex?: number; onClose?: () => void } = {}) {
  const clock = fakeClock(Date.now());
  setClock(() => new Date(clock.now()));
  const fiches = await loadFiches();
  const data = await loadPlayerData(fiches, profile);
  const ctl = await SessionController.start(program, opts.dayIndex ?? 0, data.ctx, clock.now);
  const view = render(<SessionPlayer controller={ctl} data={data} profile={profile} onClose={opts.onClose ?? (() => undefined)} />);
  return { clock, ctl, data, fiches, view };
}

const tick = (ms = 0) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
async function click(name: string | RegExp) {
  const el = screen.getByRole('button', { name });
  await act(async () => { fireEvent.click(el); });
  await tick(15);
}

const byName = (id: string) => FICHES.find((f) => f.id === id)!;
function planned(id: string, variantId: string, o: Partial<PlannedExercise> = {}) {
  return mkEx({ movementId: id, variantId, ...o });
}
const DB_PRESS = { id: 'developpe-au-sol-halteres', variant: 'developpe-sol-deux-halteres' };
const CURL = { id: 'curl-incline-halteres', variant: 'curl-incline-halteres-supination' };

/** Texte visible : jamais d'identifiant brut ni de code de règle ni de mention de source. */
function expectCleanText(ids: string[]) {
  const text = document.body.textContent ?? '';
  expect(text).not.toMatch(/sourc/i);
  expect(text).not.toMatch(/V-MSG|V-ETAL|V-PRIO|NON SOURC|PROVISOIRE|\bR[0-9]\b/);
  for (const id of ids.filter((i) => /[-_]/.test(i))) expect(text).not.toContain(id);
}

// =============================================================================================
describe('parcours complet d’une séance générée', () => {
  it('échauffement, séries, repos, fin : tout est enregistré, hors-ligne, sans identifiant brut', async () => {
    const fetchSpy = vi.fn(() => { throw new Error('réseau interdit pendant la séance'); });
    vi.stubGlobal('fetch', fetchSpy);
    const profile = await seed();
    const res = await ensureActiveProgram(FICHES, { todayIso: '2026-10-26' });
    if (!res.ok) throw new Error('programme attendu');
    const closed = vi.fn();
    const { ctl, view } = await mount(res.program, profile, { onClose: closed });
    const dayPlan = res.program.days[0];
    const ids = dayPlan.exercises.flatMap((e) => [e.movementId, e.variantId]);

    expect(screen.getByRole('heading', { name: 'Échauffement' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /signaler un problème/i })).toBeTruthy(); // ReportButton
    expectCleanText(ids);
    await click('Échauffement fait');

    let sets = 0;
    for (let guard = 0; guard < 400 && !screen.queryByText(/Séance terminée|Première séance faite|Séance écourtée/); guard++) {
      expectCleanText(ids);
      const skip = screen.queryByRole('button', { name: /Passer le repos|Série suivante/ });
      if (skip) {
        await act(async () => { fireEvent.click(skip); });
        await waitFor(() => expect(ctl.state.rest).toBeNull());
        await tick();
        continue;
      }
      const done = screen.queryByRole('button', { name: 'Série faite' });
      if (done) {
        const step = ctl.state.step;
        // machine chargée : un clic peut arriver avant que la saisie soit prête ; on le refait (sans effet s'il a déjà été pris en compte)
        for (let attempt = 0; attempt < 6; attempt++) {
          await act(async () => { fireEvent.click(screen.queryByRole('button', { name: 'Série faite' }) ?? done); });
          try {
            await waitFor(() => expect(ctl.state.step).not.toBe(step), { timeout: 4000 });
            break;
          } catch (e) {
            if (attempt === 5) throw e;
          }
        }
        await tick();
        sets++;
        continue;
      }
      await tick(5);
    }
    expect(await screen.findByRole('heading', { name: /Séance terminée|Première séance faite/ })).toBeTruthy();
    expect(sets).toBe(buildSteps(dayPlan.exercises).length);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByText('Séries')).toBeTruthy();
    await click('Retour à l’accueil');
    expect(closed).toHaveBeenCalled();
    const [session] = await list('sessions');
    expect(session.status).toBe('faite');
    expect((await list('sets')).length).toBe(sets);
    view.unmount();
  }, 60_000);
});

describe('saisie rapide', () => {
  it('charge : paliers réels des haltères du profil (pas de 1 kg), champ numérique 16 px, virgule acceptée', async () => {
    const profile = await seed();
    const prog = await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 2, startLoadKg: 4, repsMin: 8, repsMax: 12 })])]);
    const { ctl } = await mount(prog, profile);
    expect(screen.getByRole('heading', { name: byName(DB_PRESS.id).nom })).toBeTruthy();
    const input = screen.getByRole('textbox', { name: 'Charge en kilos' }) as HTMLInputElement;
    expect(input.getAttribute('inputmode')).toBe('decimal');
    expect(input.value).toBe('4');
    await click('Plus de charge');
    expect(input.value).toBe('6'); // palier réel : 4 -> 6, pas 5
    await click('Moins de charge');
    await click('Moins de charge');
    expect(input.value).toBe('2');
    await click('Moins de charge');
    expect(input.value).toBe('2'); // plus léger haltère : pas de charge inventée
    fireEvent.input(input, { target: { value: '5,5' } });
    await tick();
    await click('Plus de répétitions');
    await click('Plus de répétitions');
    await click('Moins de répétitions');
    await click('3');
    await click('Série faite');
    await waitFor(() => expect(ctl.state.step).toBe(1));
    const [s] = await list('sets');
    expect(s).toMatchObject({ loadKg: 5.5, reps: 9, rir: 3, pain: false });
  });

  it('objectif lisible, série x sur y, dernière fois, proposition de progression', async () => {
    const profile = await seed();
    const prog = await handmade([mkDay([planned(CURL.id, CURL.variant, { sets: 3, startLoadKg: 4, repsMin: 10, repsMax: 15, rirTarget: 3 })])]);
    const { fiches } = await mount(prog, profile);
    expect(screen.getByText('Série 1 sur 3')).toBeTruthy();
    expect(screen.getByText('10-15 répétitions · réserve 3')).toBeTruthy();
    expect(exName(fiches, prog.days[0].exercises[0])).toBe(byName(CURL.id).nom);
    expect(screen.getByText(/Première fois : commence léger/)).toBeTruthy();
  });
});

/** D26 (SUP-2 point 7) : une séance passée où ces variantes ont déjà été faites (hors étalonnage), avec douleur facultative. */
async function pastSets(items: { movementId: string; variantId: string; pain?: boolean }[]) {
  const session = await create('sessions', {
    programId: null, programDayIndex: null, plannedDate: '2026-10-19', status: 'faite',
    startedAt: '2026-10-19T08:00:00.000Z', endedAt: '2026-10-19T08:40:00.000Z', note: '',
  } as never);
  for (const [i, it] of items.entries())
    await create('sets', {
      sessionId: session.id, movementId: it.movementId, variantId: it.variantId, exerciseIndex: i, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12,
      reps: 10, loadKg: 4, rir: 2, pain: !!it.pain, comment: '', completedAt: `2026-10-19T08:1${i}:00.000Z`,
    } as never);
}

describe('superset', () => {
  it('signalé, transition courte entre A et B, repos après la paire (séance 2 : exercices déjà étalonnés)', async () => {
    const profile = await seed();
    await pastSets([{ movementId: DB_PRESS.id, variantId: DB_PRESS.variant }, { movementId: CURL.id, variantId: CURL.variant }]);
    const a = planned(DB_PRESS.id, DB_PRESS.variant, { sets: 2, supersetGroup: 'P1', restSec: 90 });
    const b = planned(CURL.id, CURL.variant, { sets: 2, supersetGroup: 'P1', restSec: 60, slot: 'tirage_1' });
    const { ctl } = await mount(await handmade([mkDay([a, b])]), profile);
    expect(screen.getByText(`Superset : ${byName(DB_PRESS.id).nom} puis ${byName(CURL.id).nom}`)).toBeTruthy();
    await click('Série faite');
    await waitFor(() => expect(ctl.state.rest?.kind).toBe('transition'), { timeout: 8000 });
    expect(await screen.findByText('Enchaîne vite', {}, { timeout: 8000 })).toBeTruthy();
    expect(screen.getByText(byName(CURL.id).nom)).toBeTruthy();
    await click('Passer le repos');
    await waitFor(() => expect(ctl.state.rest).toBeNull(), { timeout: 8000 });
    await click('Série faite');
    await waitFor(() => expect(ctl.state.rest?.kind).toBe('repos'), { timeout: 8000 });
    expect(ctl.state.rest?.totalMs).toBe(90_000);
  });

  it('T-D26-22 séance 1 : exercices en étalonnage, paire non appliquée sans message d’erreur, texte unique de la séance 1', async () => {
    try { localStorage.clear(); } catch { /* jsdom */ }
    const profile = await seed();
    const a = planned(DB_PRESS.id, DB_PRESS.variant, { sets: 2, supersetGroup: 'P1', restSec: 90 });
    const b = planned(CURL.id, CURL.variant, { sets: 2, supersetGroup: 'P1', restSec: 60, slot: 'tirage_2' });
    const { ctl } = await mount(await handmade([mkDay([a, b])]), profile);
    expect(ctl.day.exercises.every((e) => e.supersetGroup === null && e.pairDeferred === 'etalonnage')).toBe(true);
    expect(screen.queryByText(/Superset :/)).toBeNull();
    expect(screen.getByText(/Cette première séance peut durer un peu plus longtemps/)).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    await click('Série faite');
    await waitFor(() => expect(ctl.state.rest?.kind).toBe('repos'), { timeout: 8000 });
    expect(ctl.view().exercise?.movementId).toBe(DB_PRESS.id); // A est fait seul, avec son repos
  });

  it('T-D26-13a/b douleur pendant la paire : paire dissoute, « Continuer seul » seulement si la zone n’est pas portée par l’autre fiche', async () => {
    const profile = await seed();
    await pastSets([{ movementId: DB_PRESS.id, variantId: DB_PRESS.variant }, { movementId: CURL.id, variantId: CURL.variant }]);
    const a = planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3, supersetGroup: 'P1', restSec: 90 });
    const b = planned(CURL.id, CURL.variant, { sets: 3, supersetGroup: 'P1', restSec: 60, slot: 'tirage_2' });
    const { ctl } = await mount(await handmade([mkDay([a, b])]), profile);
    const curlZones = Object.keys(byName(CURL.id).securite.zones);
    const free = (['cheville', 'genou', 'hanche', 'aine', 'cuisse', 'dos'] as const).find((z) => !curlZones.includes(z));
    expect(free).toBeTruthy();
    await click('Ça fait mal');
    const label = ZONE_LABEL[free!];
    await click(label.charAt(0).toUpperCase() + label.slice(1));
    await click('J’arrête cet exercice');
    await waitFor(() => expect(ctl.state.painExercises).toEqual([0]));
    expect(await screen.findByText(/Le superset s’arrête/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continuer seul' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Passer au suivant' })).toBeTruthy();
    expect((await list('sets')).filter((y) => y.pain)).toHaveLength(1);
    await click('Passer au suivant');
    expect(ctl.state.skipped).toEqual([0, 1]);
  });
});

describe('douleur', () => {
  it('« Ça fait mal » : zone facultative, exercice arrêté, enregistré, conseil affiché, passage à l’exercice suivant', async () => {
    const profile = await seed();
    const prog = await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3 }), planned(CURL.id, CURL.variant, { sets: 2 })])]);
    const { ctl } = await mount(prog, profile);
    await click('Ça fait mal');
    expect(screen.getByText(/Arrête, et reviens à la version plus douce/)).toBeTruthy();
    await click('Épaule');
    await click('J’arrête cet exercice');
    await waitFor(() => expect(ctl.state.painExercises).toEqual([0]));
    expect(await screen.findByText(/Exercice arrêté : pas de progression/)).toBeTruthy();
    const [s] = await list('sets');
    expect(s).toMatchObject({ pain: true, painZone: 'epaule' });
    await click('Continuer la séance');
    expect(screen.getByRole('heading', { name: byName(CURL.id).nom })).toBeTruthy();
    expect(ctl.state.rest).toBeNull();
  });

  it('pas de « Continuer plus léger » : arrêter, voir la version plus douce, ou annuler (retour à l’exercice)', async () => {
    const profile = await seed();
    const prog = await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3, startLoadKg: 6 })])]);
    const { ctl } = await mount(prog, profile);
    await click('Ça fait mal');
    expect(screen.queryByRole('button', { name: /Continuer plus léger/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'J’arrête cet exercice' })).toBeTruthy();
    await click('Annuler');
    expect(ctl.state.painExercises).toEqual([]);
    expect((screen.getByRole('textbox', { name: 'Charge en kilos' }) as HTMLInputElement).value).toBe('6');
  });

  it('version plus douce proposée dans la feuille quand la fiche en a une', async () => {
    const profile = await seed({ tags: [] });
    const prog = await handmade([mkDay([planned('bird-dog-pause', 'bird-dog-pause-sol')])]);
    await mount(prog, profile);
    await click('Ça fait mal');
    await waitFor(() => expect(screen.getByRole('button', { name: /Voir la version plus douce/ })).toBeTruthy());
  });

  it('« Passer cet exercice » demande une confirmation', async () => {
    const profile = await seed();
    const prog = await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant), planned(CURL.id, CURL.variant)])]);
    const { ctl } = await mount(prog, profile);
    await click('Passer cet exercice');
    expect(ctl.state.skipped).toEqual([]);
    await click('Annuler');
    await click('Passer cet exercice');
    await click('Passer l’exercice');
    await waitFor(() => expect(ctl.state.skipped).toEqual([0]));
  });
});

describe('nombres décimaux', () => {
  it('virgule française dans les messages du générateur', async () => {
    const { frNum } = await import('../../src/generator/messages');
    expect(frNum(7.5)).toBe('7,5');
    expect(frNum(9)).toBe('9');
    expect(frNum(7.46)).toBe('7,5');
    const profile = await seed({ level: 'debutant' });
    const res = await ensureActiveProgram(FICHES);
    if (!res.ok) throw new Error('attendu');
    for (const m of res.program.messages ?? []) expect(m.text).not.toMatch(/d.d/);
    expect(profile.id).toBeTruthy();
  });
});

describe('quitter', () => {
  it('confirmation : Terminer / Abandonner / Continuer', async () => {
    const profile = await seed();
    const prog = await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant)])]);
    const { ctl } = await mount(prog, profile);
    await click('Quitter');
    expect(screen.getByRole('button', { name: 'Terminer la séance' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Abandonner la séance' })).toBeTruthy();
    await click('Continuer la séance');
    expect(ctl.state.outcome).toBe('en_cours');
    await click('Quitter');
    await click('Abandonner la séance');
    await waitFor(() => expect(ctl.state.outcome).toBe('abandon'));
    expect(await screen.findByRole('heading', { name: 'Séance arrêtée' })).toBeTruthy();
  });
});

describe('« J’ai un symptôme »', () => {
  const order = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

  it('U1 (15 ou 112, lien tel:) avant la liste R5 ; ni grossesse ni cou si non déclarés', async () => {
    const profile = await seed();
    await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant)])]), profile);
    await click('J’ai un symptôme');
    const u1 = screen.getByText('Urgence : appelle le 15 (SAMU) ou le 112.');
    const r5 = screen.getByText(/Arrête la séance si tu ressens/);
    expect(order(u1, r5)).toBe(true);
    expect(screen.getByRole('link', { name: 'Appeler le 15' }).getAttribute('href')).toBe('tel:15');
    expect(screen.queryByText(/Grossesse ou après un accouchement/)).toBeNull();
    expect(screen.queryByText(/Fourmillements/)).toBeNull();
    expectCleanText([]);
  });

  it('grossesse cochée : G6 ; zone cou : C4', async () => {
    const profile = await seed({ preg: 'enceinte', neck: true });
    await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant)])]), profile);
    await click('J’ai un symptôme');
    expect(screen.getByText('Grossesse ou après un accouchement')).toBeTruthy();
    expect(screen.getByText(/Une perte de liquide/)).toBeTruthy();
    expect(screen.getByText(/Fourmillements/)).toBeTruthy();
    expect(screen.getByText(/Visage qui tombe/)).toBeTruthy();
  });

  it('reprise impossible sans confirmation ; « Arrêter la séance » interrompt et garde les séries', async () => {
    const profile = await seed();
    const { ctl } = await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3 })])]), profile);
    await click('Série faite');
    await click('J’ai un symptôme');
    await click('Revenir à la séance');
    expect(screen.getByText(/Tu n’as plus aucun de ces signes/)).toBeTruthy();
    expect(ctl.state.outcome).toBe('en_cours');
    await click('Non, je reste à l’arrêt');
    await click('Arrêter la séance');
    await waitFor(() => expect(ctl.state.outcome).toBe('symptome'));
    expect(await screen.findByRole('heading', { name: 'Séance arrêtée' })).toBeTruthy();
    expect(screen.getByText('Urgence : appelle le 15 (SAMU) ou le 112.')).toBeTruthy();
    const [session] = await list('sessions');
    expect(session).toMatchObject({ status: 'sautee', endReason: 'symptome' });
    expect((await list('sets')).length).toBe(1);
  });
});

describe('repos sur l’heure réelle', () => {
  it('retour de l’arrière-plan : le repos est recalculé, bip une seule fois si le son est débloqué', async () => {
    const profile = await seed();
    await unlockSound();
    expect(resumes).toBe(1);
    const base = oscillators;
    const { ctl, clock } = await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3, restSec: 90 })])]), profile);
    await click('Série faite');
    await waitFor(() => expect(ctl.state.rest).not.toBeNull());
    expect(screen.getByRole('timer').textContent).toBe('1:30');
    expect(screen.getByText(/ne sonne pas écran verrouillé/)).toBeTruthy();
    await act(async () => { setVisibility('hidden'); });
    clock.advance(100_000); // téléphone verrouillé 100 s
    await act(async () => { setVisibility('visible'); });
    await tick();
    expect(screen.getByRole('timer').textContent).toBe('0:00');
    expect(screen.getByText('Repos terminé')).toBeTruthy();
    expect(oscillators).toBeGreaterThan(base);
    await tick(400); // le 2e bip du même repos
    const after = oscillators;
    await act(async () => { setVisibility('hidden'); setVisibility('visible'); });
    await tick(400);
    expect(oscillators).toBe(after); // pas de second bip pour le même repos
  });

  it('son non débloqué : aucun bip', async () => {
    const profile = await seed();
    const { ctl, clock } = await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3, restSec: 60 })])]), profile);
    await click('Série faite');
    await waitFor(() => expect(ctl.state.rest).not.toBeNull());
    await act(async () => { setVisibility('hidden'); });
    clock.advance(70_000);
    await act(async () => { setVisibility('visible'); });
    await tick();
    expect(screen.getByText('Repos terminé')).toBeTruthy();
    expect(oscillators).toBe(0);
  });

  it('+15 s, −15 s et « Passer le repos »', async () => {
    const profile = await seed();
    const { ctl } = await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3, restSec: 90 })])]), profile);
    await click('Série faite');
    await waitFor(() => expect(ctl.state.rest).not.toBeNull());
    await click('+15 s');
    expect(screen.getByRole('timer').textContent).toBe('1:45');
    await click('−15 s');
    await click('−15 s');
    expect(screen.getByRole('timer').textContent).toBe('1:15');
    await click('Passer le repos');
    await waitFor(() => expect(ctl.state.rest).toBeNull());
    expect(screen.getByText('Série 2 sur 3')).toBeTruthy();
  });
});

describe('écran allumé', () => {
  it('disponible : demandé, aucun bandeau, relâché à la fermeture', async () => {
    const wl = setWakeLock('ok');
    const profile = await seed();
    const { view } = await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant)])]), profile);
    await tick(5);
    expect(wl.request).toHaveBeenCalledWith('screen');
    expect(screen.queryByText(/Ton écran peut s’éteindre/)).toBeNull();
    view.unmount();
    await tick(5);
    expect(wl.sentinel.release).toHaveBeenCalled();
  });

  it('indisponible : bandeau simple, aucun plantage', async () => {
    setWakeLock('absent');
    const profile = await seed();
    await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant)])]), profile);
    await tick(5);
    expect(screen.getByText('Ton écran peut s’éteindre pendant la séance. Touche l’écran de temps en temps.')).toBeTruthy();
  });

  it('refusé (promesse rejetée) : bandeau, aucun plantage', async () => {
    setWakeLock('rejects');
    const profile = await seed();
    await mount(await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant)])]), profile);
    await tick(5);
    expect(screen.getByText(/Ton écran peut s’éteindre/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Série faite' })).toBeTruthy();
  });
});

describe('reprise après fermeture', () => {
  it('l’accueil propose « Reprendre ta séance » ; le repos est recalculé sur l’heure réelle', async () => {
    const profile = await seed();
    const prog = await handmade([mkDay([planned(DB_PRESS.id, DB_PRESS.variant, { sets: 3, restSec: 90 })])]);
    const { ctl, clock, view } = await mount(prog, profile);
    await click('Série faite');
    await waitFor(() => expect(ctl.state.rest).not.toBeNull());
    view.unmount(); // l'app est fermée
    clock.advance(40_000);
    const r = await findResumable(clock.now());
    expect(r?.proposal).toBe('reprendre');

    const resume = vi.fn();
    const home = render(<Home profile={profile} onStart={() => undefined} onEditStep={() => undefined} onResume={resume} onOpenSession={() => undefined} />);
    await waitFor(() => expect(screen.getByText('Reprendre ta séance')).toBeTruthy());
    expect(screen.queryByRole('button', { name: 'Voir la séance' })).toBeNull();
    await click('Reprendre');
    expect(resume).toHaveBeenCalledWith(ctl.sessionId);
    home.unmount();

    const fiches = await loadFiches();
    const data = await loadPlayerData(fiches, profile, ctl.sessionId);
    const back = await SessionController.resume(ctl.sessionId, data.ctx, clock.now);
    render(<SessionPlayer controller={back} data={data} profile={profile} onClose={() => undefined} />);
    expect(screen.getByRole('timer').textContent).toBe('0:50');
  });
});

describe('accueil', () => {
  it('séance du jour : nom, durée, nombre d’exercices, « Voir la séance »', async () => {
    const profile = await seed();
    const open = vi.fn();
    render(<Home profile={profile} onStart={() => undefined} onEditStep={() => undefined} onResume={() => undefined} onOpenSession={open} />);
    await waitFor(() => expect(screen.getByText('Séance A')).toBeTruthy());
    expect(screen.getByText(/exercices/)).toBeTruthy();
    await click('Voir la séance');
    expect(open).toHaveBeenCalled();
  });

  it('48 h : avertissement après une séance toute récente', async () => {
    const profile = await seed();
    const res = await ensureActiveProgram(FICHES);
    if (!res.ok) throw new Error('attendu');
    const now = new Date().toISOString();
    await create('sessions', { programId: res.program.id, programDayIndex: 0, plannedDate: now.slice(0, 10), status: 'faite', startedAt: now, endedAt: now, note: '' });
    render(<Home profile={profile} onStart={() => undefined} onEditStep={() => undefined} onResume={() => undefined} onOpenSession={() => undefined} />);
    await waitFor(() => expect(screen.getByText('Séance B')).toBeTruthy());
    expect(screen.getByText(/moins de 48 h/)).toBeTruthy();
  });

  // D25 : 1 jour est généré (STR-REP-1) ; 7 jours reste sans programme.
  it('pas de programme (7 jours) : message du moteur et « Modifier mes jours »', async () => {
    const profile = await seed({ days: 7 });
    const edit = vi.fn();
    render(<Home profile={profile} onStart={() => undefined} onEditStep={edit} onResume={() => undefined} onOpenSession={() => undefined} />);
    await waitFor(() => expect(screen.getByText(/Choisis entre 1 et 6 jours/)).toBeTruthy());
    await click('Modifier mes jours');
    expect(edit).toHaveBeenCalledWith('jours');
  });

  it('profil incomplet : le parcours existant', async () => {
    const profile = await seed({ complete: false });
    const start = vi.fn();
    render(<Home profile={profile} onStart={start} onEditStep={() => undefined} onResume={() => undefined} onOpenSession={() => undefined} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Créer mon programme' })).toBeTruthy());
    await click('Créer mon programme');
    expect(start).toHaveBeenCalled();
  });
});

describe('aperçu de la séance', () => {
  it('explication, messages (avis médecin / sage-femme en premier), liste des exercices, « Commencer » débloque le son et demande l’écran allumé', async () => {
    const wl = setWakeLock('ok');
    const profile = await seed({ preg: 'enceinte' });
    const begin = vi.fn(async () => undefined);
    render(<SessionPreview profile={profile} onBegin={begin} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Commencer la séance' })).toBeTruthy());
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/médecin ou de ta sage-femme/);
    expect(screen.getByText('Les exercices')).toBeTruthy();
    expect(document.querySelectorAll('.prev-list li').length).toBeGreaterThan(3);
    expect(screen.getAllByRole('link').length).toBeGreaterThan(3);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Commencer la séance' })); });
    await tick(5);
    expect(resumes).toBe(1);
    expect(wl.request).toHaveBeenCalled();
    expect(begin).toHaveBeenCalled();
  });

  it('avertissement 48 h et superset signalé', async () => {
    const profile = await seed();
    const a = planned(DB_PRESS.id, DB_PRESS.variant, { supersetGroup: 'P1' });
    const b = planned(CURL.id, CURL.variant, { supersetGroup: 'P1', slot: 'tirage_1' });
    const prog = await handmade([mkDay([a, b])]);
    render(
      <PreviewView
        program={prog}
        next={{ dayIndex: 0, day: prog.days[0], tooSoon: true, availableAtMs: null, scheduledToday: true }}
        fiches={await loadFiches()}
        onBegin={() => undefined}
      />,
    );
    expect(screen.getByText(/moins de 48 h/)).toBeTruthy();
    expect(screen.getAllByText(/Superset avec/).length).toBe(2);
    expect(profile.id).toBeTruthy();
  });
});
