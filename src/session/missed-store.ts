// Séance manquée : lecture du contexte et enregistrement des choix (IndexedDB, local). La logique est dans missed.ts (pure).
import { create, list, update } from '../data/repo';
import type { Profile, Program, RepriseState } from '../data/model';
import { painCheck } from './history';
import { dateKey } from './calendar';
import { missedCard, onPasBien, onSecurityAck, postponeRows, skipRow, withAnswer, type MissedCard, type MissedContext } from './missed';
import { repriseOf } from './missed-config';

export async function loadMissedContext(program: Program, now: Date = new Date()): Promise<MissedContext | null> {
  const [profiles, programs, sessions, sets, injuries] = await Promise.all([list('profile'), list('programs'), list('sessions'), list('sets'), list('injuries')]);
  const profile = profiles[0];
  if (!profile) return null;
  return {
    program,
    programs,
    sessions,
    sets,
    profile: { blockedWeekdays: profile.blockedWeekdays, daysPerWeek: profile.daysPerWeek, pregnancy: profile.pregnancy ?? null, reprise: repriseOf(profile) },
    injuries,
    consulteActive: !!painCheck(sets, sessions, injuries).s1Text,
    now,
  };
}

/** Carte « séance manquée » de l'Accueil, ou null. */
export async function getMissedCard(program: Program, now: Date = new Date()): Promise<MissedCard | null> {
  const c = await loadMissedContext(program, now);
  return c ? missedCard(c) : null;
}

const fresh = async (programId: string): Promise<Program> => {
  const p = (await list('programs')).find((x) => x.id === programId);
  if (!p) throw new Error('Programme introuvable.');
  return p;
};

/** « La faire quand je peux » : seule la réponse est écrite (SM-17). */
export async function answerLater(programId: string, d: string, now: Date = new Date()): Promise<void> {
  const p = await fresh(programId);
  await update('programs', p.id, { missedAnswers: withAnswer(p, d, 'quand_je_peux', now.toISOString()) });
}

/** « Décaler » de D vers J : lignes O et N (SM-D2) + réponse. */
export async function postponeTo(programId: string, i: number, d: string, j: string, now: Date = new Date()): Promise<void> {
  const p = await fresh(programId);
  const [o, n] = postponeRows(p, i, d, j, now.toISOString());
  await create('sessions', o);
  await create('sessions', n);
  await update('programs', p.id, { missedAnswers: withAnswer(p, d, 'decaler', now.toISOString()) });
}

/**
 * « Sauter cette séance » (`renonce`) ou « Je ne me sens pas bien » (`pas_bien`). Depuis la carte : `plannedDate` = D et réponse
 * mémorisée ; depuis l'aperçu : `plannedDate` = aujourd'hui (SM-6). « Pas bien » écrit le plancher de reprise aussitôt (R-FIN d).
 */
export async function skipSession(programId: string, i: number, reason: 'renonce' | 'pas_bien', missedDay: string | null, now: Date = new Date()): Promise<void> {
  const p = await fresh(programId);
  await create('sessions', skipRow(p, i, missedDay ?? dateKey(now), reason, now.toISOString()));
  if (missedDay) await update('programs', p.id, { missedAnswers: withAnswer(p, missedDay, 'sauter', now.toISOString()) });
  if (reason === 'pas_bien') await saveReprise(onPasBien);
}

/** Bouton T-22 (K1(b)). */
export async function acknowledgeSecurity(): Promise<void> {
  await saveReprise(onSecurityAck);
}

/** Lit, transforme et enregistre l'état de reprise du profil (donnée locale, jamais partagée). */
export async function saveReprise(fn: (s: RepriseState) => RepriseState): Promise<Profile | null> {
  const [profile] = await list('profile');
  if (!profile) return null;
  return update('profile', profile.id, { reprise: fn(repriseOf(profile)) });
}
