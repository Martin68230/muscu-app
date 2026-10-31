// D34 : variété entre les séances d'une semaine et d'une semaine à l'autre (knowledge/programmes-v3.md §1, PV3-VAR-1 à 6 ; écarts E-01, E-02).
// Attribution des fiches à l'échelle de la SEMAINE (PV3-VAR-6), déterministe (aucun hasard) : mêmes entrées, même sortie.
// Valeurs NON SOURCÉES (jugement de coach, validées sous réserve) : limite de 2 fiches par famille et par semaine, deux jeux qui
// alternent (semaine impaire = jeu 1, paire = jeu 2), piliers fixes, noyau stable fixe dans le bloc.
import { levelIdx, type Ctx } from './context';
import { rankSlot, slotDef, type SessionState, type SlotFill } from './slots';
import { typeOf } from './split';
import type { Fiche, SlotKey } from './types';

/** PV3-VAR-2 : au plus 2 fiches d'une même famille par semaine (NON SOURCÉ). */
export const VAR_MAX_PER_FAMILY_WEEK = 2;

/** §1.2 : famille provisoire d'une fiche = (schéma, premier mot de l'identifiant), en attendant le champ `famille_mouvement` (E-03). */
export const familyOf = (f: Pick<Fiche, 'id' | 'schema'>): string => `${f.schema}:${f.id.split('-')[0]}`;

/**
 * PV3-VAR-6 étape 2 : ordre d'attribution dans la semaine. 0 piliers (jambes_genou, poussee_1 ; tirage_1 en PULL, STR-REP-5),
 * 1 noyau stable (tirage_1, charniere), 2 tronc (CORE-ALT-1, ordre chronologique inchangé), 3 accessoires d'indice 2,
 * 4 accessoires d'indice >= 3, 5 isolations, 6 fonctionnel.
 */
export function stepOf(slot: SlotKey, label: string): number {
  if (slot === 'jambes_genou' || slot === 'poussee_1') return 0;
  if (slot === 'tirage_1') return typeOf(label) === 'PULL' ? 0 : 1;
  if (slot === 'charniere') return 1;
  if (slot === 'tronc') return 2;
  if (slot === 'poussee_2' || slot === 'tirage_2' || slot === 'jambes_2') return 3;
  if (slot.startsWith('iso_')) return 5;
  if (slot === 'fonctionnel') return 6;
  return 4;
}
/** Emplacement « tournant » d'une semaine à l'autre (accessoires, isolations, fonctionnel : §1.2). */
export const isRotatingSlot = (slot: SlotKey, label: string): boolean => stepOf(slot, label) >= 3;

/**
 * PV3-VAR-6 étape 3 et PV3-VAR-4 (taille de liste) : rang de départ d'un accessoire tournant. `n` fiches dans la liste (hors fiches des
 * piliers et du noyau), `k` occurrences tournantes du plan dans la semaine, semaine `w` (1 à 4), bloc `b` (1, 2…).
 * n >= 2k : deux jeux disjoints ; k < n < 2k : jeu 2 = fiches k+1 à n puis les premières (chevauchement 2k - n) ; n <= k : fixe.
 */
export function rotationStart(n: number, k: number, w: number, b: number): number {
  if (n <= 0 || k <= 0 || n <= k) return 0;
  return ((((b - 1) * 2 + ((w - 1) % 2)) * k) % Math.min(n, 2 * k));
}

export interface WeekFillArgs {
  labels: readonly string[];
  slotsFor: (l: string) => readonly SlotKey[];
  ctx: Ctx;
  pool: Fiche[];
  /** Semaine du bloc (1 à 4) et bloc (1, 2…) : PV3-VAR-6. */
  week: number;
  block: number;
  /** Pool propre à un emplacement d'une séance (charnière sans extension dorsale après une charge lourde). */
  poolFor?: (l: string, slot: SlotKey) => Fiche[] | null;
  /** Choix du tronc (CORE-ALT-1), appelé dans l'ordre chronologique des séances ; `weekUsed` = fiches déjà placées dans la semaine. */
  fillTronc?: (l: string, st: SessionState, used: Set<string>, weekUsed: Set<string>) => SlotFill;
}
export interface WeekFill {
  fills: Map<string, Map<SlotKey, SlotFill>>;
  /** Plans (schémas) où une règle de variété a dû être relâchée (PV3-VAR-6 point 4) : indicateur `penurie`. */
  penurie: Set<string>;
}

interface Ranked { cand: NonNullable<SlotFill['cand']>; tier: SlotFill['tier']; key: (number | string)[] }

/**
 * PV3-VAR-6 : remplit tous les emplacements de la semaine. Les candidats d'un emplacement sont ceux du même niveau de repli, du même
 * plan (rang de schéma) et de la même adaptation que le meilleur (la variété ne dégrade jamais la sécurité ; sous plafond P-CAP ou en
 * grossesse, jamais une fiche de niveau_min plus haut : V-PRIO). Contrôles dans l'ordre : (a) pas déjà prise cette semaine, (b) pas
 * déjà dans la séance (garanti par rankSlot), (c) famille prise moins de 2 fois, (d) famille absente de la séance ; sinon relâche (d),
 * (c), puis (a) (fiche la moins utilisée, puis la mieux classée) et note le plan dans `penurie`. Jamais de fiche hors profil.
 */
