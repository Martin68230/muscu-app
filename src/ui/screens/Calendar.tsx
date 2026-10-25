import { useEffect, useState } from 'preact/hooks';
import type { Profile } from '../../data/model';
import { list } from '../../data/repo';
import { getActiveProgram } from '../../session/program';
import {
  buildEntries, dateKey, dayMark, entriesOfMonth, frDate, frMonth, isDone, MARK_GLYPH, MARK_TEXT, monthSummary,
  PLANNED_GLYPH, PLANNED_TEXT, plannedDates, plannedMark, type HistoryEntry,
} from '../../session/calendar';
import { PastSummary } from './PastSummary';

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const PAGE = 10;

const plural = (n: number, one: string, many: string): string => `${n} ${n > 1 ? many : one}`;

/** Détail chiffré d'une séance de l'historique : seulement pour une séance faite (aucun chiffre pour une séance arrêtée). */
export function entryDetail(e: HistoryEntry): string {
  const parts = [e.label];
  if (isDone(e)) {
    if (e.durationMin !== null) parts.push(`${e.durationMin} min`);
    parts.push(plural(e.setsDone, 'série faite', 'séries faites'));
  }
  return parts.join(' · ');
}

export function monthLine(done: number, planned: number | null): string {
  if (done === 0) return 'Pas encore de séance ce mois-ci.';
  if (planned === null) return `${plural(done, 'séance faite', 'séances faites')} ce mois-ci.`;
  return `${plural(done, 'séance faite', 'séances faites')} sur environ ${plural(planned, 'prévue', 'prévues')} (estimation).`;
}

export interface CalendarViewProps {
  entries: HistoryEntry[];
  today: Date;
  daysPerWeek: number | null;
  /** Début de l'usage (jour civil local), pour le nombre de séances prévues. */
  startKey: string | null;
  /** Jours de la semaine (0 = lundi) des séances du programme actif et début du programme : séances prévues au calendrier. */
  plannedWeekdays?: number[];
  programStartKey?: string | null;
  onOpen: (sessionId: string) => void;
}

