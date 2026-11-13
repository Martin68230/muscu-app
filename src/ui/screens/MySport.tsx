// « Mon sport » (knowledge/saisie-sport-v1.md) : déclarer ses sports (Profil) et noter une séance de sport (Accueil, Calendrier, Profil).
// Tout est local. Une séance de sport ne compte ni dans les séries, ni dans la progression, ni dans la régularité de musculation.
import { useEffect, useState } from 'preact/hooks';
import type { InjuryZone, PregnancyStatus, Profile, SportEffort, SportFeeling, SportKey, SportPlanEntry, SportSession, SportSign } from '../../data/model';
import { SPORT_FEELINGS, SPORT_KEYS, SPORT_SIGNS } from '../../data/model';
import { WEEKDAYS } from '../../data/profile-setup';
import { dateKey, frDate } from '../../session/calendar';
import { EFFORT_CHOICES, EFFORT_LABEL, SPORT, SPORT_LABEL, SPORT_SHORT, SPORT_TEXT } from '../../sport/sport-config';
import { addSportSession, draftError, listSportSessions, normalizePlan, removeSportSession, saveSportPlan, type SportDraft } from '../../sport/sport-store';

const ZONES: [InjuryZone, string][] = [
  ['cou', 'Cou'], ['epaule', 'Épaule'], ['coude', 'Coude'], ['poignet', 'Poignet'], ['dos', 'Dos'],
  ['hanche', 'Hanche'], ['genou', 'Genou'], ['cheville', 'Cheville'], ['cuisse', 'Cuisse (arrière)'], ['aine', 'Aine'],
];

export const sportName = (e: Pick<SportPlanEntry, 'sport' | 'name'>): string => (e.sport === 'autre' && e.name ? e.name : SPORT_SHORT[e.sport]);

function Check({ id, label, on, onToggle }: { id: string; label: string; on: boolean; onToggle: (v: boolean) => void }) {
  return (
    <label class="check-row" for={id}>
      <input id={id} type="checkbox" checked={on} onChange={(e) => onToggle(e.currentTarget.checked)} />
      <span>{label}</span>
    </label>
  );
}

/** Résumé d'une ligne du plan : « Foot · 2 par semaine · mardi, jeudi · match samedi ». */
export function planLine(e: SportPlanEntry): string {
  const parts = [sportName(e)];
  if (e.perWeek !== undefined) parts.push(`${e.perWeek} par semaine`);
  if (e.weekdays?.length) parts.push(e.weekdays.map((d) => WEEKDAYS[d].long).join(', '));
  if (e.matchWeekday !== undefined && e.matchWeekday !== null) parts.push(`match ${WEEKDAYS[e.matchWeekday].long}`);
  return parts.join(' · ');
}

