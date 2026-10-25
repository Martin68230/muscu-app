// Emplacements d'une séance (V-EMP §2.2), classement (V-CLASSE §6.7), replis (V-IMPOS §7.1), rotation A/C (V-ROT §2.3).
import { MAIN_EXERCISE_SLOTS, PILLAR_EXCLUDED_FICHES } from './config';
import { levelIdx, isChargeable, isUnilateral, type Ctx } from './context';
import { allowedVariants, resolveFiche, type Candidate } from './safety';
import type { Fiche, SlotKey, Tier } from './types';

export const SLOT_ORDER: readonly SlotKey[] = [
  'jambes_genou', 'poussee_1', 'tirage_1', 'charniere', 'tronc', 'poussee_2', 'tirage_2', 'jambes_2', 'fonctionnel',
];
export const CORE_SLOTS: readonly SlotKey[] = ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere', 'tronc'];
export const PILLAR_SLOTS: readonly SlotKey[] = ['jambes_genou', 'poussee_1'];
export const isCore = (s: SlotKey) => CORE_SLOTS.includes(s);

interface SchemaReq {
  schema: string;
  /** Muscle principal exigé pour une fiche « pleine » (au moins un) ; null = aucun. */
  required: string[] | null;
}
interface SlotDef {
  /** Repli a : schémas du même plan, dans l'ordre de préférence. */
  a: SchemaReq[];
  /** Repli b : autre plan du même groupe. */
  b: SchemaReq[];
  /** Les replis b et d (autre plan) et c (substitut) sont-ils permis ? */
  allowB: boolean;
  allowSubst: boolean;
}

const REQ: Record<string, string[] | null> = {
  squat: ['quadriceps'],
  fente: ['quadriceps'],
  poussee_h: ['pectoraux'],
  poussee_v: ['deltoides_anterieurs'],
  tirage_h: ['grand_dorsal', 'rhomboides'],
  tirage_v: ['grand_dorsal', 'rhomboides'],
  charniere: ['ischios', 'fessiers'],
};
const req = (schema: string): SchemaReq => ({ schema, required: REQ[schema] ?? null });
const other = (s: string): string =>
  ({ squat: 'fente', fente: 'squat', poussee_h: 'poussee_v', poussee_v: 'poussee_h', tirage_h: 'tirage_v', tirage_v: 'tirage_h' })[s] ?? s;

export interface SessionState {
  label: 'A' | 'B' | 'C';
  /** Schéma réellement placé par emplacement (pour poussee_2, tirage_2, jambes_2). */
  placedSchema: Partial<Record<SlotKey, string>>;
}

/** Gabarit A/B/C (V-ROT, NON SOURCÉ, decrit dans config par l'ordre ; ici la structure de §2.2). */
export function slotDef(slot: SlotKey, st: SessionState): SlotDef {
  const B = st.label === 'B';
  switch (slot) {
    case 'jambes_genou': {
      const s = B ? 'fente' : 'squat';
      return { a: [req(s)], b: [req(other(s))], allowB: true, allowSubst: true };
    }
    case 'poussee_1': {
      const s = B ? 'poussee_v' : 'poussee_h';
      return { a: [req(s)], b: [req(other(s))], allowB: true, allowSubst: true };
    }
    case 'tirage_1': {
      const s = B ? 'tirage_v' : 'tirage_h';
      return { a: [req(s)], b: [req(other(s))], allowB: true, allowSubst: true };
    }
    case 'charniere':
      return { a: [req('charniere')], b: [], allowB: false, allowSubst: true };
    case 'tronc': {
      // A : gainage ; B : anti_rotation ; C : rotation puis anti_rotation ; si vide : les autres (comptent en entier).
      const order = st.label === 'A' ? ['gainage', 'anti_rotation', 'rotation'] : B ? ['anti_rotation', 'gainage', 'rotation'] : ['rotation', 'anti_rotation', 'gainage'];
      return { a: order.map(req), b: [], allowB: false, allowSubst: true };
    }
    case 'poussee_2': {
      const p1 = st.placedSchema.poussee_1 ?? (B ? 'poussee_v' : 'poussee_h');
      return { a: [req(other(p1))], b: [], allowB: false, allowSubst: true };
    }
    case 'tirage_2': {
      const t1 = st.placedSchema.tirage_1 ?? (B ? 'tirage_v' : 'tirage_h');
      return { a: [req(other(t1))], b: [], allowB: false, allowSubst: true };
    }
    case 'jambes_2': {
      const j1 = st.placedSchema.jambes_genou ?? (B ? 'fente' : 'squat');
      return { a: [req(other(j1)), req('hanche_laterale'), req('cheville_mollet')], b: [], allowB: false, allowSubst: true };
    }
    case 'fonctionnel':
      return { a: [req('porte'), req('anti_rotation')], b: [], allowB: false, allowSubst: false };
  }
}

