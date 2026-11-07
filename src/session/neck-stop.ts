// Cou placé automatiquement (kiné, 07/11/2026) : un malaise ou une douleur pendant l'exercice du cou le retire des séances suivantes.
// Le dépistage passe à « Oui » (neckScreen = 'oui') : le générateur (neckScreenOk) ne place plus le cou, la personne peut le corriger au profil.
import { list, update } from '../data/repo';
import type { Profile, SessionEndReason } from '../data/model';

export const NECK_FICHE_ID = 'renfo-cou-isometrique';

/** Vrai si la séance doit retirer le cou : malaise (symptome / pas_bien) ou douleur signalée sur l'exercice du cou. */
export function neckMustBeRemoved(input: {
  endReason?: SessionEndReason | null;
  painExercises?: readonly number[];
  exercises?: readonly { movementId: string }[];
}): boolean {
  if (input.endReason === 'symptome' || input.endReason === 'pas_bien') return true;
  const ex = input.exercises ?? [];
  return (input.painExercises ?? []).some((i) => ex[i]?.movementId === NECK_FICHE_ID);
}

/** Pur : profil après retrait (inchangé si le dépistage n'est pas « non »). */
export const profileAfterNeckStop = (p: Pick<Profile, 'neckScreen'>): Pick<Profile, 'neckScreen'> =>
  p.neckScreen === 'non' ? { neckScreen: 'oui' } : { neckScreen: p.neckScreen };

/** Écrit le retrait dans le profil local (rien si le dépistage n'est pas « non »). */
export async function removeNeckFromProfile(): Promise<void> {
  const [profile] = await list('profile');
  if (profile && profile.neckScreen === 'non') await update('profile', profile.id, { neckScreen: 'oui' });
}
