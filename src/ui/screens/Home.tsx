import { useEffect, useState } from 'preact/hooks';
import type { Profile } from '../../data/model';
import { isProfileComplete, type ProfileStep } from '../../data/profile-setup';
import { FICHES_ERROR, loadFiches } from '../../data/fiches';
import type { GenMessage } from '../../generator/types';
import { ensureActiveProgram, getNextSession, type NextSession } from '../../session/program';
import { closeStaleSession, findResumable, type Resumable } from '../../session/store';
import { NEUTRAL_CONTEXT } from '../../session/engine';
import { asGenFiches } from '../session/launch';
import { list } from '../../data/repo';
import { buildEntries, regularity, relativeDay, type Regularity } from '../../session/calendar';
import type { MissedCard } from '../../session/missed';
import { acknowledgeSecurity, answerLater, loadMissedContext, postponeTo, skipSession } from '../../session/missed-store';
import { missedCard as computeMissedCard, showT12 } from '../../session/missed';
import { MISSED_TEXT } from '../../session/missed-texts';
import { PAIN_S1_TEXT, R5_STOP_TEXT, U1_TEL, U1_TEXT } from '../../session/messages';
import { MissedCardView, type MissedActions } from '../MissedCard';

type Status =
  | { kind: 'loading' }
  | { kind: 'profil' }
  | { kind: 'erreur'; text: string }
  | { kind: 'refus'; code: string; messages: GenMessage[] }
  | {
      kind: 'seance';
      next: NextSession;
      resume: Resumable | null;
      equipmentChangedId?: string;
      /** Séance manquée (SM-2) : carte à la place du bandeau. */
      missed?: MissedCard | null;
      /** Programme de 2 jours (T-12). */
      twoDays?: boolean;
      /** K1(b) : message de sécurité R5/U1 + bouton T-22 tant qu'il n'est pas pressé. */
      security?: boolean;
      /** Message « consulte » S1 actif. */
      consulte?: boolean;
    }
  | { kind: 'reprise'; resume: Resumable };

const NOTICE_KEY = 'muscu.equipmentNoticeDismissed';
function noticeDismissed(programId: string): boolean {
  try {
    return localStorage.getItem(NOTICE_KEY) === programId;
  } catch {
    return false;
  }
}
function dismissNotice(programId: string): void {
  try {
    localStorage.setItem(NOTICE_KEY, programId);
  } catch {
    /* sans stockage : le message reviendra */
  }
}

/** Bouton de correction proposé quand le générateur répond « pas de programme ». */
export function refusalAction(code: string): { step: ProfileStep; label: string } {
  if (code === 'PRO') return { step: 'blessures', label: 'Modifier mes blessures' };
  if (code === 'IMPOS') return { step: 'materiel', label: 'Modifier mon matériel' };
  if (code === 'JOURS2') return { step: 'bloques', label: 'Modifier mes jours' };
  return { step: 'jours', label: 'Modifier mes jours' };
}

export interface HomeViewProps {
  profile: Profile;
  status: Status;
  onStart: () => void;
  onEditStep: (step: ProfileStep) => void;
  onResume: (sessionId: string) => void;
  onOpenSession: () => void;
  onCloseStale: (sessionId: string, how: 'terminer' | 'abandonner') => void;
  /** Régularité calculée sur l'historique local ; absente tant qu'elle n'est pas lue. */
  regularity?: Regularity | null;
  today?: Date;
  onOpenHistory?: () => void;
  /** Réponses à la carte « séance manquée ». */
  missedActions?: MissedActions;
  onAckSecurity?: () => Promise<void>;
  /** Après une réponse : recharger l'Accueil. */
  onChanged?: () => void;
}

function ResumeCard({ r, onResume, onCloseStale }: { r: Resumable; onResume: (id: string) => void; onCloseStale: (id: string, how: 'terminer' | 'abandonner') => void }) {
  const [ask, setAsk] = useState(r.proposal === 'terminer_ou_abandonner');
  return (
    <div class="card card-resume">
      <h2>Reprendre ta séance</h2>
      {r.proposal === 'terminer_ou_abandonner' ? (
        <p class="dim">Cette séance a été laissée il y a longtemps. Tu peux la terminer ou l’abandonner.</p>
      ) : (
        <p class="dim">Tu avais commencé une séance. Tes séries déjà faites sont gardées.</p>
      )}
      {!ask && (
        <>
          <button type="button" class="btn btn-primary" onClick={() => onResume(r.session.id)}>Reprendre</button>
          <button type="button" class="btn" onClick={() => setAsk(true)}>Terminer ou abandonner</button>
        </>
      )}
      {ask && (
        <>
          <button type="button" class="btn" onClick={() => onCloseStale(r.session.id, 'terminer')}>Terminer la séance</button>
          <button type="button" class="btn btn-danger" onClick={() => onCloseStale(r.session.id, 'abandonner')}>Abandonner la séance</button>
          {r.proposal === 'reprendre' && <button type="button" class="btn btn-primary" onClick={() => setAsk(false)}>Annuler</button>}
        </>
      )}
    </div>
  );
}