export interface SlotFill {
  slot: SlotKey;
  tier: Tier;
  cand: Candidate | null;
  /** Rang du schéma dans la liste du repli (0 = préféré). */
  schemaRank: number;
}

interface Ranked {
  cand: Candidate;
  tier: Tier;
  key: (number | string)[];
}

const TIER_ORDER: Tier[] = ['a', 'b', 'c', 'd', 'e'];
export const tierRank = (t: Tier) => TIER_ORDER.indexOf(t);

/** V-CLASSE §6.7 (clés 1 à 5 et 7 ; la clé 6, rotation, est appliquée par fillSlot). */
function rankKey(c: Candidate, slot: SlotKey, schemaRank: number, ctx: Ctx): (number | string)[] {
  const f = c.fiche;
  const key: (number | string)[] = [schemaRank, c.adapted ? 1 : 0];
  // Clé 3 : familles force/muscle, fiche de type force : variante chargeable ; puis variante au niveau de la personne.
  const underCap = c.capped || ctx.pregnant;
  if ((ctx.family === 'force' || ctx.family === 'muscle') && f.type === 'force') {
    const compat = allowedVariants(f, ctx);
    key.push(compat.some(isChargeable) ? 0 : 1);
    key.push(!underCap && ctx.level !== 'debutant' && !compat.some((v) => v.niveau === ctx.level) ? 1 : 0);
  } else key.push(0, 0);
  // Sous plafond : la sous-clé « niveau de la personne » est désactivée, on préfère le niveau_min le plus bas (V-PRIO).
  key.push(underCap ? levelIdx(f.niveauMin) : 0);
  // Clé 4 (piliers) : polyarticulaire (>= 2 muscles principaux), puis variante bilatérale (SRC2).
  if (slot === 'jambes_genou' || slot === 'poussee_1') {
    key.push(f.musclesPrincipaux.length >= 2 ? 0 : 1, isUnilateral(c.variant) ? 1 : 0);
  }
  // Clé 5 : favoris d'abord (les fiches masquées sont exclues en amont).
  key.push(ctx.favoris.has(f.id) ? 0 : 1);
  // Clé 7 : id alphabétique.
  key.push(f.id, c.variant.id);
  return key;
}

const cmp = (a: (number | string)[], b: (number | string)[]): number => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i];
    const y = b[i];
    if (x === y) continue;
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    return typeof x === 'number' && typeof y === 'number' ? x - y : String(x) < String(y) ? -1 : 1;
  }
  return 0;
};

function isPleine(f: Fiche, r: SchemaReq): boolean {
  if (f.couverture) return false;
  return !r.required || r.required.some((m) => f.musclesPrincipaux.includes(m));
}

const bySchemaCache = new WeakMap<Fiche[], Map<string, Fiche[]>>();
function bySchema(pool: Fiche[]): Map<string, Fiche[]> {
  let m = bySchemaCache.get(pool);
  if (!m) {
    m = new Map();
    for (const f of pool) m.set(f.schema, [...(m.get(f.schema) ?? []), f]);
    bySchemaCache.set(pool, m);
  }
  return m;
}

