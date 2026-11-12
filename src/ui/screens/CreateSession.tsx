// D28 « Créer une séance » (knowledge/creer-seance-v1.md) : écran de choix, résultat, deux actions (Faire maintenant, Ajouter au calendrier).
// Tout est local : la séance est composée par createSession (fonction pure, règles du code, aucune IA, aucun réseau).
import { useEffect, useState } from 'preact/hooks';
import type { Profile } from '../../data/model';
import { loadFiches } from '../../data/fiches';
import { TAG_LABEL } from '../../data/labels';
import { createSession, plannedOf, type CreateContext, type CreatedSession, type CreateSessionRequest, type CreateSessionResult } from '../../generator';
import type { CreateIntensity, CreateZone } from '../../generator/config';
import { availableTags } from '../../generator/context';
import type { GeneratorInput } from '../../generator/types';
import { D30_TEXT } from '../../session/messages';
import { frDate } from '../../session/calendar';
import { loadCreateContext, upcomingDays, ZONE_TEXT, type ScheduledCreated } from '../../session/create-store';
import { loadGeneratorInput } from '../../session/program';
import { asGenFiches } from '../session/launch';
import { durationText, lineText } from '../session/text';
import { Precautions } from '../Precautions';

const ZONES: CreateZone[] = ['jambes', 'haut', 'tronc', 'corps_entier'];
type Sport = NonNullable<CreateSessionRequest['sport']>;
const SPORTS: { id: Sport | null; label: string }[] = [
  { id: null, label: 'Aucun' }, { id: 'foot', label: 'Foot' }, { id: 'danse', label: 'Danse' }, { id: 'volley', label: 'Volley' }, { id: 'raquette', label: 'Raquette' },
];
const DURATIONS = [20, 30, 45, 60, 75];
const INTENSITIES: { id: CreateIntensity; label: string }[] = [
  { id: 'douce', label: 'Douce' }, { id: 'moderee', label: 'Modérée' }, { id: 'soutenue', label: 'Soutenue' },
];

export const CREATE_TEXT = {
  title: 'Créer une séance',
  intro: 'Une séance ponctuelle, faite pour aujourd’hui. Elle s’ajoute à ton programme, elle ne le remplace pas.',
  zone: 'Quelle zone ?',
  sport: 'Un sport à préparer ? (facultatif)',
  duration: 'Combien de temps ?',
  intensity: 'Quelle intensité ?',
  chair: 'Ta chaise est-elle stable et calée contre un mur ?',
  equipment: 'Ton matériel',
  equipmentHelp: 'C’est celui de ton profil. Pour le changer, va dans Profil.',
  compose: 'Voir la séance',
  profileMissing: 'Réponds d’abord aux questions de ton profil (moins d’une minute) pour créer une séance.',
  editProfile: 'Compléter mon profil',
  back: 'Retour',
  change: 'Changer mes choix',
  now: 'Faire maintenant',
  schedule: 'Ajouter au calendrier',
  pickDay: 'Quel jour ?',
  addDay: 'Ajouter ce jour',
  added: (d: string) => `C’est noté : séance ajoutée au calendrier le ${d}. Elle sera recalculée ce jour-là avec ton historique du moment.`,
  refused: 'Séance non proposée',
  tryZone: 'Essayer plutôt :',
} as const;

/** Ids des avertissements toujours visibles (consigne d'arrêt et avis) ; les autres vont dans le volet de précautions. */
const VISIBLE_WARNING_IDS = ['arret-sauts', 'avis'];

/** Heure locale de midi du jour choisi, en ISO : la séance ajoutée au calendrier est composée pour ce jour-là. */
const noonIso = (key: string): string => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0).toISOString();
};

export interface CreateViewProps {
  /** null : profil incomplet. */
  input: GeneratorInput | null;
  context: CreateContext;
  now?: () => Date;
  /** Séance ajoutée au calendrier que l'on prépare : champs préremplis. */
  prefill?: ScheduledCreated | null;
  onBack: () => void;
  onEditProfile?: () => void;
  onDoNow: (session: CreatedSession, request: CreateSessionRequest, scheduledId: string | null) => Promise<void>;
  onSchedule: (session: CreatedSession, request: CreateSessionRequest, key: string) => Promise<void>;
}

