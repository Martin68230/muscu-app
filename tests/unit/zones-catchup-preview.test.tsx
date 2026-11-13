// @vitest-environment jsdom
// Niveau 2, étape 3 : branchement du rattrapage des zones (catchUpOf, launch.ts) et texte de l'aperçu.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/preact';
import type { Program, SetLog } from '../../src/data/model';
import { generateProgram, toProgramDays } from '../../src/generator';
import type { NextSession } from '../../src/session/program';
import { PreviewView } from '../../src/ui/screens/Preview';
import { ZONE_CATCHUP_TEXT } from '../../src/session/messages';
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
  it('RAT-3 : une zone restée basse deux semaines est dite avec sa cause, sans reproche', () => {
    const notes = [ZONE_CATCHUP_TEXT.stuck('épaules (côté)', 'sport'), ZONE_CATCHUP_TEXT.review(['ischios'])];
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} catchUpNotes={notes} />);
    expect(screen.getByText('La zone « épaules (côté) » est restée basse deux semaines. Ton sport prend de la place : je n’ajoute rien pour l’instant.')).toBeTruthy();
    expect(screen.getByLabelText('Zones restées basses')).toBeTruthy();
    for (const c of ['protection', 'plafond', 'materiel', 'manquee', 'sport'] as const) expect(ZONE_CATCHUP_TEXT.stuck('ischios', c)).not.toMatch(/FIFA|OSTRC|faute|paresse|tu dois|médic/i);
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

  it('semaine 2 sans séance faite : séance manquée = aucune série en plus (RAT-4), journal prêt avec la cause', () => {
    const cu = catchUpOf(data([]), program, 0, program.days[0], false, now);
    expect(cu).not.toBeNull();
    expect(cu!.added).toEqual([]);
    expect(cu!.swapped).toBeUndefined();
    expect(cu!.weekKey).toBe('2026-11-09');
    expect(cu!.log.some((l) => l.cause === 'manquee')).toBe(true);
  });
  it('semaine 1 faite comme prévu : défaut de répartition rattrapé (sans journal : 1 série et 1 zone au plus)', () => {
    const planned = program.days.flatMap((d, i) => d.exercises.filter((e) => e.role !== 'cardio').flatMap((e) => Array.from({ length: e.sets }, (_, k) => ({ id: `s${i}${e.movementId}${k}`, sessionId: `s${i}`, movementId: e.movementId, reps: 10, pain: false, completedAt: new Date(2026, 10, 3, 10).toISOString() } as SetLog))));
    const cu = catchUpOf(data(planned), program, 0, program.days[0], false, now);
    expect(cu).not.toBeNull();
    expect(cu!.added.length).toBeLessThanOrEqual(1);
  });
  it('une séance déjà faite cette semaine : rien (une seule séance de rattrapage)', () => {
    expect(catchUpOf(data([done(new Date(2026, 10, 9, 10).toISOString())]), program, 0, program.days[0], false, now)).toBeNull();
  });
  it('reprise douce ou première semaine : rien', () => {
    expect(catchUpOf(data([]), program, 0, program.days[0], true, now)).toBeNull();
    expect(catchUpOf(data([]), program, 0, program.days[0], false, new Date(2026, 10, 5, 12).getTime())).toBeNull();
  });
});
