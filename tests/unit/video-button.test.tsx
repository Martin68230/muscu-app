// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { PLAYER_TIMEOUT_MS, VideoButton, embedUrl, isValidVideo } from '../../src/ui/VideoButton';

const YT = { kind: 'youtube', id: 'dQw4w9WgXcQ' } as const;

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => value });
}

beforeEach(() => setOnline(true));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('VideoButton (D12)', () => {
  it("n'affiche que le bouton : aucun lecteur ni adresse tierce tant qu'on n'a pas appuyé", () => {
    const { container } = render(<VideoButton video={YT} title="Pompe" />);
    expect(screen.getByRole('button', { name: /Voir une vidéo/ })).toBeTruthy();
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('video')).toBeNull();
    expect(container.innerHTML).not.toMatch(/youtube/i);
  });

  it("charge le lecteur youtube-nocookie seulement après l'appui", () => {
    const { container } = render(<VideoButton video={YT} title="Pompe" />);
    fireEvent.click(screen.getByRole('button', { name: /Voir une vidéo/ }));
    const frame = container.querySelector('iframe');
    expect(frame?.getAttribute('src')).toBe(embedUrl('dQw4w9WgXcQ'));
    expect(frame?.getAttribute('src')).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
  });

  it('est masqué hors ligne et au passage hors ligne', async () => {
    setOnline(false);
    const { container } = render(<VideoButton video={YT} title="Pompe" />);
    expect(container.querySelector('button')).toBeNull();
    await act(async () => {
      setOnline(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(container.querySelector('button')).not.toBeNull();
    await act(async () => {
      setOnline(false);
      window.dispatchEvent(new Event('offline'));
    });
    expect(container.querySelector('button')).toBeNull();
  });

  it('est masqué sans identifiant ou avec un identifiant invalide', () => {
    const a = render(<VideoButton video={null} title="x" />);
    expect(a.container.innerHTML).toBe('');
    const b = render(<VideoButton video={{ kind: 'youtube', id: '../evil' }} title="x" />);
    expect(b.container.innerHTML).toBe('');
    expect(isValidVideo({ kind: 'fichier', file: 'pompe.mp4' })).toBe(true);
    expect(isValidVideo({ kind: 'fichier', file: '../a.mp4' })).toBe(false);
  });

  it('disparaît si le lecteur échoue', () => {
    const { container } = render(<VideoButton video={YT} title="Pompe" />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.error(container.querySelector('iframe')!);
    expect(container.innerHTML).toBe('');
  });

  it("disparaît si le lecteur n'a rien affiché après le délai, mais pas s'il a chargé", async () => {
    vi.useFakeTimers();
    const a = render(<VideoButton video={YT} title="Pompe" />);
    fireEvent.click(screen.getByRole('button'));
    await act(async () => {
      vi.advanceTimersByTime(PLAYER_TIMEOUT_MS + 10);
    });
    expect(a.container.innerHTML).toBe('');
    cleanup();
    const b = render(<VideoButton video={YT} title="Pompe" />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.load(b.container.querySelector('iframe')!);
    await act(async () => {
      vi.advanceTimersByTime(PLAYER_TIMEOUT_MS + 10);
    });
    expect(b.container.querySelector('iframe')).not.toBeNull();
  });

  it("lit une vidéo de l'utilisateur avec la balise video, sans tiers", () => {
    const { container } = render(<VideoButton video={{ kind: 'fichier', file: 'pompe-inclinee.mp4' }} title="Pompe" />);
    fireEvent.click(screen.getByRole('button'));
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('video')?.getAttribute('src')).toBe('videos/pompe-inclinee.mp4');
  });
});
