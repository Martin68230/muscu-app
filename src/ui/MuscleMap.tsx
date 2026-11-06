// Carte des muscles (niveau 3) : silhouette originale face / dos, une zone = un chemin <path> avec titre accessible.
// Composant PUR (aucun état, aucun stockage). Le statut n'est pas porté par la couleur seule : gris = uni, orange = hachures, rouge = plein + contour épais.
import { BODY_ELLIPSES, BODY_PATH, ZONE_PATHS } from './muscle-silhouette';
import { ZONES, type ZoneStatus } from '../zones/zones';

export type MapView = 'face' | 'dos' | 'les-deux';
export interface MuscleMapProps {
  view: MapView;
  statuses: Readonly<Record<string, ZoneStatus>>;
  /** Si fourni, chaque zone devient un bouton (clavier compris). */
  onZone?: (zoneId: string) => void;
  /** Texte alternatif de toute la carte. */
  label?: string;
}

const STATUS_WORD: Record<ZoneStatus, string> = { gris: 'peu ou pas travaillée', orange: 'travaillée en partie', rouge: 'bien travaillée' };
const NAMES = new Map(ZONES.map((z) => [z.id, z.nom]));

// Couleurs sombre / clair (contraste >= 3:1 entre statuts et fond). Le thème de l'app est `data-theme` sur <html>.
const CSS = `
.mm{--mm-body:#232733;--mm-gris:#3a4252;--mm-gris-line:#7d889d;--mm-or:#f5a524;--mm-or-bg:#5a3d0a;--mm-red:#ff5c5c;--mm-red-line:#ffffff;--mm-text:#a9b0bf;--mm-sep:#0f1115}
:root[data-theme='light'] .mm{--mm-body:#c9ceda;--mm-gris:#eef0f5;--mm-gris-line:#8a93a6;--mm-or:#d97706;--mm-or-bg:#fff0cf;--mm-red:#c42b1c;--mm-red-line:#5c0f08;--mm-text:#4d5566;--mm-sep:#f6f7f9}
.mm .mm-body{fill:var(--mm-body)}
.mm .mm-z{stroke-linejoin:round;vector-effect:non-scaling-stroke}
.mm .mm-z.s-gris{fill:var(--mm-gris);stroke:var(--mm-gris-line);stroke-width:.8}
.mm .mm-z.s-orange{fill:url(#mm-hatch);stroke:var(--mm-or);stroke-width:1.4}
.mm .mm-z.s-rouge{fill:var(--mm-red);stroke:var(--mm-red-line);stroke-width:2}
.mm .mm-btn{cursor:pointer}.mm .mm-btn:focus-visible{outline:3px solid var(--mm-or);outline-offset:1px}
.mm .mm-h-bg{fill:var(--mm-or-bg)}.mm .mm-h-line{stroke:var(--mm-or);stroke-width:2.2}
.mm text{fill:var(--mm-text);font:600 11px system-ui,sans-serif;text-anchor:middle}
`;

function Silhouette({ view, statuses, onZone, dx }: { view: 'face' | 'dos'; statuses: MuscleMapProps['statuses']; onZone?: (z: string) => void; dx: number }) {
  const zones = Object.keys(ZONE_PATHS).filter((z) => ZONE_PATHS[z][view]);
  return (
    <g transform={`translate(${dx} 0)`} data-view={view}>
      <path class="mm-body" d={BODY_PATH} aria-hidden="true" />
      {BODY_ELLIPSES.flatMap((e, i) => (e.both ? [e.cx, 200 - e.cx] : [e.cx]).map((cx) => (
        <ellipse key={`${i}-${cx}`} class="mm-body" cx={cx} cy={e.cy} rx={e.rx} ry={e.ry} aria-hidden="true" />
      )))}
      {zones.map((z) => {
        const st: ZoneStatus = statuses[z] ?? 'gris';
        const title = `${NAMES.get(z) ?? z} : ${STATUS_WORD[st]}`;
        const interactive = onZone
          ? { role: 'button' as const, tabIndex: 0, onClick: () => onZone(z), onKeyDown: (ev: KeyboardEvent) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onZone(z); } } }
          : {};
        return (
          <path key={z} id={`mm-${view}-${z}`} data-zone={z} data-status={st} class={`mm-z s-${st}${onZone ? ' mm-btn' : ''}`} d={ZONE_PATHS[z][view]} {...interactive}>
            <title>{title}</title>
          </path>
        );
      })}
      <text x={100} y={426}>{view === 'face' ? 'Face' : 'Dos'}</text>
    </g>
  );
}

export function MuscleMap({ view, statuses, onZone, label }: MuscleMapProps) {
  const both = view === 'les-deux';
  const w = both ? 410 : 200;
  return (
    <svg class="mm" viewBox={`0 0 ${w} 434`} role={onZone ? 'group' : 'img'} aria-label={label ?? 'Carte des muscles travaillés'} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <style>{CSS}</style>
      <defs>
        <pattern id="mm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect class="mm-h-bg" width="6" height="6" />
          <line class="mm-h-line" x1="0" y1="0" x2="0" y2="6" />
        </pattern>
      </defs>
      {view !== 'dos' ? <Silhouette view="face" statuses={statuses} onZone={onZone} dx={0} /> : null}
      {view !== 'face' ? <Silhouette view="dos" statuses={statuses} onZone={onZone} dx={both ? 210 : 0} /> : null}
    </svg>
  );
}

/** Légende de l'échelle (avec les motifs, pas seulement les couleurs). */
export function MuscleMapLegend() {
  const item = (st: ZoneStatus, text: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '14px' }}>
      <svg class="mm" width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
        <style>{CSS}</style>
        <defs>
          <pattern id="mm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect class="mm-h-bg" width="6" height="6" />
            <line class="mm-h-line" x1="0" y1="0" x2="0" y2="6" />
          </pattern>
        </defs>
        <rect class={`mm-z s-${st}`} x="2" y="2" width="18" height="12" rx="3" />
      </svg>
      <span>{text}</span>
    </span>
  );
  return (
    <p class="dim" style={{ margin: '4px 0', fontSize: '14px' }}>
      {item('gris', 'peu ou pas')}
      {item('orange', 'en partie')}
      {item('rouge', 'bien travaillé')}
    </p>
  );
}
