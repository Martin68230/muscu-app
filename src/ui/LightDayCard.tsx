// D30 : lecteur du jour léger (structure-programmes.md STR-REP-12). Affiché seulement le jour même, facultatif, aucun retard compté.
// Contenu lisible : échauffement court, mobilité, puis au choix un cardio doux (marche à plat, facile) avec un minuteur sur l'heure
// réelle (règle 5) ; après une séance avec douleur la veille : mobilité seulement (STR-REP-12).
import { useEffect, useState } from 'preact/hooks';
import type { LightDay } from '../data/model';
import { D30_TEXT } from '../session/messages';
import { acquireWakeLock, releaseWakeLock } from './session/wakelock';

const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

export function LightDayCard({ day, painYesterday, now = () => Date.now() }: { day: LightDay; painYesterday: boolean; now?: () => number }) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [, tick] = useState(0);
  useEffect(() => {
    if (startedAt === null) return;
    const id = setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const cardio = painYesterday ? null : day.cardio ?? null;
  const total = cardio ? cardio.minutes * 60 : 0;
  const left = startedAt === null ? total : Math.max(0, total - Math.floor((now() - startedAt) / 1000));
  useEffect(() => {
    if (startedAt !== null && left === 0) void releaseWakeLock();
  }, [left, startedAt]);
  const w = day.warmup;
  return (
    <section class="card light-day" aria-label={D30_TEXT.lightTitle}>
      <h2>{D30_TEXT.lightTitle}</h2>
      <p class="dim">{D30_TEXT.lightIntro}</p>
      <ol class="prev-list">
        {w.general && <li>{w.general.nom} <span class="dim small">· {mmss(w.generalSec)}</span></li>}
        {w.mobility.map((m, i) => (
          <li key={i}>{m.nom} <span class="dim small">· {mmss(m.sec)}</span></li>
        ))}
      </ol>
      {cardio ? (
        <>
          <p>{D30_TEXT.lightCardio(cardio.minutes)}</p>
          {startedAt === null ? (
            <button type="button" class="btn" onClick={() => { setStartedAt(now()); void acquireWakeLock(); }}>Commencer la marche</button>
          ) : (
            <>
              <p class="light-timer" role="timer" aria-live="off">{left > 0 ? mmss(left) : 'Terminé'}</p>
              <button type="button" class="btn" onClick={() => { setStartedAt(null); void releaseWakeLock(); }}>Arrêter</button>
            </>
          )}
        </>
      ) : (
        <p class="dim">{D30_TEXT.lightNoCardio}</p>
      )}
    </section>
  );
}
