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
  // D25 (structure-programmes.md §2.3) : 1 à 6 jours sont générés ; hors de 1-6, message clair.
  it('1 à 6 jours gérés (D25) ; 0 ou 7 : message « entre 1 et 6 jours »', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(isSupportedDays)).toEqual([false, true, true, true, true, true, true, false]);
    expect(unsupportedDaysMessage(7)).toMatch(/entre 1 et 6 jours/);
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

  // D25 : 1 jour est généré, avec l'avertissement STR-REP-1 ; 4 jours ne montre plus « prochaine version ».
  it("1 jour : l'avertissement STR-REP-1 s'affiche ; 4 jours : aucun message « prochaine version »", async () => {
    render(<Harness initial={await freshProfile()} />);
    await click('1');
    expect(await screen.findByText(/Une séance par semaine, c'est mieux que rien/)).toBeTruthy();
    await click('4');
    await waitFor(() => expect(screen.queryByText(/Une séance par semaine/)).toBeNull());
    expect(screen.queryByText(/prochaine version/)).toBeNull();
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
  // D25 : 4 jours = haut / bas (structure-programmes.md §2.3) ; plus de message « prochaine version ».
  it('profil terminé avec 4 jours : programme haut / bas proposé (D25)', async () => {
    setFichesForTests(FICHES as unknown as Fiche[]);
    const p0 = await freshProfile();
    const p = await update('profile', p0.id, { daysPerWeek: 4, level: 'debutant', sessionDurationMin: 45, profileCompletedAt: '2026-10-23T10:00:00.000Z' });
    render(<Home profile={p} onStart={() => {}} onEditStep={() => {}} onResume={() => {}} onOpenSession={() => {}} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Voir la séance' })).toBeTruthy(), { timeout: 20_000 });
    expect(screen.queryByText(/prochaine version/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Créer mon programme' })).toBeNull();
  }, 30_000);
});
