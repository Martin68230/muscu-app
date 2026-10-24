import { useEffect, useState } from 'preact/hooks';
import type { PregnancyStatus, WorkoutSession } from '../../data/model';
import { list, update } from '../../data/repo';
import { gentlerAlternative, painCheck, proposeProgression } from '../../session/history';
import { ECHELON_TEXT, G6_SIGNS, G6_STOP_TEXT, G6_TITLE, G6_URGENT_TEXT, R5_STOP_TEXT, U1_TEL, U1_TEXT } from '../../session/messages';
import { symptomFrozen } from '../../session/progression';
import type { SessionController } from '../../session/store';
import { computeSummary, type Summary as SummaryData } from '../../session/summary';
import { summaryText, type SummaryText } from '../../session/summary-texts';
import { ReportButton } from '../ReportButton';
import { releaseWakeLock } from '../session/wakelock';
import type { PlayerData } from '../session/launch';
import { exName, variantOf } from '../session/text';

export interface SummaryScreenProps {
  ctl: SessionController;
  data: PlayerData;
  pregnancy: PregnancyStatus | null | undefined;
  onClose: () => void;
  onEditInjuries?: () => void;
}

interface Loaded {
  summary: SummaryData;
  text: SummaryText;
  next: string[];
  pain: { text: string | null; s1: string | null };
}

/** Bilan de séance (F6) : sobre, 3 à 4 chiffres, un texte de fin, des propositions pour la prochaine fois. Rien n'est partagé. */
export function SummaryScreen({ ctl, data, pregnancy, onClose, onEditInjuries }: SummaryScreenProps) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
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
        const [sets, sessions, injuries] = await Promise.all([list('sets'), list('sessions'), list('injuries')]);
        const row: WorkoutSession | undefined = sessions.find((s) => s.id === ctl.sessionId);
        if (!row) throw new Error('séance introuvable');
        const summary = computeSummary({ session: row, sets, sessions, pregnancy });
        const text = summaryText(summary, {
          names,
          pregnancy,
          hasGentler: (m) => !!data.input && !!gentlerAlternative(m, data.input),
        });
        // Abandon et symptôme : aucun bilan stocké (§3.4). Sinon le bilan est gardé sur la séance (recalculable).
        if (summary.status !== 'abandon' && summary.status !== 'symptome') await update('sessions', row.id, { summary: summary as unknown as Record<string, unknown> });

        const next: string[] = [];
        if (outcome === 'terminee' && !pregnant) {
          const frozen = symptomFrozen(sessions);
          day.exercises.forEach((exo, i) => {
            if (ctl.state.skipped.includes(i) && !ctl.state.painExercises.includes(i)) return;
            const variant = variantOf(data.fiches, exo);
            const bodyweight = data.bodyweightOf(exo);
            const p = proposeProgression({
              exercise: exo, sets, sessions, pregnant: data.pregnant, variantTags: variant?.tags, equipment: data.equipment ?? undefined,
              echelon: variant?.echelon, bodyweight, frozenBySymptom: frozen,
            });
            if (p.echelonProposal) {
              if (p.echelonProposal.kind === 'montee') next.push(ECHELON_TEXT.nextTime(exName(data.fiches, exo)));
              return;
            }
            if (p.action === 'hausse' || p.action === 'baisse' || p.reason === 'douleur') next.push(`${exName(data.fiches, exo)} : ${p.text}`);
          });
        }
        const check = painCheck(sets, sessions, injuries);
        setLoaded({ summary, text, next, pain: { text: check.proposals[0]?.text ?? null, s1: check.s1Text } });
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
            {loaded.next.length > 0 && (
              <section class="card" aria-label="La prochaine fois">
                <h2>La prochaine fois</h2>
                <ul class="fiche-liste">{loaded.next.map((l, i) => <li key={i}>{l}</li>)}</ul>
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
