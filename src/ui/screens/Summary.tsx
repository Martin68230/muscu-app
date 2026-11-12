import { useEffect, useState } from 'preact/hooks';
import type { PregnancyStatus, WorkoutSession } from '../../data/model';
import { list, update, listTrusted } from '../../data/repo';
import { gentlerAlternative, painCheck, proposeProgression } from '../../session/history';
import { acceptAdapt, laterAdapt, loadEvents, type AdaptCard } from '../../session/progression-store';
import { ADAPT_TEXT, ECHELON_TEXT, G6_SIGNS, G6_STOP_TEXT, G6_TITLE, G6_URGENT_TEXT, R5_STOP_TEXT, U1_TEL, U1_TEXT } from '../../session/messages';
import { neckMustBeRemoved, removeNeckFromProfile } from '../../session/neck-stop';
import { symptomFrozen } from '../../session/progression';
import { repriseOf } from '../../session/missed-config';
import type { SessionController } from '../../session/store';
import { computeSummary, type Summary as SummaryData } from '../../session/summary';
import { summaryText, type SummaryText } from '../../session/summary-texts';
import { ReportButton } from '../ReportButton';
import { releaseWakeLock } from '../session/wakelock';
import type { PlayerData } from '../session/launch';
import { exName, variantOf } from '../session/text';
import { MuscleMapCard } from '../MuscleMapCard';
import { sessionMap, setsOfLogs, type ZoneMap } from '../../zones/map-data';
import { mainGoalKey } from '../../zones/main-goal';

export interface SummaryScreenProps {
  ctl: SessionController;
  data: PlayerData;
  pregnancy: PregnancyStatus | null | undefined;
  onClose: () => void;
  onEditInjuries?: () => void;
}

/** Une ligne de « La prochaine fois » ; `card` : proposition qu'on peut accepter en un appui. */
interface NextItem { text: string; card?: AdaptCard }

interface Loaded {
  summary: SummaryData;
  text: SummaryText;
  next: NextItem[];
  pain: { text: string | null; s1: string | null };
  /** Carte des muscles des séries faites (aucune après un abandon ou un symptôme). */
  muscles?: ZoneMap | null;
}

