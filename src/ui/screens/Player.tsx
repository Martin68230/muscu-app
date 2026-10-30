import type { ComponentChildren } from 'preact';
import { CARDIO_TEXT } from '../../generator/messages';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { InjuryZone, PlannedExercise, Profile } from '../../data/model';
import { list } from '../../data/repo';
import { ZONE_LABEL } from '../../data/labels';
import type { SetInput } from '../../session/engine';
import { gentlerAlternative, lastTime, lastTimeEchelon, painCheck, proposeProgression } from '../../session/history';
import {
  C4_STOP_SIGNS, C4_STOP_TEXT, C4_TITLE, C4_URGENT_SIGNS, ECHELON_TEXT, G6_SIGNS, G6_STOP_TEXT, G6_TITLE, G6_URGENT_TEXT, loadLessText, loadMoreText,
  PAIN_HELP_TEXT, PAIN_STOP_TEXT, PAIR_FIRST_SESSION_TEXT, CARDIO_PLAY_TEXT, R5_SIGNS, R5_STOP_TEXT, SOUND_NOTE, SYMPTOM_RESUME_CONFIRM, U1_TEL, U1_TEXT, WAKE_LOCK_BANNER,
} from '../../session/messages';
import type { PairPain } from '../../session/engine';
import { loadGeneratorInput } from '../../session/program';
import type { SessionController } from '../../session/store';
import { formatClock, startDisplayTick } from '../../session/timer';
import { ReportButton } from '../ReportButton';
import { cleanText, type Fiche } from '../../data/fiches';
import { FicheImages, FicheView } from './Fiche';
import { SummaryScreen } from './Summary';
import { asGenFiches, type PlayerData } from '../session/launch';
import { playRestEnd, vibrateRestEnd } from '../session/sound';
import { acquireWakeLock, releaseWakeLock, useWakeLockOk } from '../session/wakelock';
import { durationText, exName, fmtKg, ficheOf, isLoadable, parseNumber, targetText, variantOf } from '../session/text';

type SheetKind = null | 'quit' | 'skip' | 'pain' | 'symptom';
const ZONES = Object.keys(ZONE_LABEL) as InjuryZone[];
const zoneName = (z: InjuryZone): string => ZONE_LABEL[z].charAt(0).toUpperCase() + ZONE_LABEL[z].slice(1);

interface Form {
  step: number;
  loadText: string;
  reps: number;
  rir: number | null;
}

interface PainInfo {
  gentler: { ficheId: string; nom: string } | null;
  proposal: string | null;
  s1: string | null;
  /** D26 (SUP-8) : douleur pendant un superset : partenaire et choix proposés. */
  pair: PairPain | null;
}

/** D26 (E17) : le texte de la séance 1 n'est dit qu'une fois (confort local, sans garantie : stockage du navigateur). */
const PAIR_TEXT_KEY = 'muscu.d26.texte-seance1';
function pairTextSeen(): boolean {
  try {
    return localStorage.getItem(PAIR_TEXT_KEY) === '1';
  } catch {
    return false;
  }
}
function markPairTextSeen(): void {
  try {
    localStorage.setItem(PAIR_TEXT_KEY, '1');
  } catch {
    /* stockage indisponible : le texte pourra revenir, sans gêne */
  }
}

export interface PlayerProps {
  controller: SessionController;
  data: PlayerData;
  profile: Profile;
  /** Retour à l'accueil (séance finie ou quittée). */
  onClose: () => void;
  /** Quitte le lecteur sans terminer la séance (elle reste reprenable) et ouvre l'écran Blessures. */
  onEditInjuries?: () => void;
}

/** Charge suivante / précédente : paliers réels des haltères du profil, sinon pas de 1 kg. */
function stepLoad(data: PlayerData, ex: PlannedExercise, cur: number | null, dir: 1 | -1): number | null {
  const loads = data.ctx.availableLoadsKg(ex, cur).slice().sort((a, b) => a - b);
  if (cur === null) return dir > 0 ? (loads[0] ?? 1) : null;
  const eps = 1e-9;
  if (dir > 0) return loads.find((l) => l > cur + eps) ?? null;
  const lower = loads.filter((l) => l < cur - eps).pop();
  return lower ?? null;
}

