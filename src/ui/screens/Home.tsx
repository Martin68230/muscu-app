import type { Profile } from '../../data/model';
import type { Tab } from '../TabBar';

export function Home({ profile, go }: { profile: Profile; go: (t: Tab) => void }) {
  const hello = profile.displayName ? `Salut ${profile.displayName}` : 'Salut';
  return (
    <>
      <h1>{hello}</h1>
      <div class="card">
        <h2>Séance du jour</h2>
        <p class="dim">Pas encore de programme. Le générateur de séances arrive bientôt.</p>
      </div>
      <div class="card">
        <h2>Régularité</h2>
        <p class="dim">Aucune séance pour l'instant.</p>
      </div>
      <div class="thumb-zone">
        <button class="btn btn-primary" onClick={() => go('profil')}>
          Compléter mon profil
        </button>
      </div>
    </>
  );
}
