// D28 « Créer une séance » à la demande (knowledge/creer-seance-v1.md, étape 1 : le composeur, pas l'écran).
// Fonction PURE : aucune horloge (la date vient de la demande), aucun accès réseau ni IndexedDB, aucune IA. Elle ne duplique pas la logique du
// générateur : elle appelle ses filtres (resolveFiche / allowedVariants / variantSafe : blessures, matériel, niveau, grossesse), sa dose
// (buildExercise), ses plafonds (plaf.ts : 11 / 12 par muscle, 20 par semaine), ses supersets D26 (formAllPairs), sa durée (estimerDuree),
// les verrous de 6ter (createSessionCheck), les contacts (JUMPS) et les blocs de sauts (plioBlockMin). Toutes les valeurs sont dans
// config.ts (CREER_SEANCE, avec leurs statuts) ; ce fichier ne contient aucune dose.
import type { InjuryZone, Level, SportKey, SportPlanEntry, SportSession } from '../data/model';
import { SPORT, SPORT_GATE_TEXT } from '../sport/sport-config';
import { sportGate, sportLoad, type SportGate } from '../sport/sport-load';
import { D30_TEXT } from '../session/messages';
import {
  CREER_SEANCE, IMPACT_EXCLUDED_ZONES, itemNom, JUMPS, type CreateBlock, type CreateEntry, type CreateIntensity, type CreateZone,
} from './config';
import { buildCtx, carriesLoad, isUnilateral, levelIdx, type Ctx } from './context';
import { buildExercise } from './dose';
import { estimerDuree, formAllPairs, type DurSession } from './duration';
import { createSessionCheck, plioBlockMin, variantSafe, type CreateState } from './impact';
import { frac, makePlaf, sessionCapsOk, sessionVol, weekMusclesOf, weekVol, weekCapFor } from './plaf';
import { allowedVariants, caseFor, resolveFiche, USABLE_STATUTS, warmupVariant, type Candidate } from './safety';
import { rankSlot, type SessionState } from './slots';
import { GROUP_OF, RACQUET_PREVENTION, SHOULDER_IDS, SHOULDER_PREVENTION, SPORT_LISTS, UPPER_PUSH_IDS, UPPER_PUSH_SCHEMAS, type SportEntry } from './sport-lists';
import type { Fiche, FicheVariant, GeneratorInput, GenExercise, JumpBlock, JumpItem, SlotKey, WarmupItem } from './types';
import { generalWarmup, mobilityWarmup } from './warmup';

const H_MS = 3600 * 1000;
const DAY_MS = 24 * H_MS;

// ----- Entrées -----
export interface CreateSessionRequest {
  zone: CreateZone;
  sport?: SportKey | null;
  /** §1 : objectif de la séance ; « détente » active les sauts (jambes ou corps entier). Absent : l'objectif du profil. */
  objective?: 'forme' | 'detente' | 'sport';
  /** §1 : case « avec des sauts » ; absent = pré-cochée pour volley et danse et pour l'objectif détente, décochée sinon (D31 n° 2). */
  jumps?: boolean;
  /** §1, §4 : « chaise stable, dos contre un mur ? » (absent = non : lecture prudente). */
  chairStable?: boolean;
  durationMin: number;
  intensity: CreateIntensity;
  /** Date et heure (ISO) de la demande ; une date seule est lue à minuit UTC. */
  todayIso: string;
}
/** Une séance déjà faite ou programmée (historique et jours du programme) : sert à l'espacement, aux contacts, à la douleur. */
export interface CreateHistoryItem {
  /** Fin de la séance (ISO). */
  endIso: string;
  /** Force de jambes (ou sauts puis force) : « jambes lourdes » (§3). */
  heavyLegs?: boolean;
  /** Séance avec sauts. */
  jumps?: boolean;
  /** Contacts au sol de cette séance (échauffement compris). */
  contacts?: number;
  /** Douleur déclarée pendant la séance. */
  pain?: boolean;
  /** Séance avec impact (sauts ou course). */
  impact?: boolean;
  /** Sport demandé pour cette séance créée (compte la prévention des raquettes : 2 fois par semaine au plus). */
  sport?: string | null;
}
export interface CreateContext {
  sessions?: readonly CreateHistoryItem[];
  /** Séries pondérées par muscle déjà faites cette semaine (séances du programme faites ; clés comme plaf.ts, « deltoides » = somme). */
  weekSets?: Readonly<Record<string, number>>;
  /** Séance de jambes lourdes prévue demain au programme. */
  heavyLegsTomorrow?: boolean;
  interruptedToday?: boolean;
  /** Pause de plus de 2 semaines : contacts au départ du niveau. */
  pauseOver2Weeks?: boolean;
  /** Un signe d'arrêt des sauts est apparu à la dernière séance de sauts : pas de sauts. */
  stopSignRecent?: boolean;
  /** SUP-10 : muscles principaux de la séance de la veille ; absent ou null = inconnu (aucune paire). */
  veilleMuscles?: readonly string[] | null;
  /**
   * « Mon sport » : séances de sport notées et sports déclarés. La charge est calculée à la date de la demande (sportLoad) : elle ne fait que
   * REFUSER, ALLÉGER ou DÉCALER (jambes, sauts, épaule, gêne), jamais relever une dose. Absent = aucun sport connu.
   */
  sport?: { sessions: readonly SportSession[]; plan: readonly SportPlanEntry[] };
}

