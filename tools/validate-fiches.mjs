// Validation des fiches d'exercices : node tools/validate-fiches.mjs [dossier]
// Spécification : knowledge/format-fiches.md. Aucune dépendance (mini-parseur YAML du frontmatter).
// Sortie en français : fichier:ligne : [catégorie] problème. Code de sortie 1 s'il y a des erreurs.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { INTERNAL_MENTION, textFields } from './public-text.mjs';

export const SCHEMAS = ['squat', 'charniere', 'fente', 'poussee_h', 'poussee_v', 'tirage_h', 'tirage_v', 'gainage', 'anti_rotation', 'rotation', 'porte', 'saut', 'mobilite', 'cardio', 'cheville_mollet', 'hanche_laterale'];
export const TYPES = ['force', 'fonctionnel', 'gainage', 'mobilite_recup', 'cardio'];
export const NIVEAUX = ['debutant', 'intermediaire', 'avance'];
export const STATUTS = ['brouillon_coach', 'complete_kine', 'controle_relecteur', 'utilisable', 'verifie'];
export const MUSCLES = ['pectoraux', 'grand_dorsal', 'trapezes', 'rhomboides', 'dentele_anterieur', 'deltoides_anterieurs', 'deltoides_lateraux', 'deltoides_posterieurs', 'biceps', 'triceps', 'avant_bras', 'abdominaux', 'obliques', 'transverse', 'erecteurs_rachis', 'carre_des_lombes', 'fessiers', 'moyen_fessier', 'quadriceps', 'ischios', 'adducteurs', 'mollets', 'flechisseurs_hanche', 'coiffe_des_rotateurs', 'peroniers', 'tibial_anterieur'];
export const ZONES = ['cou', 'epaule', 'coude', 'poignet', 'dos', 'hanche', 'genou', 'cheville', 'cuisse', 'aine'];
export const AMPLITUDES = ['reduite', 'mi-course', 'sans-gene', 'maintien-court', 'sans-rotation', 'bras-bas', 'bras-au-sol', 'jambes-seules', 'tete-alignee', 'lente'];
export const APPUIS = ['coussin', 'serviette', 'poings-fermes', 'avant-bras', 'paumes-face-a-face', 'mains-vers-exterieur', 'main-sur-rampe', 'main-sur-support', 'mur', 'assise-rehaussee', 'pieds-ecartes', 'buste-redresse', 'charges-surelevees', 'premiere-marche', 'coudes-pres-du-corps', 'front-pose'];

export const VIDEO_MAX_BYTES = 500_000;
const SECTIONS = ['Variantes', 'Consignes', "Points d'attention", 'Erreurs fréquentes', 'Progression / régression', 'Repères de dosage', 'Sécurité et contre-indications', 'Photo', 'Sources'];
const VARIANT_COLUMNS = ['id variante', 'nom', 'echelon', 'niveau', 'materiel_tags', 'installation'];
const FM_REQUIRED = ['id', 'nom', 'schema', 'type', 'niveau_min', 'muscles_principaux', 'muscles_secondaires', 'source_brouillon', 'statut'];
const FM_OPTIONAL = ['couverture', 'doux_pour', 'alias'];
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const RANK = { garder: 0, adapter: 1, retirer: 2 };

export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Découpe une ligne de tableau Markdown en cellules (sans les barres extérieures). */
export function cells(line) {
  const t = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return t.split('|').map((c) => c.trim());
}
export const isSeparator = (line) => /^\|?\s*:?-{2,}/.test(line.trim());

