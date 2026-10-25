// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/preact';
import { HowTo } from '../../src/ui/screens/Player';

afterEach(cleanup);

describe('lecteur : « Comment faire »', () => {
  it('affiche au plus les 3 premières consignes, sans mention interne', () => {
    render(<HowTo steps={['Étape un.', 'Étape deux (R9).', 'Étape trois.', 'Étape quatre.']} all={[]} />);
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items).toEqual(['Étape un.', 'Étape deux.', 'Étape trois.']);
    expect(screen.getByRole('heading', { name: 'Comment faire' })).toBeTruthy();
  });
  it('rien à afficher sans consigne', () => {
    const { container } = render(<HowTo steps={[]} all={[]} />);
    expect(container.textContent).toBe('');
  });
});
