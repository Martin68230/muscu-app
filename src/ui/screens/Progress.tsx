import { useEffect, useState } from 'preact/hooks';
import type { PregnancyStatus, SetLog, WorkoutSession } from '../../data/model';
import { list } from '../../data/repo';
import { loadFiches } from '../../data/fiches';
import { frDate } from '../../session/calendar';
import { fmtKg } from '../../session/messages';
import { exerciseProgress, groupsOfMuscles, MUSCLE_GROUPS, recordHistory, weeklyMetrics, weeklySets, type ExerciseProgress, type WeekCount } from '../../session/progress-view';
import { ProgressCurve } from './SessionDetail';

const unitOf = (m: ExerciseProgress['metric']): string => (m === 'charge' ? ' kg' : m === 'duree' ? ' s' : ' rép.');
const fmt = (p: ExerciseProgress, v: number): string => `${p.metric === 'charge' ? fmtKg(v) : v}${unitOf(p.metric)}`;

/** Barres par semaine (séries ou tonnage) : SVG écrit à la main, valeur au toucher, texte alternatif complet. */
export function WeeklyBars({ weeks, unit = 'séries' }: { weeks: { startKey: string; value: number }[]; unit?: string }) {
  const [sel, setSel] = useState<number | null>(null);
  const max = Math.max(1, ...weeks.map((w) => w.value));
  const W = 340;
  const H = 120;
  const bw = W / weeks.length;
  const alt = `Par semaine : ${weeks.map((w) => `semaine du ${frDate(w.startKey)}, ${w.value} ${unit}`).join(' ; ')}.`;
  const label = (w: { startKey: string; value: number }) => `Semaine du ${frDate(w.startKey)} : ${w.value} ${unit}`;
  return (
    <figure class="curve">
      <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={alt} class="curve-svg">
        {weeks.map((w, i) => {
          const h = Math.round((w.value / max) * (H - 18));
          const last = i === weeks.length - 1;
          return (
            <g key={w.startKey}>
              <rect x={i * bw + 6} y={H - h} width={bw - 12} height={Math.max(h, 2)} rx="4" class={sel === i ? 'bar bar-sel' : last ? 'bar bar-now' : 'bar'} />
              {w.value > 0 && <text x={i * bw + bw / 2} y={H - h - 4} text-anchor="middle" class="curve-txt">{w.value >= 10000 ? `${Math.round(w.value / 1000)} k` : w.value}</text>}
              <text x={i * bw + bw / 2} y={H + 14} text-anchor="middle" class="curve-txt">{w.startKey.slice(8)}/{w.startKey.slice(5, 7)}</text>
              <rect x={i * bw} y={0} width={bw} height={H + 18} class="hit" role="button" tabIndex={0} aria-label={label(w)}
                onClick={() => setSel(sel === i ? null : i)} onKeyDown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(sel === i ? null : i); } }} />
            </g>
          );
        })}
      </svg>
      <p class="curve-readout" role="status">{sel === null ? 'Touche une barre pour voir la valeur.' : label(weeks[sel])}</p>
    </figure>
  );
}

type Metric = 'sets' | 'tonnage';

/** Volume par groupe musculaire : puces de groupe, bascule séries / tonnage, 8 semaines. */
export function MuscleVolume({ sets, sessions, groupsOf }: { sets: readonly SetLog[]; sessions: readonly WorkoutSession[]; groupsOf: (movementId: string) => readonly string[] }) {
  const [group, setGroup] = useState<string>('all');
  const [metric, setMetric] = useState<Metric>('sets');
  const weeks = weeklyMetrics(sets, sessions, new Date(), group === 'all' ? () => true : (id) => groupsOf(id).includes(group));
  const data = weeks.map((w) => ({ startKey: w.startKey, value: metric === 'sets' ? w.sets : w.tonnage }));
  const any = data.some((w) => w.value > 0);
  const gLabel = group === 'all' ? 'tous les muscles' : (MUSCLE_GROUPS.find((g) => g.id === group)?.label ?? '').toLowerCase();
  return (
    <section class="card" aria-label="Volume par muscle">
      <h2>Volume par muscle</h2>
      <div class="chips" role="group" aria-label="Choisir un groupe musculaire">
        {[{ id: 'all', label: 'Tout' }, ...MUSCLE_GROUPS].map((g) => (
          <button type="button" class="chip" key={g.id} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</button>
        ))}
      </div>
      <div class="segmented" role="group" aria-label="Type de volume">
        <button type="button" aria-pressed={metric === 'sets'} onClick={() => setMetric('sets')}>Séries</button>
        <button type="button" aria-pressed={metric === 'tonnage'} onClick={() => setMetric('tonnage')}>Charge soulevée</button>
      </div>
      {any ? <WeeklyBars weeks={data} unit={metric === 'sets' ? 'séries' : 'kg'} /> : <p class="dim">Rien à afficher pour {gLabel} sur ces 8 semaines.</p>}
      <p class="dim small">
        {metric === 'sets' ? 'Séries de travail terminées, sans douleur.' : 'Charge × répétitions des séries avec une charge (kg). Les exercices au poids du corps n’y comptent pas.'}
        {' '}Un exercice compte pour chaque muscle principal qu’il travaille. Ce n’est pas un objectif à atteindre.
      </p>
    </section>
  );
}

const NEW_DAYS = 14;
const isRecent = (key: string): boolean => (Date.now() - new Date(`${key}T12:00:00`).getTime()) / 86400000 <= NEW_DAYS;