/** Matériel du profil : coché par la personne, puis ce qui est supposé à la maison (chaise, tapis, mur… sauf si elle l'a décoché). */
function equipmentLines(input: GeneratorInput): { main: string; implicit: string | null } {
  if (input.equipment.preset === 'F') return { main: 'Le matériel d’une salle de sport.', implicit: null };
  const explicit = input.equipment.tags.filter((t) => TAG_LABEL[t]);
  const implicit = [...availableTags(input.equipment)].filter((t) => t !== 'poids_du_corps' && !explicit.includes(t) && TAG_LABEL[t]);
  return {
    main: explicit.length ? `${explicit.map((t) => TAG_LABEL[t]).join(', ')}.` : 'Ton poids du corps (aucun autre matériel coché).',
    implicit: implicit.length ? `Aussi pris en compte : ${implicit.map((t) => TAG_LABEL[t]).join(', ')}.` : null,
  };
}

function Chips<T extends string | number | null>({ legend, items, value, onPick }: { legend: string; items: { id: T; label: string }[]; value: T; onPick: (v: T) => void }) {
  return (
    <fieldset class="create-group">
      <legend>{legend}</legend>
      <div class="chips">
        {items.map((it) => (
          <button key={String(it.id)} type="button" class="chip" aria-pressed={value === it.id} onClick={() => onPick(it.id)}>{it.label}</button>
        ))}
      </div>
    </fieldset>
  );
}

function SessionResult({ s }: { s: CreatedSession }) {
  const visible = s.warnings.filter((w) => VISIBLE_WARNING_IDS.includes(w.id));
  const folded = s.warnings.filter((w) => !VISIBLE_WARNING_IDS.includes(w.id));
  const avis = visible.filter((w) => w.id === 'avis');
  return (
    <>
      <div class="card" aria-label="Ta séance">
        <h2>{ZONE_TEXT[s.zone]} · environ {s.estimatedMin} min</h2>
        <p class="dim">{s.header}</p>
        <p class="dim small">
          {s.exercises.length + (s.jumps ? s.jumps.items.length : 0)} exercices · {s.totalSets} séries · intensité {s.intensity === 'douce' ? 'douce' : s.intensity === 'soutenue' ? 'soutenue' : 'modérée'}
          {s.softened ? ' (adoucie)' : ''}
        </p>
      </div>
      <div class="card" aria-label="Échauffement">
        <h2>Échauffement · {s.warmup.minutes} min</h2>
        <ul class="plain-list">
          {s.warmup.general && <li>{s.warmup.general.nom} · {durationText(s.warmup.generalSec || s.warmup.general.sec)}</li>}
          {s.warmup.mobility.map((m) => <li key={m.variantId}>{m.nom} · {durationText(m.sec)}</li>)}
        </ul>
      </div>
      {s.jumps && (
        <div class="card" aria-label="Sauts">
          <h2>{s.jumps.items.every((j) => j.soft) ? 'Version sans saut' : 'Sauts'}</h2>
          <ul class="plain-list">
            {s.jumps.items.map((j) => (
              <li key={j.variantId}>
                <strong>{j.nom}</strong>
                <div class="dim small">{j.sets} séries de {j.reps} {j.soft ? 'répétitions, sans saut' : 'sauts, réception douce'} · repos {j.restSec} s en marchant</div>
              </li>
            ))}
          </ul>
          <p class="stop-line" role="note">{D30_TEXT.jumpStop}</p>
        </div>
      )}
      <div class="card" aria-label="Exercices">
        <h2>Exercices</h2>
        <ol class="plain-list">
          {s.exercises.map((e, i) => (
            <li key={`${e.variantId}-${i}`}>
              <strong>{e.nom}{e.variantNom && e.variantNom !== e.nom ? ` (${e.variantNom})` : ''}</strong>
              <div class="dim small">{lineText(plannedOf(e))}{e.tempo ? ` · ${e.tempo}` : ''}</div>
            </li>
          ))}
        </ol>
      </div>
      <div class="card" aria-label="Retour au calme">
        <h2>Retour au calme · {s.cooldown.minutes} min</h2>
        <ul class="plain-list">
          {s.cooldown.items.map((m) => <li key={m.variantId}>{m.nom} · {durationText(m.sec)}</li>)}
        </ul>
      </div>
      {folded.length > 0 && (
        <Precautions title={`Précautions (${folded.length})`} label="Précautions de la séance">
          {folded.map((w) => <p key={w.id}>{w.text}</p>)}
        </Precautions>
      )}
      {avis.map((w) => <p key={w.id} class="dim small">{w.text}</p>)}
    </>
  );
}

