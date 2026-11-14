// « Mon sport » A2 (knowledge/saisie-sport-v1.md §9, avis kiné du 13/11/2026 : valeurs finales, NON SOURCÉ / PROVISOIRE) : prévention propre au sport, en EXERCICES dans les séances
// de force du programme : 1 à 2 par séance, 2 séries, dose fixe, listes fermées par sport (aucun exercice nouveau), mêmes plafonds que le reste (prend la place d'une isolation, jamais en plus
// d'un plafond). Épaule, équilibre et tronc en entrée de séance (emplacement `prevention_sport`), cheville et mollets en fin de séance (emplacement `correctif`).
// Prudence : débutant, grossesse / post-partum, reprise : aucune ; jour `refuse` pour la zone chargée, jour de match, veille de match : aucune (mobilité douce, report au créneau suivant) ;
// copenhague-court : jamais dans les 48 h avant / après un match ; nordique : jamais ; raquettes : seulement avec le texte « prévention inspirée d'autres sports… » (message du programme).
import type { SportPlanEntry } from '../data/model';
import { CAL11, CORRECTIF_COU, ISOLATION, VOLUME } from './config';
import { estimerDuree } from './duration';
import { isIsoSlot } from './isolation';
import { resolveFiche, type Candidate } from './safety';
import type { GenExercise } from './types';
import { correctifExercise, zoneCapsOk, type FillDeps } from './zones-check';
import type { DayLoad } from '../sport/week-map';
import type { DurSession } from './duration';

type Sess = DurSession<GenExercise>;
type Kind = 'shoulder' | 'lower' | 'core';
interface Item { id: string; kind: Kind; start: boolean; /** jamais sans appui des jambes libres : copenhague. */ nordique?: boolean }

const it = (id: string, kind: Kind, start = true, nordique = false): Item => ({ id, kind, start, ...(nordique ? { nordique } : {}) });
/** Listes fermées de A2 point 3 (saisie-sport-v1.md §9). */
export const PREVENTION_LISTS: Record<string, readonly Item[]> = {
  sauts: [
    it('rotation-externe-epaule', 'shoulder'), it('face-pull-elastique', 'shoulder'), it('tirage-w-allonge', 'shoulder'), it('oiseau-un-bras-appuye', 'shoulder'),
    it('equilibre-sur-une-jambe-en-mouvement', 'lower'), it('equilibre-unipodal', 'lower'), it('releve-mollets', 'lower', false), it('cheville-elastique', 'lower', false),
  ],
  foot: [
    it('planche-laterale', 'core'), it('pallof-elastique', 'core'), it('abduction-hanche-debout', 'lower'), it('marche-laterale-elastique', 'lower'), it('copenhague-court', 'core', true, true),
  ],
  danse: [it('equilibre-unipodal', 'lower'), it('equilibre-sur-une-jambe-en-mouvement', 'lower'), it('releve-mollets', 'lower', false), it('abduction-hanche-debout', 'lower')],
  raquette: [it('rotation-externe-epaule', 'shoulder'), it('pallof-elastique', 'core'), it('cheville-elastique', 'lower', false)],
};
const GROUP: Record<string, string> = { volley: 'sauts', basket: 'sauts', hand: 'sauts', foot: 'foot', danse: 'danse', raquette: 'raquette' };
const UPPER_TYPES = ['HAUT', 'PUSH', 'PULL', 'CE'];
const LOWER_TYPES = ['BAS', 'LEGS', 'CE'];

export interface PreventionOpts {
  entries: readonly SportPlanEntry[];
  map: readonly DayLoad[];
  dayOf: (label: string) => number | undefined;
  typeOf: (label: string) => string;
}