/** Éditeur du plan de sport (sans accès à la base : testable). */
export function SportPlanEditor({ plan, onChange }: { plan: SportPlanEntry[]; onChange: (p: SportPlanEntry[]) => void }) {
  const has = (k: SportKey) => plan.some((e) => e.sport === k);
  const toggle = (k: SportKey) => {
    if (has(k)) return onChange(plan.filter((e) => e.sport !== k));
    if (plan.length >= SPORT.maxSports) return;
    onChange(normalizePlan([...plan, { sport: k }]));
  };
  const patch = (i: number, p: Partial<SportPlanEntry>) => onChange(plan.map((e, j) => (j === i ? { ...e, ...p } : e)));
  return (
    <>
      <fieldset class="create-group">
        <legend>{SPORT_TEXT.sportsLegend}</legend>
        <div class="chips">
          {SPORT_KEYS.map((k) => (
            <button key={k} type="button" class="chip" aria-pressed={has(k)} disabled={!has(k) && plan.length >= SPORT.maxSports} onClick={() => toggle(k)}>{SPORT_LABEL[k].split(' (')[0]}</button>
          ))}
        </div>
      </fieldset>
      {plan.map((e, i) => (
        <div class="card" key={e.sport} aria-label={sportName(e)}>
          <h3>{SPORT_LABEL[e.sport]}</h3>
          {e.sport === 'autre' && (
            <>
              <label for={`sp-name-${i}`} class="small dim">{SPORT_TEXT.otherName}</label>
              <input id={`sp-name-${i}`} class="field" type="text" maxLength={SPORT.nameMax} enterkeyhint="done" value={e.name ?? ''} onInput={(ev) => patch(i, { name: ev.currentTarget.value.slice(0, SPORT.nameMax) })} />
              <p class="small dim">{SPORT_TEXT.otherUnknown}</p>
              <Check id={`sp-over-${i}`} label={SPORT_TEXT.overhead} on={!!e.overhead} onToggle={(v) => patch(i, { overhead: v })} />
            </>
          )}
          {(e.sport === 'foot' || e.sport === 'raquette' || e.sport === 'autre') && (
            <Check id={`sp-jump-${i}`} label={SPORT_TEXT.jumps} on={!!e.jumps} onToggle={(v) => patch(i, { jumps: v })} />
          )}
          <Check id={`sp-hard-${i}`} label={SPORT_TEXT.habitualHard} on={e.habitualEffort === 'tres_dur'} onToggle={(v) => patch(i, { habitualEffort: v ? 'tres_dur' : undefined })} />
          <fieldset class="create-group">
            <legend>{SPORT_TEXT.perWeek}</legend>
            <div class="chips">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button key={n} type="button" class="chip" aria-pressed={(e.perWeek ?? 1) === n} onClick={() => patch(i, { perWeek: n })}>{n}</button>
              ))}
            </div>
          </fieldset>
          <fieldset class="create-group">
            <legend>{SPORT_TEXT.days}</legend>
            <div class="chips">
              {WEEKDAYS.map((d) => {
                const on = !!e.weekdays?.includes(d.index);
                return (
                  <button key={d.index} type="button" class="chip" aria-label={d.long} aria-pressed={on} onClick={() => patch(i, { weekdays: on ? (e.weekdays ?? []).filter((x) => x !== d.index) : [...(e.weekdays ?? []), d.index].sort() })}>{d.short}</button>
                );
              })}
            </div>
            <p class="small dim">{SPORT_TEXT.daysHelp}</p>
          </fieldset>
          <fieldset class="create-group">
            <legend>{SPORT_TEXT.matchDay}</legend>
            <div class="chips">
              <button type="button" class="chip" aria-pressed={e.matchWeekday == null} onClick={() => patch(i, { matchWeekday: null })}>{SPORT_TEXT.noMatch}</button>
              {WEEKDAYS.map((d) => (
                <button key={d.index} type="button" class="chip" aria-label={d.long} aria-pressed={e.matchWeekday === d.index} onClick={() => patch(i, { matchWeekday: d.index })}>{d.short}</button>
              ))}
            </div>
          </fieldset>
        </div>
      ))}
      <p class="small dim">{SPORT_TEXT.estimate}</p>
    </>
  );
}

/** Carte « Mon sport » du Profil : résumé, modification, accès à la saisie d'une séance. */
export function MySportCard({ profile, onChange, onNote }: { profile: Profile; onChange: (p: Profile) => void; onNote: () => void }) {
  const [editing, setEditing] = useState(false);
  const [plan, setPlan] = useState<SportPlanEntry[]>(profile.sportPlan ?? []);
  const [busy, setBusy] = useState(false);
  const change = async (next: SportPlanEntry[]) => {
    setPlan(next);
    setBusy(true);
    try {
      onChange(await saveSportPlan(profile, next));
    } finally {
      setBusy(false);
    }
  };
  const saved = profile.sportPlan ?? [];
  return (
    <>
      <h2>{SPORT_TEXT.title}</h2>
      <div class="card" aria-busy={busy}>
        {!editing && (
          <>
            {saved.length ? <ul class="plain-list">{saved.map((e) => <li key={e.sport}>{planLine(e)}</li>)}</ul> : <p class="dim">Aucun sport déclaré.</p>}
            <button type="button" class="btn" onClick={() => { setPlan(profile.sportPlan ?? []); setEditing(true); }}>{saved.length ? 'Modifier mes sports' : 'Déclarer mon sport'}</button>
          </>
        )}
        {editing && (
          <>
            <SportPlanEditor plan={plan} onChange={(p) => void change(p)} />
            <button type="button" class="btn btn-primary" onClick={() => setEditing(false)}>Terminé</button>
          </>
        )}
        <button type="button" class="btn" onClick={onNote}>{SPORT_TEXT.noteButton}</button>
      </div>
    </>
  );
}

const todayKey = (now: Date): string => dateKey(now);

export interface NoteSportViewProps {
  plan: SportPlanEntry[];
  pregnancy: PregnancyStatus | null | undefined;
  sessions: SportSession[];
  now?: () => Date;
  /** Enregistre et renvoie les messages à afficher. */
  onSave: (d: SportDraft) => Promise<string[]>;
  onRemove: (id: string) => Promise<void>;
  onBack: () => void;
  onEditPlan?: () => void;
}

