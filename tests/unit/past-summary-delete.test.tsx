// @vitest-environment jsdom
// Suppression d'une séance de l'historique : la confirmation dit que les séries et l'historique de charges seront effacés.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { ensureLocalUser } from '../../src/data/bootstrap';
import { create, list } from '../../src/data/repo';
import { PastSummary } from '../../src/ui/screens/PastSummary';

afterEach(cleanup);

describe('PastSummary : suppression', () => {
  it('la confirmation prévient que les séries et les charges sont effacées, puis la séance et ses séries disparaissent', async () => {
    await ensureLocalUser();
    const session = await create('sessions', {
      programId: null, programDayIndex: null, plannedDate: '2026-10-20', status: 'faite',
      startedAt: '2026-10-20T08:00:00.000Z', endedAt: '2026-10-20T08:40:00.000Z', note: '',
    } as never);
    await create('sets', {
      sessionId: session.id, movementId: 'pompe', variantId: 'pompe-base', exerciseIndex: 0, setIndex: 0, targetRepsMin: 8, targetRepsMax: 12,
      reps: 10, loadKg: 20, rir: 2, pain: false, comment: '', completedAt: '2026-10-20T08:10:00.000Z',
    } as never);
    const onDeleted = vi.fn();
    render(<PastSummary sessionId={session.id} pregnancy={null} onBack={() => {}} onDeleted={onDeleted} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Supprimer cette séance' }));
    expect(screen.getByText(/séries de cette séance et l’historique de tes charges pour cette séance seront aussi effacés/)).toBeTruthy();
    expect(screen.getByText(/définitive/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Oui, supprimer' }));
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect((await list('sessions')).some((s) => s.id === session.id)).toBe(false);
    expect((await list('sets')).filter((s) => s.sessionId === session.id)).toHaveLength(0);
  });
});
