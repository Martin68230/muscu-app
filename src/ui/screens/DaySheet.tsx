// Fiche de journée du calendrier : navigation jour précédent / suivant et séance prévue (nom, durée, exercices). Les repas sont dans NutritionMeals (DayMeals).
// Réutilise le programme actif et les textes de séance existants (src/session, src/ui/session/text) : aucune logique de séance dupliquée.
import { useEffect, useState } from 'preact/hooks';
import type { Program, ProgramDay } from '../../data/model';
import { loadFiches, type Fiche } from '../../data/fiches';
import { addDaysKey } from '../../nutrition/meals-calendar';
import { placeLabel } from './DayPlaces';
import { dateKey, frDate, parseKey } from '../../session/calendar';
import { getActiveProgram, getNextSession } from '../../session/program';
import { exName, lineText, withSides } from '../session/text';

const weekdayOf = (key: string): number => (parseKey(key).getDay() + 6) % 7;

/** Bandeau de navigation : jour précédent, date, jour suivant, fermer. Boutons de 44 px. */
export function DayNav({ date, todayKey, onGo, onClose }: { date: string; todayKey: string; onGo: (key: string) => void; onClose: () => void }) {
  return (
    <div class="day-nav" role="group" aria-label="Changer de jour">
      <button type="button" class="cal-nav" aria-label="Jour précédent" onClick={() => onGo(addDaysKey(date, -1))}>‹</button>
      <h2 class="cap-first" aria-live="polite">{frDate(date)}{date === todayKey ? ' · aujourd’hui' : ''}</h2>
      <button type="button" class="cal-nav" aria-label="Jour suivant" onClick={() => onGo(addDaysKey(date, 1))}>›</button>
      <button type="button" class="cal-nav" aria-label="Fermer le détail du jour" onClick={onClose}>✕</button>
    </div>
  );
}

/** Séance prévue ce jour-là d'après le programme actif (séance du jour de la semaine choisi, ou jour léger). Aucune séance : « repos ». */
export function PlannedDetail({ date, hasDone }: { date: string; hasDone: boolean }) {
  const [state, setState] = useState<{ program: Program | null; fiches: Fiche[]; nextIdx: number | null } | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const program = (await getActiveProgram()) ?? null;
      const fiches = await loadFiches().catch(() => [] as Fiche[]);
      const next = program ? await getNextSession(Date.now()).catch(() => null) : null;
      if (alive) setState({ program, fiches, nextIdx: next?.dayIndex ?? null });
    })().catch(() => alive && setState({ program: null, fiches: [], nextIdx: null }));
    return () => { alive = false; };
  }, []);
  if (!state || !state.program) return null;
  const { program, fiches, nextIdx } = state;
  const startKey = /^\d{4}-\d{2}-\d{2}/.test(program.startDate ?? '') ? program.startDate.slice(0, 10) : dateKey(new Date(program.createdAt));
  if (date < startKey) return null;
  const wd = weekdayOf(date);
  const days: ProgramDay[] = program.days.filter((d) => d.weekday === wd);
  const light = (program.lightDays ?? []).find((l) => l.weekday === wd);
  const today = dateKey(new Date());
  if (hasDone) return null; // la séance faite est résumée par le bloc existant du calendrier
  if (!days.length && !light) {
    return <section class="card" aria-label="Séance prévue"><h2>Séance prévue</h2><p class="dim">Pas de séance prévue ce jour-là : jour de repos.</p></section>;
  }
  return (
    <section class="card" aria-label="Séance prévue">
      <h2>Séance prévue</h2>
      {days.map((d) => (
        <div key={d.dayIndex} class="day-session">
          <p><strong>{d.label}</strong>{d.place ? <span class="dim"> · {placeLabel(d.place)}</span> : null}{d.estimatedMin ? <span class="dim"> · environ {d.estimatedMin} min</span> : null}</p>
          <ul class="plain-list">
            {d.exercises.map((ex, i) => (
              <li key={i}><span>{exName(fiches, ex)}</span> <span class="dim small">{lineText(withSides(fiches, ex))}</span></li>
            ))}
          </ul>
          {(date === today || nextIdx === d.dayIndex) && <a class="btn btn-primary" href="#/seance">Voir / démarrer la séance</a>}
          {date !== today && nextIdx !== d.dayIndex && <p class="dim small">Tu pourras la démarrer le jour venu, ou quand tu veux depuis l’Accueil.</p>}
        </div>
      ))}
      {!days.length && light && <p>Jour léger (facultatif) : échauffement et mobilité, environ {light.estimatedMin} min.{light.cardio ? ` Cardio doux possible : ${light.cardio.nom}, ${light.cardio.minutes} min.` : ''}</p>}
    </section>
  );
}
