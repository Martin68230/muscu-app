// @vitest-environment jsdom
// Niveau 3, étape 2 : carte des muscles branchée (fiche, accueil + sous-écran du cycle) ; panneau au toucher, équivalent texte, calque de toucher.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import type { Fiche } from '../../src/data/fiches';
import type { Profile } from '../../src/data/model';
import { MuscleMapCard } from '../../src/ui/MuscleMapCard';
import { FicheView } from '../../src/ui/screens/Fiche';
import { HomeView, type WeekMuscles } from '../../src/ui/screens/Home';
import { cycleMaps, sessionMap, setsOfExercises, statusesForExercise, weekMap } from '../../src/zones/map-data';

const ALL: Fiche[] = JSON.parse(readFileSync('public/data/fiches.json', 'utf8')).fiches;
const byId = new Map(ALL.map((f) => [f.id, f]));
const PUSH = [{ movementId: 'developpe-couche-barre', sets: 4 }, { movementId: 'elevation-laterale', sets: 3 }];

afterEach(cleanup);

describe('MuscleMapCard', () => {
  it('au toucher d\'une zone (clic ou Entrée) : nom de la zone et ses points dans le panneau sous la carte, zone entourée', () => {
    const m = sessionMap(setsOfExercises(PUSH), byId);
    const { container } = render(<MuscleMapCard id="t" title="Muscles de cette séance" statuses={m.statuses} points={m.points} period="dans cette séance" />);
    expect(screen.getByText(/Touche une zone pour voir son nom et ses points/)).toBeTruthy();
    const pec = container.querySelector('path[data-zone="pectoraux_milieu_bas"]')!;
    expect(pec.getAttribute('role')).toBe('button');
    // Attribut en minuscules : « tabIndex » sur un élément SVG ne le rend pas focalisable (WebKit).
    expect(pec.getAttribute('tabindex')).toBe('0');
    expect(pec.querySelector('title')?.textContent).toMatch(/^Pectoraux/);
    fireEvent.keyDown(pec, { key: 'Enter' });
    const panel = container.querySelector('.mm-panel')!;
    expect(panel.getAttribute('role')).toBe('status');
    expect(panel.textContent).toMatch(/Pectoraux \(milieu et bas\) : travaillée en partie, 4 points dans cette séance\./);
    expect(pec.getAttribute('class')).toContain('mm-sel');
    fireEvent.click(container.querySelector('path[data-zone="mollets_soleaire"]')!);
    expect(panel.textContent).toMatch(/: peu ou pas travaillée, 0 points dans cette séance/);
    // Aucun sigle ni identifiant brut dans le panneau ou la liste.
    expect(container.textContent).not.toMatch(/_|undefined|NaN/);
  });
  it('calque de toucher transparent sur toute la carte (zone sensible agrandie), caché au lecteur d\'écran ; légende et liste des zones', () => {
    const { container } = render(<MuscleMapCard id="t" title="Carte" statuses={statusesForExercise(byId.get('developpe-couche-barre')!)} />);
    const hit = container.querySelector('rect.mm-hit')!;
    expect(hit.getAttribute('aria-hidden')).toBe('true');
    expect(hit.getAttribute('width')).toBe('410');
    expect(hit.getAttribute('height')).toBe('434');
    expect(screen.getByText('peu ou pas')).toBeTruthy();
    expect(screen.getByText('en partie')).toBeTruthy();
    expect(screen.getByText('bien travaillé')).toBeTruthy();
    expect(screen.getByText('Liste des zones')).toBeTruthy();
    expect(container.textContent).toMatch(/Principales :.*Pectoraux/);
    fireEvent.keyDown(container.querySelector('path[data-zone="pectoraux_milieu_bas"]')!, { key: ' ' });
    expect(container.querySelector('.mm-panel')!.textContent).toMatch(/muscle principal de l’exercice\.$/);
  });
});

describe('branchements', () => {
  it('fiche d\'exercice de force : « Où ça travaille » ; fiche de mobilité : pas de carte (tout serait gris)', () => {
    const view = (f: Fiche) => render(<FicheView fiche={f} all={ALL} equipment={null} injuries={[]} pregnancy={null} />);
    view(byId.get('developpe-couche-barre')!);
    expect(screen.getByRole('heading', { name: 'Où ça travaille' })).toBeTruthy();
    cleanup();
    view(byId.get('accroupi-profond-tenu')!);
    expect(screen.queryByRole('heading', { name: 'Où ça travaille' })).toBeNull();
  });
  it('accueil : carte de la semaine, puis sous-écran par type de séance et retour', () => {
    const days = [
      { sessionType: 'HAUT', exercises: PUSH },
      { sessionType: 'BAS', exercises: [{ movementId: 'developpe-couche-barre', sets: 1 }] },
    ];
    const muscles: WeekMuscles = { week: weekMap(days, byId), cycle: cycleMaps(days, byId) };
    const next = { dayIndex: 0, day: { label: 'Séance A', exercises: [], estimatedMin: 40 }, tooSoon: false, readyAt: null } as never;
    const noop = vi.fn();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    render(<HomeView profile={{ displayName: 'A' } as Profile} status={{ kind: 'seance', next, resume: null, muscles }} onStart={noop} onEditStep={noop} onResume={noop} onOpenSession={noop} onCloseStale={noop} />);
    expect(screen.getByRole('heading', { name: 'Muscles de ton cycle' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Voir par type de séance' }));
    expect(screen.getByRole('heading', { name: 'Muscles par type de séance' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Haut du corps (1 séance par cycle)' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Bas du corps (1 séance par cycle)' })).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: /Retour à l’accueil/ })[0]);
    expect(screen.getByRole('heading', { name: 'Muscles de ton cycle' })).toBeTruthy();
  });
  it('accueil sans programme (ou message de sécurité) : pas de carte', () => {
    const noop = vi.fn();
    render(<HomeView profile={{ displayName: 'A' } as Profile} status={{ kind: 'profil' }} onStart={noop} onEditStep={noop} onResume={noop} onOpenSession={noop} onCloseStale={noop} />);
    expect(screen.queryByRole('heading', { name: 'Muscles de ton cycle' })).toBeNull();
  });
});