/** Calendrier du mois + historique (sans accès à la base : testable). */
export function CalendarView({ entries, today, daysPerWeek, startKey, plannedWeekdays = [], programStartKey = null, onOpen }: CalendarViewProps) {
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const { year, month } = cursor;
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // lundi en premier
  const label = frMonth(year, month);
  const todayKey = dateKey(today);
  const isCurrent = year === today.getFullYear() && month === today.getMonth();
  const move = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
    setSelected(null);
  };
  const sum = monthSummary(entries, year, month, { daysPerWeek, startKey, today });
  const inMonth = entriesOfMonth(entries, year, month);
  const dayEntries = selected ? entries.filter((e) => e.dateKey === selected) : [];
  const weekAfterEnd = dateKey(new Date(year, month + 1, 7));
  const planned = new Set(programStartKey ? plannedDates(plannedWeekdays, programStartKey, weekAfterEnd) : []);
  const plannedInMonth = new Set([...planned].filter((k) => k.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)));
  const pm = (key: string) => (plannedInMonth.has(key) ? plannedMark(key, planned, entries, todayKey) : null);

  return (
    <>
      <h1>Calendrier</h1>
      <div class="card card-cal">
        <div class="cal-head">
          <button type="button" class="cal-nav" aria-label="Mois précédent" onClick={() => move(-1)}>‹</button>
          <h2 class="capitalize" aria-live="polite">{label}</h2>
          <button type="button" class="cal-nav" aria-label="Mois suivant" disabled={isCurrent} onClick={() => move(1)}>›</button>
        </div>
        <div class="calendar" role="group" aria-label={label}>
          {DOW.map((d, i) => (
            <div class="dow" key={`d${i}`} aria-hidden="true">{d}</div>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <div class="day empty" key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const key = dateKey(new Date(year, month, i + 1));
            const mark = dayMark(entries, key);
            const pmark = mark ? null : pm(key);
            const isToday = key === todayKey;
            const name = `${frDate(key)}${isToday ? ', aujourd’hui' : ''}${mark ? ` : séance ${MARK_TEXT[mark].toLowerCase()}` : pmark ? ` : séance ${PLANNED_TEXT[pmark].toLowerCase()}` : ''}`;
            const cls = `day${isToday ? ' today' : ''}${mark ? ` has-${mark}` : pmark ? ` has-${pmark}` : ''}${selected === key ? ' selected' : ''}`;
            const body = (
              <>
                <span class="day-num">{i + 1}</span>
                <span class="day-mark" aria-hidden="true">{mark ? MARK_GLYPH[mark] : pmark ? PLANNED_GLYPH[pmark] : isToday ? '•' : ''}</span>
              </>
            );
            return mark || pmark ? (
              <button type="button" class={cls} key={key} aria-label={name} aria-pressed={selected === key} onClick={() => setSelected(selected === key ? null : key)}>{body}</button>
            ) : (
              <div class={cls} key={key} aria-label={name} role="img">{body}</div>
            );
          })}
        </div>
        <ul class="cal-legend small dim" aria-label="Légende">
          <li><span aria-hidden="true">✓</span> Faite</li>
          <li><span aria-hidden="true">○</span> Prévue</li>
          <li><span aria-hidden="true">◌</span> Non faite</li>
          <li><span aria-hidden="true">↷</span> Reportée</li>
          <li><span aria-hidden="true">–</span> Arrêtée</li>
          <li><span aria-hidden="true">◆</span> Douleur ou symptôme</li>
          <li><span aria-hidden="true">•</span> Aujourd’hui</li>
        </ul>
      </div>
      <p class="month-line" role="status">{monthLine(sum.done, sum.planned)}</p>

      {selected && dayEntries.length === 0 && pm(selected) && (
        <section class="card" aria-label={`Séance du ${frDate(selected)}`}>
          <h2 class="cap-first">{frDate(selected)}</h2>
          <p><strong>{PLANNED_GLYPH[pm(selected)!]} {PLANNED_TEXT[pm(selected)!]}</strong></p>
          <p class="dim">
            {pm(selected) === 'prevue'
              ? 'Séance prévue ce jour-là selon les jours que tu as choisis. Tu peux la faire un autre jour : c’est toi qui décides.'
              : 'Pas de séance enregistrée ce jour-là. Pas de souci : ta prochaine séance du programme reste proposée sur l’accueil.'}
          </p>
        </section>
      )}

      {selected && dayEntries.length > 0 && (
        <section class="card" aria-label={`Séances du ${frDate(selected)}`}>
          <h2 class="cap-first">{frDate(selected)}</h2>
          {dayEntries.map((e) => (
            <div class="hist-detail" key={e.id}>
              <p><strong>{MARK_GLYPH[e.mark]} {MARK_TEXT[e.mark]}</strong></p>
              <p class="dim">{entryDetail(e)}</p>
              {e.mark !== 'reportee' && <button type="button" class="btn" onClick={() => onOpen(e.id)}>Voir le bilan</button>}
            </div>
          ))}
        </section>
      )}

      <h2>Historique</h2>
      {entries.length === 0 ? (
        <div class="card"><p class="dim">Tes séances apparaîtront ici dès la première. Pas de pression : à ton rythme.</p></div>
      ) : (
        <>
          <ul class="hist-list" aria-label="Séances passées">
            {entries.slice(0, shown).map((e) => (
              <li key={e.id}>
                <button type="button" class="hist-row" onClick={() => onOpen(e.id)}>
                  <span class="hist-date cap-first">{frDate(e.dateKey)}</span>
                  <span class="hist-mark"><span aria-hidden="true">{MARK_GLYPH[e.mark]}</span> {MARK_TEXT[e.mark]}</span>
                  <span class="dim small hist-info">{entryDetail(e)}</span>
                </button>
              </li>
            ))}
          </ul>
          {shown < entries.length && <button type="button" class="btn" onClick={() => setShown(shown + PAGE)}>Afficher plus</button>}
        </>
      )}
      {entries.length > 0 && inMonth.length === 0 && <p class="dim small">Aucune séance ce mois-ci : l’historique ci-dessous montre les autres mois.</p>}
    </>
  );
}

export function Calendar({ profile }: { profile: Profile }) {
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [plan, setPlan] = useState<{ weekdays: number[]; startKey: string | null }>({ weekdays: [], startKey: null });
  const load = async () => {
    try {
      const [sessions, sets] = await Promise.all([list('sessions'), list('sets')]);
      setEntries(buildEntries(sessions, sets));
      const prog = await getActiveProgram();
      const weekdays = (prog?.days ?? []).map((d) => d.weekday).filter((w): w is number => typeof w === 'number');
      setPlan({ weekdays, startKey: prog && weekdays.length ? (/^\d{4}-\d{2}-\d{2}/.test(prog.startDate ?? '') ? prog.startDate.slice(0, 10) : dateKey(new Date(prog.createdAt))) : null });
    } catch {
      setEntries([]);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  if (openId) {
    return (
      <PastSummary
        sessionId={openId}
        pregnancy={profile.pregnancy}
        onBack={() => setOpenId(null)}
        onDeleted={() => {
          setOpenId(null);
          void load();
        }}
      />
    );
  }
  if (!entries) return <p class="dim" role="status">Chargement…</p>;
  return (
    <CalendarView
      entries={entries}
      today={new Date()}
      daysPerWeek={profile.daysPerWeek}
      startKey={dateKey(new Date(profile.createdAt))}
      plannedWeekdays={plan.weekdays}
      programStartKey={plan.startKey}
      onOpen={setOpenId}
    />
  );
}
