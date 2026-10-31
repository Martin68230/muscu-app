import { useEffect, useState } from 'preact/hooks';
import type { Program, ProgramDay, Profile } from '../../data/model';
import { FICHES_ERROR, loadFiches, type Fiche } from '../../data/fiches';
import { list } from '../../data/repo';
import { D30_TEXT, ECHELON_TEXT, GAIN_TEXT, PAIR_FIRST_SESSION_TEXT } from '../../session/messages';
import { SwitchRow } from '../SwitchRow';
import { CardioDayNotes } from '../session/CardioNotes';
import { ensureActiveProgram, getNextSession, loadGeneratorInput, programWeek, rotationFreeze, withProgramWeek, type NextSession } from '../../session/program';
import { pairsForSession } from '../../session/engine';
import { update } from '../../data/repo';
import { WEEKDAY_NAMES } from '../../generator/messages';
import { isCardioDay } from '../../generator';
import { GainToggle, gainDisabledReason } from '../GainToggle';
import { acceptEchelon, answerLevel, cancelArrivals, computeProposals, loadEvents, refuseEchelon, staleArrivals, type MoveProposal, type ProposalItem, type ProposalSet } from '../../session/progression-store';
import { SessionError } from '../../session/engine';
import { asGenFiches } from '../session/launch';
import { exName, lineText, ficheOf, variantOf } from '../session/text';
import { unlockSound } from '../session/sound';
import { acquireWakeLock } from '../session/wakelock';
import { loadPlayerData } from '../session/launch';
import { planReprise } from '../../session/reprise-plan';
import { repriseOf } from '../../session/missed-config';
import { showT12 } from '../../session/missed';
import { skipSession } from '../../session/missed-store';
import { PreviewSkipLinks } from '../MissedCard';

export function goHome(): void {
  location.hash = '#/accueil';
}

/** Messages du générateur : l'avis médecin / sage-femme (grossesse) passe en premier. */
export function orderedMessages(program: Program): string[] {
  const msgs = program.messages ?? [];
  const first = msgs.filter((m) => m.id === 'V-MSG-GROS-AVIS');
  return [...first, ...msgs.filter((m) => m.id !== 'V-MSG-GROS-AVIS')].map((m) => m.text);
}

/** Messages de sécurité (douleur, grossesse, blessures, cardio) : toujours visibles. Les autres vont derrière « Pourquoi ? ». */
export const SAFETY_MESSAGE_IDS = [
  'V-MSG-GROS-AVIS', 'V-MSG-GROS-DUREE', 'V-MSG-ZONE', 'V-MSG-PRO', 'R3', 'T0', 'T1', 'T1u', 'T3', 'T4', 'T5',
  // D25 : avertissement « une séance par semaine » affiché avant (STR-REP-1), limites de séances de force (STR-REP-6, 11).
  'V-MSG-UN-JOUR', 'V-MSG-UN-JOUR-DUREE', 'V-MSG-LEGERS', 'V-MSG-GROS-SEANCES',
];

/** Sépare les messages du programme : sécurité (visibles) et informations (repliées). L'avis grossesse passe en premier. */
export function splitMessages(program: Program): { safety: string[]; info: string[] } {
  const msgs = program.messages ?? [];
  const safe = msgs.filter((m) => SAFETY_MESSAGE_IDS.includes(m.id));
  const first = safe.filter((m) => m.id === 'V-MSG-GROS-AVIS');
  return {
    safety: [...first, ...safe.filter((m) => m.id !== 'V-MSG-GROS-AVIS')].map((m) => m.text),
    info: msgs.filter((m) => !SAFETY_MESSAGE_IDS.includes(m.id)).map((m) => m.text),
  };
}

