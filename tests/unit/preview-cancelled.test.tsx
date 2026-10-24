// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/preact';
import type { Program } from '../../src/data/model';
import type { NextSession } from '../../src/session/program';
import { PreviewView } from '../../src/ui/screens/Preview';
import { day, ex } from './session-helpers';

afterEach(cleanup);
const d = day([ex({ variantId: 'a' })]);
const program = { days: [d], explanation: [], messages: [] } as unknown as Program;
const next = { dayIndex: 0, day: d, tooSoon: false, availableAtMs: null, scheduledToday: true } as NextSession;

describe('aperçu : décision d’échelon annulée', () => {
  it('message clair quand le programme a changé', () => {
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} cancelled />);
    expect(screen.getByText('La proposition d’échelon est annulée parce que ton programme a changé.')).toBeTruthy();
  });
  it('rien quand il n’y a rien à dire', () => {
    render(<PreviewView program={program} next={next} fiches={[]} onBegin={() => undefined} />);
    expect(screen.queryByText(/annulée/)).toBeNull();
  });
});
