import type { Profile } from '../../data/model';
import { isProfileComplete, isSupportedDays, unsupportedDaysMessage } from '../../data/profile-setup';

export function Home({ profile, onStart }: { profile: Profile; onStart: () => void }) {
  const hello = profile.displayName ? `Salut ${profile.displayName}` : 'Salut';
  const complete = isProfileComplete(profile);
  const days = profile.daysPerWeek;
  return (
    <>
      <h1>{hello}</h1>
      <div class="card">
        <h2>Séance du jour</h2>
        {!complete && <p class="dim">Réponds à quelques questions (moins d'une minute) pour préparer ton programme.</p>}
        {complete && days !== null && !isSupportedDays(days) && <p class="dim">{unsupportedDaysMessage(days)}</p>}
        {complete && (days === null || isSupportedDays(days)) && (
          <p class="dim">Ton profil est prêt. Le générateur de séances arrive bientôt.</p>
        )}
      </div>
      <div class="card">
        <h2>Régularité</h2>
        <p class="dim">Aucune séance pour l'instant.</p>
      </div>
      <div class="thumb-zone">
        <button class="btn btn-primary" onClick={onStart}>
          {complete ? 'Modifier mon profil' : 'Créer mon programme'}
        </button>
      </div>
    </>
  );
}
