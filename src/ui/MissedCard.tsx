// Carte « séance manquée » de l'Accueil (knowledge/seance-manquee-v1.md SM-3, SM-4, §7). Aucun bouton de fermeture (SM-D3),
// gros boutons (44 px et plus), « Décaler » en premier et bouton principal quand il est possible ; confirmation avant « Sauter ».
import { useState } from 'preact/hooks';
import type { MissedCard } from '../session/missed';
import { MISSED_TEXT, dayButton, dayName } from '../session/missed-texts';

export interface MissedActions {
  postpone: (day: string) => Promise<void>;
  later: () => Promise<void>;
  skip: () => Promise<void>;
  unwell: () => Promise<void>;
}

type Step = 'carte' | 'jours' | 'sauter' | 'pas_bien';

/** Choix du jour de « Décaler » (T-6) : partagé par la carte de l'Accueil et l'aperçu de séance (décision du 12/11/2026). */
function DayChoices({ card, busy, error, onPick, onBack }: { card: MissedCard; busy: boolean; error: string | null; onPick: (day: string) => void; onBack: () => void }) {
  return (
    <section class="card missed-card" aria-label={MISSED_TEXT.T6_TITLE}>
      <h2>{MISSED_TEXT.T6_TITLE}</h2>
      <div class="missed-days">
        {card.jours.map((j) => (
          <button type="button" class="btn btn-primary" key={j} disabled={busy} onClick={() => onPick(j)}>
            {dayButton(j)}
          </button>
        ))}
      </div>
      <button type="button" class="btn" onClick={onBack}>{MISSED_TEXT.T6_BACK}</button>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}

export function MissedCardView({ card, actions, twoDays, onDone }: {
  card: MissedCard;
  actions: MissedActions;
  /** Programme de 2 jours : T-12 sous T-10 après « Sauter » (SM-11). */
  twoDays: boolean;
  /** Après une réponse : texte de confirmation à afficher (un seul message) puis rechargement de l'Accueil. */
  onDone: (texts: string[]) => void;
}) {
  const [step, setStep] = useState<Step>('carte');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<void>, texts: string[]) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      onDone(texts);
    } catch {
      setError('Enregistrement impossible. Réessaie.');
    } finally {
      setBusy(false);
    }
  };
  const canPostpone = card.jours.length > 0;

  if (step === 'jours') {
    return (
      <DayChoices card={card} busy={busy} error={error} onPick={(j) => run(() => actions.postpone(j), [MISSED_TEXT.t7(card.nom, dayName(j))])} onBack={() => setStep('carte')} />
    );
  }
  if (step === 'sauter') {
    return (
      <section class="card missed-card" role="alertdialog" aria-label={MISSED_TEXT.T5}>
        <p>{MISSED_TEXT.t9(card.nom)}</p>
        <button type="button" class="btn btn-primary" disabled={busy} onClick={() => run(actions.skip, twoDays ? [MISSED_TEXT.T10, MISSED_TEXT.T12] : [MISSED_TEXT.T10])}>{MISSED_TEXT.T9_YES}</button>
        <button type="button" class="btn" onClick={() => setStep('carte')}>{MISSED_TEXT.T9_NO}</button>
        {error && <p role="alert">{error}</p>}
      </section>
    );
  }
  if (step === 'pas_bien') {
    return (
      <section class="card missed-card" role="alertdialog" aria-label={MISSED_TEXT.T18_LINK}>
        <p>{MISSED_TEXT.T21}</p>
        <button type="button" class="btn btn-primary" disabled={busy} onClick={() => run(actions.unwell, [MISSED_TEXT.T18_AFTER])}>{MISSED_TEXT.T21_YES}</button>
        <button type="button" class="btn" onClick={() => setStep('carte')}>{MISSED_TEXT.T21_NO}</button>
        {error && <p role="alert">{error}</p>}
      </section>
    );
  }
  return (
    <section class="card missed-card" aria-label="Séance manquée">
      <h2>{MISSED_TEXT.t1(card.jour)}</h2>
      <p class="dim">{MISSED_TEXT.T2}</p>
      {canPostpone && <button type="button" class="btn btn-primary" onClick={() => setStep('jours')}>{MISSED_TEXT.T3}</button>}
      <button type="button" class={canPostpone ? 'btn' : 'btn btn-primary'} disabled={busy} onClick={() => run(actions.later, [MISSED_TEXT.T8])}>{MISSED_TEXT.T4}</button>
      <button type="button" class="btn" onClick={() => setStep('sauter')}>{MISSED_TEXT.T5}</button>
      {!canPostpone && <p class="dim small">{MISSED_TEXT.T11}</p>}
      <button type="button" class="btn btn-link" onClick={() => setStep('pas_bien')}>{MISSED_TEXT.T18_LINK}</button>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}

