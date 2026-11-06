import { useState } from 'preact/hooks';
import type { SetLog, WorkoutSession } from '../../data/model';
import { dateKey, frDate, sessionDate } from '../../session/calendar';
import {
  compareDetails, CURVE_LEGEND, CURVE_MIN_POINTS, curveGeometry, curveSeries, deltaText, fmtDuration, previousSameType, serieText, sessionDetail,
  type ExerciseCompare, type ExerciseDetail,
} from '../../session/history-view';
import { fmtKg } from '../../session/messages';

export interface DetailNames {
  fiche: (movementId: string) => string;
  variant: (variantId: string) => string;
}

const W = 340;
const H = 190;
const PAD = { l: 44, r: 14, t: 14, b: 30 };

/** Courbe écrite à la main (SVG) : une séance = un point, couleurs du thème, texte alternatif complet. */
export function ProgressCurve({ movementId, name, sets, sessions }: { movementId: string; name: string; sets: readonly SetLog[]; sessions: readonly WorkoutSession[] }) {
  const { metric, points } = curveSeries(movementId, sets, sessions);
  if (points.length < CURVE_MIN_POINTS) {
    return <p class="dim small">Pas encore assez de séances pour une courbe : il en faut au moins deux avec cet exercice, sans douleur.</p>;
  }
  const g = curveGeometry(points.map((p) => p.value), W, H, PAD);
  const unit = metric === 'charge' ? 'kg' : metric === 'duree' ? 's' : '';
  const fmt = (v: number) => (metric === 'charge' ? fmtKg(v) : String(v));
  const first = points[0];
  const last = points[points.length - 1];
  const alt = `Courbe de ${name} : ${points.map((p) => `${frDate(p.dateKey)}, ${fmt(p.value)} ${unit}`.trim()).join(' ; ')}.`;
  const short = (k: string) => new Date(`${k}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', '');
  return (
    <figure class="curve">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt} class="curve-svg">
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} class="curve-axis" />
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} class="curve-axis" />
        <text x={PAD.l - 6} y={g.xy.reduce((m, p) => Math.min(m, p.y), H) + 4} text-anchor="end" class="curve-txt">{fmt(g.max)}</text>
        {g.max !== g.min && <text x={PAD.l - 6} y={g.xy.reduce((m, p) => Math.max(m, p.y), 0) + 4} text-anchor="end" class="curve-txt">{fmt(g.min)}</text>}
        <path d={g.path} class="curve-line" fill="none" />
        {g.xy.map((p, i) => <circle key={points[i].sessionId} cx={p.x} cy={p.y} r="5" class="curve-dot" />)}
        <text x={PAD.l} y={H - 8} text-anchor="start" class="curve-txt">{short(first.dateKey)}</text>
        <text x={W - PAD.r} y={H - 8} text-anchor="end" class="curve-txt">{short(last.dateKey)}</text>
      </svg>
      <figcaption class="small dim">
        {CURVE_LEGEND[metric]} {points.length} séances, de {short(first.dateKey)} à {short(last.dateKey)}. Les séries avec douleur ne comptent pas.
      </figcaption>
    </figure>
  );
}

function CompareRow({ c, name }: { c: ExerciseCompare; name: string }) {
  return (
    <li class="cmp-row">
      <strong>{name}</strong>
      {c.variantChanged && <span class="dim small"> (variante différente : charges non comparables)</span>}
      <ul class="cmp-list small">
        {c.kind === 'charge' && !c.variantChanged && <li>Charge : {fmtKg(c.loadBefore!)} → {fmtKg(c.loadNow!)} kg ({deltaText(c.dLoad, 'kg')})</li>}
        {c.kind !== 'duree' && <li>Répétitions (meilleure série) : {c.repsBefore ?? '–'} → {c.repsNow ?? '–'} ({deltaText(c.dReps, 'rep')})</li>}
        {c.kind === 'duree' && <li>Durée (meilleure) : {c.holdBefore ?? '–'} → {c.holdNow ?? '–'} s ({deltaText(c.dHold, 'sec')})</li>}
        <li>Séries : {c.seriesBefore} → {c.seriesNow} ({deltaText(c.dSeries, 'serie')})</li>
      </ul>
    </li>
  );
}

/**
 * Détail d'une séance passée : exercices, séries (par côté si besoin), paires de supersets, ressenti, comparaison avec la séance précédente
 * du même type et courbe par exercice. `numbers` faux (grossesse, post-partum) : séries seulement, ni charge, ni comparaison, ni courbe.
 */
export function SessionDetail({ session, sets, sessions, names, numbers }: {
  session: WorkoutSession;
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  names: DetailNames;
  numbers: boolean;
}) {
  const [curve, setCurve] = useState<number | null>(null);
  const detail = sessionDetail(session, sets);
  if (!detail.length) return null;
  const prev = numbers ? previousSameType(session, sessions, sets) : null;
  const cmp = prev ? compareDetails(detail, sessionDetail(prev, sets)) : [];
  const nameOf = (d: ExerciseDetail) => names.variant(d.variantId) !== 'Exercice' ? names.variant(d.variantId) : names.fiche(d.movementId);
  const byIndex = (i: number) => detail.find((d) => d.index === i);
  const dur = session.startedAt && session.endedAt ? Math.round((Date.parse(session.endedAt) - Date.parse(session.startedAt)) / 1000) : 0;
  return (
    <>
      <h2>Détail de la séance</h2>
      {dur > 0 && dur <= 6 * 3600 && <p class="dim small">Durée : {fmtDuration(Math.max(60, Math.round(dur / 60) * 60))}.</p>}
      {detail.map((d) => (
        <section class="card ex-detail" key={d.index} aria-label={nameOf(d)}>
          <h3>{nameOf(d)}</h3>
          {d.pairWith.length > 0 && <p class="dim small">Superset avec {d.pairWith.map((i) => byIndex(i)).filter(Boolean).map((o) => nameOf(o!)).join(' et ')}.</p>}
          {d.perSide && <p class="dim small">Un seul côté à la fois : une série compte les deux côtés.</p>}
          {numbers ? (
            <ol class="ex-series">
              {d.series.map((s, i) => <li key={s.setIndex}>{serieText(s, d, i + 1)}</li>)}
            </ol>
          ) : (
            <p>{d.series.length} {d.series.length > 1 ? 'séries faites' : 'série faite'}.</p>
          )}
          {numbers && !d.cardio && (
            <>
              <button type="button" class="btn" aria-expanded={curve === d.index} onClick={() => setCurve(curve === d.index ? null : d.index)}>
                {curve === d.index ? 'Masquer la courbe' : 'Voir la courbe'}
              </button>
              {curve === d.index && <ProgressCurve movementId={d.movementId} name={nameOf(d)} sets={sets} sessions={sessions} />}
            </>
          )}
        </section>
      ))}
      {numbers && (
        <section class="card" aria-label="Comparaison avec la séance précédente du même type">
          <h3>Par rapport à la séance précédente</h3>
          {!prev && <p class="dim">Pas de séance précédente du même type à comparer pour l’instant.</p>}
          {prev && (
            <>
              <p class="dim small cap-first">Comparée à « {prev.plan?.label} » du {frDate(dateKey(sessionDate(prev)))}.</p>
              {cmp.length === 0 ? (
                <p class="dim">Aucun exercice en commun avec cette séance : rien à comparer.</p>
              ) : (
                <ul class="cmp">{cmp.map((c) => <CompareRow key={c.index} c={c} name={nameOf(byIndex(c.index)!)} />)}</ul>
              )}
            </>
          )}
        </section>
      )}
    </>
  );
}