const seances = (n: number): string => `${n} ${n > 1 ? 'séances faites' : 'séance faite'}`;

/** Régularité : ton positif, aucune comparaison, aucun chiffre tant qu'il n'y a pas de séance. */
export function RegularityCard({ reg, today, onOpenHistory }: { reg: Regularity | null; today: Date; onOpenHistory?: () => void }) {
  return (
    <div class="card regularity">
      <h2>Régularité</h2>
      {!reg || !reg.hasAny ? (
        <p class="dim">Ta première séance lancera le suivi. Chaque séance compte, à ton rythme.</p>
      ) : (
        <>
          <p>
            <strong>Cette semaine :</strong>{' '}
            {reg.doneThisWeek === 0
              ? 'pas encore de séance, la semaine est devant toi.'
              : reg.plannedPerWeek
                ? `${seances(reg.doneThisWeek)} sur ${reg.plannedPerWeek} prévues${reg.doneThisWeek >= reg.plannedPerWeek ? ', bravo !' : '.'}`
                : `${seances(reg.doneThisWeek)}.`}
          </p>
          <p>
            {reg.streakWeeks > 0
              ? `${reg.streakWeeks} ${reg.streakWeeks > 1 ? 'semaines' : 'semaine'} de suite avec au moins une séance.`
              : 'Une nouvelle série de semaines commence quand tu veux.'}
          </p>
          {reg.lastKey && <p class="dim">Dernière séance : {relativeDay(reg.lastKey, today)}.</p>}
          {onOpenHistory && <button type="button" class="btn" onClick={onOpenHistory}>Voir mon historique</button>}
        </>
      )}
    </div>
  );
}

