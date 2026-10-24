import { useEffect, useState } from 'preact/hooks';
import type { Program, Profile } from '../../data/model';
import { FICHES_ERROR, loadFiches, type Fiche } from '../../data/fiches';
import { list } from '../../data/repo';
import { ECHELON_TEXT } from '../../session/messages';
import { ensureActiveProgram, getNextSession, loadGeneratorInput, type NextSession } from '../../session/program';
import { acceptEchelon, answerLevel, cancelArrivals, computeProposals, loadEvents, refuseEchelon, staleArrivals, type MoveProposal, type ProposalItem, type ProposalSet } from '../../session/progression-store';
import { SessionError } from '../../session/engine';
import { asGenFiches } from '../session/launch';
import { exName, lineText, ficheOf, variantOf } from '../session/text';
import { unlockSound } from '../session/sound';
import { acquireWakeLock } from '../session/wakelock';

export function goHome(): void {
  location.hash = '#/accueil';
}

/** Messages du générateur : l'avis médecin / sage-femme (grossesse) passe en premier. */
export function orderedMessages(program: Program): string[] {
  const msgs = program.messages ?? [];
  const first = msgs.filter((m) => m.id === 'V-MSG-GROS-AVIS');
  return [...first, ...msgs.filter((m) => m.id !== 'V-MSG-GROS-AVIS')].map((m) => m.text);
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
export function PreviewView({ program, next, fiches, error, onBegin, proposals, cancelled, onAnswer, onAnswerLevel }: PreviewViewProps) {
  const day = next.day;
  const messages = orderedMessages(program);
  return (
    <>
      <button type="button" class="btn back-btn" onClick={goHome}>← Accueil</button>
      <h1>{day.label}</h1>
      <p class="dim">
        {day.estimatedMin ? `Environ ${day.estimatedMin} min` : 'Durée estimée : 45 min environ'} · {day.exercises.length} exercices
      </p>
      {next.tooSoon && (
        <div class="notice" role="status">
          <p>Ta dernière séance date de moins de 48 h. Tes muscles ont besoin de repos : tu peux attendre, mais c’est toi qui décides.</p>
        </div>
      )}
      {cancelled && <div class="notice small" role="status"><p>{ECHELON_TEXT.cancelled}</p></div>}
      {proposals && <ProposalCards proposals={proposals} onAnswer={onAnswer} onAnswerLevel={onAnswerLevel} />}
      {(program.explanation ?? []).length > 0 && (
        <section class="card" aria-label="Pourquoi ce programme">
          {(program.explanation ?? []).map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </section>
      )}
      {messages.length > 0 && (
        <section class="notice" aria-label="À savoir">
          {messages.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
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
                {partner && <div class="small prev-super">Superset avec {exName(fiches, partner)} : enchaîne sans repos long.</div>}
              </li>
            );
          })}
        </ol>
      </section>
      {error && <div class="toast" role="alert">{error}</div>}
      <div class="thumb-zone thumb-zone-alone">
        <button type="button" class="btn btn-primary" onClick={onBegin}>Commencer la séance</button>
      </div>
    </>
  );
}

type Loaded = { program: Program; next: NextSession; fiches: Fiche[] };

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
    const next = await getNextSession(Date.now());
    if (!next) return setEmpty(true);
    setData({ program: res.program, next, fiches });
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
  return <PreviewView program={data.program} next={data.next} fiches={data.fiches} error={error} onBegin={begin} proposals={proposals} cancelled={cancelled} onAnswer={answer} onAnswerLevel={answerLevelFn} />;
}