export interface PreviewViewProps {
  program: Program;
  next: NextSession;
  fiches: Fiche[];
  error?: string | null;
  onBegin: () => void;
  /** F6 : propositions de progression (jamais automatiques). */
  proposals?: ProposalSet | null;
  /** Une proposition acceptée a été annulée parce que le programme a changé : message clair. */
  cancelled?: boolean;
  onAnswer?: (item: ProposalItem, accepted: boolean) => void;
  onAnswerLevel?: (accepted: boolean) => void;
  /** Reprise douce (SM-14) : bloc de messages T-13/T-14/T-20/T-15 et T-19, un seul bloc, et séance adaptée au palier. */
  repriseTexts?: string[];
  repriseDay?: ProgramDay | null;
  /** SM-6 : « Sauter cette séance » et « Je ne me sens pas bien » depuis l'aperçu. */
  onSkip?: () => Promise<void>;
  onUnwell?: () => Promise<void>;
  /** Option « Gagner du temps » (core-et-supersets.md §12) ; `firstSession` : paires différées par l'étalonnage (SUP-2 point 7). */
  gain?: { on: boolean; disabledReason: string | null; onToggle: (on: boolean) => void; busy?: boolean; firstSession: boolean };
  /** Semaine du programme (rampe du cardio du débutant) ; absente = 1. */
  week?: number;
  /** D31 : « Ajouter une séance de cardio ? » (force, muscle, perte de gras) ou séance de sport incluse. */
  cardioOpt?: { state: NonNullable<Program['cardioOption']>; onToggle: (on: boolean) => void; busy?: boolean };
}

/** Cartes de progression de l'aperçu : « Prêt pour l'échelon suivant : <nom> ? » Accepter / Plus tard. */
function ProposalCards({ proposals, onAnswer, onAnswerLevel }: { proposals: ProposalSet; onAnswer?: PreviewViewProps['onAnswer']; onAnswerLevel?: PreviewViewProps['onAnswerLevel'] }) {
  return (
    <>
      {proposals.items.map((it) => {
        const p = it.proposal;
        if (p.kind === 'plancher') return <div class="notice small" role="status" key={it.movementId}><p>{p.text}</p></div>;
        return (
          <section class="card proposal" aria-label="Proposition" key={it.movementId}>
            <h2>{p.title}</h2>
            <p class="dim">{p.text}</p>
            <button type="button" class="btn btn-primary" onClick={() => onAnswer?.(it, true)}>{ECHELON_TEXT.accept}</button>
            <button type="button" class="btn" onClick={() => onAnswer?.(it, false)}>{ECHELON_TEXT.later}</button>
          </section>
        );
      })}
      {proposals.level && (
        <section class="card proposal" aria-label="Proposition de niveau">
          <h2>{ECHELON_TEXT.levelTitle}</h2>
          <p>{proposals.level.text}</p>
          <p class="dim">{proposals.level.note}</p>
          <button type="button" class="btn btn-primary" onClick={() => onAnswerLevel?.(true)}>{ECHELON_TEXT.levelAccept}</button>
          <button type="button" class="btn" onClick={() => onAnswerLevel?.(false)}>{ECHELON_TEXT.levelStay}</button>
        </section>
      )}
    </>
  );
}

