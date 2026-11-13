// « Mon sport » : passerelle entre l'écran et le stockage local (profil.sportPlan et table sportSessions). Tout est local, rien n'est envoyé.
// Une séance de sport n'est JAMAIS une WorkoutSession : aucune série, aucune progression, aucune « dernière fois », aucun plafond de séries,
// aucune régularité de musculation (listTrusted ne la lit pas, elle n'est pas dans `sessions`).
import type { InjuryZone, PregnancyStatus, Profile, SportEffort, SportFeeling, SportKey, SportPlanEntry, SportSession, SportSign } from '../data/model';
import { INJURY_ZONES, SPORT_EFFORTS, SPORT_FEELINGS, SPORT_KEYS, SPORT_SIGNS } from '../data/model';
import { create, list, softDelete, update } from '../data/repo';
import { SPORT, SPORT_TEXT } from './sport-config';
import { addDaysMs, sportLoad, startOfDayMs, type SportLoad } from './sport-load';

/** Plan de sport nettoyé : 3 sports au plus, sans doublon, nom libre borné, nombres et jours dans leurs bornes. Jamais de champ inconnu. */
export function normalizePlan(plan: readonly Partial<SportPlanEntry>[]): SportPlanEntry[] {
  const out: SportPlanEntry[] = [];
  for (const e of plan) {
    if (!e || !SPORT_KEYS.includes(e.sport as SportKey)) continue;
    if (e.sport !== 'autre' && out.some((o) => o.sport === e.sport)) continue;
    if (out.length >= SPORT.maxSports) break;
    const row: SportPlanEntry = { sport: e.sport as SportKey };
    if (e.sport === 'autre') row.name = (e.name ?? '').trim().slice(0, SPORT.nameMax);
    if (typeof e.perWeek === 'number' && Number.isFinite(e.perWeek)) row.perWeek = Math.min(7, Math.max(0, Math.round(e.perWeek)));
    const days = [...new Set((e.weekdays ?? []).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort();
    if (days.length) row.weekdays = days;
    if (typeof e.matchWeekday === 'number' && Number.isInteger(e.matchWeekday) && e.matchWeekday >= 0 && e.matchWeekday <= 6) row.matchWeekday = e.matchWeekday;
    if (e.sport === 'foot' || e.sport === 'raquette' || e.sport === 'autre') if (e.jumps) row.jumps = true;
    if (e.sport === 'autre' && e.overhead) row.overhead = true;
    if (e.habitualEffort === 'tres_dur') row.habitualEffort = 'tres_dur';
    out.push(row);
  }
  return out;
}

export async function saveSportPlan(profile: Profile, plan: readonly Partial<SportPlanEntry>[]): Promise<Profile> {
  return update('profile', profile.id, { sportPlan: normalizePlan(plan) });
}

export interface SportDraft {
  sport: SportKey;
  name?: string;
  /** Jour local AAAA-MM-JJ ; jamais dans le futur. */
  day: string;
  durationMin: number;
  /** Choix obligatoire, jamais prérempli. */
  effort: SportEffort | null;
  match?: boolean;
  jumps?: boolean;
  overhead?: boolean;
  feelings: SportFeeling[];
  painZone?: InjuryZone | null;
  signs?: SportSign[];
  note?: string;
}

/** Message d'erreur en français, ou null si la saisie est valable. */
export function draftError(d: SportDraft): string | null {
  if (!SPORT_KEYS.includes(d.sport)) return 'Choisis un sport.';
  if (d.effort === null || !SPORT_EFFORTS.includes(d.effort)) return SPORT_TEXT.chooseEffort;
  if (!Number.isFinite(d.durationMin) || d.durationMin < SPORT.durationMin.min || d.durationMin > SPORT.durationMin.max) {
    return `La durée doit être comprise entre ${SPORT.durationMin.min} et ${SPORT.durationMin.max} minutes.`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.day)) return 'Choisis un jour.';
  return null;
}

/** Début de la séance : aujourd'hui, elle vient de finir ; un autre jour, l'heure est inconnue : fin de journée (lecture prudente). Jamais dans le futur. */
export function startedAtOf(d: Pick<SportDraft, 'day' | 'durationMin'>, now: Date): string {
  const [y, m, dd] = d.day.split('-').map(Number);
  const dayStart = new Date(y, m - 1, dd).getTime();
  const nowMs = now.getTime();
  const endMs = dayStart === startOfDayMs(nowMs) ? nowMs : Math.min(addDaysMs(dayStart, 1) - 1, nowMs);
  return new Date(Math.min(endMs - d.durationMin * 60_000, nowMs)).toISOString();
}

export function toRow(d: SportDraft, now: Date): Omit<SportSession, keyof import('../data/model').SyncFields> {
  const feelings = SPORT_FEELINGS.filter((f) => d.feelings.includes(f));
  const hasPain = feelings.includes('gene_douleur');
  const row: Omit<SportSession, keyof import('../data/model').SyncFields> = {
    sport: d.sport,
    startedAt: startedAtOf(d, now),
    durationMin: Math.round(d.durationMin),
    effort: d.effort as SportEffort,
    feelings,
  };
  if (d.sport === 'autre') row.name = (d.name ?? '').trim().slice(0, SPORT.nameMax);
  if (d.match) row.match = true;
  if (d.jumps) row.jumps = true;
  if (d.overhead) row.overhead = true;
  if (hasPain && d.painZone && INJURY_ZONES.includes(d.painZone)) row.painZone = d.painZone;
  if (hasPain && d.signs?.length) row.signs = SPORT_SIGNS.filter((s) => d.signs!.includes(s));
  const note = (d.note ?? '').trim().slice(0, SPORT.noteMax);
  if (note) row.note = note;
  return row;
}

export interface SavedSport {
  session: SportSession;
  /** Messages à afficher après l'enregistrement (grossesse, gêne, malaise, renvoi vers un professionnel). */
  messages: string[];
}

/** Messages après l'enregistrement d'une séance (fonction pure, testable). */
export function savedMessages(s: Pick<SportSession, 'feelings'>, pregnancy: PregnancyStatus | null | undefined, load: SportLoad | null): string[] {
  const out: string[] = [SPORT_TEXT.saved];
  if (pregnancy === 'enceinte' || pregnancy === 'post_partum') out.push(SPORT_TEXT.pregnancyRecorded, SPORT_TEXT.pregnancyStop);
  if (s.feelings.includes('malaise_vertige')) out.push(SPORT_TEXT.malaise);
  if (s.feelings.includes('gene_douleur')) out.push(SPORT_TEXT.pain);
  if (load?.consult) out.push(SPORT_TEXT.consult);
  return out;
}

export async function addSportSession(draft: SportDraft, profile: Pick<Profile, 'pregnancy' | 'sportPlan'>, now: Date = new Date()): Promise<SavedSport> {
  const err = draftError(draft);
  if (err) throw new Error(err);
  const session = await create('sportSessions', toRow(draft, now));
  const all = await list('sportSessions');
  return { session, messages: savedMessages(session, profile.pregnancy, sportLoad(all, profile.sportPlan, now)) };
}

export const listSportSessions = (): Promise<SportSession[]> => list('sportSessions');
export const removeSportSession = (id: string): Promise<void> => softDelete('sportSessions', id);