/** Bilan de séance (F6) : sobre, 3 à 4 chiffres, un texte de fin, des propositions pour la prochaine fois. Rien n'est partagé. */
export function SummaryScreen({ ctl, data, pregnancy, onClose, onEditInjuries }: SummaryScreenProps) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [answers, setAnswers] = useState<Record<string, 'ok' | 'later'>>({});
  const [adaptError, setAdaptError] = useState(false);
  const pregnant = pregnancy === 'enceinte' || pregnancy === 'post_partum';
  const outcome = ctl.state.outcome;
  const day = ctl.day;

  useEffect(() => {
    void releaseWakeLock();
    (async () => {
      const names = {
        fiche: (id: string) => data.fiches.find((f) => f.id === id)?.nom ?? 'Exercice',
        variant: (id: string) => data.fiches.flatMap((f) => f.variantes).find((v) => v.id === id)?.nom ?? 'Exercice',
      };
      try {
        const [sets, sessions, injuries] = await Promise.all([listTrusted('sets'), listTrusted('sessions'), list('injuries')]);
        const row: WorkoutSession | undefined = sessions.find((s) => s.id === ctl.sessionId);
        if (!row) throw new Error('séance introuvable');
        // Cou placé automatiquement : malaise ou douleur sur cet exercice, le cou est retiré des séances suivantes.
        if (neckMustBeRemoved({ endReason: row.endReason, painExercises: row.painExercises, exercises: day.exercises })) await removeNeckFromProfile();
        const summary = computeSummary({ session: row, sets, sessions, pregnancy });
        const text = summaryText(summary, {
          names,
          pregnancy,
          hasGentler: (m) => !!data.input && !!gentlerAlternative(m, data.input),
        });
        // Abandon et symptôme : aucun bilan stocké (§3.4). Sinon le bilan est gardé sur la séance (recalculable).
        if (summary.status !== 'abandon' && summary.status !== 'symptome') await update('sessions', row.id, { summary: summary as unknown as Record<string, unknown> });

        const next: NextItem[] = [];
        const adaptEvents = await loadEvents();
        let deloadShown = false;
        // D28 : une séance créée à la demande ne propose aucune progression et ne sert pas de base à celles du programme.
        if (outcome === 'terminee' && !pregnant && !ctl.created) {
          const frozen = symptomFrozen(sessions);
          // R-FIN vient d'être appliquée : la reprise peut s'être terminée à cette séance (progression normale ensuite).
          const repriseActive = repriseOf((await list('profile'))[0]).actif;
          day.exercises.forEach((exo, i) => {
            if (ctl.state.skipped.includes(i) && !ctl.state.painExercises.includes(i)) return;
            const variant = variantOf(data.fiches, exo);
            const bodyweight = data.bodyweightOf(exo);
            const p = proposeProgression({
              exercise: exo, sets, sessions, pregnant: data.pregnant, variantTags: variant?.tags, equipment: data.equipment ?? undefined,
              echelon: variant?.echelon, bodyweight, frozenBySymptom: frozen, repriseActive,
              ...(data.adaptOf?.(exo, true) ?? {}),
              adaptEvents,
            });
            if (p.echelonProposal) {
              if (p.echelonProposal.kind === 'montee') next.push({ text: ECHELON_TEXT.nextTime(exName(data.fiches, exo)) });
              return;
            }
            // Acceptation en un appui : série en plus, version plus dure, repos, décharge (une seule décharge proposée par bilan).
            const base = { movementId: exo.movementId };
            const card: AdaptCard | null = p.exerciseProposal ? { ...base, kind: 'exercice' }
              : p.repsProposal ? { ...base, kind: 'repetitions', repsMin: p.repsProposal.repsMin, repsMax: p.repsProposal.repsMax }
              : p.setsProposal ? { ...base, kind: 'serie', sets: p.setsProposal }
              : p.harderVariant ? { ...base, kind: 'variante', variantId: p.harderVariant.variantId }
              : p.restProposal ? { ...base, kind: 'repos', restSec: p.restProposal }
              : p.deloadProposal && !deloadShown ? { ...base, kind: 'decharge' } : null;
            if (card) {
              if (card.kind === 'decharge') deloadShown = true;
              next.push({ text: `${exName(data.fiches, exo)} : ${p.text}`, card });
              return;
            }
            if (p.deloadProposal) return;
            if (p.action === 'hausse' || p.action === 'baisse' || p.reason === 'douleur') next.push({ text: `${exName(data.fiches, exo)} : ${p.text}` });
          });
        }
        const check = painCheck(sets, sessions, injuries);
        const done = summary.status !== 'abandon' && summary.status !== 'symptome' ? setsOfLogs(sets, row.id) : [];
        const muscles = done.length ? sessionMap(done, data.fiches, await mainGoalKey()) : null;
        setLoaded({ summary, text, next, pain: { text: check.proposals[0]?.text ?? null, s1: check.s1Text }, muscles });
      } catch {
        // Le bilan reste lisible même si le calcul échoue : durée et séries de la séance.
        const minutes = Math.max(1, Math.round(((ctl.state.endedAt ?? ctl.state.startedAt) - ctl.state.startedAt) / 60000));
        const summary = { status: outcome === 'terminee' ? 'complete' : outcome === 'symptome' ? 'symptome' : 'abandon' } as SummaryData;
        const text: SummaryText = {
          title: outcome === 'terminee' ? 'Séance terminée' : 'Séance arrêtée',
          paragraphs: [], comparison: [], records: [], details: [],
          stats: outcome === 'terminee' ? [{ label: 'Durée', value: `${minutes} min` }, { label: 'Séries faites', value: String(ctl.state.workSetsDone) }] : [],
          safetyFirst: outcome === 'symptome',
        };
        setLoaded({ summary, text, next: [], pain: { text: null, s1: null } });
      }
    })();
  }, []);

  const answer = (card: AdaptCard, ok: boolean) => {
    (ok ? acceptAdapt(card) : laterAdapt(card))
      .then(() => setAnswers((a) => ({ ...a, [card.movementId]: ok ? 'ok' : 'later' })))
      .catch(() => setAdaptError(true));
  };
  const symptom = outcome === 'symptome';
  const t = loaded?.text;
  return (
    <div class="player summary">
      <header class="player-head">
        <span class="player-quit-spacer" aria-hidden="true" />
        <div class="player-count">Bilan</div>
        <ReportButton ficheId={day.exercises[0]?.movementId ?? ''} variantId={null} />
      </header>
      <div class="player-scroll">
        {symptom && (
          <section class="notice notice-urgent" aria-label="Urgence">
            <p><strong>{U1_TEXT}</strong></p>
            <a class="btn btn-danger" href={U1_TEL}>Appeler le 15</a>
            <p>{R5_STOP_TEXT}</p>
          </section>
        )}
        {symptom && pregnant && (
          <section class="card" aria-label={G6_TITLE}>
            <h2>{G6_TITLE}</h2>
            <p>{G6_STOP_TEXT}</p>
            <ul class="fiche-liste">{G6_SIGNS.map((x) => <li key={x}>{x}</li>)}</ul>
            <p><strong>{G6_URGENT_TEXT}</strong></p>
          </section>
        )}
        {!loaded && <p class="dim" role="status">Calcul du bilan…</p>}
        {t && (
          <>
            <h1>{t.title}</h1>
            {t.paragraphs.map((p, i) => <p key={i} class={i === 0 ? '' : 'dim'}>{p}</p>)}
            {t.stats.length > 0 && (
              <section class="card end-stats" aria-label="Chiffres de la séance">
                {t.stats.map((s) => (
                  <p key={s.label}><span class="dim small">{s.label}</span><br /><strong>{s.value}</strong></p>
                ))}
              </section>
            )}
            {t.comparison.length > 0 && (
              <section class="card" aria-label="Par rapport à la dernière fois">
                {t.comparison.map((c, i) => <p key={i}>{c}</p>)}
              </section>
            )}
            {t.records.length > 0 && (
              <section class="card" aria-label="Records">
                {t.records.map((r, i) => <p key={i}><strong>{r}</strong></p>)}
              </section>
            )}
            {t.details.length > 0 && <p class="dim small">{t.details.join(' ')}</p>}
            {loaded.muscles && <MuscleMapCard id="bilan-carte" title="Muscles travaillés aujourd’hui" statuses={loaded.muscles.statuses} points={loaded.muscles.points} period="dans cette séance" />}
            {loaded.next.length > 0 && (
              <section class="card" aria-label="La prochaine fois">
                <h2>La prochaine fois</h2>
                <ul class="adapt-list">
                  {loaded.next.map((l, i) => {
                    const done = l.card ? answers[l.card.movementId] : undefined;
                    return (
                      <li key={i}>
                        <p>{l.text}</p>
                        {l.card && !done && (
                          <div class="adapt-actions">
                            <button type="button" class="btn btn-primary" onClick={() => answer(l.card!, true)}>{ADAPT_TEXT.accept}</button>
                            <button type="button" class="btn" onClick={() => answer(l.card!, false)}>{ADAPT_TEXT.later}</button>
                          </div>
                        )}
                        {done && <p class="dim" role="status">{done === 'ok' ? ADAPT_TEXT.accepted : ADAPT_TEXT.laterDone}</p>}
                      </li>
                    );
                  })}
                </ul>
                {adaptError && <p class="dim" role="alert">Enregistrement impossible. Réessaie.</p>}
              </section>
            )}
            {loaded.pain.text && <div class="notice"><p>{loaded.pain.text}</p></div>}
            {loaded.pain.s1 && <div class="notice"><p>{loaded.pain.s1}</p></div>}
            {loaded.pain.text && onEditInjuries && <button type="button" class="btn" onClick={onEditInjuries}>Mettre à jour mes blessures</button>}
          </>
        )}
      </div>
      <div class="player-foot">
        <button type="button" class="btn btn-primary btn-big" onClick={onClose}>Retour à l’accueil</button>
      </div>
    </div>
  );
}
