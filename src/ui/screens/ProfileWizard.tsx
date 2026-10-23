import { useEffect, useRef, useState } from 'preact/hooks';
import type { MainGoalKey, Profile } from '../../data/model';
import { update } from '../../data/repo';
import {
  DAYS_CHOICES, DURATIONS, NIVEAUX, OBJECTIFS, PLACES, PREGNANCY_CHOICES, PREGNANCY_TEXT, PROFILE_STEPS, WEEKDAYS,
  completeProfile, freeDaysEnough, getMainGoal, isSupportedDays, setMainGoal, unsupportedDaysMessage, type ProfileStep,
} from '../../data/profile-setup';
import { Equipment } from './Equipment';
import { Injuries } from './Injuries';

export const STEP_TITLES: Record<ProfileStep, string> = {
  jours: 'Combien de jours par semaine ?',
  bloques: 'Des jours impossibles ?',
  duree: 'Combien de temps par séance ?',
  lieu: "Où t'entraînes-tu ?",
  materiel: 'Ton matériel',
  niveau: 'Ton niveau',
  objectif: 'Ton objectif principal',
  blessures: 'Une gêne ou une blessure ?',
  grossesse: 'Grossesse ou post-partum ?',
};

function Choice({ selected, label, hint, onClick, big }: {
  selected: boolean; label: string; hint?: string; onClick: () => void; big?: boolean;
}) {
  return (
    <button class={big ? 'choice choice-big' : 'choice'} aria-pressed={selected} onClick={onClick}>
      <span class="choice-label">{label}</span>
      {hint && <span class="choice-hint">{hint}</span>}
    </button>
  );
}

/**
 * Profil en cartes (F1) : une carte par écran, enregistrement à chaque choix, retour en arrière facile.
 * `only` : une seule carte (modification depuis Profil). Sans `only` : le parcours complet.
 */
