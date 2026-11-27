import type { SetLog, WorkoutSession } from '../data/model';
import { PAIN_ALERT_TEXT, PAIN_FROZEN_TEXT, PAIN_NOT_MEDICAL_TEXT, painHistory, painRowText } from '../session/pain-history';

const short = (k: string) => new Date(`${k}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Évolution de la douleur sur un exercice : tendance, conseil prudent, liste des dernières séances (texte seul, sans graphique). */
export function PainHistoryCard({ movementId, name, sets, sessions, frozen = false }: {
  movementId: string;
  name: string;
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  /** Gel douleur de la zone actif (moteur, adaptation-regles.md §5). */
  frozen?: boolean;
}) {
  const h = painHistory(movementId, sets, sessions);
  if (!h.rows.length) return <p class="dim small">Aucune séance enregistrée avec cet exercice.</p>;
  return (
    <div class="pain-hist" aria-label={`Évolution de la douleur : ${name}`}>
      {h.trend && <p class="pain-trend"><strong>{h.trend}</strong>{frozen ? <span class="dim"> · {PAIN_FROZEN_TEXT}</span> : null}</p>}
      {!h.trend && frozen && <p class="pain-trend dim">{PAIN_FROZEN_TEXT}</p>}
      {h.consult && <div class="notice" role="status"><p>{h.consult}</p></div>}
      <ol class="pain-list">
        {h.rows.map((r) => (
          <li key={r.sessionId} class={r.pain ? 'pain-row pain-yes' : 'pain-row'}>
            <span class="pain-date">{short(r.dateKey)}</span> · {painRowText(r)}
          </li>
        ))}
      </ol>
      <p class="dim small">{PAIN_ALERT_TEXT}</p>
      <p class="dim small">{PAIN_NOT_MEDICAL_TEXT}</p>
    </div>
  );
}