/** Contenu de l'aperçu (sans accès à la base : testable). */
export function PreviewView({ program, next, fiches, error, onBegin, proposals, cancelled, onAnswer, onAnswerLevel, repriseTexts = [], repriseDay, onSkip, onUnwell, gain, week = 1, cardioOpt }: PreviewViewProps) {
  const day = withProgramWeek(repriseDay ?? next.day, week);
  const hasPair = day.exercises.some((e) => !!e.supersetGroup);
  // Séance de cardio dédiée : l'option « Gagner du temps » (supersets de musculation) n'a pas d'objet.
  const cardioDay = isCardioDay(day);
  const light = program.lightDays ?? [];
  const split = splitMessages(program);
  // T-19 = T3 du cardio : jamais deux fois le même texte sur l'écran.
  const safety = split.safety.filter((t) => !repriseTexts.includes(t));
  const info = split.info;
  const lines = program.explanation ?? [];
  const [skipped, setSkipped] = useState<string[] | null>(null);
  if (skipped) {
    return (
      <>
        <button type="button" class="btn back-btn" onClick={goHome}>← Accueil</button>
        <div class="notice" role="status">{skipped.map((t, i) => <p key={i}>{t}</p>)}</div>
        <div class="thumb-zone thumb-zone-alone">
          <button type="button" class="btn btn-primary" onClick={goHome}>Retour à l’accueil</button>
        </div>
      </>
    );
  }
  return (
    <>
      <button type="button" class="btn back-btn" onClick={goHome}>← Accueil</button>
      <h1>{day.label}</h1>
      <p class="dim">
        {day.estimatedMin ? `Environ ${day.estimatedMin} min` : 'Durée estimée : 45 min environ'} · {day.exercises.length} exercice{day.exercises.length > 1 ? 's' : ''}
      </p>
      <CardioDayNotes day={day} />
      {gain && !cardioDay && (
        <>
          <GainToggle on={gain.on} disabledReason={gain.disabledReason} onToggle={gain.onToggle} busy={gain.busy} />
          {gain.on && !gain.disabledReason && hasPair && gain.firstSession && <div class="notice small" role="status"><p>{PAIR_FIRST_SESSION_TEXT}</p></div>}
          {gain.on && !gain.disabledReason && !hasPair && <p class="dim small">{GAIN_TEXT.noPairToday}</p>}
        </>
      )}
      {cardioOpt && cardioOpt.state.offered && (
        <SwitchRow
          id="cardio-opt"
          label={cardioOpt.state.kind === 'sport' ? D30_TEXT.sportLabel : D30_TEXT.optionLabel}
          on={cardioOpt.state.accepted}
          help={cardioOpt.state.kind === 'sport' ? D30_TEXT.sportExplain : D30_TEXT.optionExplain}
          disabledReason={cardioOpt.state.disabledReason}
          busy={cardioOpt.busy}
          onToggle={cardioOpt.onToggle}
        />
      )}
      {repriseTexts.length > 0 && (
        <section class="notice" aria-label="Reprise">
          {repriseTexts.map((t, i) => <p key={i}>{t}</p>)}
        </section>
      )}
      {next.tooSoon && repriseTexts.length === 0 && (
        <div class="notice" role="status">
          <p>Ta dernière séance date de moins de 48 h. Tes muscles ont besoin de repos : tu peux attendre, mais c’est toi qui décides.</p>
        </div>
      )}
      {cancelled && <div class="notice small" role="status"><p>{ECHELON_TEXT.cancelled}</p></div>}
      {proposals && <ProposalCards proposals={proposals} onAnswer={onAnswer} onAnswerLevel={onAnswerLevel} />}
      {safety.length > 0 && (
        <section class="notice" aria-label="À savoir">
          {safety.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </section>
      )}
      {(lines.length > 0 || info.length > 0) && (
        <section class="card" aria-label="Pourquoi ce programme">
          {lines[0] && <p>{lines[0]}</p>}
          {(lines.length > 1 || info.length > 0) && (
            <details class="why">
              <summary>Pourquoi ?</summary>
              {lines.slice(1).map((l, i) => (
                <p key={`l${i}`}>{l}</p>
              ))}
              {info.map((t, i) => (
                <p class="dim" key={`i${i}`}>{t}</p>
              ))}
              {light.length > 0 && (
                <p class="dim light-days">
                  Jours légers, facultatifs ({light.map((d) => WEEKDAY_NAMES[d.weekday]).join(', ')}) : échauffement court et mobilité, {light[0].estimatedMin} min environ, sans charge{light[0].cardio ? `, et si tu veux ${light[0].cardio.minutes} min de marche à plat` : ''}.
                </p>
              )}
            </details>
          )}
        </section>
      )}
      <section class="card" aria-label="Les exercices">
        <h2>Les exercices</h2>
        <ol class="prev-list">
          {day.exercises.map((ex, i) => {
            const v = variantOf(fiches, ex);
            const many = (ficheOf(fiches, ex)?.variantes.length ?? 0) > 1;
            const partner = ex.supersetGroup ? day.exercises.find((e) => e !== ex && e.supersetGroup === ex.supersetGroup) : undefined;
            return (
              <li key={i}>
                <a class="fiche-link" href={`#/fiche/${ex.movementId}`}>{exName(fiches, ex)}</a>
                {v && many && <div class="dim small">{v.nom}</div>}
                <div class="small">{lineText(ex)}</div>
                {ex.jump?.softNom && !ex.jump.soft && <div class="dim small">{D30_TEXT.softLine(ex.jump.softNom)}</div>}
                {partner && <div class="small prev-super">Superset avec {exName(fiches, partner)} : enchaîne sans repos long.</div>}
              </li>
            );
          })}
        </ol>
      </section>
      {onSkip && onUnwell && (
        <PreviewSkipLinks nom={day.label} twoDays={showT12(program)} onSkip={onSkip} onUnwell={onUnwell} onDone={setSkipped} />
      )}
      {error && <div class="toast" role="alert">{error}</div>}
      <div class="thumb-zone thumb-zone-alone">
        <button type="button" class="btn btn-primary" onClick={onBegin}>Commencer la séance</button>
      </div>
    </>
  );
}

type Loaded = {
  program: Program; next: NextSession; fiches: Fiche[]; repriseTexts: string[]; repriseDay: ProgramDay | null; repriseActive: boolean;
  gainOn: boolean; gainReason: string | null; firstSession: boolean;
};

/** #/seance : aperçu de la séance du jour. L'appui sur « Commencer » débloque le son et demande l'écran allumé. */
export function SessionPreview({ profile, onBegin }: { profile: Profile; onBegin: (program: Program, dayIndex: number, fiches: Fiche[]) => Promise<void> }) {
  const [data, setData] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);
  const [proposals, setProposals] = useState<ProposalSet | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const load = async () => {
    const fiches = await loadFiches();
    const res = await ensureActiveProgram(asGenFiches(fiches));
    if (!res.ok) return setEmpty(true);
    const next0 = await getNextSession(Date.now());
    if (!next0) return setEmpty(true);
    // D34 (PV3-VAR-4, 5 d) : séance de la semaine en cours (jeu 1 ou jeu 2, gel après une douleur), AVANT la reprise douce.
    const [fzSets, fzInjuries] = await Promise.all([list('sets'), list('injuries')]);
    const next: NextSession = { ...next0, day: withProgramWeek(next0.day, programWeek(res.program, Date.now()), rotationFreeze(fzSets, fzInjuries, Date.now())) };
    // Reprise douce : calcul de R-DEM pour l'affichage seulement (rien n'est enregistré avant « Commencer »).
    let reprise: { texts: string[]; day: ProgramDay | null; active: boolean } = { texts: [], day: null, active: false };
    let me: Profile = profile;
    let firstSession = false;
    try {
      const [profiles, programs, allSessions, allSets] = await Promise.all([list('profile'), list('programs'), list('sessions'), list('sets')]);
      me = profiles[0] ?? profile;
      const pdata = await loadPlayerData(fiches, me).catch(() => null);
      const plan = planReprise(next.day, { reprise: repriseOf(profiles[0]), sessions: allSessions, programs, sets: allSets, now: new Date(), ctx: pdata?.ctx ?? null });
      if (plan) reprise = { texts: plan.start.texts, day: plan.state.actif ? plan.day : null, active: plan.state.actif };
      // SUP-2 point 7 : première séance d'un exercice de la paire -> exercices faits un par un (texte de la séance 1).
      if (pdata) firstSession = pairsForSession(reprise.day ?? next.day, pdata.ctx).exercises.some((e) => e.pairDeferred === 'etalonnage');
    } catch {
      /* sans reprise : la séance reste utilisable */
    }
    setData({
      program: res.program, next, fiches, repriseTexts: reprise.texts, repriseDay: reprise.day, repriseActive: reprise.active,
      gainOn: !!me.gagnerDuTemps, gainReason: gainDisabledReason(me), firstSession,
    });
    if (reprise.active) return setProposals(null); // V-PROG-E8 : reprise douce active, aucune proposition de montée
    try {
      const loaded = await loadGeneratorInput(asGenFiches(fiches));
      if (!loaded) return;
      const [sets, sessions, injuries, firstEvents] = await Promise.all([list('sets'), list('sessions'), list('injuries'), loadEvents()]);
      // Programme régénéré depuis l'acceptation : la décision est périmée, on le dit (une seule fois) au lieu de l'ignorer en silence.
      const stale = staleArrivals(res.program, asGenFiches(fiches), sets, firstEvents);
      if (stale.length) {
        await cancelArrivals(stale);
        setCancelled(true);
      }
      const events = stale.length ? await loadEvents() : firstEvents;
      setProposals(
        computeProposals({
          program: res.program, dayIndex: next.dayIndex, input: loaded.input, sets, sessions, events,
          zoneLevel2Plus: injuries.some((i) => i.active && !i.deletedAt && i.level >= 2), now: Date.now(),
        }),
      );
    } catch {
      setProposals(null); // pas de carte : la séance reste utilisable
    }
  };

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : FICHES_ERROR));
  }, [profile.id]);

  const answer = (item: ProposalItem, accepted: boolean) => {
    const p = item.proposal as MoveProposal;
    (accepted ? acceptEchelon(p) : refuseEchelon(p)).then(() => load()).catch(() => setError('Enregistrement impossible. Réessaie.'));
  };
  const answerLevelFn = (accepted: boolean) => {
    answerLevel(accepted).then(() => load()).catch(() => setError('Enregistrement impossible. Réessaie.'));
  };

  const [gainBusy, setGainBusy] = useState(false);
  const toggleGain = (on: boolean) => {
    // Réglage conservé dans le profil : le programme est régénéré avec l'option (empreinte des entrées).
    setGainBusy(true);
    update('profile', profile.id, { gagnerDuTemps: on })
      .then(() => load())
      .catch(() => setError('Enregistrement impossible. Réessaie.'))
      .finally(() => setGainBusy(false));
  };

  const [optBusy, setOptBusy] = useState(false);
  const toggleCardio = (on: boolean) => {
    // D31 : réglage conservé dans le profil ; le programme est régénéré (empreinte des entrées).
    setOptBusy(true);
    update('profile', profile.id, { seanceCardio: on })
      .then(() => load())
      .catch(() => setError('Enregistrement impossible. Réessaie.'))
      .finally(() => setOptBusy(false));
  };

  const begin = () => {
    if (!data) return;
    // L'appui est un geste de la personne : c'est là que le son et l'écran allumé peuvent être demandés.
    void unlockSound();
    void acquireWakeLock();
    onBegin(data.program, data.next.dayIndex, data.fiches).catch((e) => {
      setError(e instanceof SessionError ? e.message : 'Impossible de commencer la séance. Réessaie.');
    });
  };

  if (error && !data) return <div class="notice" role="alert">{error}</div>;
  if (empty) {
    return (
      <>
        <button type="button" class="btn back-btn" onClick={goHome}>← Accueil</button>
        <p>Aucune séance à montrer pour l’instant.</p>
      </>
    );
  }
  if (!data) return <p class="dim" role="status">Chargement…</p>;
  return (
    <PreviewView
      program={data.program} next={data.next} fiches={data.fiches} error={error} onBegin={begin} proposals={proposals} cancelled={cancelled}
      onAnswer={answer} onAnswerLevel={answerLevelFn} repriseTexts={data.repriseTexts} repriseDay={data.repriseDay}
      gain={{ on: data.gainOn, disabledReason: data.gainReason, onToggle: toggleGain, busy: gainBusy, firstSession: data.firstSession }}
      week={programWeek(data.program, Date.now())}
      cardioOpt={data.program.cardioOption ? { state: data.program.cardioOption, onToggle: toggleCardio, busy: optBusy } : undefined}
      onSkip={() => skipSession(data.program.id, data.next.dayIndex, 'renonce', null)}
      onUnwell={() => skipSession(data.program.id, data.next.dayIndex, 'pas_bien', null)}
    />
  );
}
