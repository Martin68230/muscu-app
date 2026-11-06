// @vitest-environment jsdom
// Niveau 2, étape 3 : branchement du rattrapage des zones (catchUpOf, launch.ts) et texte de l'aperçu.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/preact';
import type { Program, SetLog } from '../../src/data/model';
import { generateProgram, toProgramDays } from '../../src/generator';
import type { NextSession } from '../../src/session/program';
import { PreviewView } from '../../src/ui/screens/Preview';
import { catchUpOf, type PlayerData } from '../../src/ui/session/launch';
import { FICHES, mk } from './generator-helpers';
import { day, ex } from './session-helpers';

afterEach(cleanup);

describe('aperçu : rattrapage des zones', () => {
  const d = day([ex({ variantId: 'a' })]);
  const program = { days: [d], explanation: [], messages: [] } as unknown as Program;
  const next = { dayIndex: 0, day: d, tooSoon: false, availableAtMs: null, scheduledToday: true } as NextSession;
  it('une ligne simple par série ajoutée', () => {
    const fiches = [{ id: d.exercises[0].movementId, nom: 'Pompes', variantes: [] }] as never;
    render(<PreviewView program={program} next={next} fiches={fiches} onBegin={() => undefined} catchUp={[{ movementId: d.exercises[0].movementId, zone: 'pectoraux_haut' }]} />);
    expect(screen.getByText('Cette semaine : une série en plus à Pompes, pour des zones qui ont eu peu de travail la semaine dernière.')).toBeTruthy();
  });
  it('rien sans rattrapage', () => {
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} />);
    expect(screen.queryByLabelText('Rattrapage des zones')).toBeNull();
  });
});

describe('catchUpOf : première séance de la semaine seulement, jamais en reprise douce', () => {
  // Règle du 06/11/2026 : « illimité » = séance remplie à 60 min, rattrapage jusqu'à 75 (limitMin) ; durée choisie : jamais au-delà.
  const input = mk({ level: 'intermediaire', days: 3, dur: null, goal: 'muscle', profile: 'F', place: 'salle' });
  const r = generateProgram(input);
  if (!r.ok) throw new Error('programme');
  const now = new Date(2026, 10, 10, 12).getTime();
  const program = { id: 'p', startDate: '2026-11-02', days: toProgramDays(r.program).map((d, i) => (i ? d : { ...d, exercises: d.exercises.map((e) => (e.sets > 2 && !e.capped && !e.supersetGroup ? { ...e, sets: e.sets - 1 } : e)) })), durationMin: r.program.durationMin } as unknown as Program;
  const data = (sets: SetLog[]) => ({ input, sets, sessions: [], injuries: [], fiches: FICHES, frozen: false }) as unknown as PlayerData;
  const done = (iso: string) => ({ id: 'x', sessionId: 's', movementId: program.days[0].exercises[0].movementId, reps: 10, pain: false, completedAt: iso } as SetLog);

  it('semaine 2 sans séance faite : séries en plus calculées', () => {
    const cu = catchUpOf(data([]), program, 0, program.days[0], false, now);
    expect(cu).not.toBeNull();
    expect(cu!.added.length).toBeGreaterThan(0);
  });
  it('une séance déjà faite cette semaine : rien (une seule séance de rattrapage)', () => {
    expect(catchUpOf(data([done(new Date(2026, 10, 9, 10).toISOString())]), program, 0, program.days[0], false, now)).toBeNull();
  });
  it('reprise douce ou première semaine : rien', () => {
    expect(catchUpOf(data([]), program, 0, program.days[0], true, now)).toBeNull();
    expect(catchUpOf(data([]), program, 0, program.days[0], false, new Date(2026, 10, 5, 12).getTime())).toBeNull();
  });
});