// ----- Sortie -----
export interface CreateMessage {
  id: string;
  text: string;
}
export type CreatedExercise = GenExercise & {
  /** Bloc de la séance (§2) ; 'general' pour les emplacements du générateur (haut du corps, tronc, corps entier). */
  block: CreateBlock | 'general';
  tempo?: string;
};
export interface CreatedSession {
  zone: CreateZone;
  /** Intensité retenue (douce si la séance est adoucie). */
  intensity: CreateIntensity;
  softened: boolean;
  durationMin: number;
  /** Ordre fixé par le générateur (§2), jamais par la demande. */
  order: string[];
  warmup: { general: WarmupItem | null; generalSec: number; mobility: WarmupItem[]; minutes: number; bounces: number };
  /** Bloc de sauts (pliométrie en tête), ou null ; en version douce (débutant) : contacts 0. */
  jumps: JumpBlock | null;
  exercises: CreatedExercise[];
  cooldown: { items: WarmupItem[]; minutes: number };
  /** Contacts au sol (échauffement compris), 0 sans sauts. */
  contacts: number;
  /** Séries de la séance (force + séries de sauts). */
  totalSets: number;
  estimatedSec: number;
  /** Durée affichée, arrondie aux 5 min supérieures sans dépasser la durée choisie. */
  estimatedMin: number;
  /** Cette séance compte comme jambes lourdes pour l'espacement (à enregistrer par l'appelant). */
  heavyLegs: boolean;
  /** Séance avec impact (sauts réels). */
  impact: boolean;
  /** Ids des fiches de prévention du sport ajoutées à l'échauffement (vide hors sport). */
  prevention: string[];
  /** « Séance ponctuelle : elle s'ajoute à ton programme, elle ne le remplace pas. » */
  header: string;
  warnings: CreateMessage[];
}
export type CreateSessionResult =
  | { ok: true; session: CreatedSession; warnings: CreateMessage[] }
  | { ok: false; code: string; message: string; warnings: CreateMessage[]; suggestions: CreateZone[] };

// ----- Outils -----
const T = CREER_SEANCE.text;
/** Raison affichée d'un verrou des sauts venu du sport (« Pas de sauts aujourd'hui : … »). */
const SPORT_LOCK_TEXT: Record<NonNullable<SportGate['jumpLock']>, string> = {
  'sport-sauts-48h': SPORT_GATE_TEXT.jumpsSport48, 'sport-contacts': SPORT_GATE_TEXT.jumpsContacts, 'sport-jambes-24h': SPORT_GATE_TEXT.jumpsLight, 'sport-match': SPORT_GATE_TEXT.jumpsMatch,
};
const SENSITIVE_IDS: ReadonlySet<string> = new Set(Object.values(SPORT_LISTS).flatMap((l) => [...l.legs, ...l.upper]).filter((x) => x.shoulderSensitive).map((x) => x.id));
const LEG_SCHEMAS = ['squat', 'fente', 'charniere', 'cheville_mollet', 'hanche_laterale'];
const isLegFiche = (f: Pick<Fiche, 'schema'>): boolean => LEG_SCHEMAS.includes(f.schema);

interface Item {
  ex: CreatedExercise;
  /** Plus le nombre est grand, moins l'exercice est prioritaire (retiré en premier). */
  prio: number;
  /** Ordre d'affichage. */
  ord: number;
}
interface PlioItem {
  ficheId: string;
  variantId: string;
  softVariantId: string | null;
  reps: number;
  series: number;
}
interface Flags {
  intensity: CreateIntensity;
  chairStable: boolean;
  afterJumps: boolean;
  softened: boolean;
}

const refuse = (code: string, message: string, warnings: CreateMessage[] = [], suggestions: CreateZone[] = []): CreateSessionResult => ({
  ok: false, code, message, warnings, suggestions,
});

/** Nombre d'exercices de force selon la durée (CAL-1, plus grand seuil <= durée), le bloc de sauts comptant pour 1 de moins. */
function strengthCount(dMin: number, jumps: boolean): number {
  let n = CREER_SEANCE.strengthCount[0][1];
  for (const [min, count] of CREER_SEANCE.strengthCount) if (dMin >= min) n = count;
  n = Math.min(n, CREER_SEANCE.maxStrength);
  return Math.max(1, n - (jumps ? CREER_SEANCE.jumpsCountForOne : 0));
}

/** Élément d'échauffement ou de retour au calme : variante d'échelon 1 qui passe les lignes de zone et de grossesse. */
function wItem(ficheId: string, ctx: Ctx, sec: number, prefer?: string): WarmupItem | null {
  const f = ctx.fichesById.get(ficheId);
  if (!f) return null;
  const r = warmupVariant(f, ctx, prefer);
  if (!r) return null;
  return { ficheId: f.id, variantId: r.variant.id, nom: itemNom(f.nom, r.variant), sec, adaptations: r.adaptations };
}

/** Candidat d'une liste fermée : fiche admissible et sûre (cases de zone et de grossesse), variante imposée par la liste, jamais un remplaçant. */
function candidateFor(entry: CreateEntry, ctx: Ctx, fl: Flags): Candidate | null {
  if (levelIdx(entry.minLevel) > ctx.levelI) return null;
  if (entry.needsStableChair && !fl.chairStable) return null;
  if (entry.notIn?.includes(fl.intensity)) return null;
  if (entry.blockZones) {
    const gene = ctx.zones.some((z) => !z.isG && z.level >= 1 && entry.blockZones!.includes(z.key));
    if (gene || [...ctx.recentPainZones].some((z) => entry.blockZones!.includes(z))) return null;
  }
  if (fl.softened && entry.slow3s) return null;
  const f = ctx.fichesById.get(entry.id);
  if (!f) return null;
  const base = resolveFiche(f, ctx).candidates[0];
  if (!base || base.fiche.id !== f.id || base.replaces) return null;
  for (const vid of entry.variants) {
    const v = f.variantes.find((x) => x.id === vid);
    if (!v || !allowedVariants(f, ctx, { only: new Set([vid]) }).length) continue;
    if (!variantRuleOk(f, v, ctx, fl)) continue;
    return { ...base, variant: v, adaptations: base.adaptations.filter((a) => !a.startsWith('variante:')) };
  }
  return null;
}