export function fillWeekVariety(a: WeekFillArgs): WeekFill {
  const { labels, ctx } = a;
  const st = new Map<string, SessionState>(labels.map((l) => [l, { label: l, placedSchema: {} }]));
  const used = new Map<string, Set<string>>(labels.map((l) => [l, new Set<string>()]));
  const fams = new Map<string, Set<string>>(labels.map((l) => [l, new Set<string>()]));
  const raw = new Map<string, Map<SlotKey, SlotFill>>(labels.map((l) => [l, new Map()]));
  const weekCount = new Map<string, number>();
  const famCount = new Map<string, number>();
  const weekUsed = new Set<string>();
  const fixedUsed = new Set<string>(); // fiches des piliers et du noyau (retirées des listes tournantes, PV3-VAR-6 étape 3)
  const penurie = new Set<string>();
  const kByPlan = new Map<string, number>();
  const planOf = (l: string, slot: SlotKey) => slotDef(slot, st.get(l)!).a[0]?.schema ?? slot;

  const record = (l: string, slot: SlotKey, fill: SlotFill, step: number) => {
    raw.get(l)!.set(slot, fill);
    if (!fill.cand) return;
    const f = fill.cand.fiche;
    used.get(l)!.add(f.id);
    st.get(l)!.placedSchema[slot] = f.schema;
    weekCount.set(f.id, (weekCount.get(f.id) ?? 0) + 1);
    famCount.set(familyOf(f), (famCount.get(familyOf(f)) ?? 0) + 1);
    fams.get(l)!.add(familyOf(f));
    weekUsed.add(f.id);
    if (step <= 1) fixedUsed.add(f.id);
  };

  for (let step = 0; step <= 6; step++) {
    if (step === 3) {
      // k = occurrences tournantes de chaque plan dans la semaine (plans lus après les piliers et le noyau).
      for (const l of labels) for (const slot of a.slotsFor(l)) if (stepOf(slot, l) >= 3) kByPlan.set(planOf(l, slot), (kByPlan.get(planOf(l, slot)) ?? 0) + 1);
    }
    for (const l of labels) {
      for (const slot of a.slotsFor(l)) {
        if (stepOf(slot, l) !== step) continue;
        const s = st.get(l)!;
        if (slot === 'tronc' && a.fillTronc) {
          record(l, slot, a.fillTronc(l, s, used.get(l)!, weekUsed), step);
          continue;
        }
        const ranked = rankSlot(slot, s, used.get(l)!, ctx, a.poolFor?.(l, slot) ?? a.pool) as Ranked[];
        if (!ranked.length) {
          record(l, slot, { slot, tier: 'e', cand: null, schemaRank: 0 }, step);
          continue;
        }
        const best = ranked[0];
        const underCap = best.cand.capped || ctx.pregnant;
        const C = ranked.filter(
          (r) => r.tier === best.tier && r.key[1] === best.key[1] && r.cand.adapted === best.cand.adapted &&
            (!underCap || levelIdx(r.cand.fiche.niveauMin) <= levelIdx(best.cand.fiche.niveauMin)),
        );
        let L = C;
        let r0 = 0;
        if (step === 1) r0 = (a.block - 1) % L.length;
        else if (step >= 3) {
          const free = C.filter((r) => !fixedUsed.has(r.cand.fiche.id));
          if (free.length) L = free;
          r0 = rotationStart(L.length, kByPlan.get(planOf(l, slot)) ?? 1, a.week, a.block);
        }
        const order = L.map((_, i) => L[(r0 + i) % L.length]);
        const fam = (r: Ranked) => familyOf(r.cand.fiche);
        const checks: ((r: Ranked) => boolean)[] = [
          (r) => !weekCount.get(r.cand.fiche.id) && (famCount.get(fam(r)) ?? 0) < VAR_MAX_PER_FAMILY_WEEK && !fams.get(l)!.has(fam(r)),
          (r) => !weekCount.get(r.cand.fiche.id) && (famCount.get(fam(r)) ?? 0) < VAR_MAX_PER_FAMILY_WEEK,
          (r) => !weekCount.get(r.cand.fiche.id),
        ];
        let pick: Ranked | undefined;
        for (let c = 0; c < checks.length && !pick; c++) {
          pick = order.find(checks[c]);
          if (pick && c > 0) penurie.add(pick.cand.fiche.schema);
        }
        if (!pick) {
          // Relâche (a) : la fiche la moins utilisée cette semaine ; départage (lecture de `dev`, au service de PV3-VAR-1) : celle qui fait le
          // moins monter le recouvrement R avec les séances qui l'ont déjà ; puis la mieux classée (rang du classement V-CLASSE).
          const rAfter = (x: Ranked) => {
            let m = 0;
            for (const o of labels) {
              if (o === l || !used.get(o)!.has(x.cand.fiche.id)) continue;
              let r = 1;
              for (const id of used.get(l)!) if (used.get(o)!.has(id)) r++;
              m = Math.max(m, r);
            }
            return m;
          };
          pick = [...C].sort(
            (x, y) => (weekCount.get(x.cand.fiche.id) ?? 0) - (weekCount.get(y.cand.fiche.id) ?? 0) || rAfter(x) - rAfter(y) || C.indexOf(x) - C.indexOf(y),
          )[0];
          penurie.add(pick.cand.fiche.schema);
        }
        record(l, slot, { slot, tier: pick.tier, cand: pick.cand, schemaRank: pick.key[1] as number }, step);
      }
    }
  }
  // Sortie dans l'ordre des emplacements de chaque séance (V-EMP).
  const fills = new Map<string, Map<SlotKey, SlotFill>>();
  for (const l of labels) {
    const m = new Map<SlotKey, SlotFill>();
    for (const slot of a.slotsFor(l)) if (raw.get(l)!.has(slot)) m.set(slot, raw.get(l)!.get(slot)!);
    fills.set(l, m);
  }
  return { fills, penurie };
}

