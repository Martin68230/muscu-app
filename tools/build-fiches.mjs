// F0 : transforme les fiches `utilisable` et `verifie` (et elles seules) de knowledge/exercices/**
// en un JSON statique lu par l'app : public/data/fiches.json (précaché par le service worker => hors-ligne).
// Usage : node tools/build-fiches.mjs   (branché dans `npm run build`)
// Réutilise le parseur de tools/validate-fiches.mjs ; ne contient aucune valeur sport/santé :
// il recopie ce que les fiches disent, rien d'autre.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cells, isSeparator, listFiches, norm, parseCase, parseFiche, splitSections, parseFrontmatter } from './validate-fiches.mjs';

export const USABLE_STATUTS = ['utilisable', 'verifie'];

const clean = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();

/** Case de sécurité -> objet structuré (le générateur n'a pas à relire du texte). */
export function structCase(raw) {
  const pc = parseCase(raw);
  if (pc.error) throw new Error(`case illisible « ${raw} » : ${pc.error}`);
  const c = raw.trim();
  if (c === 'garder') return { action: 'garder' };
  if (c === 'retirer') return { action: 'retirer' };
  let m = c.match(/^retirer: (remplacant|sans-zone):(\S+)$/);
  if (m) return m[1] === 'remplacant' ? { action: 'retirer', remplacant: m[2] } : { action: 'retirer', sansZone: m[2] };
  m = c.match(/^adapter: (.+)$/);
  const p = m[1];
  if (p === 'sans-charge') return { action: 'adapter', sansCharge: true };
  if (p === 'charge:legere') return { action: 'adapter', charge: 'legere' };
  const [k, v] = [p.slice(0, p.indexOf(':')), p.slice(p.indexOf(':') + 1)];
  return { action: 'adapter', [k]: v };
}

function bullets(lines) {
  return lines.filter((l) => /^\s*[-*]\s/.test(l.text)).map((l) => clean(l.text.replace(/^\s*[-*]\s*/, '')));
}

/** Lignes qui suivent un titre en gras `**Titre**` jusqu'au prochain titre en gras. */
function boldBlock(lines, title) {
  const i = lines.findIndex((l) => l.text.trim().startsWith(`**${title}`));
  if (i < 0) return [];
  const out = [];
  for (const l of lines.slice(i + 1)) {
    if (/^\*\*[^*]+\*\*/.test(l.text.trim())) break;
    out.push(l);
  }
  return out;
}

/** Une fiche (texte) -> objet de l'app. Suppose la fiche déjà validée (check:fiches). */
export function buildFiche(text, file, { publicDir } = {}) {
  const { fiche } = parseFiche(text, file);
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const fm = parseFrontmatter(lines);
  const d = fm.data;
  const secs = splitSections(lines, fm.end + 1);
  const sec = (name) => secs.find((s) => s.title.startsWith(name));

  // Variantes
  const variantes = [];
  for (const r of sec('Variantes').lines.filter((l) => l.text.trim().startsWith('|')).slice(1)) {
    if (isSeparator(r.text)) continue;
    const [id, nom, ech, niveau, tags, installation] = cells(r.text);
    variantes.push({ id, nom, echelon: Number(ech), niveau, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), installation });
  }

  const consignes = sec('Consignes').lines.filter((l) => /^\d+\.\s/.test(l.text)).map((l) => clean(l.text.replace(/^\d+\.\s*/, '')));
  const pointsAttention = bullets(sec("Points d'attention").lines);

  // Sécurité
  const ss = sec('Sécurité').lines;
  const rows = ss.filter((l) => l.text.trim().startsWith('|'));
  const hi = rows.findIndex((r) => norm(cells(r.text)[0] ?? '') === 'zone');
  const zones = {};
  for (const r of rows.slice(hi + 1)) {
    if (isSeparator(r.text)) continue;
    const c = cells(r.text);
    zones[norm(c[0])] = c.slice(1).map(structCase);
  }
  const grossesse = structCase(ss.find((l) => /^\*\*Grossesse\*\*/.test(l.text.trim())).text.trim().match(/^\*\*Grossesse\*\*\s*:\s*(.*)$/)[1]);
  const vpd = ss.find((l) => /^\*\*Version plus douce\*\*/.test(l.text.trim())).text.trim().match(/^\*\*Version plus douce\*\*\s*:\s*(\S+)/)[1];
  const notes = {};
  for (const l of boldBlock(ss, 'Notes')) {
    const m = l.text.match(/^\s*[-*]\s*([a-z]+(?:-n[123])?)\s*:\s*(.+)$/);
    if (m) notes[m[1]] = clean(m[2]);
  }
  const signesArret = bullets(boldBlock(ss, 'Signes qui doivent faire arrêter'));
  const objetsQuotidien = bullets(boldBlock(ss, 'Objets du quotidien'));

  // Images affichables seulement (statut « oui », fichier présent)
  const images = [];
  const missing = [];
  for (const ph of fiche.photos) {
    if (ph.statut !== 'oui') continue;
    let src;
    if (ph.illustration) src = ph.path.replace(/^public\//, '');
    else {
      const [dir, f] = ph.path.split('/');
      src = `photos/free-exercise-db/${dir}-${f.replace(/\.jpg$/, '')}.webp`;
    }
    if (publicDir && !existsSync(join(publicDir, src))) { missing.push(src); continue; }
    images.push({ type: ph.illustration ? 'illustration' : 'photo', src, ...(fiche.legende ? { legende: fiche.legende } : {}) });
  }

  const v = fiche.videos?.[0];
  const out = {
    id: d.id,
    nom: d.nom,
    schema: d.schema,
    type: d.type,
    niveauMin: d.niveau_min,
    statut: d.statut,
    musclesPrincipaux: d.muscles_principaux,
    musclesSecondaires: d.muscles_secondaires,
    ...(d.couverture ? { couverture: d.couverture } : {}),
    douxPour: d.doux_pour ?? [],
    variantes,
    consignes,
    pointsAttention,
    securite: { zones, grossesse, versionPlusDouce: vpd === 'aucune' ? null : vpd, signesArret, objetsQuotidien, notes },
    images,
    video: v ? { kind: v.kind, ref: v.ref } : null,
  };
  return { fiche: out, missing };
}

/** Construit toutes les fiches utilisables d'un dossier. */
export function buildAll(dir, publicDir) {
  const fiches = [];
  const warnings = [];
  for (const name of listFiches(dir)) {
    const text = readFileSync(join(dir, name), 'utf8');
    const statut = parseFrontmatter(text.replace(/\r\n/g, '\n').split('\n')).data.statut;
    if (!USABLE_STATUTS.includes(statut)) continue;
    const { fiche, missing } = buildFiche(text, name, { publicDir });
    for (const m of missing) warnings.push(`${name} : image absente de public/ : ${m}`);
    fiches.push(fiche);
  }
  fiches.sort((a, b) => a.id.localeCompare(b.id));
  return { fiches, warnings };
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const publicDir = join(root, 'public');
  const { fiches, warnings } = buildAll(join(root, 'knowledge', 'exercices'), publicDir);
  const outDir = join(publicDir, 'data');
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, 'fiches.json');
  writeFileSync(file, JSON.stringify({ format: 'muscu-app-fiches', version: 1, fiches }));
  for (const w of warnings) console.warn(`(avertissement) ${w}`);
  const kb = Math.round(readFileSync(file).length / 1024);
  console.log(`fiches.json : ${fiches.length} fiche(s), ${kb} Ko -> public/data/fiches.json`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) main();
