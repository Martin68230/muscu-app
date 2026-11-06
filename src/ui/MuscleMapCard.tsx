// Carte des muscles dans une carte d'écran : titre, silhouette cliquable, panneau sous la carte (nom de la zone et ses points), légende,
// liste des zones par statut (équivalent texte pour le lecteur d'écran et pour les petites zones). Tout est calculé localement.
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { ZONES, type ZoneStatus } from '../zones/zones';
import { fmtPoints, type PointsMap, type StatusMap } from '../zones/map-data';
import { MuscleMap, MuscleMapLegend, type MapView } from './MuscleMap';

const NAMES = new Map(ZONES.map((z) => [z.id, z.nom]));
const WORD: Record<ZoneStatus, string> = { gris: 'peu ou pas travaillée', orange: 'travaillée en partie', rouge: 'bien travaillée' };
const WORD_EXERCISE: Record<ZoneStatus, string> = { gris: 'peu ou pas sollicitée', orange: 'aide le mouvement', rouge: 'muscle principal de l’exercice' };
const LIST_TITLE: Record<ZoneStatus, string> = { rouge: 'Bien travaillées', orange: 'En partie', gris: 'Peu ou pas' };

export interface MuscleMapCardProps {
  id: string;
  title: string;
  statuses: StatusMap;
  /** Points de la période (absent = vue « un exercice », sans points). */
  points?: PointsMap;
  /** Fin de la phrase des points : « dans cette séance », « sur la semaine »… */
  period?: string;
  view?: MapView;
  intro?: string;
  children?: ComponentChildren;
}

const pts = (p: number) => `${fmtPoints(p)} ${p > 0 && p < 2 ? 'point' : 'points'}`;

export function MuscleMapCard({ id, title, statuses, points, period, view = 'les-deux', intro, children }: MuscleMapCardProps) {
  const [sel, setSel] = useState<string | null>(null);
  const words = points ? WORD : WORD_EXERCISE;
  const st = sel ? statuses[sel] ?? 'gris' : null;
  return (
    <section class="card mm-card" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {intro && <p class="dim small">{intro}</p>}
      <MuscleMap view={view} statuses={statuses} onZone={setSel} selected={sel} label={title} />
      <div class="mm-panel" role="status" aria-live="polite">
        {sel && st ? (
          <p>
            <strong>{NAMES.get(sel) ?? sel}</strong> : {words[st]}
            {points ? <>, {pts(points[sel] ?? 0)} {period}</> : null}.
          </p>
        ) : (
          <p class="dim small">Touche une zone pour voir son nom{points ? ' et ses points' : ''}.</p>
        )}
      </div>
      <MuscleMapLegend />
      {points && <p class="dim small">Points : 1 par série où la zone travaille en premier, ½ quand elle aide.</p>}
      <details class="mm-list">
        <summary>Liste des zones</summary>
        {(['rouge', 'orange', 'gris'] as const).map((s) => {
          const zs = ZONES.filter((z) => (statuses[z.id] ?? 'gris') === s);
          return zs.length ? (
            <p key={s} class="small">
              <strong>{points ? LIST_TITLE[s] : s === 'rouge' ? 'Principales' : s === 'orange' ? 'Aident' : 'Peu ou pas'} :</strong>{' '}
              {zs.map((z) => (points ? `${z.nom} (${fmtPoints(points[z.id] ?? 0)})` : z.nom)).join(', ')}.
            </p>
          ) : null;
        })}
      </details>
      {children}
    </section>
  );
}
