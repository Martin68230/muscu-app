// Chargement et lecture des fiches d'exercices (public/data/fiches.json, produit par tools/build-fiches.mjs).
// Le fichier est dans le cache hors-ligne de l'app ; il est lu une seule fois puis gardé en mémoire.

import type { Injury, InjuryZone } from './model';
import { effectiveLevel } from './injury-rules';
import {
  AMPLITUDE_LABEL,
  APPUI_LABEL,
  LEVEL_LABEL,
  MUSCLE_SHORT,
  TAG_LABEL,
  ZONE_GENE,
} from './labels';

export interface Variante {
  id: string;
  nom: string;
  echelon: number;
  niveau: string;
  tags: string[];
  installation: string;
}

export interface CaseSecurite {
  action: 'garder' | 'adapter' | 'retirer';
  variante?: string;
  amplitude?: string;
  appui?: string;
  charge?: string;
  sansCharge?: boolean;
  remplacant?: string;
  sansZone?: string;
}

export interface FicheImage {
  type: 'photo' | 'illustration';
  src: string;
  legende?: string;
}

export interface Fiche {
  id: string;
  nom: string;
  schema: string;
  type: string;
  niveauMin: string;
  statut: string;
  musclesPrincipaux: string[];
  musclesSecondaires: string[];
  douxPour: string[];
  alias: string[];
  variantes: Variante[];
  consignes: string[];
  pointsAttention: string[];
  /** Pas encore exportés par tools/build-fiches.mjs (affichés s'ils apparaissent). */
  erreursFrequentes?: string[];
  progression?: { plusFacile: string[]; plusDur: string[] };
  securite: {
    zones: Partial<Record<InjuryZone, CaseSecurite[]>>;
    grossesse: CaseSecurite;
    versionPlusDouce: string | null;
    signesArret: string[];
    objetsQuotidien: string[];
    notes: Record<string, string>;
  };
  images: FicheImage[];
  video: { kind: string; ref: string } | null;
}

// ---------- Chargement ----------

let cache: Fiche[] | null = null;
let pending: Promise<Fiche[]> | null = null;

export const FICHES_ERROR = 'Les fiches d’exercices sont introuvables sur ce téléphone. Reconnecte-toi une fois à internet puis relance l’appli.';

export function loadFiches(): Promise<Fiche[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= fetch('./data/fiches.json')
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<{ format?: string; fiches?: Fiche[] }>;
    })
    .then((j) => {
      if (j.format !== 'muscu-app-fiches' || !Array.isArray(j.fiches)) throw new Error('format');
      cache = j.fiches;
      return cache;
    })
    .catch(() => {
      pending = null;
      throw new Error(FICHES_ERROR);
    });
  return pending;
}

/** Pour les tests : vide ou remplace la mémoire. */
export function setFichesForTests(list: Fiche[] | null): void {
  cache = list;
  pending = null;
}

// ---------- Recherche ----------

/** Minuscules, sans accents, apostrophes et tirets ramenés à l'espace. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’'`-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function haystack(f: Fiche): string {
  const mus = [...f.musclesPrincipaux, ...f.musclesSecondaires].map((m) => MUSCLE_SHORT[m] ?? '');
  return normalize([f.nom, ...f.alias, ...mus].join(' | '));
}

const hayCache = new WeakMap<Fiche, string>();

/** Tous les mots de la recherche doivent se retrouver (nom, alias, muscles). */
export function searchFiches(list: Fiche[], query: string): Fiche[] {
  const words = normalize(query).split(' ').filter(Boolean);
  if (words.length === 0) return list;
  return list.filter((f) => {
    let h = hayCache.get(f);
    if (h === undefined) hayCache.set(f, (h = haystack(f)));
    return words.every((w) => h.includes(w));
  });
}