/** Contenu de l'accueil (sans accès à la base : testable). */
export function HomeView({ profile, status, onStart, onEditStep, onResume, onOpenSession, onCloseStale, regularity: reg, today, onOpenHistory, missedActions, onAckSecurity, onChanged }: HomeViewProps) {
  const hello = profile.displayName ? `Salut ${profile.displayName}` : 'Salut';
  const complete = isProfileComplete(profile);
  const [hidden, setHidden] = useState(false);
  const [confirm, setConfirm] = useState<string[] | null>(null);
  // Un seul message par écran, dans l'ordre de SM-3 : sécurité, « consulte », carte de séance manquée, équipement, bandeau.
  const seance = status.kind === 'seance' ? status : null;
  const security = !!seance?.security;
  const consulte = !security && !!seance?.consulte;
  const missed = !security && !consulte && !confirm && seance?.missed && missedActions ? seance.missed : null;
  const anyMessage = security || consulte || !!missed || !!confirm;
  return (
    <>
      <h1>{hello}</h1>
      {security && (
        <section class="notice notice-urgent" aria-label="Sécurité">
          <p><strong>{U1_TEXT}</strong></p>
          <a class="btn btn-danger" href={U1_TEL}>Appeler le 15</a>
          <p>{R5_STOP_TEXT}</p>
          <button type="button" class="btn" onClick={() => void onAckSecurity?.().then(() => onChanged?.())}>{MISSED_TEXT.T22}</button>
        </section>
      )}
      {consulte && <div class="notice" role="status"><p>{PAIN_S1_TEXT}</p></div>}
      {confirm && (
        <div class="notice" role="status">
          {confirm.map((t, i) => <p key={i}>{t}</p>)}
        </div>
      )}
      {missed && missedActions && (
        <MissedCardView
          card={missed}
          actions={missedActions}
          twoDays={!!seance?.twoDays}
          onDone={(texts) => {
            setConfirm(texts);
            onChanged?.();
          }}
        />
      )}
      {status.kind === 'seance' && !anyMessage && status.equipmentChangedId && !hidden && (
        <div class="notice" role="status">
          <p>Ton matériel a changé : ton programme a été mis à jour.</p>
          <button type="button" class="btn" onClick={() => { dismissNotice(status.equipmentChangedId!); setHidden(true); }}>OK</button>
        </div>
      )}
      {status.kind === 'reprise' && <ResumeCard r={status.resume} onResume={onResume} onCloseStale={onCloseStale} />}
      {status.kind !== 'reprise' && !security && !missed && (
        <div class="card">
          <h2>Séance du jour</h2>
          {status.kind === 'loading' && <p class="dim" role="status">Préparation de ta séance…</p>}
          {status.kind === 'profil' && <p class="dim">Réponds à quelques questions (moins d'une minute) pour préparer ton programme.</p>}
          {status.kind === 'erreur' && <p role="alert">{status.text}</p>}
          {status.kind === 'refus' && (
            <>
              {status.messages.map((m, i) => <p key={i}>{m.text}</p>)}
              <button type="button" class="btn btn-primary" onClick={() => onEditStep(refusalAction(status.code).step)}>{refusalAction(status.code).label}</button>
            </>
          )}
          {status.kind === 'seance' && (
            <>
              <p class="home-session-name">{status.next.day.label}</p>
              <p class="dim">
                {status.next.day.estimatedMin ? `Environ ${status.next.day.estimatedMin} min · ` : ''}{status.next.day.exercises.length} exercices
              </p>
              {status.next.tooSoon && !anyMessage && !(status.equipmentChangedId && !hidden) && (
                <div class="notice small" role="status">
                  <p>Ta dernière séance date de moins de 48 h. Tu peux attendre un peu pour laisser reposer tes muscles, mais c’est toi qui décides.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {status.kind === 'seance' && status.resume && <ResumeCard r={status.resume} onResume={onResume} onCloseStale={onCloseStale} />}
      <RegularityCard reg={reg ?? null} today={today ?? new Date()} onOpenHistory={onOpenHistory} />
      {complete && <button type="button" class="btn" onClick={onStart}>Modifier mon profil</button>}
      <div class="thumb-zone">
        {!complete && <button type="button" class="btn btn-primary" onClick={onStart}>Créer mon programme</button>}
        {complete && status.kind === 'seance' && !missed && (
          <button type="button" class={security ? 'btn' : 'btn btn-primary'} onClick={onOpenSession}>Voir la séance</button>
        )}
      </div>
    </>
  );
}

export function Home({ profile, onStart, onEditStep, onResume, onOpenSession, onOpenHistory }: {
  profile: Profile;
  onStart: () => void;
  onEditStep: (step: ProfileStep) => void;
  onResume: (sessionId: string) => void;
  onOpenSession: () => void;
  onOpenHistory?: () => void;
}) {
  const [reg, setReg] = useState<Regularity | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'loading' });
  const [programId, setProgramId] = useState<string | null>(null);
  const complete = isProfileComplete(profile);

  const load = async () => {
    if (!complete) return setStatus({ kind: 'profil' });
    try {
      const resume = await findResumable();
      const fiches = await loadFiches();
      const res = await ensureActiveProgram(asGenFiches(fiches));
      if (!res.ok) {
        if (res.code === 'PROFIL') return setStatus({ kind: 'profil' });
        if (resume) return setStatus({ kind: 'reprise', resume });
        return setStatus({ kind: 'refus', code: res.code, messages: res.messages });
      }
      if (resume) return setStatus({ kind: 'reprise', resume });
      const next = await getNextSession(Date.now());
      const equipmentChangedId = res.program.equipmentChanged && !noticeDismissed(res.program.id) ? res.program.id : undefined;
      if (!next) return setStatus({ kind: 'erreur', text: 'Aucune séance disponible pour l’instant.' });
      // Séance manquée, sécurité, « consulte » : une lecture locale ; en cas d'erreur, l'Accueil reste utilisable sans carte.
      const mc = await loadMissedContext(res.program).catch(() => null);
      setProgramId(res.program.id);
      setStatus({
        kind: 'seance', next, resume: null, equipmentChangedId,
        missed: mc ? computeMissedCard(mc) : null,
        twoDays: showT12(res.program),
        security: !!mc?.profile.reprise?.securiteALire,
        consulte: !!mc?.consulteActive,
      });
    } catch (e) {
      setStatus({ kind: 'erreur', text: e instanceof Error && e.message ? e.message : FICHES_ERROR });
    }
  };

  const loadRegularity = async () => {
    try {
      const [sessions, sets] = await Promise.all([list('sessions'), list('sets')]);
      setReg(regularity(buildEntries(sessions, sets), new Date(), profile.daysPerWeek));
    } catch {
      setReg(null);
    }
  };

  useEffect(() => {
    void loadRegularity();
  }, [profile.id, profile.daysPerWeek]);

  useEffect(() => {
    void load();
  }, [profile.id, complete, profile.updatedAt]);

  const closeStale = async (id: string, how: 'terminer' | 'abandonner') => {
    try {
      await closeStaleSession(id, how, NEUTRAL_CONTEXT);
    } catch {
      /* déjà close : on recharge */
    }
    await load();
  };

  const card = status.kind === 'seance' ? status.missed : null;
  const missedActions: MissedActions | undefined =
    card && programId
      ? {
          postpone: (j) => postponeTo(programId, card.dayIndex, card.day, j),
          later: () => answerLater(programId, card.day),
          skip: () => skipSession(programId, card.dayIndex, 'renonce', card.day),
          unwell: () => skipSession(programId, card.dayIndex, 'pas_bien', card.day),
        }
      : undefined;

  return (
    <HomeView
      profile={profile}
      status={status}
      onStart={onStart}
      onEditStep={onEditStep}
      onResume={onResume}
      onOpenSession={onOpenSession}
      onCloseStale={async (id, how) => {
        await closeStale(id, how);
        await loadRegularity();
      }}
      regularity={reg}
      onOpenHistory={onOpenHistory}
      missedActions={missedActions}
      onAckSecurity={acknowledgeSecurity}
      onChanged={() => {
        void load();
        void loadRegularity();
      }}
    />
  );
}