function Sheet({ title, children, onClose, label }: { title: string; children: ComponentChildren; onClose?: () => void; label?: string }) {
  return (
    <div class="sheet-back" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div class="sheet" role="dialog" aria-modal="true" aria-label={label ?? title}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

/** « Comment faire » : les 3 premières consignes de la fiche, en mots simples ; le reste est dans la fiche (« Voir la fiche »). */
export function HowTo({ steps, all }: { steps: string[]; all: Fiche[] }) {
  const lines = steps.slice(0, 3).map((s) => cleanText(s, all)).filter((s) => s.length > 0);
  if (!lines.length) return null;
  return (
    <section class="how" aria-label="Comment faire">
      <h2>Comment faire</h2>
      <ol>
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ol>
    </section>
  );
}

export function SessionPlayer({ controller: ctl, data, profile, onClose, onEditInjuries }: PlayerProps) {
  const [, setVer] = useState(0);
  const refresh = () => setVer((v) => v + 1);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [ficheOpen, setFicheOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{ exercise: number; text: string } | null>(null);
  const [formRaw, setFormRaw] = useState<Form | null>(null);
  const [zone, setZone] = useState<InjuryZone | 'inconnu' | null>(null);
  const [painInfo, setPainInfo] = useState<PainInfo | null>(null);
  const [zoom, setZoom] = useState(false);
  const [gentlerPre, setGentlerPre] = useState<{ ficheId: string; nom: string } | null>(null);
  const [confirmResume, setConfirmResume] = useState(false);
  const busy = useRef(false);
  const alerted = useRef<number | null>(null);
  const wakeOk = useWakeLockOk();

  const day = ctl.day;
  const state = ctl.state;
  // D26 (SUP-2 point 7, E17) : paires reportées pour étalonnage : la séance peut durer plus que l'annonce ; dit une seule fois.
  const [pairText] = useState(() => day.exercises.some((e) => e.pairDeferred === 'etalonnage') && state.workSetsDone === 0 && !pairTextSeen());
  useEffect(() => {
    if (pairText) markPairTextSeen();
  }, [pairText]);
  const v = ctl.view();
  const all = data.fiches;
  const ex = v.exercise;
  const hasRest = !!state.rest;

  // ----- Écran allumé, arrière-plan, minuteur -----
  // Écran allumé : redemandé à l'ouverture, relâché IMMÉDIATEMENT à la fermeture de l'écran (effet de mise en page : son nettoyage
  // s'exécute pendant le démontage, sans attendre le prochain cycle d'affichage).
  useLayoutEffect(() => {
    void acquireWakeLock();
    return () => {
      void releaseWakeLock();
    };
  }, []);
  useEffect(() => {
    if (v.phase === 'fin') void releaseWakeLock();
  }, [v.phase]);

  const alertRestEnd = (endsAt: number) => {
    if (alerted.current === endsAt) return;
    alerted.current = endsAt;
    playRestEnd();
    vibrateRestEnd();
  };

  useEffect(() => {
    const foreground = () => {
      const rest = ctl.state.rest;
      const r = ctl.onForeground();
      if (rest && r.finishedWhileAway) alertRestEnd(rest.endsAt);
      void acquireWakeLock();
      refresh();
    };
    const onVis = () => {
      if (document.visibilityState === 'hidden') ctl.onBackground();
      else foreground();
    };
    document.addEventListener('visibilitychange', onVis);
    addEventListener('pageshow', foreground);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      removeEventListener('pageshow', foreground);
    };
  }, [ctl]);

  useEffect(() => {
    if (!hasRest) return;
    return startDisplayTick(() => {
      const rest = ctl.state.rest;
      if (rest && ctl.restRemainingMs() === 0) alertRestEnd(rest.endsAt);
      refresh();
    }, 250);
  }, [ctl, hasRest]);

  // Dernière série faite : la séance se termine d'elle-même et l'écran de fin s'affiche.
  useEffect(() => {
    if (v.phase === 'fin' && ctl.state.outcome === 'en_cours') {
      void ctl.finishSession().then(refresh, (e) => setError(e instanceof Error ? e.message : 'Enregistrement impossible.'));
    }
  }, [v.phase, state.outcome]);

  useEffect(() => {
    if (sheet !== 'pain' || v.exerciseIndex === null) return;
    let off = false;
    const mv = day.exercises[v.exerciseIndex].movementId;
    loadGeneratorInput(asGenFiches(all)).then((l) => {
      const g = l ? gentlerAlternative(mv, l.input) : null;
      if (!off) setGentlerPre(g ? { ficheId: g.ficheId, nom: g.nom } : null);
    }, () => undefined);
    return () => {
      off = true;
      setGentlerPre(null);
    };
  }, [sheet]);

  const act = async (fn: () => Promise<unknown>) => {
    if (busy.current) return;
    busy.current = true;
    try {
      await fn();
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue. Réessaie.');
    } finally {
      busy.current = false;
      refresh();
    }
  };

  // ----- Données de l'exercice courant -----
  const variant = ex ? variantOf(all, ex) : undefined;
  const loadable = isLoadable(variant);
  const bodyweight = ex ? data.bodyweightOf(ex) : undefined;
  const last = useMemo(
    () => (ex ? (bodyweight && variant ? lastTimeEchelon(data.sets, ex.movementId, variant.echelon, ctl.sessionId) : lastTime(data.sets, ex.variantId, ctl.sessionId)) : null),
    [ex?.variantId],
  );
  const prog = useMemo(
    () =>
      ex
        ? proposeProgression({
            exercise: ex,
            sets: data.sets,
            pregnant: data.pregnant,
            variantTags: variant?.tags,
            equipment: data.equipment ?? undefined,
            echelon: variant?.echelon,
            excludeSessionId: ctl.sessionId,
            sessions: data.sessions,
            frozenBySymptom: data.frozen,
            bodyweight,
            repriseActive: data.repriseActive,
            zonesOfFiche: Object.keys(ficheOf(all, ex)?.securite.zones ?? {}),
          })
        : null,
    [ex?.variantId],
  );

  const cursorStep = v.cursor?.step ?? -1;
  const switched = !!ex && v.exerciseIndex !== null && ex.variantId !== day.exercises[v.exerciseIndex].variantId;
  const initialForm = (): Form => ({
    step: cursorStep,
    loadText: v.loadKg === null ? '' : fmtKg(v.loadKg),
    // V-PROG-E10 : après tout changement d'échelon, la suggestion est le bas de la fourchette ; sans charge, le suivi est par (fiche, échelon).
    reps: ex && !v.isWarmupSet && switched ? ex.repsMin : ex && !v.isWarmupSet && (bodyweight ? data.startReps(ex) : last?.reps) != null ? Math.min(500, (bodyweight ? data.startReps(ex) : last?.reps) as number) : (ex?.repsMin ?? 0),
    rir: null,
  });
  const form: Form = formRaw && formRaw.step === cursorStep ? formRaw : initialForm();
  const setForm = (patch: Partial<Form>) => setFormRaw({ ...form, ...patch });
  const curLoad = parseNumber(form.loadText);

  const bumpLoad = (dir: 1 | -1) => {
    if (!ex) return;
    const next = stepLoad(data, ex, curLoad, dir);
    if (next !== null) setForm({ loadText: fmtKg(next) });
  };

  // ----- Actions -----
  const doneSet = () =>
    act(async () => {
      if (!ex) return;
      const input: SetInput = v.isWarmupSet
        ? { reps: ex.warmupSets[v.setNumber - 1]?.reps ?? null, loadKg: v.loadKg }
        : ex.unit === 'sec'
          ? { holdSec: ex.holdSec }
          : { reps: form.reps, loadKg: loadable || v.loadKg !== null ? curLoad : null, rir: ex.unit === 'reps' ? form.rir : null };
      const r = await ctl.completeSet(input);
      const s = r.suggestion;
      if (r.echelonChange) {
        const nom = all.flatMap((f) => f.variantes).find((x) => x.id === r.echelonChange!.variantId)?.nom ?? 'la version suivante';
        setSuggestion({ exercise: r.entry.exercise, text: r.echelonChange.to > r.echelonChange.from ? ECHELON_TEXT.switchedUp(nom) : ECHELON_TEXT.switchedDown(nom) });
      } else if (s && s.loadKg !== null && input.loadKg != null && s.loadKg !== input.loadKg) {
        const d = Math.abs(s.loadKg - input.loadKg);
        setSuggestion({ exercise: r.entry.exercise, text: s.loadKg > input.loadKg ? loadMoreText(d) : loadLessText(d) });
      } else if (s && s.action === 'garder') setSuggestion({ exercise: r.entry.exercise, text: 'Garde la même charge.' });
      else setSuggestion(null);
    });

  const recordPain = () =>
    act(async () => {
      if (!ex) return;
      const exIndex = v.exerciseIndex!;
      const res = await ctl.markPain({ zone });
      const pair = res.pairPain ?? null;
      setSuggestion(null);
      // Conseils après la douleur : version plus douce (si elle passe tous les filtres), et douleur sur 2 séances de suite.
      let gentler: PainInfo['gentler'] = null;
      try {
        const loaded = await loadGeneratorInput(asGenFiches(all));
        const g = loaded ? gentlerAlternative(day.exercises[exIndex].movementId, loaded.input) : null;
        gentler = g ? { ficheId: g.ficheId, nom: g.nom } : null;
      } catch {
        gentler = null;
      }
      let proposal: string | null = null;
      let s1: string | null = null;
      try {
        const [sets, sessions, injuries] = await Promise.all([list('sets'), list('sessions'), list('injuries')]);
        const nowIso = new Date().toISOString();
        const patched = sessions.map((s) => (s.id === ctl.sessionId ? { ...s, status: 'sautee' as const, endedAt: nowIso } : s));
        const check = painCheck(sets, patched, injuries);
        proposal = check.proposals[0]?.text ?? null;
        s1 = check.s1Text;
      } catch {
        /* ignoré : le conseil de consulter reste affiché */
      }
      setPainInfo({ gentler, proposal, s1, pair });
    });

  const closePain = () => {
    setSheet(null);
    setPainInfo(null);
    setZone(null);
  };

  // ----- Pièces d'écran -----
  const count = v.phase === 'echauffement' ? 'Échauffement' : v.exerciseIndex !== null ? `Exercice ${v.exerciseIndex + 1}/${day.exercises.length}` : 'Séance';
  const reportFiche = ex ? ex.movementId : day.exercises[0]?.movementId ?? '';
  const header = (
    <header class="player-head">
      <button type="button" class="btn player-quit" onClick={() => setSheet('quit')}>Quitter</button>
      <div class="player-count" aria-live="polite">{count}</div>
      <ReportButton ficheId={reportFiche} variantId={ex?.variantId ?? null} />
    </header>
  );
  // Un seul message d'information par écran : le bandeau « écran qui peut s'éteindre » cède la place à l'annonce d'un superset.
  const bannersFor = (showWake: boolean) => (
    <>
      {showWake && !wakeOk && <div class="notice small" role="status">{WAKE_LOCK_BANNER}</div>}
      {error && <div class="toast" role="alert">{error}</div>}
    </>
  );
  const banners = bannersFor(true);
  const symptomBtn = (
    <button type="button" class="btn btn-sec" onClick={() => { setConfirmResume(false); setSheet('symptom'); }}>J’ai un symptôme</button>
  );

  // ----- Fiche ouverte pendant la séance -----
  if (ficheOpen) {
    const f = all.find((x) => x.id === ficheOpen);
    return (
      <div class="player">
        <div class="player-scroll">
          <button type="button" class="btn back-btn" onClick={() => setFicheOpen(null)}>← Retour à la séance</button>
          {f ? <FicheView fiche={f} all={all} equipment={data.equipment} injuries={data.injuries} pregnancy={profile.pregnancy} /> : <p>Cette fiche n’existe pas.</p>}
        </div>
        <div class="player-foot">
          <button type="button" class="btn btn-primary" onClick={() => setFicheOpen(null)}>Retour à la séance</button>
        </div>
      </div>
    );
  }

  // ----- Écran de sécurité -----
  if (sheet === 'symptom' && state.outcome === 'en_cours') {
    const neck = data.injuries.some((i) => i.zone === 'cou');
    return (
      <div class="player" role="alertdialog" aria-label="J’ai un symptôme">
        <div class="player-scroll">
          <h1>J’ai un symptôme</h1>
          <section class="notice notice-urgent" aria-label="Urgence">
            <p><strong>{U1_TEXT}</strong></p>
            <a class="btn btn-danger" href={U1_TEL}>Appeler le 15</a>
            <a class="btn" href="tel:112">Appeler le 112</a>
          </section>
          <section class="card">
            <h2>Arrête la séance si tu ressens :</h2>
            <ul class="fiche-liste">{R5_SIGNS.map((t) => <li key={t}>{t}</li>)}</ul>
            <p>{R5_STOP_TEXT}</p>
          </section>
          {data.pregnant && (
            <section class="card">
              <h2>{G6_TITLE}</h2>
              <p>{G6_STOP_TEXT}</p>
              <ul class="fiche-liste">{G6_SIGNS.map((t) => <li key={t}>{t}</li>)}</ul>
              <p><strong>{G6_URGENT_TEXT}</strong></p>
            </section>
          )}
          {neck && (
            <section class="card">
              <h2>{C4_TITLE}</h2>
              <p><strong>Appelle le 15 ou le 112 si tu as :</strong></p>
              <ul class="fiche-liste">{C4_URGENT_SIGNS.map((t) => <li key={t}>{t}</li>)}</ul>
              <p>{C4_STOP_TEXT}</p>
              <ul class="fiche-liste">{C4_STOP_SIGNS.map((t) => <li key={t}>{t}</li>)}</ul>
            </section>
          )}
          {confirmResume && (
            <div class="notice" role="alert">
              <p>{SYMPTOM_RESUME_CONFIRM}</p>
              <button type="button" class="btn" onClick={() => { setConfirmResume(false); setSheet(null); }}>Oui, je reprends</button>
              <button type="button" class="btn btn-primary" onClick={() => setConfirmResume(false)}>Non, je reste à l’arrêt</button>
            </div>
          )}
        </div>
        <div class="player-foot">
          <button type="button" class="btn btn-primary" onClick={() => act(async () => { await ctl.reportSymptom(true); setSheet(null); })}>Arrêter la séance</button>
          {!confirmResume && <button type="button" class="btn" onClick={() => setConfirmResume(true)}>Revenir à la séance</button>}
        </div>
      </div>
    );
  }

  // ----- Fin -----
  if (state.outcome === 'en_cours' && v.phase === 'fin') {
    return <div class="player"><p class="dim player-scroll" role="status">Enregistrement de ta séance…</p></div>;
  }
  if (state.outcome !== 'en_cours') {
    return <SummaryScreen ctl={ctl} data={data} pregnancy={profile.pregnancy} onClose={onClose} onEditInjuries={onEditInjuries} />;
  }

  // ----- Échauffement -----
  if (v.phase === 'echauffement') {
    const w = day.warmup;
    return (
      <div class="player">
        {header}
        <div class="player-scroll">
          {banners}
          <h1>Échauffement</h1>
          <p class="dim">Prends quelques minutes pour te mettre en route, tranquillement.</p>
          {pairText && <div class="notice small" role="status"><p>{PAIR_FIRST_SESSION_TEXT}</p></div>}
          <section class="card">
            <ul class="fiche-liste">
              {w?.general && <li><strong>{w.general.nom}</strong> · {durationText(w.general.sec)}</li>}
              {(w?.mobility ?? []).map((m, i) => <li key={i}><strong>{m.nom}</strong> · {durationText(m.sec)}</li>)}
            </ul>
          </section>
        </div>
        <div class="player-foot">
          <button type="button" class="btn btn-primary btn-big" onClick={() => act(() => ctl.endWarmup())}>Échauffement fait</button>
          {symptomBtn}
        </div>
        {sheet === 'quit' && quitSheet()}
      </div>
    );
  }

  // ----- Repos -----
  if (state.rest && ex) {
    const left = ctl.restRemainingMs();
    const total = state.rest.totalMs || 1;
    const over = left === 0;
    const transition = state.rest.kind === 'transition';
    return (
      <div class="player">
        {header}
        <div class="player-scroll">
          {banners}
          <p class="rest-label">{over ? 'Repos terminé' : transition ? 'Enchaîne vite' : 'Repos'}</p>
          <div class="rest-clock" role="timer" aria-label={`Repos : ${formatClock(left)}`}>{formatClock(left)}</div>
          <div class="rest-bar" aria-hidden="true"><div class="rest-bar-fill" style={{ width: `${Math.round((left / total) * 100)}%` }} /></div>
          <div class="rest-adjust">
            <button type="button" class="btn" onClick={() => act(() => ctl.adjustRest(-15))}>−15 s</button>
            <button type="button" class="btn" onClick={() => act(() => ctl.adjustRest(15))}>+15 s</button>
          </div>
          <section class="card" aria-label="Ensuite">
            <p class="dim small">Ensuite</p>
            <p><strong>{exName(all, ex)}</strong></p>
            <p class="small">
              {v.isWarmupSet ? 'Série d’échauffement' : `Série ${v.setNumber} sur ${v.setsTotal}`}
              {v.side ? ` · côté ${v.side}` : ''} · {targetText(ex)}
            </p>
            {suggestion && suggestion.exercise === v.exerciseIndex && <p class="small prog-line">{suggestion.text}</p>}
          </section>
          <p class="dim small">{SOUND_NOTE}</p>
        </div>
        <div class="player-foot">
          <button type="button" class="btn btn-primary btn-big" onClick={() => act(() => ctl.skipRest())}>{over ? 'Série suivante' : 'Passer le repos'}</button>
          {symptomBtn}
        </div>
        {sheet === 'quit' && quitSheet()}
      </div>
    );
  }

  // ----- Carte d'exercice -----
  if (!ex) return <div class="player"><p>Chargement…</p></div>;
  const fiche = ficheOf(all, ex);
  const partner = v.inSuperset ? day.exercises[v.partnerIndexes[0]] : null;
  const supersetText = partner
    ? `Superset : ${day.exercises.filter((e) => e.supersetGroup === ex.supersetGroup).map((e) => exName(all, e)).join(' puis ')}`
    : null;
  const lastLine = (() => {
    if (!last || last.reps === null) return null;
    return last.loadKg !== null ? `Dernière fois : ${fmtKg(last.loadKg)} kg × ${last.reps}` : `Dernière fois : ${last.reps} répétitions`;
  })();
  const progLine = suggestion && suggestion.exercise === v.exerciseIndex ? suggestion.text : v.setNumber === 1 && prog && !prog.echelonProposal ? prog.text : null;
  const showLoad = !v.isWarmupSet && ex.unit !== 'sec' && (loadable || v.loadKg !== null);
  const askRir = !v.isWarmupSet && ex.unit === 'reps';
  const askReps = !v.isWarmupSet && ex.unit !== 'sec';

  function quitSheet() {
    return (
      <Sheet title="Quitter la séance ?" onClose={() => setSheet(null)}>
        <p class="dim">Les séries déjà faites sont gardées.</p>
        <button type="button" class="btn btn-primary" onClick={() => act(async () => { await ctl.finishSession(); setSheet(null); })}>Terminer la séance</button>
        <button type="button" class="btn btn-danger" onClick={() => act(async () => { await ctl.abandonSession(); setSheet(null); })}>Abandonner la séance</button>
        <button type="button" class="btn" onClick={() => setSheet(null)}>Continuer la séance</button>
      </Sheet>
    );
  }

  return (
    <div class="player">
      {header}
      <div class="player-scroll">
        {bannersFor(!supersetText && !(pairText && state.workSetsDone === 0))}
        {pairText && state.workSetsDone === 0 && !supersetText && <div class="notice small" role="status"><p>{PAIR_FIRST_SESSION_TEXT}</p></div>}
        {supersetText && (
          <div class="notice small superset" role="status">
            <strong>{supersetText}</strong>
          </div>
        )}
        <div class="ex-head">
          {fiche && (
            <button type="button" class="img-btn" aria-label="Agrandir l’image" onClick={() => setZoom(true)}>
              <FicheImages fiche={fiche} compact />
            </button>
          )}
          <div class="ex-info">
            <h1>{exName(all, ex)}</h1>
            <button type="button" class="btn btn-link" onClick={() => fiche && setFicheOpen(fiche.id)}>Voir la fiche</button>
          </div>
        </div>
        {variant && (fiche?.variantes.length ?? 0) > 1 && <p class="dim small tight">Pour toi : {variant.nom}</p>}
        <p class="set-line">
          {v.isWarmupSet ? `Série d’échauffement ${v.setNumber} sur ${v.setsTotal}` : `Série ${v.setNumber} sur ${v.setsTotal}`}
          {v.side ? ` · côté ${v.side}` : ''}
        </p>
        <p class="target-line">{v.isWarmupSet ? `${ex.warmupSets[v.setNumber - 1]?.reps ?? ex.repsMin} répétitions, léger${v.loadKg !== null ? ` · ${fmtKg(v.loadKg)} kg` : ''}` : targetText(ex)}</p>
        {lastLine && !v.isWarmupSet && <p class="dim small">{lastLine}</p>}
        {progLine && !v.isWarmupSet && <p class="small prog-line">{progLine}</p>}

        <div class="stepper-pair">
        {showLoad && (
          <div class="stepper" role="group" aria-label="Charge en kilos">
            <button type="button" class="btn step-btn" aria-label="Moins de charge" onClick={() => bumpLoad(-1)}>−</button>
            <label class="step-field">
              <span class="small dim">Charge (kg)</span>
              <input class="field step-input" inputMode="decimal" value={form.loadText} onInput={(e) => setForm({ loadText: e.currentTarget.value })} aria-label="Charge en kilos" />
            </label>
            <button type="button" class="btn step-btn" aria-label="Plus de charge" onClick={() => bumpLoad(1)}>+</button>
          </div>
        )}
        {askReps && (
          <div class="stepper" role="group" aria-label="Répétitions">
            <button type="button" class="btn step-btn" aria-label="Moins de répétitions" onClick={() => setForm({ reps: Math.max(0, form.reps - 1) })}>−</button>
            <div class="step-field" aria-live="polite">
              <span class="small dim">Répétitions</span>
              <span class="step-value">{form.reps}</span>
            </div>
            <button type="button" class="btn step-btn" aria-label="Plus de répétitions" onClick={() => setForm({ reps: Math.min(500, form.reps + 1) })}>+</button>
          </div>
        )}
        </div>
        {askRir && (
          <div role="group" aria-label="Répétitions en réserve">
            <p class="small dim rir-q">Combien de répétitions te restait-il ?</p>
            <div class="rir-row">
              {[0, 1, 2, 3, 4].map((n) => (
                <button key={n} type="button" class="chip rir-btn" aria-pressed={form.rir === n} onClick={() => setForm({ rir: form.rir === n ? null : n })}>
                  {n === 4 ? '4+' : n}
                </button>
              ))}
            </div>
          </div>
        )}
        {ex.unit === 'sec' && ex.role !== 'cardio' && <p class="dim small">Tiens la position, puis touche « Série faite ».</p>}
        {ex.role === 'cardio' && (
          <p class="dim small">
            {ex.intensity === 'facile' ? CARDIO_PLAY_TEXT.easy : CARDIO_PLAY_TEXT.moderate} {CARDIO_TEXT.T7}
            {ex.slowEndMin ? ` ${CARDIO_PLAY_TEXT.slowEnd(ex.slowEndMin)}` : ''}
            {ex.slowEndMin && data.pregnant ? ` ${CARDIO_PLAY_TEXT.pregnancy}` : ''} Touche « Série faite » à la fin.
          </p>
        )}
        {fiche && <HowTo steps={fiche.consignes} all={all} />}
      </div>
      <div class="player-foot">
        <button type="button" class="btn btn-primary btn-big" onClick={doneSet}>Série faite</button>
        <div class="foot-row">
          <button type="button" class="btn btn-sec" onClick={() => { setPainInfo(null); setZone(null); setSheet('pain'); }}>Ça fait mal</button>
          <button type="button" class="btn btn-sec" onClick={() => setSheet('skip')}>Passer cet exercice</button>
          {symptomBtn}
        </div>
      </div>

      {zoom && fiche && (
        <Sheet title={exName(all, ex)} label="Image de l’exercice" onClose={() => setZoom(false)}>
          <FicheImages fiche={fiche} />
          <button type="button" class="btn btn-primary" onClick={() => setZoom(false)}>Fermer</button>
        </Sheet>
      )}
      {sheet === 'quit' && quitSheet()}
      {sheet === 'skip' && (
        <Sheet title="Passer cet exercice ?" onClose={() => setSheet(null)}>
          <p class="dim">Il ne sera pas compté dans ta séance.</p>
          <button type="button" class="btn btn-danger" onClick={() => act(async () => { await ctl.skipExercise(); setSheet(null); })}>Passer l’exercice</button>
          <button type="button" class="btn btn-primary" onClick={() => setSheet(null)}>Annuler</button>
        </Sheet>
      )}
      {sheet === 'pain' && !painInfo && (
        <Sheet title="Ça fait mal ?" label="Ça fait mal" onClose={() => setSheet(null)}>
          <p class="dim small">{PAIN_HELP_TEXT}</p>
          <p><strong>Arrête, et reviens à la version plus douce.</strong></p>
          <p class="small dim">Où as-tu mal ? (facultatif)</p>
          <div class="zones" role="group" aria-label="Zone de la douleur">
            {ZONES.map((z) => (
              <button key={z} type="button" class="zone-btn" aria-pressed={zone === z} onClick={() => setZone(zone === z ? null : z)}>{zoneName(z)}</button>
            ))}
            <button type="button" class="zone-btn" aria-pressed={zone === 'inconnu'} onClick={() => setZone(zone === 'inconnu' ? null : 'inconnu')}>Je ne sais pas</button>
          </div>
          <button type="button" class="btn btn-primary" onClick={recordPain}>J’arrête cet exercice</button>
          {gentlerPre && (
            <button type="button" class="btn" onClick={() => { const id = gentlerPre.ficheId; setSheet(null); setFicheOpen(id); }}>Voir la version plus douce : {gentlerPre.nom}</button>
          )}
          <button type="button" class="btn" onClick={() => setSheet(null)}>Annuler</button>
        </Sheet>
      )}
      {sheet === 'pain' && painInfo && (
        <Sheet title="Exercice arrêté" onClose={closePain}>
          <p>{PAIN_STOP_TEXT}</p>
          {painInfo.gentler ? (
            <button type="button" class="btn" onClick={() => { const id = painInfo.gentler!.ficheId; closePain(); setFicheOpen(id); }}>Voir la version plus douce : {painInfo.gentler.nom}</button>
          ) : (
            <p class="dim small">À la prochaine séance, la charge ne monte pas.</p>
          )}
          {painInfo.proposal && <div class="notice small"><p>{painInfo.proposal}</p></div>}
          {painInfo.s1 && <div class="notice small"><p>{painInfo.s1}</p></div>}
          {painInfo.proposal && onEditInjuries && (
            <button type="button" class="btn" onClick={onEditInjuries}>Mettre à jour mes blessures</button>
          )}
          {painInfo.pair ? (
            <>
              <p class="small">
                Le superset s’arrête. {exName(all, day.exercises[painInfo.pair.partner])} :{' '}
                {painInfo.pair.canContinue ? 'tu peux le continuer seul, avec son repos, ou passer à la suite.' : 'passe à la suite.'}
              </p>
              {painInfo.pair.canContinue && <button type="button" class="btn btn-primary" onClick={closePain}>Continuer seul</button>}
              <button
                type="button"
                class={painInfo.pair.canContinue ? 'btn' : 'btn btn-primary'}
                onClick={() => act(async () => { if (ctl.view().exerciseIndex === painInfo.pair!.partner) await ctl.skipExercise(); closePain(); })}
              >
                Passer au suivant
              </button>
            </>
          ) : (
            <button type="button" class="btn btn-primary" onClick={closePain}>Continuer la séance</button>
          )}
        </Sheet>
      )}
    </div>
  );
}