/** Cases de zone et règles de niveau / unilatéral pour une variante précise d'une fiche de jambes. */
function variantRuleOk(f: Fiche, v: FicheVariant, ctx: Ctx, fl: Flags): boolean {
  // Chaise non calée (ou question sans réponse) : aucune variante sur chaise, quelle que soit la zone (relecteur D28, point 3).
  if (!fl.chairStable && v.tags.includes('chaise')) return false;
  for (const e of ctx.zones) {
    const c = caseFor(f, e);
    if (c.action === 'retirer') return false;
    if (c.action === 'adapter' && c.variante && c.variante !== v.id && f.variantes.some((x) => x.id === c.variante)) return false;
    if (c.action === 'adapter' && c.sansCharge && carriesLoad(v)) return false;
  }
  if (!isLegFiche(f)) return true;
  const uni = isUnilateral(v);
  if (uni && ctx.level === 'debutant') return false; // §3 : débutant, ni unilatéral
  if (uni && fl.softened) return false; // §3 : séance adoucie, sans unilatéral
  if (uni && fl.afterJumps && fl.intensity === 'soutenue') return false; // §3 : unilatéral après des sauts, jamais en soutenue
  return true;
}

/** Dose de « Créer » appliquée à l'exercice construit par buildExercise : ne fait que respecter §3 (séries, réserve, répétitions, repos). */
function applyDose(ex0: GenExercise, ctx: Ctx, fl: Flags, opts: { entry?: CreateEntry; slow?: boolean }): GenExercise {
  const C = CREER_SEANCE;
  const ex = { ...ex0 };
  const leg = ['squat', 'fente', 'charniere', 'cheville_mollet'].includes(ex.schema);
  // Séries : intensité, puis plafonds propres (adouci, unilatéral après des sauts, entrée), puis ceux de la fiche / grossesse (buildExercise).
  let target: number = fl.softened ? C.softenedSets : fl.intensity === 'douce' ? C.sets.douce : fl.intensity === 'soutenue' ? C.sets.soutenue : ctx.level === 'debutant' ? C.sets.moderateBeginner : C.sets.moderee;
  if (ctx.level === 'debutant') target = Math.min(target, C.sets.moderateBeginner);
  if (ex.unilateral && fl.afterJumps) target = Math.min(target, C.afterJumpsUnilateralMaxSets);
  if (opts.entry?.maxSets !== undefined) target = Math.min(target, opts.entry.maxSets);
  if (ex.setsCap !== undefined) target = Math.min(target, ex.setsCap);
  if (ctx.pregnant || !ex.rirAsked) target = Math.min(target, ex.sets);
  ex.sets = Math.max(1, target);
  // Réserve : +1 en douce, -1 en soutenue, jamais sous 2, jamais baissée si l'exercice est plafonné ; 3 au moins (unilatéral, jambes après des sauts).
  if (ex.rirAsked) {
    let rir = ex.rirTarget + C.rirDelta[fl.intensity];
    if (ex.capped) rir = Math.max(rir, ex.rirTarget);
    rir = Math.max(rir, C.rirFloor);
    if (ex.unilateral || (fl.afterJumps && leg)) rir = Math.max(rir, C.rirUnilateralOrAfterJumps);
    ex.rirTarget = rir;
  }
  // Répétitions : force lente 8 à 12 (sauf répétitions imposées par l'entrée), plafond 15.
  if (ex.unit === 'reps' || ex.unit === 'reps_par_cote') {
    if (opts.entry?.reps) [ex.repsMin, ex.repsMax] = opts.entry.reps;
    else if (opts.slow && !ctx.pregnant) {
      const [lo, hi] = C.slowReps;
      ex.repsMin = Math.min(Math.max(ex.repsMin, lo), hi);
      ex.repsMax = Math.max(ex.repsMin, Math.min(ex.repsMax, hi));
    }
    ex.repsMax = Math.min(ex.repsMax, C.repsCap);
    ex.repsMin = Math.min(ex.repsMin, ex.repsMax);
  }
  // Repos entre séries de force : 60 à 90 s (douce 90).
  ex.restSec = fl.intensity === 'douce' || fl.softened ? C.restSec.douce : Math.min(C.restSec.max, Math.max(C.restSec.min, ex.restSec));
  return ex;
}

/** Contacts au sol autorisés (§3) : départ du niveau, +20 en soutenue après une séance de sauts sans douleur (14 jours), +5 au plus sur la précédente, plafond. */
function contactBudget(level: Level, intensity: CreateIntensity, recent: { contacts?: number; pain?: boolean } | null, pauseOver2Weeks: boolean): number {
  const start = JUMPS.startContacts[level];
  const cap = JUMPS.capContacts[level];
  if (level === 'debutant') return 0; // §3 : le débutant n'a que la version douce, 0 contact (20 au plus de toute façon).
  let budget = start;
  if (!pauseOver2Weeks && recent) {
    if (!recent.pain) {
      if (intensity === 'soutenue') budget = start + CREER_SEANCE.contacts.soutenueBonus;
      if (recent.contacts !== undefined) budget = Math.min(budget, recent.contacts + CREER_SEANCE.contacts.stepOverPrevious);
    } else if (recent.contacts !== undefined) budget = Math.min(budget, recent.contacts);
  }
  return Math.min(budget, cap);
}

const roundUp5 = (min: number): number => Math.ceil(min / 5) * 5;

