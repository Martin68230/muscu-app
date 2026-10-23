// @vitest-environment jsdom
import { useState } from 'preact/hooks';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import type { Profile } from '../../src/data/model';
import { ensureLocalUser, acceptOnboarding } from '../../src/data/bootstrap';
import { list, update } from '../../src/data/repo';
import {
  freeDaysEnough, getMainGoal, isProfileComplete, isSupportedDays, unsupportedDaysMessage,
} from '../../src/data/profile-setup';
import { ProfileWizard } from '../../src/ui/screens/ProfileWizard';
import { Home } from '../../src/ui/screens/Home';
import { setFichesForTests, type Fiche } from '../../src/data/fiches';
import { FICHES } from './generator-helpers';

afterEach(cleanup);

function Harness({ initial, only, onExit }: { initial: Profile; only?: Parameters<typeof ProfileWizard>[0]['only']; onExit?: () => void }) {
  const [p, setP] = useState(initial);
  return <ProfileWizard profile={p} onChange={setP} only={only} onExit={onExit ?? (() => {})} />;
}

async function freshProfile() {
  const p = await ensureLocalUser();
  return acceptOnboarding(p.id);
}
const click = async (name: string | RegExp) => {
  fireEvent.click(await screen.findByRole('button', { name }));
};
const stored = async () => (await list('profile'))[0];

describe('règles du parcours', () => {
  it('2 et 3 jours gérés ; 1 et 4 à 6 : message « prochaine version »', () => {
    expect([1, 2, 3, 4, 5, 6].map(isSupportedDays)).toEqual([false, true, true, false, false, false]);
    for (const d of [1, 4, 5, 6]) expect(unsupportedDaysMessage(d)).toMatch(/prochaine version/);
  });
  it('jours libres suffisants', () => {
    expect(freeDaysEnough(3, [0, 1, 2, 3])).toBe(true);
    expect(freeDaysEnough(3, [0, 1, 2, 3, 4])).toBe(false);
    expect(freeDaysEnough(null, [0, 1, 2, 3, 4, 5, 6])).toBe(true);
  });
});

describe('parcours en cartes', () => {
  it('on ne peut pas passer une carte obligatoire sans choisir, et chaque choix est enregistré', async () => {
    render(<Harness initial={await freshProfile()} />);
    const next = await screen.findByRole('button', { name: 'Suivant' });
    expect((next as HTMLButtonElement).disabled).toBe(true);
    await click('3');
    await waitFor(async () => expect((await stored()).daysPerWeek).toBe(3));
    expect((screen.getByRole('button', { name: 'Suivant' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("1 jour : le message s'affiche et rien de faux n'est proposé", async () => {
    render(<Harness initial={await freshProfile()} />);
    await click('4');
    expect(await screen.findByText(/prochaine version/)).toBeTruthy();
    await click('2');
    await waitFor(() => expect(screen.queryByText(/prochaine version/)).toBeNull());
  });

  it('parcours complet, retour en arrière, enregistrement à chaque carte, fin du parcours', async () => {
    render(<Harness initial={await freshProfile()} />);
    await click('3');
    await click('Suivant');
    // jours bloqués : dimanche
    await click('dimanche');
    await waitFor(async () => expect((await stored()).blockedWeekdays).toEqual([6]));
    await click('Suivant');
    // durée : sans limite
    await click('Sans limite');
    await waitFor(async () => expect((await stored()).sessionDurationMin).toBeNull());
    await click('Suivant');
    // lieu, puis retour en arrière : la valeur est conservée
    await click(/À la maison/);
    await waitFor(async () => expect((await stored()).place).toBe('maison'));
    await click('Retour');
    expect(await screen.findByRole('heading', { name: 'Combien de temps par séance ?' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sans limite' }).getAttribute('aria-pressed')).toBe('true');
    await click('Suivant');
    expect((await screen.findByRole('button', { name: /À la maison/ })).getAttribute('aria-pressed')).toBe('true');
    await click('Suivant');
    // matériel : on passe
    expect(await screen.findByRole('heading', { name: 'Ton matériel' })).toBeTruthy();
    await click('Suivant');
    // niveau
    await click(/Débutant/);
    expect(screen.getByText(/Moins de 6 mois d'entraînement régulier, ou reprise après une longue pause/)).toBeTruthy();
    await waitFor(async () => expect((await stored()).level).toBe('debutant'));
    await click('Suivant');
    // objectif
    await click(/Force/);
    await waitFor(async () => expect(await getMainGoal()).toBe('force'));
    await click('Suivant');
    // blessures : cuisse et aine existent
    expect(await screen.findByRole('button', { name: /^Cuisse/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Aine' })).toBeTruthy();
    await click('Suivant');
    // grossesse : facultatif, texte prudent
    expect(screen.getByText(/jamais partagée/)).toBeTruthy();
    expect(screen.getByText(/avis de ton médecin/)).toBeTruthy();
    await click('Enceinte');
    await waitFor(async () => expect((await stored()).pregnancy).toBe('enceinte'));
    await click('Terminer');
    expect(await screen.findByRole('heading', { name: 'Ton profil est prêt' })).toBeTruthy();
    const p = await stored();
    expect(isProfileComplete(p)).toBe(true);
    expect(p).toMatchObject({ daysPerWeek: 3, blockedWeekdays: [6], sessionDurationMin: null, place: 'maison', level: 'debutant', pregnancy: 'enceinte' });
  });

  it('la grossesse reste facultative : on peut finir sans répondre', async () => {
    const p = await freshProfile();
    render(<Harness initial={p} only="grossesse" />);
    expect((screen.getByRole('button', { name: 'Terminer' }) as HTMLButtonElement).disabled).toBe(false);
    expect((await stored()).pregnancy).toBeNull();
  });

  it("mode une carte (depuis Profil) : modifie une valeur puis revient", async () => {
    const p = await freshProfile();
    let exited = false;
    render(<Harness initial={p} only="niveau" onExit={() => { exited = true; }} />);
    await click(/Avancé/);
    await waitFor(async () => expect((await stored()).level).toBe('avance'));
    await click('Terminer');
    expect(exited).toBe(true);
  });
});

describe('Accueil', () => {
  it("propose « Créer mon programme » tant que le profil est incomplet", async () => {
    const p = await freshProfile();
    let started = false;
    render(<Home profile={p} onStart={() => { started = true; }} onEditStep={() => {}} onResume={() => {}} onOpenSession={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Créer mon programme' }));
    expect(started).toBe(true);
  });
  it('profil terminé avec 4 jours : message du moteur, bouton « Modifier mes jours », pas de programme', async () => {
    setFichesForTests(FICHES as unknown as Fiche[]);
    const p0 = await freshProfile();
    const p = await update('profile', p0.id, { daysPerWeek: 4, level: 'debutant', sessionDurationMin: 45, profileCompletedAt: '2026-10-23T10:00:00.000Z' });
    render(<Home profile={p} onStart={() => {}} onEditStep={() => {}} onResume={() => {}} onOpenSession={() => {}} />);
    await waitFor(() => expect(screen.getByText(/Ce rythme arrive dans une prochaine version/)).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Modifier mes jours' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Créer mon programme' })).toBeNull();
  });
});