export function ProgressView({ items, weeks, names, sets, sessions, groupsOf = () => [], onBack }: {
  items: ExerciseProgress[];
  weeks: WeekCount[];
  names: (id: string) => string;
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  groupsOf?: (movementId: string) => readonly string[];
  onBack: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [rec, setRec] = useState<string | null>(null);
  const any = weeks.some((w) => w.sets > 0);
  const byRecent = [...items].sort((a, b) => b.bestDateKey.localeCompare(a.bestDateKey));
  return (
    <>
      <button type="button" class="btn btn-back" onClick={onBack}>‹ Retour à l’accueil</button>
      <h1>Ma progression</h1>
      <p class="dim small">Calculée sur ton téléphone, à partir de tes séances. Ce n’est pas un avis médical : si tu as mal, tu ne forces pas.</p>
      {any && <MuscleVolume sets={sets} sessions={sessions} groupsOf={groupsOf} />}
      {!any && (
        <section class="card" aria-label="Volume">
          <h2>Volume</h2>
          <p class="dim">Aucune série pour l’instant. Ta première séance remplira ces graphiques.</p>
        </section>
      )}
      <a class="lib-nutrition" href="#/nutrition">
        <span class="nut-entry-text">
          <span class="nut-entry-name">Courbe de poids</span>
          <span class="dim small">Poids lissé, dans Nutrition (si tu as noté ton poids)</span>
        </span>
        <span class="nut-entry-chevron" aria-hidden="true">›</span>
      </a>
      <h2>Mes records</h2>
      {items.length === 0 && <p class="dim">Il faut au moins deux séances avec un même exercice pour voir un record et son évolution.</p>}
      {items.length === 0 && <a class="btn btn-primary" href="#/accueil">Voir ma prochaine séance</a>}
      {items.length > 0 && (
        <ul class="rec-list card" aria-label="Records par exercice">
          {byRecent.map((p) => {
            const h = rec === p.movementId ? recordHistory(p.movementId, sets, sessions) : null;
            return (
              <li key={p.movementId} class="rec-item">
                <button type="button" class="rec-row" aria-expanded={rec === p.movementId} onClick={() => setRec(rec === p.movementId ? null : p.movementId)}>
                  <span class="rec-name">{names(p.movementId)}{isRecent(p.bestDateKey) && <span class="rec-new">Récent</span>}</span>
                  <span class="rec-val"><strong>{fmt(p, p.best)}</strong><span class="dim small"> {frDate(p.bestDateKey)}</span></span>
                </button>
                {h && (
                  <ol class="rec-history small" aria-label={`Historique des records : ${names(p.movementId)}`}>
                    {h.steps.map((st) => <li key={st.dateKey}>{frDate(st.dateKey)} : {fmt(p, st.value)}</li>)}
                  </ol>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {items.length > 0 && <p class="dim small">Un record est ta meilleure valeur sur une séance menée à terme, sans douleur. Touche un exercice pour voir comment il a évolué.</p>}
      {items.length > 0 && <h2>Courbes par exercice</h2>}
      {items.map((p) => {
        const delta = p.last - p.first;
        return (
          <section class="card prog-ex" key={p.movementId} aria-label={names(p.movementId)}>
            <h3>{names(p.movementId)}</h3>
            <p class="dim small">
              {p.sessions} séances · {delta === 0 ? 'stable' : delta > 0 ? `+${fmt(p, delta)}` : `${fmt(p, delta)}`} depuis la première.
            </p>
            <button type="button" class="btn" aria-expanded={open === p.movementId} onClick={() => setOpen(open === p.movementId ? null : p.movementId)}>
              {open === p.movementId ? 'Masquer la courbe' : 'Voir la courbe'}
            </button>
            {open === p.movementId && <ProgressCurve movementId={p.movementId} name={names(p.movementId)} sets={sets} sessions={sessions} />}
          </section>
        );
      })}
      <button type="button" class="btn" onClick={onBack}>Retour à l’accueil</button>
    </>
  );
}

export function Progress({ pregnancy, onBack }: { pregnancy?: PregnancyStatus | null; onBack: () => void }) {
  const [st, setSt] = useState<{ sets: SetLog[]; sessions: WorkoutSession[]; names: (id: string) => string; groupsOf: (id: string) => readonly string[] } | null>(null);
  useEffect(() => {
    (async () => {
      const [sets, sessions] = await Promise.all([list('sets'), list('sessions')]);
      let names = (_id: string): string => 'Exercice';
      let groupsOf = (_id: string): readonly string[] => [];
      try {
        const fiches = await loadFiches();
        names = (id) => fiches.find((f) => f.id === id)?.nom ?? 'Exercice';
        const byId = new Map(fiches.map((f) => [f.id, groupsOfMuscles(f.musclesPrincipaux ?? [])]));
        groupsOf = (id) => byId.get(id) ?? [];
      } catch { /* hors ligne sans fiches : noms génériques */ }
      setSt({ sets, sessions, names, groupsOf });
    })().catch(() => setSt({ sets: [], sessions: [], names: () => 'Exercice', groupsOf: () => [] }));
  }, []);
  // Grossesse / post-partum : pas de chiffres de charge ni de records (comme le détail des séances).
  if (pregnancy === 'enceinte' || pregnancy === 'post_partum') {
    return (
      <>
        <button type="button" class="btn btn-back" onClick={onBack}>‹ Retour à l’accueil</button>
        <h1>Ma progression</h1>
        <p class="dim">Pendant cette période, l’appli ne met pas de chiffres ni de records en avant : l’important est d’écouter ton corps. Ce n’est pas un avis médical.</p>
      </>
    );
  }
  if (!st) return <p class="dim" role="status">Calcul de ta progression…</p>;
  return <ProgressView items={exerciseProgress(st.sets, st.sessions)} weeks={weeklySets(st.sets, st.sessions, new Date())} names={st.names} groupsOf={st.groupsOf} sets={st.sets} sessions={st.sessions} onBack={onBack} />;
}