/** Contenu de l'écran (sans accès à la base : testable). */
export function CreateSessionView({ input, context, now = () => new Date(), prefill = null, onBack, onEditProfile, onDoNow, onSchedule }: CreateViewProps) {
  const pre = prefill?.meta.request;
  const [zone, setZone] = useState<CreateZone>((pre?.zone as CreateZone) ?? 'corps_entier');
  const [sport, setSport] = useState<Sport | null>((pre?.sport as Sport | null) ?? null);
  const [durationMin, setDurationMin] = useState<number>(pre?.durationMin ?? 45);
  const [intensity, setIntensity] = useState<CreateIntensity>((pre?.intensity as CreateIntensity) ?? 'moderee');
  const [chairStable, setChairStable] = useState<boolean>(pre?.chairStable ?? false);
  const [result, setResult] = useState<{ request: CreateSessionRequest; res: CreateSessionResult } | null>(null);
  const [picking, setPicking] = useState(false);
  const [day, setDay] = useState<string>('');
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!input) {
    return (
      <>
        <button type="button" class="btn back-btn" onClick={onBack}>{CREATE_TEXT.back}</button>
        <h1>{CREATE_TEXT.title}</h1>
        <div class="card">
          <p>{CREATE_TEXT.profileMissing}</p>
          {onEditProfile && <button type="button" class="btn btn-primary" onClick={onEditProfile}>{CREATE_TEXT.editProfile}</button>}
        </div>
      </>
    );
  }
  const hasChair = availableTags(input.equipment).has('chaise');
  const eq = equipmentLines(input);
  const days = upcomingDays(now());
  const request = (): CreateSessionRequest => ({ zone, sport, chairStable: hasChair && chairStable, durationMin, intensity, todayIso: now().toISOString() });

  const compose = () => {
    setError(null);
    setInfo(null);
    setPicking(false);
    const r = request();
    setResult({ request: r, res: createSession(input, r, context) });
    scrollTo(0, 0);
  };
  const doNow = async () => {
    if (!result || !result.res.ok) return;
    setBusy(true);
    setError(null);
    try {
      await onDoNow(result.res.session, result.request, prefill?.id ?? null);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : 'Impossible de lancer la séance.');
      setBusy(false);
    }
  };
  const schedule = async () => {
    if (!result || !day) return;
    setBusy(true);
    setError(null);
    // La séance est recomposée pour ce jour-là : l'espacement des jambes et les contacts dépendent de la date.
    const r = { ...result.request, todayIso: noonIso(day) };
    const res = createSession(input, r, context);
    if (!res.ok) {
      setError(res.message);
      setBusy(false);
      return;
    }
    try {
      await onSchedule(res.session, r, day);
      setInfo(CREATE_TEXT.added(frDate(day)));
      setPicking(false);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : 'Impossible d’ajouter la séance au calendrier.');
    }
    setBusy(false);
  };

  // ----- Résultat -----
  if (result) {
    const res = result.res;
    return (
      <>
        <button type="button" class="btn back-btn" onClick={() => { setResult(null); setInfo(null); setError(null); setPicking(false); }}>{CREATE_TEXT.change}</button>
        <h1>{res.ok ? 'Ta séance' : CREATE_TEXT.refused}</h1>
        {!res.ok && (
          <div class="notice" role="status">
            <p>{res.message}</p>
            {res.warnings.map((w) => <p key={w.id} class="small">{w.text}</p>)}
            {res.suggestions.length > 0 && (
              <>
                <p class="small dim">{CREATE_TEXT.tryZone}</p>
                <div class="chips" role="group" aria-label={CREATE_TEXT.tryZone}>
                  {res.suggestions.map((z) => (
                    <button key={z} type="button" class="chip" onClick={() => { setZone(z); setResult({ request: { ...result.request, zone: z }, res: createSession(input, { ...result.request, zone: z }, context) }); scrollTo(0, 0); }}>{ZONE_TEXT[z]}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {res.ok && <SessionResult s={res.session} />}
        {error && <p role="alert" class="notice">{error}</p>}
        {info && <p role="status" class="info-line">{info}</p>}
        {res.ok && picking && (
          <div class="card">
            <label for="create-day">{CREATE_TEXT.pickDay}</label>
            <select id="create-day" class="field" value={day} onChange={(ev) => setDay((ev.currentTarget as HTMLSelectElement).value)}>
              <option value="">Choisis un jour</option>
              {days.map((k) => <option key={k} value={k}>{frDate(k)}</option>)}
            </select>
            <button type="button" class="btn btn-primary" disabled={!day || busy} onClick={() => void schedule()}>{CREATE_TEXT.addDay}</button>
          </div>
        )}
        <div class="thumb-zone">
          {res.ok && <button type="button" class="btn btn-primary" disabled={busy} onClick={() => void doNow()}>{CREATE_TEXT.now}</button>}
          {res.ok && !prefill && <button type="button" class="btn" disabled={busy} onClick={() => { setPicking(!picking); setInfo(null); }}>{CREATE_TEXT.schedule}</button>}
          {!res.ok && <button type="button" class="btn btn-primary" onClick={() => setResult(null)}>{CREATE_TEXT.change}</button>}
        </div>
      </>
    );
  }

  // ----- Choix -----
  return (
    <>
      <button type="button" class="btn back-btn" onClick={onBack}>{CREATE_TEXT.back}</button>
      <h1>{CREATE_TEXT.title}</h1>
      <p class="dim">{CREATE_TEXT.intro}</p>
      <Chips legend={CREATE_TEXT.zone} items={ZONES.map((z) => ({ id: z, label: ZONE_TEXT[z] }))} value={zone} onPick={setZone} />
      <Chips legend={CREATE_TEXT.sport} items={SPORTS.map((s) => ({ id: s.id as Sport | null, label: s.label }))} value={sport} onPick={setSport} />
      <Chips legend={CREATE_TEXT.duration} items={DURATIONS.map((d) => ({ id: d, label: `${d} min` }))} value={durationMin} onPick={setDurationMin} />
      <Chips legend={CREATE_TEXT.intensity} items={INTENSITIES} value={intensity} onPick={setIntensity} />
      <div class="card">
        <h2>{CREATE_TEXT.equipment}</h2>
        <p>{eq.main}</p>
        {eq.implicit && <p class="dim small">{eq.implicit}</p>}
        <p class="dim small">{CREATE_TEXT.equipmentHelp}</p>
      </div>
      {hasChair && (
        <Chips legend={CREATE_TEXT.chair} items={[{ id: 'oui', label: 'Oui' }, { id: 'non', label: 'Non' }]} value={chairStable ? 'oui' : 'non'} onPick={(v) => setChairStable(v === 'oui')} />
      )}
      <div class="thumb-zone">
        <button type="button" class="btn btn-primary" onClick={compose}>{CREATE_TEXT.compose}</button>
      </div>
    </>
  );
}

/** Écran branché sur le stockage local : lit le profil complet, l'historique, puis délègue le lancement à l'application. */
export function CreateSessionScreen({ profile: _profile, prefill, onBack, onEditProfile, onLaunch, onSchedule }: {
  profile: Profile;
  prefill?: ScheduledCreated | null;
  onBack: () => void;
  onEditProfile?: () => void;
  onLaunch: (session: CreatedSession, request: CreateSessionRequest, scheduledId: string | null) => Promise<void>;
  onSchedule: (session: CreatedSession, request: CreateSessionRequest, key: string) => Promise<void>;
}) {
  const [data, setData] = useState<{ input: GeneratorInput | null; context: CreateContext } | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const fiches = await loadFiches();
        const loaded = await loadGeneratorInput(asGenFiches(fiches));
        const context = await loadCreateContext((id) => fiches.find((f) => f.id === id)?.schema, new Date(), (id) => {
          const f = fiches.find((x) => x.id === id);
          return f ? { principaux: f.musclesPrincipaux, secondaires: f.musclesSecondaires } : undefined;
        });
        if (alive) setData({ input: loaded && loaded.profileComplete ? loaded.input : null, context });
      } catch {
        if (alive) setData({ input: null, context: {} });
      }
    })();
    return () => { alive = false; };
  }, []);
  if (!data) return <p class="dim" role="status">Chargement…</p>;
  return <CreateSessionView input={data.input} context={data.context} prefill={prefill} onBack={onBack} onEditProfile={onEditProfile} onDoNow={onLaunch} onSchedule={onSchedule} />;
}
