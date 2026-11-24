// Lieu de chaque jour (24/11/2026) : « Salle », « Maison », « Dehors » ou « Repos » pour les 7 jours ; chaque séance se construit avec le matériel du lieu de CE
// jour. Sans réglage, le lieu unique du profil vaut pour tous les jours. Réglage privé, local, jamais partagé. Mobile d'abord : une ligne par jour, boutons >= 44 px.
import type { DayPlace, Profile } from '../../data/model';
import { update } from '../../data/repo';
import { WEEKDAYS } from '../../data/profile-setup';
import { dominantPlace, PLACE_PRESETS, validDayPlaces } from '../../generator/day-places';

export const DAY_PLACE_TEXT = {
  title: 'Lieu de chaque jour',
  intro: 'Choisis où tu t’entraînes chaque jour. La séance d’un jour de salle utilise les machines, poulies, barres et haltères ; celle d’un jour à la maison, ton matériel de maison.',
  single: 'Un seul lieu pour tous les jours',
  choose: 'Choisir un lieu par jour',
  allGym: 'Tous en salle',
  someGym: 'Salle lun / mer / ven, maison le reste',
  allHome: 'Tous à la maison',
  back: 'Revenir à un seul lieu',
  tip: 'Les jours de salle sont utilisés en premier. Un jour de repos ne reçoit jamais de séance.',
} as const;
export const DAY_PLACE_CHOICES: [DayPlace, string][] = [['salle', 'Salle'], ['maison', 'Maison'], ['dehors', 'Dehors'], ['repos', 'Repos']];
export const placeLabel = (p: 'salle' | 'maison' | 'dehors' | null | undefined): string => (p === 'salle' ? 'salle' : p === 'dehors' ? 'dehors' : p === 'maison' ? 'maison' : '');

/** Résumé court : « Lieu unique : maison » ou « Salle : lun, mer, ven · Maison : mar, jeu · … ». */
export function dayPlacesSummary(dp: readonly DayPlace[] | null, place: string | null | undefined): string {
  if (!dp) return `Lieu unique : ${place === 'salle' ? 'salle' : 'maison'}`;
  return DAY_PLACE_CHOICES.map(([k, t]) => {
    const ds = WEEKDAYS.filter((w) => dp[w.index] === k).map((w) => w.long.slice(0, 3));
    return ds.length ? `${t} : ${ds.join(', ')}` : '';
  }).filter(Boolean).join(' · ');
}

export function DayPlacesCard({ profile, onChange }: { profile: Profile; onChange: (p: Profile) => void }) {
  const dp = validDayPlaces(profile.dayPlaces);
  const save = async (next: DayPlace[]) => {
    // Le lieu général suit le lieu dominant (salle ou maison) ; « [] » = revenir à un seul lieu.
    const dom = dominantPlace(next.length === 7 ? next : null);
    onChange(await update('profile', profile.id, { dayPlaces: next, ...(dom === 'salle' ? { place: 'salle' as const } : dom === 'maison' ? { place: 'maison' as const } : {}) }));
  };
  const start = () => save(profile.place === 'salle' ? PLACE_PRESETS.toutSalle : PLACE_PRESETS.toutMaison);
  return (
    <div class="card" role="group" aria-label={DAY_PLACE_TEXT.title}>
      <h3 class="eq-title">{DAY_PLACE_TEXT.title}</h3>
      <p class="dim small">{DAY_PLACE_TEXT.intro}</p>
      {!dp && (
        <>
          <p>{dayPlacesSummary(null, profile.place)}</p>
          <button type="button" class="btn" onClick={start}>{DAY_PLACE_TEXT.choose}</button>
        </>
      )}
      {dp && (
        <>
          <div class="chips" role="group" aria-label="Raccourcis">
            <button type="button" class="chip" onClick={() => save(PLACE_PRESETS.toutSalle)}>{DAY_PLACE_TEXT.allGym}</button>
            <button type="button" class="chip" onClick={() => save(PLACE_PRESETS.salleLunMerVen)}>{DAY_PLACE_TEXT.someGym}</button>
            <button type="button" class="chip" onClick={() => save(PLACE_PRESETS.toutMaison)}>{DAY_PLACE_TEXT.allHome}</button>
          </div>
          {WEEKDAYS.map((w) => (
            <div key={w.index} class="dayplace-row">
              <p class="dayplace-day">{w.long}</p>
              <div class="segmented" role="group" aria-label={`Lieu du ${w.long}`}>
                {DAY_PLACE_CHOICES.map(([value, label]) => (
                  <button key={value} type="button" aria-pressed={dp[w.index] === value} onClick={() => save(dp.map((x, i) => (i === w.index ? value : x)))}>{label}</button>
                ))}
              </div>
            </div>
          ))}
          <p class="dim small">{DAY_PLACE_TEXT.tip}</p>
          <button type="button" class="btn" onClick={() => save([])}>{DAY_PLACE_TEXT.back}</button>
        </>
      )}
    </div>
  );
}
