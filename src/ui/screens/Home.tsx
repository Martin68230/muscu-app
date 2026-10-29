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

type Status =
  | { kind: 'loading' }
  | { kind: 'profil' }
  | { kind: 'erreur'; text: string }
  | { kind: 'refus'; code: string; messages: GenMessage[] }
  | { kind: 'seance'; next: NextSession; resume: Resumable | null; equipmentChangedId?: string }
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
export function HomeView({ profile, status, onStart, onEditStep, onResume, onOpenSession, onCloseStale, regularity: reg, today, onOpenHistory }: HomeViewProps) {
  const hello = profile.displayName ? `Salut ${profile.displayName}` : 'Salut';
  const complete = isProfileComplete(profile);
  const [hidden, setHidden] = useState(false);
  return (
    <>
      <h1>{hello}</h1>
      {status.kind === 'seance' && status.equipmentChangedId && !hidden && (
        <div class="notice" role="status">
          <p>Ton matériel a changé : ton programme a été mis à jour.</p>
          <button type="button" class="btn" onClick={() => { dismissNotice(status.equipmentChangedId!); setHidden(true); }}>OK</button>
        </div>
      )}
      {status.kind === 'reprise' && <ResumeCard r={status.resume} onResume={onResume} onCloseStale={onCloseStale} />}
      {status.kind !== 'reprise' && (
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
              {status.next.tooSoon && !(status.equipmentChangedId && !hidden) && (
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
        {complete && status.kind === 'seance' && <button type="button" class="btn btn-primary" onClick={onOpenSession}>Voir la séance</button>}
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
      setStatus(next ? { kind: 'seance', next, resume: null, equipmentChangedId } : { kind: 'erreur', text: 'Aucune séance disponible pour l’instant.' });
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
    />
  );
}