export function ProfileWizard({ profile, onChange, onExit, only }: {
  profile: Profile;
  onChange: (p: Profile) => void;
  onExit: () => void;
  only?: ProfileStep;
}) {
  const single = only !== undefined;
  const [index, setIndex] = useState(single ? PROFILE_STEPS.indexOf(only) : 0);
  const [done, setDone] = useState(false);
  const [goal, setGoal] = useState<MainGoalKey | null>(null);
  const [durationChosen, setDurationChosen] = useState(profile.sessionDurationMin !== null || !!profile.profileCompletedAt);
  const screen = useRef<HTMLElement>(null);
  const step = PROFILE_STEPS[index];

  useEffect(() => {
    getMainGoal().then(setGoal);
  }, []);
  useEffect(() => {
    screen.current?.scrollTo?.(0, 0);
  }, [index, done]);

  const save = async (patch: Partial<Profile>) => onChange(await update('profile', profile.id, patch));

  const days = profile.daysPerWeek;
  const blocked = profile.blockedWeekdays;
  const canNext: Record<ProfileStep, boolean> = {
    jours: days !== null,
    bloques: true,
    duree: durationChosen,
    lieu: !!profile.place,
    materiel: true,
    niveau: !!profile.level,
    objectif: goal !== null,
    blessures: true,
    grossesse: true,
  };

  const next = async () => {
    if (single) return onExit();
    if (index < PROFILE_STEPS.length - 1) return setIndex(index + 1);
    onChange(await completeProfile(profile.id));
    setDone(true);
  };

  const body = () => {
    switch (step) {
      case 'jours':
        return (
          <>
            <p class="dim">Choisis le nombre de séances que tu peux tenir chaque semaine.</p>
            <div class="choice-grid choice-grid-3" role="group" aria-label="Jours par semaine">
              {DAYS_CHOICES.map((d) => (
                <Choice key={d} big selected={days === d} label={String(d)} onClick={() => save({ daysPerWeek: d })} />
              ))}
            </div>
            {days !== null && !isSupportedDays(days) && (
              <div class="notice" role="status"><p>{unsupportedDaysMessage(days)}</p></div>
            )}
            {days === null && <p class="dim small">Disponible dès maintenant : 2 ou 3 jours.</p>}
          </>
        );
      case 'bloques':
        return (
          <>
            <p class="dim">Facultatif. Touche les jours où tu ne t'entraînes jamais.</p>
            <div class="weekdays" role="group" aria-label="Jours impossibles">
              {WEEKDAYS.map((w) => (
                <button
                  key={w.index}
                  class="weekday"
                  aria-label={w.long}
                  aria-pressed={blocked.includes(w.index)}
                  onClick={() =>
                    save({ blockedWeekdays: blocked.includes(w.index) ? blocked.filter((x) => x !== w.index) : [...blocked, w.index].sort() })
                  }
                >
                  {w.short}
                </button>
              ))}
            </div>
            {!freeDaysEnough(days, blocked) && (
              <div class="notice" role="status"><p>Il ne te reste pas assez de jours libres pour {days} séances par semaine.</p></div>
            )}
          </>
        );
      case 'duree':
        return (
          <>
            <p class="dim">L'appli adapte le nombre d'exercices à ce temps.</p>
            <div class="choice-grid choice-grid-2" role="group" aria-label="Durée de séance">
              {DURATIONS.map((d) => (
                <Choice
                  key={String(d.value)}
                  selected={durationChosen && profile.sessionDurationMin === d.value}
                  label={d.label}
                  onClick={() => {
                    setDurationChosen(true);
                    save({ sessionDurationMin: d.value });
                  }}
                />
              ))}
            </div>
          </>
        );
      case 'lieu':
        return (
          <div class="choice-list" role="group" aria-label="Lieu d'entraînement">
            {PLACES.map((p) => (
              <Choice key={p.value} selected={profile.place === p.value} label={p.label} hint={p.hint} onClick={() => save({ place: p.value })} />
            ))}
          </div>
        );
      case 'materiel':
        return <Equipment />;
      case 'niveau':
        return (
          <div class="choice-list" role="group" aria-label="Niveau">
            {NIVEAUX.map((n) => (
              <Choice key={n.value} selected={profile.level === n.value} label={n.label} hint={n.hint} onClick={() => save({ level: n.value })} />
            ))}
          </div>
        );
      case 'objectif':
        return (
          <div class="choice-list" role="group" aria-label="Objectif principal">
            {OBJECTIFS.map((o) => (
              <Choice
                key={o.value}
                selected={goal === o.value}
                label={o.label}
                hint={o.hint}
                onClick={async () => {
                  setGoal(o.value);
                  await setMainGoal(o.value);
                }}
              />
            ))}
          </div>
        );
      case 'blessures':
        return <Injuries />;
      case 'grossesse':
        return (
          <>
            <p class="dim">{PREGNANCY_TEXT}</p>
            <div class="choice-grid choice-grid-3" role="group" aria-label="Grossesse ou post-partum">
              {PREGNANCY_CHOICES.map((c) => (
                <Choice key={c.value} selected={profile.pregnancy === c.value} label={c.label} onClick={() => save({ pregnancy: c.value })} />
              ))}
            </div>
          </>
        );
    }
  };

  if (done) {
    return (
      <div class="shell">
        <main class="screen screen-wizard" ref={screen}>
          <h1>Ton profil est prêt</h1>
          <div class="card">
            <p>Tout est enregistré sur ce téléphone. Tu peux tout modifier depuis l'onglet Profil.</p>
            {days !== null && !isSupportedDays(days) ? (
              <p class="dim">{unsupportedDaysMessage(days)}</p>
            ) : (
              <p class="dim">Le générateur de programme arrive bientôt.</p>
            )}
          </div>
          <div class="thumb-zone thumb-zone-alone">
            <button class="btn btn-primary" onClick={onExit}>Aller à l'accueil</button>
          </div>
        </main>
      </div>
    );
  }

  const total = PROFILE_STEPS.length;
  const last = index === total - 1;
  return (
    <div class="shell">
      <main class="screen screen-wizard" ref={screen}>
        {!single && (
          <div class="wizard-progress" role="progressbar" aria-label="Progression du profil" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1}>
            <div class="wizard-bar"><div class="wizard-bar-fill" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
            <p class="dim small">Étape {index + 1} sur {total}</p>
          </div>
        )}
        <h1>{STEP_TITLES[step]}</h1>
        {body()}
        <div class="thumb-zone thumb-zone-alone">
          <div class="step-nav">
            {!single && index > 0 && <button class="btn" onClick={() => setIndex(index - 1)}>Retour</button>}
            {single && <button class="btn" onClick={onExit}>Retour</button>}
            <button class="btn btn-primary" disabled={!canNext[step]} onClick={next}>
              {single ? 'Terminer' : last ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
