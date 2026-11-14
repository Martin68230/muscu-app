import { useEffect, useState } from 'preact/hooks';
import type { PregnancyStatus, SetLog, WorkoutSession } from '../../data/model';
import { list } from '../../data/repo';
import { loadFiches } from '../../data/fiches';
import { frDate } from '../../session/calendar';
import { fmtKg } from '../../session/messages';
import { exerciseProgress, weeklySets, type ExerciseProgress, type WeekCount } from '../../session/progress-view';
import { ProgressCurve } from './SessionDetail';

const unitOf = (m: ExerciseProgress['metric']): string => (m === 'charge' ? ' kg' : m === 'duree' ? ' s' : ' rép.');
const fmt = (p: ExerciseProgress, v: number): string => `${p.metric === 'charge' ? fmtKg(v) : v}${unitOf(p.metric)}`;

/** Barres des séries par semaine : SVG écrit à la main, texte alternatif complet. */
export function WeeklyBars({ weeks }: { weeks: WeekCount[] }) {
  const max = Math.max(1, ...weeks.map((w) => w.sets));
  const W = 340;
  const H = 120;
  const bw = W / weeks.length;
  const alt = `Séries par semaine : ${weeks.map((w) => `semaine du ${frDate(w.startKey)}, ${w.sets}`).join(' ; ')}.`;
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={alt} class="curve-svg">
      {weeks.map((w, i) => {
        const h = Math.round((w.sets / max) * (H - 18));
        const last = i === weeks.length - 1;
        return (
          <g key={w.startKey}>
            <rect x={i * bw + 6} y={H - h} width={bw - 12} height={Math.max(h, 2)} rx="4" class={last ? 'bar bar-now' : 'bar'} />
            {w.sets > 0 && <text x={i * bw + bw / 2} y={H - h - 4} text-anchor="middle" class="curve-txt">{w.sets}</text>}
            <text x={i * bw + bw / 2} y={H + 14} text-anchor="middle" class="curve-txt">{w.startKey.slice(8)}/{w.startKey.slice(5, 7)}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function ProgressView({ items, weeks, names, sets, sessions, onBack }: {
  items: ExerciseProgress[];
  weeks: WeekCount[];
  names: (id: string) => string;
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  onBack: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const any = weeks.some((w) => w.sets > 0);
  return (
    <>
      <button type="button" class="btn btn-back" onClick={onBack}>‹ Retour à l’accueil</button>
      <h1>Ma progression</h1>
      <p class="dim small">Calculée sur ton téléphone, à partir de tes séances. Ce n’est pas un avis médical : si tu as mal, tu ne forces pas.</p>
      <section class="card" aria-label="Séries par semaine">
        <h2>Séries par semaine</h2>
        {any ? <WeeklyBars weeks={weeks} /> : <p class="dim">Aucune série pour l’instant. Ta première séance remplira ce graphique.</p>}
        <p class="dim small">Séries de travail terminées, sans douleur, sur les 8 dernières semaines.</p>
      </section>
      <a class="lib-nutrition" href="#/nutrition">
        <span class="nut-entry-text">
          <span class="nut-entry-name">Courbe de poids</span>
          <span class="dim small">Poids lissé, dans Nutrition (si tu as noté ton poids)</span>
        </span>
        <span class="nut-entry-chevron" aria-hidden="true">›</span>
      </a>
      <h2>Mes exercices</h2>
      {items.length === 0 && <p class="dim">Il faut au moins deux séances avec un même exercice pour voir une évolution.</p>}
      {items.length === 0 && <a class="btn btn-primary" href="#/accueil">Voir ma prochaine séance</a>}
      {items.map((p) => {
        const delta = p.last - p.first;
        return (
          <section class="card prog-ex" key={p.movementId} aria-label={names(p.movementId)}>
            <h3>{names(p.movementId)}</h3>
            <p class="prog-line"><strong>Record : {fmt(p, p.best)}</strong> <span class="dim">le {frDate(p.bestDateKey)}</span></p>
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
  const [st, setSt] = useState<{ sets: SetLog[]; sessions: WorkoutSession[]; names: (id: string) => string } | null>(null);
  useEffect(() => {
    (async () => {
      const [sets, sessions] = await Promise.all([list('sets'), list('sessions')]);
      let names = (_id: string): string => 'Exercice';
      try {
        const fiches = await loadFiches();
        names = (id) => fiches.find((f) => f.id === id)?.nom ?? 'Exercice';
      } catch { /* hors ligne sans fiches : noms génériques */ }
      setSt({ sets, sessions, names });
    })().catch(() => setSt({ sets: [], sessions: [], names: () => 'Exercice' }));
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
  return <ProgressView items={exerciseProgress(st.sets, st.sessions)} weeks={weeklySets(st.sets, st.sessions, new Date())} names={st.names} sets={st.sets} sessions={st.sessions} onBack={onBack} />;
}