/** Écran « Noter une séance de sport » (sans accès à la base : testable). */
export function NoteSportView({ plan, pregnancy, sessions, now = () => new Date(), onSave, onRemove, onBack, onEditPlan }: NoteSportViewProps) {
  const first = plan[0];
  const [sport, setSport] = useState<SportKey | null>(first?.sport ?? null);
  const entry = plan.find((e) => e.sport === sport);
  const [day, setDay] = useState(todayKey(now()));
  const [duration, setDuration] = useState('60');
  const [effort, setEffort] = useState<SportEffort | null>(null);
  const [match, setMatch] = useState(false);
  const [jumps, setJumps] = useState(!!first?.jumps);
  const [overhead, setOverhead] = useState(!!first?.overhead);
  const [feelings, setFeelings] = useState<SportFeeling[]>([]);
  const [zone, setZone] = useState<InjuryZone | 'inconnu' | null>(null);
  const [signs, setSigns] = useState<SportSign[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState(sessions);
  useEffect(() => setList(sessions), [sessions]);

  const pregnant = pregnancy === 'enceinte' || pregnancy === 'post_partum';
  const toggle = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const draft = (): SportDraft => ({
    sport: sport ?? 'autre', name: entry?.name, day, durationMin: Number(duration), effort, match, jumps, overhead, feelings,
    painZone: zone && zone !== 'inconnu' ? zone : null, signs, note,
  });
  const pickSport = (k: SportKey) => {
    setSport(k);
    const e = plan.find((x) => x.sport === k);
    setJumps(!!e?.jumps);
    setOverhead(!!e?.overhead);
  };
  const save = async () => {
    const d = draft();
    const err = draftError(d);
    if (err) return setError(err);
    setBusy(true);
    setError(null);
    try {
      setMessages(await onSave(d));
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : SPORT_TEXT.savedFail);
    }
    setBusy(false);
    scrollTo(0, 0);
  };

  if (messages) {
    return (
      <>
        <h1>{SPORT_TEXT.noteTitle}</h1>
        <div class="notice" role="status">
          {messages.map((m) => <p key={m}>{m}</p>)}
        </div>
        <div class="thumb-zone">
          <button type="button" class="btn btn-primary" onClick={onBack}>{SPORT_TEXT.back}</button>
        </div>
      </>
    );
  }

  if (!plan.length) {
    return (
      <>
        <button type="button" class="btn back-btn" onClick={onBack}>{SPORT_TEXT.back}</button>
        <h1>{SPORT_TEXT.noteTitle}</h1>
        <div class="card">
          <p>{SPORT_TEXT.noSport}</p>
          {onEditPlan && <button type="button" class="btn btn-primary" onClick={onEditPlan}>{SPORT_TEXT.openMy}</button>}
        </div>
      </>
    );
  }

  const hasPain = feelings.includes('gene_douleur');
  const showJumps = sport === 'foot' || sport === 'raquette' || sport === 'autre';
  return (
    <>
      <button type="button" class="btn back-btn" onClick={onBack}>{SPORT_TEXT.back}</button>
      <h1>{SPORT_TEXT.noteTitle}</h1>
      <p class="dim">{SPORT_TEXT.privacy}</p>
      {pregnant && <div class="notice" role="note"><p>{SPORT_TEXT.pregnancyRecorded}</p><p>{SPORT_TEXT.pregnancyStop}</p></div>}
      {plan.length > 1 && (
        <fieldset class="create-group">
          <legend>{SPORT_TEXT.which}</legend>
          <div class="chips">{plan.map((e) => <button key={e.sport} type="button" class="chip" aria-pressed={sport === e.sport} onClick={() => pickSport(e.sport)}>{sportName(e)}</button>)}</div>
        </fieldset>
      )}
      <div class="card">
        <label for="sp-day" class="small dim">{SPORT_TEXT.when}</label>
        <input id="sp-day" class="field" type="date" max={todayKey(now())} value={day} onInput={(e) => setDay(e.currentTarget.value)} />
        <label for="sp-dur" class="small dim">{SPORT_TEXT.duration}</label>
        <input id="sp-dur" class="field" type="number" inputMode="numeric" min={SPORT.durationMin.min} max={SPORT.durationMin.max} enterkeyhint="done" value={duration} onInput={(e) => setDuration(e.currentTarget.value)} />
      </div>
      <fieldset class="create-group">
        <legend>{SPORT_TEXT.effort}</legend>
        <div class="chips" role="group" aria-label={SPORT_TEXT.effort}>
          {EFFORT_CHOICES.map((c) => <button key={c.id} type="button" class="chip" aria-pressed={effort === c.id} onClick={() => setEffort(c.id)}>{c.label}</button>)}
        </div>
        <ul class="plain-list small dim">{EFFORT_CHOICES.map((c) => <li key={c.id}><strong>{c.label}</strong> : {c.help}</li>)}</ul>
        <p class="small dim">{SPORT_TEXT.effortHelp}</p>
      </fieldset>
      <Check id="sp-match" label={SPORT_TEXT.match} on={match} onToggle={(v) => { setMatch(v); if (v) setEffort('tres_dur'); }} />
      {showJumps && <Check id="sp-jumps" label={SPORT_TEXT.jumps} on={jumps} onToggle={setJumps} />}
      {sport === 'autre' && <Check id="sp-over" label={SPORT_TEXT.overhead} on={overhead} onToggle={setOverhead} />}
      <fieldset class="create-group">
        <legend>{SPORT_TEXT.feelings}</legend>
        <div class="chips">
          {SPORT_FEELINGS.map((f) => <button key={f} type="button" class="chip" aria-pressed={feelings.includes(f)} onClick={() => setFeelings(toggle(feelings, f))}>{SPORT_TEXT.feelingLabels[f]}</button>)}
        </div>
      </fieldset>
      {feelings.includes('malaise_vertige') && <div class="notice notice-urgent" role="alert"><p>{SPORT_TEXT.malaise}</p></div>}
      {hasPain && (
        <div class="card">
          <p>{SPORT_TEXT.pain}</p>
          <fieldset class="create-group">
            <legend>{SPORT_TEXT.zone}</legend>
            <div class="chips">
              {ZONES.map(([z, label]) => <button key={z} type="button" class="chip" aria-pressed={zone === z} onClick={() => setZone(z)}>{label}</button>)}
              <button type="button" class="chip" aria-pressed={zone === 'inconnu'} onClick={() => setZone('inconnu')}>{SPORT_TEXT.zoneUnknown}</button>
            </div>
          </fieldset>
          <fieldset class="create-group">
            <legend>{SPORT_TEXT.signsLegend}</legend>
            {SPORT_SIGNS.map((s) => <Check key={s} id={`sp-sign-${s}`} label={SPORT_TEXT.signLabels[s]} on={signs.includes(s)} onToggle={() => setSigns(toggle(signs, s))} />)}
          </fieldset>
        </div>
      )}
      <div class="card">
        <label for="sp-note" class="small dim">{SPORT_TEXT.note}</label>
        <input id="sp-note" class="field" type="text" maxLength={SPORT.noteMax} enterkeyhint="done" value={note} onInput={(e) => setNote(e.currentTarget.value)} />
      </div>
      {error && <p role="alert" class="notice">{error}</p>}
      {effort === null && <p class="small dim" role="status">{SPORT_TEXT.chooseEffort}</p>}
      <div class="thumb-zone">
        <button type="button" class="btn btn-primary" disabled={busy || effort === null} onClick={() => void save()}>{SPORT_TEXT.save}</button>
      </div>

      <h2>{SPORT_TEXT.history}</h2>
      {list.length === 0 ? <p class="dim">{SPORT_TEXT.none}</p> : (
        <ul class="plain-list" aria-label={SPORT_TEXT.history}>
          {[...list].sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)).slice(0, 10).map((s) => (
            <li key={s.id}>
              <span class="cap-first">{frDate(dateKey(new Date(s.startedAt)))}</span> · {s.sport === 'autre' && s.name ? s.name : SPORT_SHORT[s.sport]} · {s.durationMin} min · {EFFORT_LABEL[s.effort]}
              <button type="button" class="btn" onClick={async () => { await onRemove(s.id); setList(list.filter((x) => x.id !== s.id)); }}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Écran branché sur le stockage local. */
export function NoteSport({ profile, onBack, onEditPlan }: { profile: Profile; onBack: () => void; onEditPlan?: () => void }) {
  const [sessions, setSessions] = useState<SportSession[] | null>(null);
  useEffect(() => {
    void listSportSessions().then(setSessions, () => setSessions([]));
  }, []);
  if (!sessions) return <p class="dim" role="status">Chargement…</p>;
  return (
    <NoteSportView
      plan={profile.sportPlan ?? []}
      pregnancy={profile.pregnancy}
      sessions={sessions}
      onSave={async (d) => (await addSportSession(d, profile)).messages}
      onRemove={removeSportSession}
      onBack={onBack}
      onEditPlan={onEditPlan}
    />
  );
}