/** Mini-parseur du frontmatter : `cle: valeur`, listes `[a, b]`, commentaires `# ...`. */
export function parseFrontmatter(lines) {
  const problems = [];
  if (lines[0]?.trim() !== '---') {
    problems.push({ line: 1, message: 'le fichier doit commencer par une ligne « --- » (frontmatter)' });
    return { data: {}, lineOf: {}, end: -1, problems };
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === '---') { end = i; break; }
  if (end < 0) {
    problems.push({ line: 1, message: 'frontmatter non fermé (ligne « --- » manquante)' });
    return { data: {}, lineOf: {}, end: -1, problems };
  }
  const data = {};
  const lineOf = {};
  for (let i = 1; i < end; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const m = raw.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) { problems.push({ line: i + 1, message: `ligne de frontmatter illisible : « ${raw.trim()} »` }); continue; }
    let v = m[2].replace(/\s+#.*$/, '').trim();
    if (m[1] in data) problems.push({ line: i + 1, message: `champ « ${m[1]} » répété` });
    lineOf[m[1]] = i + 1;
    if (v.startsWith('[')) {
      if (!v.endsWith(']')) { problems.push({ line: i + 1, message: `liste non fermée pour « ${m[1]} »` }); data[m[1]] = []; continue; }
      const inner = v.slice(1, -1).trim();
      data[m[1]] = inner === '' ? [] : inner.split(',').map((x) => x.trim().replace(/^["']|["']$/g, ''));
    } else {
      data[m[1]] = v.replace(/^["']|["']$/g, '');
    }
  }
  return { data, lineOf, end, problems };
}

/** Frontmatter d'un fichier de fiche (pour les tests et les outils). */
export function readFrontmatter(path) {
  return parseFrontmatter(readFileSync(path, 'utf8').replace(/\r\n/g, '\n').split('\n')).data;
}

/** Découpe le corps en sections `## titre`. */
export function splitSections(lines, from) {
  const secs = [];
  for (let i = from; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(.*?)\s*$/);
    if (m) secs.push({ title: m[1], start: i, lines: [], }); else if (secs.length) secs[secs.length - 1].lines.push({ n: i + 1, text: lines[i] });
  }
  return secs;
}

/** Analyse une case de sécurité. Retourne { rank, refs, error }. */
export function parseCase(cell) {
  const c = cell.trim();
  const refs = [];
  const bad = (error) => ({ rank: null, refs, error });
  if (c === 'garder') return { rank: 0, refs, error: null };
  if (c === 'retirer') return { rank: 2, refs, error: null, retirer: true };
  let m = c.match(/^retirer: (remplacant|sans-zone):(\S+)$/);
  if (m) {
    if (!ID_RE.test(m[2])) return bad(`identifiant invalide « ${m[2]} » (kebab-case ASCII attendu)`);
    refs.push({ type: m[1], id: m[2] });
    return { rank: 2, refs, error: null, retirer: true, sansZone: m[1] === 'sans-zone' };
  }
  m = c.match(/^adapter: (.+)$/);
  if (m) {
    const p = m[1];
    if (p === 'sans-charge') return { rank: 1, refs, error: null };
    if (p === 'charge:legere') return { rank: 1, refs, error: null };
    let mm = p.match(/^variante:(\S+)$/);
    if (mm) {
      if (!ID_RE.test(mm[1])) return bad(`identifiant invalide « ${mm[1]} » (kebab-case ASCII attendu)`);
      refs.push({ type: 'variante', id: mm[1] });
      return { rank: 1, refs, error: null };
    }
    mm = p.match(/^amplitude:(\S+)$/);
    if (mm) return AMPLITUDES.includes(mm[1]) ? { rank: 1, refs, error: null } : bad(`amplitude « ${mm[1]} » hors de la liste fermée (${AMPLITUDES.join(', ')})`);
    mm = p.match(/^appui:(\S+)$/);
    if (mm) return APPUIS.includes(mm[1]) ? { rank: 1, refs, error: null } : bad(`appui « ${mm[1]} » hors de la liste fermée (${APPUIS.join(', ')})`);
  }
  // Diagnostic lisible
  if (c === '') return bad('case vide (écrire garder, adapter: ... ou retirer)');
  if (/\(/.test(c)) return bad('texte entre parenthèses interdit dans une case : mettre la précision dans les Notes');
  if (/\bou\b/.test(c)) return bad('« ou » interdit : une case = une seule action');
  if (/,|;/.test(c)) return bad('plusieurs actions dans la même case : une case = une seule action (précision en Note, ou variante dédiée)');
  if (/^(adapter|retirer) :/.test(c)) return bad("pas d'espace avant les deux-points : écrire « adapter: ... » ou « retirer: ... »");
  const free = c.match(/^adapter\s*:\s*(appui|amplitude):(.+\s.+)$/);
  if (free) return bad(`valeur libre interdite pour ${free[1]} : choisir dans la liste fermée (précision en Note)`);
  if (/^garder\b/.test(c)) return bad('« garder » ne prend rien après (sinon c\'est « adapter: ... »)');
  if (/^(adapter|retirer)\s*:\S/.test(c) || /^(adapter|retirer)\s*:\s{2,}/.test(c)) return bad('écriture attendue : « adapter: <action> » avec un seul espace après les deux-points');
  if (/^adapter\s*:\s*\S+/.test(c)) return bad(`action inconnue « ${c} » (permis : variante:<id>, charge:legere, sans-charge, amplitude:<valeur>, appui:<valeur>)`);
  if (/légère|remplaçant/.test(c)) return bad('écrire sans accent : legere, remplacant');
  return bad(`case non conforme : « ${c} » (permis : garder | adapter: ... | retirer | retirer: remplacant:<id> | retirer: sans-zone:<id>)`);
}

/** Analyse une fiche. Retourne { fiche, issues } ; les références croisées sont vérifiées par checkLot. */
export function parseFiche(text, file) {
  const issues = [];
  const add = (line, categorie, message, severite = 'erreur') => issues.push({ file, line, categorie, message, severite });
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const fm = parseFrontmatter(lines);
  for (const p of fm.problems) add(p.line, 'frontmatter', p.message);
  const d = fm.data;
  const fiche = { file, id: d.id, statut: d.statut, niveauMin: d.niveau_min, douxPour: Array.isArray(d.doux_pour) ? d.doux_pour : [], variants: [], refs: [] };
  const addRef = (line, type, id) => fiche.refs.push({ line, type, id });

  // ---- Frontmatter
  if (fm.end >= 0) {
    for (const k of FM_REQUIRED) if (!(k in d)) add(1, 'frontmatter', `champ obligatoire manquant : ${k}`);
    for (const k of Object.keys(d)) if (!FM_REQUIRED.includes(k) && !FM_OPTIONAL.includes(k)) add(fm.lineOf[k], 'frontmatter', `champ inconnu : ${k}`);
    const L = (k) => fm.lineOf[k] ?? 1;
    const base = basename(file).replace(/\.md$/, '');
    if ('id' in d) {
      if (!ID_RE.test(d.id)) add(L('id'), 'frontmatter', `id invalide « ${d.id} » (kebab-case ASCII)`);
      if (d.id !== base) add(L('id'), 'frontmatter', `id « ${d.id} » différent du nom du fichier « ${base} »`);
    }
    if ('nom' in d && !d.nom) add(L('nom'), 'frontmatter', 'nom vide');
    const oneOf = (k, list) => {
      if (!(k in d)) return;
      if (typeof d[k] !== 'string' || !list.includes(d[k])) {
        const hint = typeof d[k] === 'string' && list.includes(norm(d[k])) ? ' (écrire sans accent)' : '';
        add(L(k), 'frontmatter', `${k} = « ${Array.isArray(d[k]) ? '[...]' : d[k]} » hors de la liste : ${list.join(', ')}${hint}`);
      }
    };
    oneOf('schema', SCHEMAS); oneOf('type', TYPES); oneOf('niveau_min', NIVEAUX); oneOf('statut', STATUTS);
    if ('couverture' in d && d.couverture !== 'substitut') add(L('couverture'), 'frontmatter', 'couverture : seule la valeur « substitut » est permise');
    if ('doux_pour' in d) {
      if (!Array.isArray(d.doux_pour)) add(L('doux_pour'), 'frontmatter', 'doux_pour doit être une liste entre crochets : [cou]');
      else if (d.doux_pour.length === 0) add(L('doux_pour'), 'frontmatter', 'doux_pour vide : retirer le champ');
      else {
        for (const z of d.doux_pour) if (!ZONES.includes(z)) add(L('doux_pour'), 'frontmatter', `doux_pour : zone « ${z} » hors de la liste : ${ZONES.join(', ')}`);
        if (new Set(d.doux_pour).size !== d.doux_pour.length) add(L('doux_pour'), 'frontmatter', 'doux_pour : zone répétée');
      }
    }
    const list = (k) => {
      if (!(k in d)) return null;
      if (!Array.isArray(d[k])) { add(L(k), 'frontmatter', `${k} doit être une liste entre crochets : [a, b]`); return null; }
      return d[k];
    };
    const mp = list('muscles_principaux'); const ms = list('muscles_secondaires'); const sb = list('source_brouillon');
    if (mp && mp.length === 0) add(L('muscles_principaux'), 'frontmatter', 'muscles_principaux ne peut pas être vide');
    for (const [k, arr] of [['muscles_principaux', mp], ['muscles_secondaires', ms]]) for (const m of arr ?? []) if (!MUSCLES.includes(m)) add(L(k), 'frontmatter', `muscle inconnu « ${m} » dans ${k}`);
    if (mp && ms) for (const m of ms) if (mp.includes(m)) add(L('muscles_secondaires'), 'frontmatter', `muscle « ${m} » à la fois principal et secondaire`);
    for (const s of sb ?? []) if (!/^M\d+$/.test(s)) add(L('source_brouillon'), 'frontmatter', `source_brouillon : « ${s} » n'est pas un identifiant M0000`);
  }

  // ---- Sections
  const secs = splitSections(lines, fm.end >= 0 ? fm.end + 1 : 0);
  const sec = (name) => secs.find((s) => s.title.startsWith(name));
  for (const name of SECTIONS) if (!sec(name)) add(1, 'structure', `section obligatoire manquante : « ${name} »`);

  // ---- Variantes
  const sv = sec('Variantes');
  if (sv) {
    const rows = sv.lines.filter((l) => l.text.trim().startsWith('|'));
    if (rows.length === 0) add(sv.start + 1, 'variantes', 'aucun tableau des variantes');
    else {
      const head = cells(rows[0].text).map((c) => c.toLowerCase());
      if (head.join('|') !== VARIANT_COLUMNS.join('|')) add(rows[0].n, 'variantes', `colonnes attendues dans cet ordre : ${VARIANT_COLUMNS.join(' | ')}`);
      else {
        const data = rows.slice(1).filter((r) => !isSeparator(r.text));
        if (data.length === 0) add(rows[0].n, 'variantes', 'le tableau des variantes est vide');
        let prevEch = 0; let prevNiv = -1; const seen = new Set();
        data.forEach((r, idx) => {
          const c = cells(r.text);
          if (c.length !== 6) { add(r.n, 'variantes', `${c.length} colonnes au lieu de 6`); return; }
          const [id, nom, ech, niv, tagsCell, inst] = c;
          if (!ID_RE.test(id)) add(r.n, 'variantes', `id variante invalide « ${id} » (kebab-case ASCII)`);
          if (seen.has(id)) add(r.n, 'variantes', `id variante « ${id} » répété dans la fiche`);
          seen.add(id);
          if (!nom) add(r.n, 'variantes', 'nom vide');
          if (!inst) add(r.n, 'variantes', 'installation vide');
          let e = null;
          if (!/^[1-9]\d*$/.test(ech)) add(r.n, 'variantes', `echelon « ${ech} » : entier ≥ 1 attendu`);
          else {
            e = Number(ech);
            if (idx === 0 && e !== 1) add(r.n, 'variantes', 'le premier echelon doit être 1');
            else if (idx > 0 && e !== prevEch && e !== prevEch + 1) add(r.n, 'variantes', `echelon ${e} après ${prevEch} : même échelon ou +1 seulement`);
            prevEch = e;
          }
          const ni = NIVEAUX.indexOf(niv);
          if (ni < 0) add(r.n, 'variantes', `niveau « ${niv} » hors de la liste : ${NIVEAUX.join(', ')}${NIVEAUX.includes(norm(niv)) ? ' (écrire sans accent)' : ''}`);
          else {
            if (ni < prevNiv) add(r.n, 'variantes', `niveau « ${niv} » plus bas que la variante précédente`);
            if (idx === 0 && d.niveau_min && NIVEAUX.includes(d.niveau_min) && niv !== d.niveau_min) add(r.n, 'variantes', `niveau de l'échelon 1 (« ${niv} ») différent de niveau_min (« ${d.niveau_min} »)`);
            prevNiv = ni;
          }
          const tags = tagsCell.split(',').map((t) => t.trim()).filter(Boolean);
          if (tags.length === 0) add(r.n, 'tags', 'materiel_tags vide (écrire poids_du_corps si aucun matériel)');
          fiche.variants.push({ id, line: r.n, tags });
        });
      }
    }
  }

  // ---- Consignes
  const sc = sec('Consignes');
  if (sc) {
    const n = sc.lines.filter((l) => /^\d+\.\s/.test(l.text)).length;
    if (n < 4 || n > 6) add(sc.start + 1, 'structure', `Consignes : ${n} étape(s) numérotée(s), 4 à 6 attendues`);
  }

  // ---- Progression
  const sp = sec('Progression');
  if (sp) {
    for (const key of ['plus-facile', 'plus-dur']) {
      const re = new RegExp(`^\\s*[-*]?\\s*${key}\\s*:\\s*(.*)$`, 'i');
      const l = sp.lines.find((x) => re.test(x.text));
      if (!l) { add(sp.start + 1, 'progression', `ligne « - ${key} : <ids séparés par des virgules | aucun> » manquante`); continue; }
      const val = l.text.match(re)[1].trim();
      if (val === '' ) { add(l.n, 'progression', `${key} vide (écrire aucun)`); continue; }
      if (val === 'aucun') continue;
      for (const raw of val.split(',').map((x) => x.trim())) {
        const am = raw.match(/^a-creer:(\S+)$/);
        if (am) { add(l.n, 'progression', `${key} : « ${am[1]} » est à créer (fiche pas encore écrite)`, 'avertissement'); continue; }
        if (!ID_RE.test(raw)) { add(l.n, 'progression', `${key} : « ${raw} » n'est pas un identifiant (kebab-case ASCII, ou a-creer:<id>)`); continue; }
        addRef(l.n, 'progression', raw);
      }
    }
  }

  // ---- Sécurité
  const ss = sec('Sécurité');
  if (ss) {
    const rows = ss.lines.filter((l) => l.text.trim().startsWith('|'));
    const hi = rows.findIndex((r) => norm(cells(r.text)[0] ?? '') === 'zone');
    if (hi < 0) add(ss.start + 1, 'securite', 'tableau « | Zone | Niveau 1 | Niveau 2 | Niveau 3 | » manquant');
    else {
      const head = cells(rows[hi].text).map((c) => norm(c));
      if (head.join('|') !== 'zone|niveau 1|niveau 2|niveau 3') add(rows[hi].n, 'securite', 'en-tête attendu : | Zone | Niveau 1 | Niveau 2 | Niveau 3 |');
      const seenZ = new Set(); const ranksByZone = {};
      for (const r of rows.slice(hi + 1)) {
        if (isSeparator(r.text)) continue;
        const c = cells(r.text);
        if (c.length !== 4) { add(r.n, 'securite', `${c.length} colonnes au lieu de 4`); continue; }
        const z = norm(c[0]);
        if (!ZONES.includes(z)) add(r.n, 'securite', `zone « ${c[0]} » : une seule zone par ligne, parmi ${ZONES.join(', ')}`);
        else if (seenZ.has(z)) add(r.n, 'securite', `zone « ${c[0]} » en double`);
        seenZ.add(z);
        let prev = -1; ranksByZone[z] = [];
        c.slice(1).forEach((cell, i) => {
          const niveau = i + 1;
          const pc = parseCase(cell);
          ranksByZone[z].push(pc.rank);
          if (pc.error) { add(r.n, 'securite', `${c[0]} niveau ${niveau} : ${pc.error}`); return; }
          for (const ref of pc.refs) addRef(r.n, ref.type, ref.id);
          if (niveau === 3 && !pc.retirer) add(r.n, 'securite', `${c[0]} niveau 3 : toujours « retirer » (règle R3), pas « ${cell} »`);
          if (niveau !== 3 && pc.sansZone) add(r.n, 'securite', `${c[0]} niveau ${niveau} : sans-zone n'existe qu'au niveau 3`);
          if (pc.rank < prev) add(r.n, 'securite', `${c[0]} niveau ${niveau} : moins prudent que le niveau précédent`);
          prev = Math.max(prev, pc.rank);
        });
      }
      for (const z of fiche.douxPour) {
        const rk = ranksByZone[z];
        if (!rk) add(rows[hi].n, 'securite', `doux_pour : « ${z} » n'a pas de ligne dans le tableau zone x niveau`);
        else if (rk[0] === 2 || rk[1] === 2) add(rows[hi].n, 'securite', `doux_pour : une fiche douce pour « ${z} » ne peut pas être retirée aux niveaux 1 ou 2`);
      }
    }
    const gl = ss.lines.find((l) => /^\*\*Grossesse\*\*/.test(l.text.trim()));
    if (!gl) add(ss.start + 1, 'securite', 'ligne « **Grossesse** : <case> » manquante');
    else {
      const m = gl.text.trim().match(/^\*\*Grossesse\*\*\s*:\s*(.*)$/);
      if (!m) add(gl.n, 'securite', 'écriture attendue : « **Grossesse** : <case> » (pas de texte entre « Grossesse » et les deux-points)');
      else {
        const pc = parseCase(m[1]);
        if (pc.error) add(gl.n, 'securite', `Grossesse : ${pc.error}`);
        else for (const ref of pc.refs) addRef(gl.n, ref.type, ref.id);
      }
    }
    const vl = ss.lines.find((l) => /^\*\*Version plus douce\*\*/.test(l.text.trim()));
    if (!vl) add(ss.start + 1, 'securite', 'ligne « **Version plus douce** : <id | aucune> » manquante');
    else {
      const m = vl.text.trim().match(/^\*\*Version plus douce\*\*\s*:\s*(\S+)\s*$/);
      if (!m) add(vl.n, 'securite', 'écriture attendue : « **Version plus douce** : <id> » ou « aucune » (une précision va dans les Notes)');
      else if (m[1] !== 'aucune') {
        if (!ID_RE.test(m[1])) add(vl.n, 'securite', `Version plus douce : « ${m[1]} » n'est pas un identifiant`);
        else addRef(vl.n, 'version-plus-douce', m[1]);
      }
    }
    const ni = ss.lines.findIndex((l) => /^\*\*Notes\*\*/.test(l.text.trim()));
    if (ni >= 0) {
      for (const l of ss.lines.slice(ni + 1)) {
        if (!/^\s*[-*]\s/.test(l.text)) { if (l.text.trim() === '' || /^\*\*/.test(l.text.trim())) break; continue; }
        const m = l.text.match(/^\s*[-*]\s*([a-z]+(?:-n[123])?)\s*:\s*\S/);
        const cible = m?.[1];
        const ok = cible && (cible === 'grossesse' || cible === 'general' || ZONES.includes(cible.replace(/-n[123]$/, '')) && /-n[123]$/.test(cible));
        if (!ok) add(l.n, 'securite', 'note : écriture attendue « - <zone>-n<1|2|3> : texte » (ou grossesse, general)');
      }
    }
  }

  // ---- Photo
  const sph = sec('Photo');
  fiche.photos = [];
  if (sph) {
    const bullets = sph.lines.filter((l) => /^\s*[-*]\s/.test(l.text));
    if (bullets.length === 0) add(sph.start + 1, 'photo', 'aucune ligne : écrire une ligne par image, ou « - aucune photo »');
    for (const l of bullets) {
      if (/^\s*[-*]\s*aucune photo\b/i.test(l.text)) continue;
      // Légende affichable sous les images de la fiche : « - légende : <texte> » (une seule, 120 caractères au plus)
      const lg = l.text.match(/^\s*[-*]\s*l[ée]gende\s*:\s*(.*?)\s*$/i);
      if (lg) {
        if (!lg[1]) add(l.n, 'photo', 'légende vide : « - légende : <texte> »');
        else if (lg[1].length > 120) add(l.n, 'photo', `légende trop longue (${lg[1].length} caractères, 120 au plus)`);
        else if (fiche.legende) add(l.n, 'photo', 'une seule légende par fiche');
        else fiche.legende = lg[1];
        continue;
      }
      // Illustration originale de l'app : « - illustration : public/illustrations/<id>.svg : affichable : oui (raison) »
      const il = l.text.match(/^\s*[-*]\s*illustration\s*:\s*(public\/illustrations\/([a-z0-9]+(?:-[a-z0-9]+)*)\.svg)\s*:\s*affichable\s*:\s*(oui|non|à vérifier|a verifier)\b\s*(?:\((.+)\))?\s*\.?\s*$/);
      if (il) {
        if (il[3] !== 'oui' && !il[4]) add(l.n, 'photo', `« ${il[3]} » demande une raison entre parenthèses`);
        if (fm.data.id && il[2] !== fm.data.id) add(l.n, 'photo', `illustration « ${il[2]}.svg » : le fichier doit porter l'id de la fiche (« ${fm.data.id} »)`);
        fiche.photos.push({ line: l.n, path: il[1], statut: il[3] === 'a verifier' ? 'à vérifier' : il[3], illustration: true });
        continue;
      }
      const m =l.text.match(/^\s*[-*]\s*`([^`]+)`\s*:\s*affichable\s*:\s*(oui|non|à vérifier|a verifier)\b\s*(?:\((.+)\))?\s*\.?\s*$/);
      if (!m) { add(l.n, 'photo', 'écriture attendue : « - `Dossier/0.jpg` : affichable : oui | non (raison) | à vérifier (raison) » ou « - illustration : public/illustrations/<id>.svg : affichable : oui (illustration originale de l\'app) »'); continue; }
      if (!/^[A-Za-z0-9_\-]+\/\d+\.jpg$/.test(m[1])) add(l.n, 'photo', `chemin d'image « ${m[1]} » : attendu Dossier/<n>.jpg`);
      if (m[2] !== 'oui' && !m[3]) add(l.n, 'photo', `« ${m[2]} » demande une raison entre parenthèses`);
      fiche.photos.push({ line: l.n, path: m[1], statut: m[2] === 'a verifier' ? 'à vérifier' : m[2] });
    }
  }

  // ---- Vidéo (facultative, décision D12) : « - video : youtube:<id> | <chaîne> | vérifiée le AAAA-MM-JJ »
  // ou « - video : fichier:<nom>.mp4 | <auteur> | ajoutée le AAAA-MM-JJ » (fichier dans public/videos/) ; « - aucune vidéo ».
  const sv2 = sec('Vidéo');
  fiche.videos = [];
  if (sv2) {
    const bullets = sv2.lines.filter((l) => /^\s*[-*]\s/.test(l.text));
    if (bullets.length === 0) add(sv2.start + 1, 'video', 'aucune ligne : écrire « - video : ... » ou « - aucune vidéo »');
    for (const l of bullets) {
      if (/^\s*[-*]\s*aucune vid[ée]o/i.test(l.text)) continue;
      const m = l.text.match(/^\s*[-*]\s*video\s*:\s*(youtube|fichier)\s*:\s*([^|\s]+)\s*\|\s*([^|]+?)\s*\|\s*(?:v[ée]rifi[ée]e|ajout[ée]e)\s+le\s+(\d{4}-\d{2}-\d{2})\s*$/);
      if (!m) { add(l.n, 'video', "écriture attendue : « - video : youtube:<id> | <chaîne> | vérifiée le AAAA-MM-JJ » ou « - video : fichier:<nom>.mp4 | <auteur> | ajoutée le AAAA-MM-JJ »"); continue; }
      const [, kind, ref, who, date] = m;
      if (Number.isNaN(Date.parse(date))) add(l.n, 'video', `date « ${date} » invalide`);
      if (kind === 'youtube') {
        if (!/^[A-Za-z0-9_-]{11}$/.test(ref)) add(l.n, 'video', `identifiant YouTube « ${ref} » : 11 caractères (lettres, chiffres, - et _) attendus`);
      } else {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.mp4$/.test(ref)) add(l.n, 'video', `fichier « ${ref} » : nom en kebab-case, extension .mp4`);
      }
      fiche.videos.push({ line: l.n, kind, ref, who, date });
    }
  }

  // ---- Sources
  const ssr = sec('Sources');
  if (ssr) {
    const rows = ssr.lines.filter((l) => l.text.trim().startsWith('|'));
    if (rows.length === 0) add(ssr.start + 1, 'sources', 'tableau des sources manquant');
    else {
      const head = cells(rows[0].text).map((c) => norm(c));
      const si = head.indexOf('statut');
      if (si < 0) add(rows[0].n, 'sources', 'colonne « Statut » manquante');
      else {
        const data = rows.slice(1).filter((r) => !isSeparator(r.text));
        if (data.length === 0) add(rows[0].n, 'sources', 'aucune ligne de source');
        for (const r of data) {
          const c = cells(r.text);
          if (c.length !== head.length) { add(r.n, 'sources', `${c.length} colonnes au lieu de ${head.length}`); continue; }
          if (!/\bOK\b|PROVISOIRE|NON SOURC[ÉE]/.test(c[si])) add(r.n, 'sources', 'statut absent : OK, PROVISOIRE ou NON SOURCÉ attendu');
        }
      }
    }
  }
  return { fiche, issues };
}

/** Valide un lot : files = [{ name, text }] ; options = { tags: { ids:Set, remplaces:{} }, photosDir? }. */
export function validateLot(files, options = {}) {
  const issues = [];
  const parsed = files.map((f) => parseFiche(f.text, f.name));
  for (const p of parsed) issues.push(...p.issues);
  const fichesById = new Map();
  const variantOwner = new Map();
  for (const { fiche } of parsed) {
    if (fiche.id) {
      if (fichesById.has(fiche.id)) issues.push({ file: fiche.file, line: 1, categorie: 'ids', severite: 'erreur', message: `id de fiche « ${fiche.id} » déjà pris par ${fichesById.get(fiche.id)}` });
      else fichesById.set(fiche.id, fiche.file);
    }
  }
  for (const { fiche } of parsed) {
    for (const v of fiche.variants) {
      if (variantOwner.has(v.id)) issues.push({ file: fiche.file, line: v.line, categorie: 'ids', severite: 'erreur', message: `id variante « ${v.id} » déjà pris dans ${variantOwner.get(v.id)}` });
      else variantOwner.set(v.id, fiche.file);
      if (fichesById.has(v.id) && fichesById.get(v.id) !== fiche.file) issues.push({ file: fiche.file, line: v.line, categorie: 'ids', severite: 'erreur', message: `id variante « ${v.id} » identique à l'id de la fiche ${fichesById.get(v.id)} (ambigu)` });
    }
  }
  const known = (id) => fichesById.has(id) || variantOwner.has(id);
  for (const { fiche } of parsed) {
    for (const r of fiche.refs) {
      if (!known(r.id)) issues.push({ file: fiche.file, line: r.line, categorie: 'ids', severite: 'erreur', message: `${r.type} : id « ${r.id} » introuvable dans le lot (ni fiche ni variante)` });
    }
    if (options.tags) {
      for (const v of fiche.variants) for (const t of v.tags) {
        if (options.tags.ids.has(t)) continue;
        const rep = options.tags.remplaces?.[t];
        issues.push({ file: fiche.file, line: v.line, categorie: 'tags', severite: 'erreur', message: rep ? `tag « ${t} » remplacé par « ${rep} »` : `tag de matériel inconnu « ${t} » (voir knowledge/materiel-tags.json)` });
      }
    }
    if (['utilisable', 'verifie'].includes(fiche.statut) && !fiche.photos.some((ph) => ph.statut === 'oui')) {
      issues.push({ file: fiche.file, line: 1, categorie: 'image', severite: 'erreur', message: `fiche ${fiche.statut} sans image « affichable : oui » (photo libre ou illustration originale, décision D6)` });
    }
    if (options.illustrationsDir) {
      for (const ph of fiche.photos) {
        if (ph.illustration && ph.statut === 'oui' && !existsSync(join(options.illustrationsDir, basename(ph.path)))) {
          issues.push({ file: fiche.file, line: ph.line, categorie: 'photo', severite: 'erreur', message: `illustration « oui » sans fichier : ${ph.path} (lancer node tools/make-illustrations.mjs)` });
        }
      }
    }
    if (options.videosDir) {
      for (const v of fiche.videos) {
        if (v.kind !== 'fichier' || !/^[a-z0-9]+(?:-[a-z0-9]+)*\.mp4$/.test(v.ref)) continue;
        const p = join(options.videosDir, v.ref);
        if (!existsSync(p)) issues.push({ file: fiche.file, line: v.line, categorie: 'video', severite: 'erreur', message: `fichier vidéo absent : public/videos/${v.ref}` });
        else if (statSync(p).size > VIDEO_MAX_BYTES) issues.push({ file: fiche.file, line: v.line, categorie: 'video', severite: 'erreur', message: `fichier vidéo trop lourd : ${Math.round(statSync(p).size / 1024)} Ko (maximum ${VIDEO_MAX_BYTES / 1000} Ko)` });
      }
    }
    if (options.photosDir) {
      for (const ph of fiche.photos) {
        if (ph.statut !== 'oui' || ph.illustration) continue;
        const [dir, f] = ph.path.split('/');
        const webp = join(options.photosDir, `${dir}-${f.replace(/\.jpg$/, '')}.webp`);
        if (!existsSync(webp)) issues.push({ file: fiche.file, line: ph.line, categorie: 'photo', severite: 'avertissement', message: `photo « oui » sans fichier WebP : ${basename(webp)}` });
      }
    }
  }
  issues.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  return { issues, errors: issues.filter((i) => i.severite === 'erreur'), warnings: issues.filter((i) => i.severite !== 'erreur') };
}

export function loadTags(path) {
  const j = JSON.parse(readFileSync(path, 'utf8'));
  return { ids: new Set(j.tags.map((t) => t.id)), remplaces: j.remplaces ?? {} };
}

/** Liste récursive des fiches sous dir (exclut ecartees/, README, CONTROLE/RECONTROLE, fichiers non-fiches). Noms relatifs à dir. */
export function listFiches(dir) {
  const out = [];
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== 'ecartees' && !e.name.startsWith('.')) walk(join(d, e.name), rel ? rel + '/' + e.name : e.name); continue; }
      if (!e.name.endsWith('.md') || e.name === 'README.md' || e.name === 'CAMPAGNE.md' || e.name === 'DECISIONS-utilisateur.md' || e.name === 'BILAN.md' || e.name === 'BILAN-campagne.md' || /^(RE)?CONTROLE-.*relecteur.*\.md$/.test(e.name)) continue;
      out.push(rel ? rel + '/' + e.name : e.name);
    }
  };
  walk(dir, '');
  return out.sort();
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const dir = resolve(process.argv[2] ?? join(root, 'knowledge', 'exercices'));
  const names = listFiches(dir);
  const files = names.map((n) => ({ name: n, text: readFileSync(join(dir, n), 'utf8') }));
  const tags = loadTags(join(root, 'knowledge', 'materiel-tags.json'));
  const { issues, errors, warnings } = validateLot(files, { tags, photosDir: join(root, 'public', 'photos', 'free-exercise-db'), illustrationsDir: join(root, 'public', 'illustrations'), videosDir: join(root, 'public', 'videos') });
  for (const i of issues) console.log(`${i.file}:${i.line} : [${i.categorie}]${i.severite === 'erreur' ? '' : ' (avertissement)'} ${i.message}`);
  const byCat = {}; const byFile = {};
  for (const e of errors) { byCat[e.categorie] = (byCat[e.categorie] ?? 0) + 1; byFile[e.file] = (byFile[e.file] ?? 0) + 1; }
  // Fichier PUBLIC généré (public/data/fiches.json) : aucune mention interne (rédacteurs, codes de règle, numéros de question, statuts de source).
  const pub = join(root, 'public', 'data', 'fiches.json');
  if (existsSync(pub)) {
    for (const f of JSON.parse(readFileSync(pub, 'utf8')).fiches ?? [])
      for (const [get] of textFields(f)) {
        const t = get();
        if (typeof t === 'string' && INTERNAL_MENTION.test(t)) {
          errors.push({ file: `public/data/fiches.json (${f.id})`, categorie: 'mention-interne-publique' });
          console.log(`public/data/fiches.json : [mention-interne-publique] ${f.id} : ${t.slice(0, 120)}`);
        }
      }
  }
  console.log(`\n${files.length} fiche(s) contrôlée(s) : ${errors.length} erreur(s), ${warnings.length} avertissement(s).`);
  if (errors.length) {
    console.log('Erreurs par catégorie : ' + Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '));
    console.log('Fiches les plus touchées : ' + Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k} (${v})`).join(', '));
    process.exit(1);
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) main();