/** Liens de l'aperçu de séance (SM-6) : « Sauter cette séance » et « Je ne me sens pas bien », avec les mêmes confirmations. */
export function PreviewSkipLinks({ nom, twoDays, onSkip, onUnwell, onDone }: {
  nom: string;
  twoDays: boolean;
  onSkip: () => Promise<void>;
  onUnwell: () => Promise<void>;
  onDone: (texts: string[]) => void;
}) {
  const [step, setStep] = useState<'liens' | 'sauter' | 'pas_bien'>('liens');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<void>, texts: string[]) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      onDone(texts);
    } catch {
      setError('Enregistrement impossible. Réessaie.');
    } finally {
      setBusy(false);
    }
  };
  if (step === 'sauter') {
    return (
      <section class="card" role="alertdialog" aria-label={MISSED_TEXT.T5}>
        <p>{MISSED_TEXT.t9(nom)}</p>
        <button type="button" class="btn btn-primary" disabled={busy} onClick={() => run(onSkip, twoDays ? [MISSED_TEXT.T10, MISSED_TEXT.T12] : [MISSED_TEXT.T10])}>{MISSED_TEXT.T9_YES}</button>
        <button type="button" class="btn" onClick={() => setStep('liens')}>{MISSED_TEXT.T9_NO}</button>
        {error && <p role="alert">{error}</p>}
      </section>
    );
  }
  if (step === 'pas_bien') {
    return (
      <section class="card" role="alertdialog" aria-label={MISSED_TEXT.T18_LINK}>
        <p>{MISSED_TEXT.T21}</p>
        <button type="button" class="btn btn-primary" disabled={busy} onClick={() => run(onUnwell, [MISSED_TEXT.T18_AFTER])}>{MISSED_TEXT.T21_YES}</button>
        <button type="button" class="btn" onClick={() => setStep('liens')}>{MISSED_TEXT.T21_NO}</button>
        {error && <p role="alert">{error}</p>}
      </section>
    );
  }
  return (
    <div class="preview-links">
      <button type="button" class="btn btn-link" onClick={() => setStep('sauter')}>{MISSED_TEXT.T5}</button>
      <button type="button" class="btn btn-link" onClick={() => setStep('pas_bien')}>{MISSED_TEXT.T18_LINK}</button>
    </div>
  );
}

/**
 * Bouton « Décaler » de l'aperçu de séance (SM-6, décision de l'utilisateur 12/11/2026) : mêmes conditions que sur la carte
 * (la carte porte au moins un jour libre à 48 h réelles, SM-5), même choix de jour, même enregistrement. Rien sans jour possible.
 */
export function PreviewPostpone({ card, postpone, onDone }: { card: MissedCard; postpone: (day: string) => Promise<void>; onDone: (texts: string[]) => void }) {
  const [step, setStep] = useState<'bouton' | 'jours'>('bouton');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (card.jours.length === 0) return null;
  if (step === 'jours') {
    const pick = async (j: string) => {
      if (busy) return;
      setBusy(true);
      try {
        await postpone(j);
        onDone([MISSED_TEXT.t7(card.nom, dayName(j))]);
      } catch {
        setError('Enregistrement impossible. Réessaie.');
      } finally {
        setBusy(false);
      }
    };
    return <DayChoices card={card} busy={busy} error={error} onPick={pick} onBack={() => setStep('bouton')} />;
  }
  return <button type="button" class="btn" onClick={() => setStep('jours')}>{MISSED_TEXT.T3}</button>;
}