export function sortByName(list: Fiche[]): Fiche[] {
  return [...list].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

export function isUsable(f: Fiche): boolean {
  return f.statut === 'utilisable' || f.statut === 'verifie';
}

export function findFiche(list: Fiche[], id: string): Fiche | undefined {
  return list.find((f) => f.id === id);
}

/** Fiche ou variante (identifiant cité par une case de sécurité) -> nom lisible. */
export function nameOfId(list: Fiche[], id: string): string | null {
  for (const f of list) {
    if (f.id === id) return f.nom;
    const v = f.variantes.find((x) => x.id === id);
    if (v) return v.nom;
  }
  return null;
}

/** Fiche qui contient cet identifiant (fiche elle-même ou une de ses variantes). */
export function ficheOfId(list: Fiche[], id: string): Fiche | undefined {
  return list.find((f) => f.id === id || f.variantes.some((v) => v.id === id));
}

// ---------- Variante adaptée au matériel ----------

export function missingTags(v: Variante, owned: ReadonlySet<string>): string[] {
  return v.tags.filter((t) => !owned.has(t));
}

export function tagText(tag: string): string {
  return TAG_LABEL[tag] ?? 'du matériel en plus';
}

/** « des haltères et un banc plat ». */
export function listText(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
}

export interface VariantChoice {
  /** Variante la plus facile dont tout le matériel est dans le profil ; null si aucune. */
  best: Variante | null;
  /** Sinon : la variante la plus proche et ce qui lui manque. */
  closest: { variante: Variante; missing: string[] } | null;
  rows: { variante: Variante; missing: string[] }[];
}

export function chooseVariant(f: Fiche, owned: ReadonlySet<string>): VariantChoice {
  const rows = [...f.variantes]
    .sort((a, b) => a.echelon - b.echelon)
    .map((v) => ({ variante: v, missing: missingTags(v, owned) }));
  const ok = rows.find((r) => r.missing.length === 0);
  if (ok) return { best: ok.variante, closest: null, rows };
  const closest = rows.reduce((a, b) => (b.missing.length < a.missing.length ? b : a), rows[0]);
  return { best: null, closest: closest ?? null, rows };
}

// ---------- Cases de sécurité en texte ----------

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** Texte de la case : « adapter : mouvement moins ample » (jamais d'identifiant). */
export function caseText(c: CaseSecurite, list: Fiche[], note?: string): string {
  if (c.action === 'garder') return 'garder l’exercice tel quel' + (note ? ` (${lowerFirst(note)})` : '');
  const detail = (): string => {
    if (note) return lowerFirst(note);
    if (c.variante) {
      const n = nameOfId(list, c.variante);
      return n ? `choisis plutôt « ${n} »` : 'choisis une variante plus douce';
    }
    if (c.amplitude) return AMPLITUDE_LABEL[c.amplitude] ?? 'mouvement moins ample';
    if (c.appui) return APPUI_LABEL[c.appui] ?? 'avec un appui';
    if (c.charge) return 'charge légère, que tu n’augmentes pas';
    if (c.sansCharge) return 'sans charge';
    return 'à ajuster avec prudence';
  };
  if (c.action === 'adapter') return `adapter : ${detail()}`;
  // retirer
  let t = 'retirer : ne fais pas cet exercice';
  if (c.remplacant) {
    const n = nameOfId(list, c.remplacant);
    if (n) t += `, fais plutôt « ${n} »`;
  } else if (c.sansZone) {
    const n = nameOfId(list, c.sansZone);
    if (n) t += `, sauf « ${n} » qui ne sollicite pas cette zone`;
  }
  return t;
}

export interface InjuryLine {
  zone: InjuryZone;
  level: 1 | 2 | 3;
  text: string;
}

/** Une ligne par blessure active dont la zone a une case dans la fiche. */
export function injuryLines(f: Fiche, injuries: readonly Injury[], list: Fiche[]): InjuryLine[] {
  const out: InjuryLine[] = [];
  const seen = new Set<InjuryZone>();
  for (const zone of Object.keys(f.securite.zones) as InjuryZone[]) {
    const level = injuries
      .filter((i) => i.zone === zone && i.active && !i.deletedAt)
      .reduce<0 | 1 | 2 | 3>((m, i) => Math.max(m, effectiveLevel(i)) as 1 | 2 | 3, 0);
    if (level === 0 || seen.has(zone)) continue;
    const c = f.securite.zones[zone]?.[level - 1];
    if (!c) continue;
    seen.add(zone);
    out.push({
      zone,
      level: level as 1 | 2 | 3,
      text: `À cause de ta gêne ${ZONE_GENE[zone]} (niveau ${level}) : ${caseText(c, list, f.securite.notes[`${zone}-n${level}`])}`,
    });
  }
  return out;
}

export const POST_PARTUM_ADVICE = 'Reprends progressivement et demande l’avis de ton médecin ou de ta sage-femme.';

/** Ligne grossesse (« enceinte ») ou après accouchement (« post_partum ») : la note post-partum de la fiche n'est jamais perdue. */
export function pregnancyLine(f: Fiche, list: Fiche[], status: 'enceinte' | 'post_partum' = 'enceinte'): string {
  const sentences = (f.securite.notes.grossesse ?? '').split(/(?<=[.!?])\s+/).filter(Boolean);
  const pp = sentences.filter((s) => /Post-partum/i.test(s)).join(' ');
  const rest = sentences.filter((s) => !/Post-partum/i.test(s)).join(' ');
  if (status === 'enceinte') return `Pendant ta grossesse : ${caseText(f.securite.grossesse, list, rest || undefined)}`;
  const detail = cleanText(pp, list).replace(/^Post-partum\s*:\s*/i, '').replace(/\.$/, '');
  return `Après l’accouchement : ${detail ? `${lowerFirst(detail)}. ` : ''}${POST_PARTUM_ADVICE}`;
}

export function levelText(level: string): string {
  return LEVEL_LABEL[level] ?? level;
}

// ---------- Nettoyage des textes affichés ----------

const ID_LIKE = /\b[a-z0-9]+(?:-[a-z0-9]+)+\b/g;
const SNAKE = /\b(?:tag\s+)?([a-z]+(?:_[a-z]+)+)\b/g;
const CODE = /\b[A-Z]\d{1,2}\b/;
const CODE_G = /\b[A-Z]\d{1,2}\b/g;

/** Mots de sécurité : une phrase qui en contient n'est JAMAIS supprimée entière. */
export const SAFETY_WORD =
  /urgence|appelle|\b15\b|\b112\b|arrête|arrete|consulte|douleur|vertige|engourdissement|fourmillement|jamais|interdit|ne fais|ne refais|retiré|retirée|grossesse/i;
/** Marqueurs de note interne (phrase supprimée seulement si elle n'a aucun mot de sécurité). */
const INTERNAL_WORD = /\b(?:dev|coach|kine)\b|README|marqueur à coder|générateur|\blot\b/i;
/** Note de méthode (pas une consigne) : phrase retirée si elle n'a aucun mot de sécurité. */
const METHOD_NOTE = /valeurs?\s+sourcée?s?|n['’]est pas fixée ici|non sourcée?s?/i;
/** Justifications de sources dans une parenthèse (jargon pour l'équipe, pas pour l'utilisateur). */
const SOURCE_MARK = /\bHAS\b|extrapolation|PROVISOIRE|IFOMPT|README|regles-|sourc|§|\bOK\b|lot-\d/i;

/** Parenthèses (même imbriquées ou non refermées) : [début, fin exclu, contenu]. */
export function parenGroups(t: string): [number, number, string][] {
  const out: [number, number, string][] = [];
  let i = 0;
  while (i < t.length) {
    if (t[i] !== '(') {
      i++;
      continue;
    }
    let depth = 0;
    let j = i;
    for (; j < t.length; j++) {
      if (t[j] === '(') depth++;
      else if (t[j] === ')' && --depth === 0) break;
    }
    const end = j >= t.length ? t.length : j + 1; // non refermée : jusqu'à la fin
    out.push([i, end, t.slice(i + 1, depth === 0 ? j : t.length)]);
    i = end;
  }
  return out;
}

function stripCodes(s: string): string {
  return s.replace(/§\s*\d+(?:\.\d+)*/g, '').replace(/(?:,\s*|\s+et\s+)?\b[A-Z]\d{1,2}\b/g, '');
}

/**
 * Parenthèses qui citent un code de règle : supprimées (ce sont des justifications), sauf si elles portent
 * une consigne de sécurité sans jargon de source : alors seul le code est retiré.
 */
function handleParens(t: string): string {
  const groups = parenGroups(t).filter(([, , inner]) => CODE.test(inner) || SOURCE_MARK.test(inner));
  let out = '';
  let pos = 0;
  for (const [a, b, inner] of groups) {
    out += t.slice(pos, a);
    if (SAFETY_WORD.test(inner) && !SOURCE_MARK.test(inner)) out += `(${stripCodes(inner)})`;
    else out = out.replace(/\s+$/, ' ');
    pos = b;
  }
  return out + t.slice(pos);
}

function tidy(t: string): string {
  return t
    .replace(/\(\s*[,;:]?\s*\)/g, '')
    .replace(/\(\s*[,;:]\s*/g, '(')
    .replace(/[,;]\s*(?=[,;.)])/g, '')
    .replace(/:\s*(?=[.,;])/g, '')
    .replace(/\.(?:\s*\.)+/g, '.')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/[\s,;:]+$/, '')
    .replace(/^[\s,;:.]+/, '')
    .trim();
}

/**
 * Les textes des fiches citent parfois des codes de règle internes (R8, G4, S1...), des identifiants
 * de fiche ou de matériel : on retire le code et son habillage, jamais la phrase de sécurité qui l'entoure.
 * Seule une note interne (dev, coach, README...) sans aucun mot de sécurité est supprimée entière.
 */
export function cleanText(text: string, list: Fiche[] = []): string {
  let t = handleParens(text);
  t = t.replace(/,?\s*voir [A-Z]\d{1,2}\b/g, '');
  // « Post-partum : G7 (sans effet) » -> « Post-partum : sans effet » ; « Post-partum : G7. » -> rien à dire.
  t = t.replace(/Post-partum\s*:\s*[A-Z]\d{1,2}\s*(?:\(([^()]*)\)|,\s*)?/g, (_m, p?: string) => `Post-partum : ${p ?? ''}`);
  t = t.replace(/Post-partum\s*:\s*(?=[.;]|$)/g, '');
  t = t.replace(/[:,]?\s*\b[A-Z]\d{1,2}\b ne s['’]applique pas ici/g, '');
  t = t.replace(/,?\s*(?:limite|choix prudent)\s+NON SOURCÉ(?:ES?|S)?\.?/gi, '');
  t = t
    .split(/(?<=[.!?])\s+/)
    .filter((part) => !(METHOD_NOTE.test(part) && !SAFETY_WORD.test(part)))
    .join(' ');
  t = t.replace(/(?<![A-Za-zÀ-ÿ])(?:NON SOURCÉ(?:ES?|S)?|PROVISOIRES?)(?![A-Za-zÀ-ÿ])/g, '');
  t = t.replace(SNAKE, (_m, id: string) => {
    const lbl = TAG_LABEL[id] ?? MUSCLE_SHORT[id];
    return lbl ? lbl.replace(/^(?:un |une |des |du )/, '') : id.replace(/_/g, ' ');
  });
  t = t.replace(ID_LIKE, (id) => {
    const n = nameOfId(list, id);
    if (n) return `« ${n} »`;
    if (APPUI_LABEL[id]) return APPUI_LABEL[id];
    if (AMPLITUDE_LABEL[id]) return AMPLITUDE_LABEL[id];
    return id;
  });
  t = t.replace(/§\s*\d+(?:\.\d+)*/g, '');
  t = t.replace(CODE_G, ''); // code isolé resté dans le texte : retiré seul
  // Notes internes sans mot de sécurité : retirées entières.
  t = t
    .split(/(?<=[.!?])\s+/)
    .filter((part) => !(INTERNAL_WORD.test(part) && !SAFETY_WORD.test(part)))
    .join(' ');
  t = t.replace(/;\s*[^;.]*\bsourc[^;.]*/gi, ''); // « ; l'effet n'est pas sourcé ici » : clause de méthode
  t = t.replace(/photo de la source/gi, 'photo');
  t = t.replace(/,?\s*(?:non |aucune? )?(?:valeurs? )?sourcée?s?\b/gi, ''); // reste isolé dans une phrase de sécurité
  return tidy(t);
}
