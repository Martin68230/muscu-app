import type { ComponentType } from 'preact';
import { IconCalendar, IconFriends, IconHome, IconLibrary, IconProfile } from './icons';

export type Tab = 'accueil' | 'calendrier' | 'bibliotheque' | 'amis' | 'profil';

/** L'onglet Amis reste masqué jusqu'à la phase 6 (comptes). */
export const FRIENDS_ENABLED = false;

const TABS: { id: Tab; label: string; Icon: ComponentType }[] = [
  { id: 'accueil', label: 'Accueil', Icon: IconHome },
  { id: 'calendrier', label: 'Calendrier', Icon: IconCalendar },
  { id: 'bibliotheque', label: 'Bibliothèque', Icon: IconLibrary },
  { id: 'amis', label: 'Amis', Icon: IconFriends },
  { id: 'profil', label: 'Profil', Icon: IconProfile },
];

export function TabBar({ current, onSelect }: { current: Tab; onSelect: (t: Tab) => void }) {
  return (
    <nav class="tabbar" aria-label="Navigation principale">
      {TABS.filter((t) => t.id !== 'amis' || FRIENDS_ENABLED).map(({ id, label, Icon }) => (
        <button
          key={id}
          class="tab"
          aria-current={current === id ? 'page' : undefined}
          onClick={() => onSelect(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  );
}