/** Tous les candidats classés d'un emplacement (pour le repli et la rotation). */
export function rankSlot(slot: SlotKey, st: SessionState, used: Set<string>, ctx: Ctx, pool: Fiche[]): Ranked[] {
  const def = slotDef(slot, st);
  const schemas = new Map<string, { tierFull: Tier; tierSub: Tier; r: SchemaReq; rank: number }>();
  def.a.forEach((r, i) => schemas.set(r.schema, { tierFull: 'a', tierSub: 'c', r, rank: i }));
  if (def.allowB) def.b.forEach((r, i) => !schemas.has(r.schema) && schemas.set(r.schema, { tierFull: 'b', tierSub: 'd', r, rank: i }));
  const best = new Map<string, Ranked>();
  const groups = bySchema(pool);
  for (const X of [...schemas.keys()].flatMap((k) => groups.get(k) ?? [])) {
    for (const c of resolveFiche(X, ctx).candidates) {
      const s = schemas.get(c.fiche.schema);
      if (!s || used.has(c.fiche.id)) continue;
      if (MAIN_EXERCISE_SLOTS.includes(slot) && PILLAR_EXCLUDED_FICHES.includes(c.fiche.id)) continue; // lancers : jamais exercice principal
      // jambes_2 / fonctionnel : un schéma sans muscle exigé ne peut pas être « substitut »
      const full = isPleine(c.fiche, s.r);
      if (!full && !def.allowSubst) continue;
      const tier = full ? s.tierFull : s.tierSub;
      const r: Ranked = { cand: c, tier, key: [tierRank(tier), ...rankKey(c, slot, s.rank, ctx)] };
      const prev = best.get(c.fiche.id);
      if (!prev || cmp(r.key, prev.key) < 0) best.set(c.fiche.id, r);
    }
  }
  return [...best.values()].sort((x, y) => cmp(x.key, y.key));
}

/**
 * Remplit un emplacement : meilleur candidat ; rotation (V-ROT) : si une séance précédente a déjà placé ce candidat dans
 * cet emplacement, on prend le suivant non utilisé, à condition qu'il soit au même niveau de repli et sans adaptation
 * de plus (la rotation ne dégrade jamais la sécurité).
 */
export function fillSlot(slot: SlotKey, st: SessionState, used: Set<string>, prevUsed: Set<string>, ctx: Ctx, pool: Fiche[]): SlotFill {
  const ranked = rankSlot(slot, st, used, ctx, pool);
  if (!ranked.length) return { slot, tier: 'e', cand: null, schemaRank: 0 };
  let pick = ranked[0];
  if (prevUsed.has(pick.cand.fiche.id)) {
    // Sous plafond (zone au niveau 2, grossesse), la rotation ne monte jamais vers une fiche de niveau_min plus haut (V-PRIO, T45).
    const underCap = pick.cand.capped || ctx.pregnant;
    const alt = ranked.find(
      (r) =>
        !prevUsed.has(r.cand.fiche.id) && r.tier === pick.tier && r.cand.adapted === pick.cand.adapted && r.key[1] === pick.key[1] &&
        (!underCap || levelIdx(r.cand.fiche.niveauMin) <= levelIdx(pick.cand.fiche.niveauMin)),
    );
    if (alt) pick = alt;
  }
  return { slot, tier: pick.tier, cand: pick.cand, schemaRank: pick.key[1] as number };
}

/** Remplit tous les emplacements d'une séance, dans l'ordre de priorité (la même fiche n'occupe jamais deux emplacements). */
export function fillSession(
  label: 'A' | 'B' | 'C',
  slots: readonly SlotKey[],
  ctx: Ctx,
  pool: Fiche[],
  prevBySlot: Map<SlotKey, Set<string>>,
): Map<SlotKey, SlotFill> {
  const st: SessionState = { label, placedSchema: {} };
  const used = new Set<string>();
  const out = new Map<SlotKey, SlotFill>();
  for (const slot of slots) {
    const fill = fillSlot(slot, st, used, prevBySlot.get(slot) ?? new Set(), ctx, pool);
    out.set(slot, fill);
    if (fill.cand) {
      used.add(fill.cand.fiche.id);
      st.placedSchema[slot] = fill.cand.fiche.schema;
    }
  }
  return out;
}