/**
 * createSession : une séance ponctuelle (jamais le programme). Renvoie la séance composée (échauffement, sauts, force, retour au calme,
 * avertissements) ou un refus avec message. Aucune séance n'est « forcée » : si un verrou tombe, elle est composée sans saut ou refusée.
 */
export function createSession(input0: GeneratorInput, request: CreateSessionRequest, context: CreateContext = {}): CreateSessionResult {
  const C = CREER_SEANCE;
  const warnings: CreateMessage[] = [];
  const warn = (id: string, text: string) => warnings.push({ id, text });
  const nowMs = Date.parse(request.todayIso);
  if (!Number.isFinite(nowMs)) return refuse('date', 'La date de la demande est illisible.');
  const D = request.durationMin;
  const zone = request.zone;
  const legs = zone === 'jambes' || zone === 'corps_entier';
  const goalKey = request.objective ? C.objectiveGoal[request.objective] : undefined;
  // « Mon sport » : charge à la date de la demande ; une gêne notée devient un niveau 1 temporaire (3 si renvoi vers un professionnel) sans toucher au profil.
  const load = context.sport ? sportLoad(context.sport.sessions, context.sport.plan, new Date(nowMs)) : null;
  const sportInjuries: NonNullable<GeneratorInput['injuries']> = [];
  if (load) {
    const lv: Partial<Record<InjuryZone, number>> = {};
    for (const z of load.tempPainZones) lv[z] = 1;
    for (const z of load.consult?.zones ?? []) lv[z] = 3;
    for (const [zone, level] of Object.entries(lv)) sportInjuries.push({ zone: zone as InjuryZone, level: level as 1 | 3, active: true, deletedAt: null, updatedAt: request.todayIso });
  }
  const input: GeneratorInput = sportInjuries.length ? { ...input0, injuries: [...(input0.injuries ?? []), ...sportInjuries] } : input0;
  const ctx = buildCtx({
    ...input,
    ...(goalKey ? { goals: [{ goalKey, rank: 1 }] } : {}),
    options: { ...(input.options ?? {}), nowIso: request.todayIso },
  });
  const sessions = [...(context.sessions ?? [])].map((s) => ({ ...s, t: Date.parse(s.endIso) })).filter((s) => Number.isFinite(s.t));

  const gate: SportGate | null = load ? sportGate(load, ctx.level, JUMPS.startContacts[ctx.level]) : null;
  const sportKey = request.sport ?? null;
  const group = sportKey ? GROUP_OF[sportKey] : undefined;
  const pause = !!context.pauseOver2Weeks || (!!sportKey && !!load?.pauseOver14);

  // ----- Refus (§4) -----
  if (gate?.dayLocked) return refuse('sport-malaise', SPORT_GATE_TEXT.malaiseDay, warnings);
  if (legs && ctx.pregnant) return refuse('grossesse', T.pregnancy, warnings, ['haut', 'tronc']);
  const heavyEnds = sessions.filter((s) => s.heavyLegs).map((s) => s.t);
  const lastHeavyEndMs = heavyEnds.length ? Math.max(...heavyEnds) : null;
  const hoursHeavy = lastHeavyEndMs === null ? Infinity : (nowMs - lastHeavyEndMs) / H_MS;
  if (legs && hoursHeavy < C.spacing.refuseHours) return refuse('jambes-trop-proches', T.tooClose, warnings, ['haut', 'tronc']);
  if (legs && gate?.legs === 'refuse') return refuse('sport-jambes-trop-proches', SPORT_GATE_TEXT.legsRefuse, warnings, ['haut', 'tronc']);
  const softenedByLegs = legs && hoursHeavy < C.spacing.softenHours;
  const softened = softenedByLegs || (legs && gate?.legs === 'soften');
  const intensity: CreateIntensity = softened ? 'douce' : request.intensity;
  if (softenedByLegs) warn('adoucie', T.softened);
  else if (softened) warn('adoucie', gate?.matchTomorrow ? SPORT_GATE_TEXT.matchTomorrow : SPORT_GATE_TEXT.legsSoften);
  else if (legs && hoursHeavy < C.spacing.warnHours) warn('moins-de-72h', T.warn72);
  else if (legs && gate?.legs === 'warn') warn('moins-de-72h', SPORT_GATE_TEXT.legsWarn);
  if (gate?.consult) warn('sport-consulter', SPORT_GATE_TEXT.consult);
  if (load && (load.events.length || gate?.consult)) warn('sport-estimation', SPORT_GATE_TEXT.estimate);
  if (sportKey === 'autre') warn('sport-autre', SPORT_GATE_TEXT.autre);
  if (legs && context.heavyLegsTomorrow) warn('jambes-demain', T.tomorrowLegs);
  const chairStable = !!request.chairStable;
  if (!chairStable && legs) warn('chaise', T.unstableChair);

  // ----- Sauts : demandés ? permis ? (§3, §4, createSessionCheck) -----
  const jumpsWanted = sportKey === 'autre' ? false : request.jumps ?? (!!request.sport && C.jumpSports.includes(request.sport) || request.objective === 'detente');
  let jumpsOn = jumpsWanted && legs;
  if (jumpsWanted && !legs) warn('sauts-hors-jambes', T.detenteNoLegs);
  const jumpsOff = (code: string) => {
    jumpsOn = false;
    warn('sauts-off', `${T.jumpsOff}${C.lockReason[code] ?? code}.`);
  };
  const recentJump = [...sessions].filter((s) => s.jumps && nowMs - s.t <= C.contacts.recentDays * DAY_MS).sort((a, b) => b.t - a.t)[0] ?? null;
  const lastJump = [...sessions].filter((s) => s.jumps).sort((a, b) => b.t - a.t)[0] ?? null;
  if (jumpsOn) {
    const st: CreateState = {
      level: ctx.level, pregnant: ctx.pregnant, zones: ctx.zones, interruptedToday: !!context.interruptedToday,
      lastHeavyEndMs, lastJumpEndMs: lastJump?.t ?? null, impactEndsMs: sessions.filter((s) => s.impact || s.jumps).map((s) => s.t),
      heavyTomorrow: !!context.heavyLegsTomorrow, pauseOver2Weeks: pause, nowMs,
    };
    const check = createSessionCheck({ jumps: true, run: false, legsStrength: true }, st);
    const painZone = [...ctx.recentPainZones].some((z) => IMPACT_EXCLUDED_ZONES.includes(z));
    const lock = check.locks[0]
      ?? (softened ? 'adoucie' : painZone ? 'douleur-recente' : ctx.repriseActive ? 'reprise' : recentJump?.pain ? 'douleur-sauts-recents' : context.stopSignRecent ? 'signe-arret' : null);
    const sportLock = gate?.unknownPain ? SPORT_GATE_TEXT.jumpsUnknownPain : gate?.jumpLock ? SPORT_LOCK_TEXT[gate.jumpLock] : group === 'sauts' && intensity === 'soutenue' ? SPORT_GATE_TEXT.jumpsSoutenue : null;
    if (lock) jumpsOff(lock);
    else if (sportLock) {
      jumpsOn = false;
      warn('sauts-off', `${T.jumpsOff}${sportLock}.`);
    } else {
      if (gate?.jumpWarn) warn('sport-sauts-72h', SPORT_GATE_TEXT.jumps72);
      if (check.warnings.includes('jambes-lourdes')) warn('jambes-lourdes', T.heavyLegs);
      if (check.warnings.includes('moins-de-72h')) warn('sauts-moins-de-72h', T.warn72);
      if (check.warnings.includes('reprise') || pause) warn('reprise', 'Reprise après une pause : les contacts repartent du niveau de départ.');
    }
  }

  // ----- Sauts : bloc de pliométrie (liste fermée de 5.2) -----
  let plio: PlioItem[] | null = null;
  const afterJumpsFlag = (): Flags => ({ intensity, chairStable, afterJumps: plio !== null, softened });
  let softBlock: JumpBlock | null = null;
  const jumpFiche = (id: string): Fiche | undefined => ctx.fichesById.get(id);
  if (jumpsOn && ctx.level === 'debutant') {
    // §3 : le débutant n'a que la montée sur la pointe des pieds, 0 contact (version douce d'abord).
    const b = C.beginnerSoft;
    const f = jumpFiche(b.ficheId);
    const v = f?.variantes.find((x) => x.id === b.variantId);
    if (f && v && variantSafe(f, ctx, b.variantId)) {
      const nom = itemNom(f.nom, v);
      softBlock = {
        items: [{ variantId: b.variantId, ficheId: f.id, nom, softVariantId: b.variantId, softNom: nom, soft: true, sets: b.sets, reps: b.reps, restSec: JUMPS.restSec }],
        contacts: 0, capContacts: JUMPS.capContacts.debutant, warmupMin: JUMPS.warmupMin,
      };
      warn('debutant-doux', T.beginnerSoft);
    } else jumpsOff('debutant');
    jumpsOn = false;
  } else if (jumpsOn) {
    const need = D >= C.jumpExercises.longFromMin ? C.jumpExercises.long : C.jumpExercises.short;
    const picked: PlioItem[] = [];
    for (const p of C.plio) {
      if (picked.length >= need) break;
      const f = jumpFiche(p.ficheId);
      if (!f || levelIdx(C.plioMinLevel) > ctx.levelI || !USABLE_STATUTS.includes(f.statut) || !variantSafe(f, ctx, p.variantId)) continue;
      if (group === 'sauts' && pause && p.ficheId === 'rebonds-chevilles') continue; // reprise : pas de rebonds (kine 13/11/2026)
      picked.push({ ficheId: p.ficheId, variantId: p.variantId, softVariantId: p.softVariantId && variantSafe(f, ctx, p.softVariantId) ? p.softVariantId : null, reps: p.reps, series: group === 'sauts' ? Math.min(2, C.jumpStartSeries[picked.length] ?? 2) : C.jumpStartSeries[picked.length] ?? 2 });
    }
    const budget = contactBudget(ctx.level, intensity, recentJump, pause) - JUMPS.warmupBounces;
    const trimTo = (b: number) => {
      while (picked.length && picked.reduce((a, x) => a + x.series * x.reps, 0) > b) {
        const last = picked[picked.length - 1];
        last.series--;
        if (last.series <= 0) picked.pop();
      }
    };
    trimTo(budget);
    if (picked.length) plio = picked;
    else jumpsOff('indisponible');
    if (!plio) jumpsOn = false;
  }

  // ----- Choix des exercices de force -----
  const items: Item[] = [];
  const used = new Set<string>(softBlock ? [C.beginnerSoft.ficheId] : []);
  const pool = input.fiches.filter((f) => USABLE_STATUTS.includes(f.statut)).sort((a, b) => (a.id < b.id ? -1 : 1));
  // Sauts retirés à cause du sport : la place du bloc de sauts n'est PAS rendue à de la force (la charge ne fait que retirer, jamais ajouter).
  const sportRestricts = !!gate && (gate.legs === 'soften' || !!gate.jumpLock || gate.unknownPain || (group === 'sauts' && intensity === 'soutenue'));
  const nForce = strengthCount(D, !!plio || !!softBlock || (jumpsWanted && legs && sportRestricts));
  const mk = (cand: Candidate, slot: SlotKey, tier: GenExercise['tier'], extra: { block: CreatedExercise['block']; prio: number; ord: number; entry?: CreateEntry; slow?: boolean }) => {
    const fl = afterJumpsFlag();
    const ex = applyDose(buildExercise(cand, slot, tier, ctx), ctx, fl, { entry: extra.entry, slow: extra.slow });
    items.push({ ex: { ...ex, block: extra.block, ...(extra.entry?.tempo ? { tempo: extra.entry.tempo } : {}) }, prio: extra.prio, ord: extra.ord });
    used.add(cand.fiche.id);
  };
  // Sport connu : listes fermées de sport (saisie-sport-v1.md §4 et §7), en priorité ; les blocs habituels complètent ensuite. Jamais pendant la grossesse.
  const sportList = group && !ctx.pregnant ? SPORT_LISTS[group] : null;
  const shoulderState = gate?.shoulder ?? 'free';
  /** Haut du corps le jour d'un sport qui charge l'épaule : ni poussée verticale, dips, lancer, ni exercice d'épaule fragile (§7 (a), (c)). */
  // Gêne d'épaule de niveau >= 1 (profil OU gêne notée au sport, 2 jours) : rotation externe seule, ni au-dessus de la tête ni appui chargé (§7 (d)).
  const shoulderInjured = ctx.zones.some((z) => !z.isG && z.key === 'epaule' && z.level >= 1);
  if (shoulderInjured && zone !== 'jambes' && sportKey && SPORT.shoulderFamilies.includes(sportKey)) warn('sport-epaule-gene', SPORT_GATE_TEXT.shoulderPain);
  if (gate?.unknownPain) warn('sport-gene-inconnue', SPORT_GATE_TEXT.unknownPain);
  const upperOk = (c: Candidate): boolean => {
    if (shoulderInjured && (SENSITIVE_IDS.has(c.fiche.id) || UPPER_PUSH_IDS.includes(c.fiche.id))) return false;
    if (!gate?.noUpperPush) return true;
    if (UPPER_PUSH_SCHEMAS.includes(c.fiche.schema) || UPPER_PUSH_IDS.includes(c.fiche.id)) return false;
    if (shoulderState !== 'free' && SENSITIVE_IDS.has(c.fiche.id)) return false;
    if (shoulderState === 'none' && SHOULDER_IDS.includes(c.fiche.id)) return false;
    return true;
  };
  if (zone === 'jambes') {
    const lists = ctx.level === 'debutant' ? 'debutant' : 'autres';
    const seen: Record<string, number> = {};
    let prio = 0;
    if (sportList) {
      const quota = Math.max(1, Math.ceil(nForce / 2));
      const fl0 = afterJumpsFlag();
      sportList.legs.forEach((entry, idx) => {
        if (items.length >= quota || used.has(entry.id)) return;
        if (entry.startOnly && (plio || softBlock || softened || gate?.matchTomorrow)) return;
        const cand = candidateFor(entry, ctx, fl0);
        if (!cand) return;
        const posterior = cand.fiche.schema === 'charniere';
        const kk = (seen[posterior ? 'posterior' : 'slow'] = (seen[posterior ? 'posterior' : 'slow'] ?? 0) + 1) - 1;
        const slot: SlotKey = posterior ? (kk === 0 ? 'charniere' : 'jambes_4') : kk === 0 ? 'jambes_2' : 'jambes_4';
        mk(cand, slot, 'a', { block: posterior ? 'posterior' : 'slow', prio: 0, ord: -20 + idx, entry, slow: true });
      });
    }
    for (const block of C.legs.priority) {
      if (items.length >= nForce) break;
      prio++;
      if (block === 'explosive' && !(plio && D >= C.explosiveMinDurationMin)) continue;
      const entries: readonly CreateEntry[] = block === 'explosive' ? C.legs.explosive : C.legs[block][lists];
      const fl = afterJumpsFlag();
      for (const entry of entries) {
        if (used.has(entry.id)) continue;
        const cand = candidateFor(entry, ctx, fl);
        if (!cand) continue;
        const k = (seen[block] = (seen[block] ?? 0) + 1) - 1;
        const slot: SlotKey = block === 'explosive' ? 'jambes_3' : block === 'slow' ? (k === 0 ? 'jambes_2' : 'jambes_4') : block === 'posterior' ? (k === 0 ? 'charniere' : 'jambes_4') : 'jambes_4';
        mk(cand, slot, 'a', { block, prio, ord: C.legs.displayOrder.indexOf(block) * 10 + k, entry, slow: block === 'slow' || block === 'explosive' });
        break;
      }
    }
  } else {
    const slots = C.slots[zone].slice(0, nForce);
    const st: SessionState = { label: zone === 'haut' ? 'HAUT-A' : 'A', placedSchema: {} };
    slots.forEach((slot, i) => {
      const slotKey = slot as SlotKey;
      const label = zone === 'tronc' ? C.trunkLabels[i % C.trunkLabels.length] : st.label;
      const state: SessionState = { label, placedSchema: st.placedSchema };
      const fl = afterJumpsFlag();
      const ranked = rankSlot(slotKey, state, used, ctx, pool);
      const okPick = (r: (typeof ranked)[number]): boolean => variantRuleOk(r.cand.fiche, r.cand.variant, ctx, fl) && !(fl.softened && r.cand.fiche.id === 'nordique-ischios') && upperOk(r.cand);
      const upperEntry = (id: string): SportEntry | undefined => sportList?.upper.find((x) => x.id === id);
      const sportPick = sportList && slotKey !== 'jambes_genou' && slotKey !== 'charniere'
        ? ranked.find((r) => { const en = upperEntry(r.cand.fiche.id); return !!en && !(shoulderInjured && !!sportKey && SPORT.shoulderFamilies.includes(sportKey) && en.id !== 'rotation-externe-epaule') && levelIdx(en.minLevel) <= ctx.levelI && en.variants.includes(r.cand.variant.id) && okPick(r); })
        : undefined;
      const pick = sportPick ?? ranked.find(okPick);
      if (!pick) return;
      st.placedSchema[slotKey] = pick.cand.fiche.schema;
      mk(pick.cand, slotKey, pick.tier, { block: 'general', prio: i, ord: i });
    });
  }
  if (!items.length && !plio && !softBlock) return refuse('aucun-exercice', T.noExercise, warnings);
  if (!items.length && (plio || softBlock) && zone !== 'jambes' && zone !== 'corps_entier') return refuse('aucun-exercice', T.noExercise, warnings);

  // ----- Calcul de la durée, des plafonds et réduction jusqu'à ce que tout tienne -----
  const plafMode = intensity === 'soutenue' && ctx.level !== 'debutant' ? 'slot' : 'auto';
  const plaf = makePlaf(ctx, plafMode);
  const warmupMin = D > 45 ? JUMPS.warmupMinLong : JUMPS.warmupMin;
  const cooldownMin = D >= C.cooldownLongFromMin ? C.cooldownLongMin : C.cooldownMin;
  const [, zoneMax] = C.totalSets[zone];
  const setsMax = Math.min(zoneMax, C.totalSetsMax);
  const weekSets = context.weekSets ?? {};
  const sorted = (): CreatedExercise[] => [...items].sort((a, b) => a.ord - b.ord).map((i) => i.ex);
  const arranged = (): CreatedExercise[] => {
    const exs = sorted();
    if (!ctx.gagnerDuTemps || !exs.length) return exs;
    const dur: DurSession<CreatedExercise> = {
      label: 'A', days: 1, veille: context.veilleMuscles ? [...context.veilleMuscles] : null, level: ctx.level, pregnant: ctx.pregnant, exercises: exs, e1Sec: 0, e2Count: 0,
    };
    return formAllPairs(dur).exercises;
  };
  const plioSeries = (): number => (plio ?? []).reduce((a, x) => a + x.series, 0) + (softBlock ? softBlock.items.reduce((a, x) => a + x.sets, 0) : 0);
  const plioMin = (): number => plioBlockMin(plioSeries());
  const strengthSec = (): number => {
    const exs = arranged();
    if (!exs.length) return 0;
    return estimerDuree({ label: 'A', days: 1, veille: context.veilleMuscles ? [...context.veilleMuscles] : null, level: ctx.level, pregnant: ctx.pregnant, exercises: exs, e1Sec: 0, e2Count: 0 });
  };
  const totalSec = (): number => (warmupMin + cooldownMin + plioMin()) * 60 + strengthSec();
  const limitSec = (): number => (D - C.marginMin) * 60;
  const totalSets = (): number => items.reduce((a, i) => a + i.ex.sets, 0) + (plio ?? []).reduce((a, x) => a + x.series, 0);
  const dropPlio = () => {
    plio = null;
    jumpsOn = false;
    warn('sauts-off', `${T.jumpsOff}${C.lockReason.duree}.`);
    // La force explosive n'existe qu'avec des sauts (§2) : retirée avec eux.
    for (let i = items.length - 1; i >= 0; i--) if (items[i].ex.block === 'explosive') items.splice(i, 1);
  };
  /** Retire une série à l'exercice le moins prioritaire parmi `targets` qui en a plus de 2, sinon (si permis) retire l'exercice. */
  const shrink = (targets: Item[], allowRemove: boolean): boolean => {
    const byLow = [...targets].sort((a, b) => b.prio - a.prio);
    const withSets = byLow.find((i) => i.ex.sets > 2);
    if (withSets) {
      withSets.ex = { ...withSets.ex, sets: withSets.ex.sets - 1 };
      return true;
    }
    if (allowRemove && items.length > 1 && byLow.length) {
      items.splice(items.indexOf(byLow[0]), 1);
      return true;
    }
    return false;
  };
  for (let guard = 0; guard < 400; guard++) {
    const exs = sorted();
    // 1. Plafonds par séance (11 / 12 par muscle, charnières, nombre d'exercices).
    const bad = weekMusclesOf([{ exercises: exs }]).find((m) => sessionVol({ exercises: exs }, m) > plaf.cap(exs, m));
    if (bad || !sessionCapsOk({ exercises: exs }, plaf)) {
      const targets = bad ? items.filter((i) => frac(i.ex, bad) > 0) : items.filter((i) => i.ex.schema === 'charniere');
      if (shrink(bad ? targets : items, true)) continue;
      break;
    }
    // 2. Total de séries de la séance (CAL-3, 19 au plus).
    if (totalSets() > setsMax) {
      if (shrink(items, true)) continue;
      if (plio && plioSeries() > C.jumpMinSeries) {
        const last = plio[plio.length - 1];
        last.series--;
        if (last.series <= 0) plio.pop();
        if (!plio.length) dropPlio();
        continue;
      }
      break;
    }
    // 3. Plafond hebdomadaire (20 par muscle) avec les séances du programme déjà faites : on retire des séries, jamais sous 2 par exercice.
    const weekBad = weekMusclesOf([{ exercises: exs }]).find((m) => (weekSets[m] ?? 0) + weekVol({ exercises: exs }, m) > weekCapFor(ctx, m));
    if (weekBad) {
      if (shrink(items.filter((i) => frac(i.ex, weekBad) > 0), false)) continue;
      return refuse('plafond-hebdomadaire', T.weekCap, warnings, (['haut', 'tronc', 'jambes', 'corps_entier'] as CreateZone[]).filter((z) => z !== zone));
    }
    // 4. Durée choisie (échauffement et retour au calme compris), avec la marge ; jamais de repos raccourci.
    if (totalSec() > limitSec()) {
      if (shrink(items, true)) continue;
      if (plio && plioSeries() > C.jumpMinSeries) {
        const last = plio[plio.length - 1];
        last.series--;
        if (last.series <= 0) plio.pop();
        if (!plio.length) dropPlio();
        continue;
      }
      if (plio) {
        dropPlio();
        continue;
      }
      return refuse('duree-trop-courte', T.tooShort, warnings);
    }
    break;
  }
  if (totalSec() > limitSec()) return refuse('duree-trop-courte', T.tooShort, warnings);

  if (gate?.noUpperPush && zone !== 'jambes' && zone !== 'tronc') warn('sport-epaule', SPORT_GATE_TEXT.shoulderDay);

  // ----- Assemblage : échauffement, sauts, force, retour au calme -----
  const final = arranged();
  const finalPlio = plio as PlioItem[] | null;
  let jumps: JumpBlock | null = softBlock;
  let contacts = 0;
  if (finalPlio && finalPlio.length) {
    const jumpItems: JumpItem[] = finalPlio.map((p) => {
      const f = ctx.fichesById.get(p.ficheId)!;
      const v = f.variantes.find((x) => x.id === p.variantId)!;
      const sv = p.softVariantId ? f.variantes.find((x) => x.id === p.softVariantId) : undefined;
      return {
        variantId: p.variantId, ficheId: f.id, nom: itemNom(f.nom, v), softVariantId: sv?.id ?? null, softNom: sv ? itemNom(f.nom, sv) : null,
        soft: false, sets: p.series, reps: p.reps, restSec: JUMPS.restSec,
      };
    });
    contacts = JUMPS.warmupBounces + jumpItems.reduce((a, x) => a + x.sets * x.reps, 0);
    jumps = { items: jumpItems, contacts, capContacts: JUMPS.capContacts[ctx.level], warmupMin: JUMPS.warmupMin };
    warn('t8', D30_TEXT.T8);
    warn('arret-sauts', D30_TEXT.jumpStop);
  }
  // Chaise non calée : ni l'échauffement ni le retour au calme n'utilisent une variante sur chaise (l'item est retiré, jamais remplacé par une autre chaise).
  const offChair = <T extends { ficheId: string; variantId: string }>(it: T | null): boolean =>
    !!it && (chairStable || !ctx.fichesById.get(it.ficheId)?.variantes.find((v) => v.id === it.variantId)?.tags.includes('chaise'));
  const mobility = mobilityWarmup(ctx, final.some((e) => e.schema === 'charniere')).filter(offChair);
  if (legs) for (const id of C.warmupLegsExtra) {
    const it = wItem(id, ctx, 45);
    if (it && !mobility.some((m) => m.ficheId === it.ficheId)) mobility.push(it);
  }
  // Prévention du sport (échauffement, 2 exercices, 3 dès 45 min) : jamais en grossesse, jamais pour « autre », raquette seulement avec son texte et 2 fois par semaine au plus.
  const prevention: string[] = [];
  if (group && sportKey && sportKey !== 'autre' && !ctx.pregnant) {
    const racquetDone = (context.sessions ?? []).filter((s) => s.sport === 'raquette' && nowMs - Date.parse(s.endIso) < 7 * DAY_MS).length;
    if (!(sportKey === 'raquette' && racquetDone >= RACQUET_PREVENTION.maxPerWeek)) {
      const shoulderId = SHOULDER_PREVENTION[sportKey];
      const ids = [...(shoulderId && zone !== 'jambes' ? [shoulderId] : []), ...SPORT_LISTS[group].prevention];
      const want = D >= C.cooldownLongFromMin ? 3 : 2;
      for (const id of ids) {
        if (prevention.length >= want) break;
        if (SHOULDER_IDS.includes(id) && (shoulderState === 'none' || zone === 'jambes')) continue;
        if (mobility.some((m) => m.ficheId === id)) continue;
        const it = wItem(id, ctx, 45);
        if (!it || !offChair(it)) continue;
        mobility.push(it);
        prevention.push(id);
      }
      if (prevention.length && sportKey === 'raquette') warn('prevention-raquette', SPORT_GATE_TEXT.racquetPrevention);
    }
  }
  const general0 = generalWarmup(ctx);
  const general = offChair(general0) ? general0 : null;
  const generalSec = Math.max(0, warmupMin * 60 - mobility.reduce((a, m) => a + m.sec, 0));
  const stretchIds = C.stretch[zone];
  const stretchSec = Math.round((cooldownMin * 60) / Math.max(1, stretchIds.length));
  const cooldownItems = stretchIds.map((id) => wItem(id, ctx, stretchSec)).filter((x): x is WarmupItem => !!x && offChair(x));
  const order = ['echauffement', ...(jumps ? ['sauts'] : []), ...(final.length ? ['force'] : []), 'retour_au_calme'];
  const sec = totalSec();
  warn('avis', T.notMedical);
  const heavyLegs = legs && final.some((e) => isLegFiche(e));
  const session: CreatedSession = {
    zone, intensity, softened, durationMin: D, order,
    warmup: { general: general ? { ...general, sec: Math.min(general.sec, generalSec) || general.sec } : null, generalSec, mobility, minutes: warmupMin, bounces: contacts ? JUMPS.warmupBounces : 0 },
    jumps, exercises: final, cooldown: { items: cooldownItems, minutes: cooldownMin }, contacts,
    totalSets: totalSets(), estimatedSec: sec, estimatedMin: Math.min(D, roundUp5(sec / 60)),
    heavyLegs, impact: contacts > 0, prevention, header: T.header, warnings,
  };
  return { ok: true, session, warnings };
}
