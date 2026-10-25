// Nettoyage des textes PUBLICS des fiches à la génération : le fichier public/data/fiches.json ne contient aucune mention
// interne (coach, kine, codes de règle, numéros de question, statuts de source, noms de fichiers de travail).
// Réutilise cleanText (src/data/fiches.ts), empaqueté à la volée avec rolldown (déjà installé avec Vite).
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

/** Mots et codes qui ne doivent JAMAIS apparaître dans un texte public (utilisé aussi par le test). */
export const INTERNAL_MENTION =
  /\b(?:coach|kine|kiné|relecteur|dev)\b|\bQ\d{1,2}\b|QUESTIONS|NON SOURC|PROVISOIRE|sourcé|\.md\b|regles-securite|\b[GRSCMNBT]\d{1,2}\b|\bV-[A-Z]|knowledge\/|\blot-\d|README|extrapolation|[a-z]+-n[123]\s*:/i;

/** Champs texte d'une fiche publiée : [accès, écriture]. Les identifiants, tags et actions de sécurité ne sont jamais touchés. */
export function textFields(f) {
  const out = [];
  const list = (arr) => arr.forEach((_, i) => out.push([() => arr[i], (v) => (arr[i] = v)]));
  list(f.consignes);
  list(f.pointsAttention);
  list(f.erreursFrequentes);
  list(f.securite.signesArret);
  list(f.securite.objetsQuotidien);
  for (const v of f.variantes) out.push([() => v.installation, (x) => (v.installation = x)]);
  for (const k of Object.keys(f.securite.notes ?? {})) out.push([() => f.securite.notes[k], (x) => (f.securite.notes[k] = x)]);
  for (const im of f.images ?? []) if (im.legende) out.push([() => im.legende, (x) => (im.legende = x)]);
  return out;
}

const SAFE = /urgence|appelle|\b15\b|\b112\b|arrête|consulte|douleur|vertige|engourdissement|fourmillement|jamais|interdit|retiré|grossesse/i;
/** « , confirmé par kine », « choix de coach », « décision de kine 22/10/2026 » : attribution interne. */
const AUTEUR = /,?\s*(?:choix|décision|ajout|repris|corrigé|confirmé|signalé|rédigé)s?\s+(?:de|par)\s+(?:coach|kine|kiné|dev|relecteur)\b(?:,|\s+\d{1,2}\/\d{1,2}\/\d{4})?/gi;

/** Passe 1 (avant cleanText) : renvois à des fichiers de travail, auteurs, renvois entre notes. */
export function scrubRaw(text) {
  let t = text;
  t = t.replace(/\s*\([^()]*\.md[^()]*\)/gi, '');
  t = t.replace(/[:,;]?\s*(?:voir|cf\.?)\s+[^.;]*?\.md(?:\s*(?:,|et)\s*[\w-]+\.md)*/gi, '');
  t = t.replace(/\s*\([^()]*\b(?:coach|kine|kiné|relecteur|dev)\b[^()]*\)/gi, '');
  t = t.replace(AUTEUR, '');
  t = t.replace(/\s*\(voir questions\)/gi, '').replace(/\bmême raison que [a-z]+-n[123]\s*:\s*/gi, '');
  t = t.replace(/,?\s*choix prudent,?\s*extrapolation de.*$/i, '');
  t = t.replace(/(?:^|(?<=[.;]\s))[a-z]+(?:-[a-z]+)?-n[123](?:\s*(?:et|,)\s*[a-z]+-n[123])*\s*:\s*[^.;]*[.;]?/g, '');
  return t;
}

/** Passe 2 (après cleanText) : phrases de méthode, mots restants, mise en forme. */
export function scrubFinal(text) {
  const parts = text.split(/(?<=[.!?])\s+/).filter((x) => {
    if (/^Aucune (?:durée|valeur)\b/i.test(x.trim()) && !SAFE.test(x)) return false;
    if (/^(?:Cases? au moins|Conseil non codé)/i.test(x.trim())) return false;
    if (/\b(?:coach|kine|kiné|relecteur|dev)\b|README|knowledge\/|regles-securite|\.md\b|\blot-\d/i.test(x) && !SAFE.test(x)) return false;
    return true;
  });
  let t = parts.join(' ');
  t = t.replace(AUTEUR, '');
  t = t.replace(/\b(?:coach|kine|kiné|relecteur|dev)\b/gi, '').replace(/\bQ\d{1,2}\b/g, '');
  return t
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,)])/g, '$1')
    .replace(/[\s,;:]+$/, '')
    .replace(/^[\s,;:.]+/, '')
    .trim();
}

export async function loadCleanText(root) {
  const bundle = await rolldown({ input: join(root, 'src/data/fiches.ts'), platform: 'node', logLevel: 'silent' });
  const { output } = await bundle.generate({ format: 'esm' });
  return (await import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString('base64')}`)).cleanText;
}

/** Applique le nettoyage à tous les champs texte (en place) et renvoie les textes qui gardent une mention interne. */
export async function sanitizePublic(fiches, root = resolve(dirname(fileURLToPath(import.meta.url)), '..')) {
  const cleanText = await loadCleanText(root);
  const left = [];
  for (const f of fiches)
    for (const [get, set] of textFields(f)) {
      const before = get();
      if (typeof before !== 'string') continue;
      const after = scrubFinal(cleanText(scrubRaw(before), fiches));
      set(after);
      if (INTERNAL_MENTION.test(after)) left.push(`${f.id} : ${after.slice(0, 160)}`);
    }
  return left;
}
