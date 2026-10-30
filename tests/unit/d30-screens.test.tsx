// @vitest-environment jsdom
// D30 / D31 : écrans (interrupteur de l'option de cardio, notes des sauts T8 et de l'extérieur T9, lecteur du jour léger sur l'heure réelle).
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import type { LightDay, PlannedExercise } from '../../src/data/model';
import { D30_TEXT } from '../../src/session/messages';
import { SwitchRow } from '../../src/ui/SwitchRow';
import { CardioDayNotes, JumpPlayNotes, OutdoorPlayNotes } from '../../src/ui/session/CardioNotes';
import { LightDayCard } from '../../src/ui/LightDayCard';

afterEach(cleanup);

const ex = (o: Partial<PlannedExercise>): PlannedExercise => ({
  movementId: 'm', variantId: 'v', sets: 2, repsMin: 10, repsMax: 10, restSec: 60, supersetGroup: null, rirTarget: 3, unit: 'reps', holdSec: null,
  warmupSets: [], role: 'cardio', slot: 'sauts', startLoadKg: null, capped: true, adaptation: null, substitut: false, ...o,
});

describe('Option « Ajouter une séance de cardio ? »', () => {
  it('grisée avec la phrase de la règle ; cochable sinon', () => {
    const onToggle = vi.fn();
    render(<SwitchRow id="a" label={D30_TEXT.optionLabel} on={false} help={D30_TEXT.optionExplain} disabledReason={D30_TEXT.optionNoDay} onToggle={onToggle} />);
    const sw = screen.getByRole('switch', { name: D30_TEXT.optionLabel });
    expect((sw as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(D30_TEXT.optionNoDay)).toBeTruthy();
    cleanup();
    render(<SwitchRow id="a" label={D30_TEXT.optionLabel} on={false} help={D30_TEXT.optionExplain} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});

describe('Notes des sauts et de l\'extérieur', () => {
  it('aperçu : T8 avant les sauts, « version sans saut d\'abord » pour le débutant ; T9 et alternative intérieure dehors', () => {
    render(<CardioDayNotes day={{ exercises: [ex({ jump: { soft: true, softVariantId: 's', softNom: 'Doux', contacts: 0 } }), ex({ role: 'cardio', unit: 'sec', jump: undefined, outdoor: true })] }} />);
    expect(screen.getByText(D30_TEXT.T8)).toBeTruthy();
    expect(screen.getByText(D30_TEXT.softFirst)).toBeTruthy();
    expect(screen.getByText(D30_TEXT.T9)).toBeTruthy();
    expect(screen.getByText(D30_TEXT.indoorTitle)).toBeTruthy();
  });
  it('rien pour une séance sans saut ni extérieur', () => {
    const { container } = render(<CardioDayNotes day={{ exercises: [ex({ unit: 'sec' })] }} />);
    expect(container.textContent).toBe('');
  });
  it('lecteur : « jambes lourdes ? » oui -> version sans saut ; extérieur : rappel en une ligne', () => {
    render(<JumpPlayNotes ex={ex({ jump: { soft: false, softVariantId: 's', softNom: 'Doux', contacts: 50 } })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Oui' }));
    expect(screen.getByRole('status').textContent).toContain(D30_TEXT.heavyYes);
    cleanup();
    render(<OutdoorPlayNotes ex={ex({ outdoor: true })} />);
    expect(screen.getByText(D30_TEXT.T9short)).toBeTruthy();
  });
});

describe('Lecteur du jour léger (STR-REP-12)', () => {
  const day: LightDay = {
    weekday: 2, estimatedMin: 10,
    warmup: { generalSec: 180, general: { ficheId: 'g', variantId: 'g', nom: 'Échauffement', sec: 180 }, mobility: [{ ficheId: 'm', variantId: 'm', nom: 'Mobilité hanches', sec: 75 }], cooldown: null },
    cardio: { ficheId: 'w', variantId: 'marche-rapide-continue', nom: 'Marche', minutes: 10 },
  };
  it('cardio doux facultatif avec minuteur sur l\'heure réelle', () => {
    let t = 1_000_000;
    render(<LightDayCard day={day} painYesterday={false} now={() => t} />);
    expect(screen.getByText(D30_TEXT.lightIntro)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Commencer la marche' }));
    expect(screen.getByRole('timer').textContent).toBe('10:00');
    t += 125_000;
    fireEvent.click(screen.getByRole('button', { name: 'Arrêter' }));
    expect(screen.getByRole('button', { name: 'Commencer la marche' })).toBeTruthy();
  });
  it('douleur la veille : mobilité seulement', () => {
    render(<LightDayCard day={day} painYesterday={true} />);
    expect(screen.getByText(D30_TEXT.lightNoCardio)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Commencer la marche' })).toBeNull();
  });
});