/** Ajoute la prévention du sport aux séances (en place). Renvoie vrai si un exercice de raquette a été placé (texte §7 (h) à afficher). */
export function addSportPrevention(sessions: Sess[], d: FillDeps, o: PreventionOpts): { raquette: boolean } {
  const { ctx } = d;
  const out = { raquette: false };
  if (ctx.level === 'debutant' || ctx.pregnant || ctx.postPartum || ctx.repriseActive || ctx.lightWeek) return out;
  const sports = o.entries.filter((e) => GROUP[e.sport]);
  if (!sports.length) return out;
  let raquetteCount = 0;
  for (const s of sessions) {
    const type = o.typeOf(s.label);
    const day = o.dayOf(s.label);
    const dl = day === undefined ? undefined : o.map[day];
    if (!dl || dl.noForce || dl.eveOfMatch) continue;
    let placed = 0;
    for (const entry of sports) {
      for (const item of PREVENTION_LISTS[GROUP[entry.sport]]) {
        if (placed >= 2) break;
        if (item.kind === 'shoulder' ? !UPPER_TYPES.includes(type) : item.kind === 'lower' ? !LOWER_TYPES.includes(type) : false) continue;
        // Basket : épaule seulement si « bras au-dessus de la tête » est coché.
        if (entry.sport === 'basket' && item.kind === 'shoulder' && !entry.overhead) continue;
        // Jour chargé : épaule libre, jambes sans refus ; copenhague : jamais dans les 48 h autour d'un match.
        // Épaule : seulement un jour libre (relecteur 14/11/2026 : un jour « léger » n'a pas de version sans résistance, rien n'est placé).
        if (item.kind === 'shoulder' && dl.shoulder !== 'free') continue;
        if ((item.kind === 'lower' || item.nordique) && dl.legs !== 'ok' && dl.legs !== 'warn') continue;
        if (item.nordique && dl.nordiqueLock) continue;
        const weekIds = new Set(sessions.flatMap((x) => x.exercises.map((e) => e.ficheId)));
        if (weekIds.has(item.id)) continue;
        // Raquettes : 2 exercices par semaine au plus (saisie-sport-v1.md §7 (h), §8.3).
        if (entry.sport === 'raquette' && raquetteCount >= 2) continue;
        // Un seul exercice par catégorie dans la séance.
        if (s.exercises.some((e) => (e.slot === 'prevention_sport' || e.cappedLabel === CAL11.stopMessage) && PREVENTION_LISTS[GROUP[entry.sport]].find((x) => x.id === e.ficheId)?.kind === item.kind)) continue;
        if (s.exercises.filter((e) => isIsoSlot(e.slot)).length + s.exercises.filter((e) => e.slot === 'prevention_sport').length + placed >= ISOLATION.maxPerSession + 1) continue;
        const f = d.pool.find((x) => x.id === item.id);
        if (!f) continue;
        const c: Candidate | undefined = resolveFiche(f, ctx).candidates.find((x) => x.fiche.id === f.id && !x.replaces && !x.adapted && !x.adaptations.length);
        if (!c) continue;
        const ex = correctifExercise(c, ctx);
        ex.sets = Math.min(2, ex.sets);
        ex.capped = true;
        ex.cappedLabel = CAL11.stopMessage;
        if (item.start) ex.slot = 'prevention_sport';
        // La prévention PREND LA PLACE d'une isolation (ou d'un correctif de petite zone, hors cou) quand la séance est pleine ; jamais en plus d'un plafond.
        let base = s.exercises;
        if (base.length >= VOLUME.maxExercisesPerSession) {
          const victim = [...base].reverse().find((e) => isIsoSlot(e.slot) || (e.slot === 'correctif' && e.ficheId !== CORRECTIF_COU.ficheId));
          if (!victim) continue;
          base = base.filter((e) => e !== victim);
        }
        const trial = { ...s, exercises: [...base, ex] };
        const all = sessions.map((x) => (x === s ? trial : x));
        if (estimerDuree(trial) > d.budget(s)) continue;
        if (!d.sessionOk(trial.exercises, 'auto') || !d.weekOk(all) || !zoneCapsOk(sessions, all, ctx)) continue;
        s.exercises = trial.exercises;
        placed++;
        if (entry.sport === 'raquette') { out.raquette = true; raquetteCount++; }
      }
    }
  }
  return out;
}
