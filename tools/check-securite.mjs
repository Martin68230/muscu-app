// Contrôles de sécurité automatiques (docs/securite.md) : bloquant dans .github/workflows/deploy.yml.
//  1. secrets dans l'historique git ;  2. fonctions dangereuses (XSS) dans src/ et index.html ;  3. npm audit (graves et critiques).
// Usage : npm run check:securite
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];

// ---- 1. Secrets dans l'historique (lignes ajoutées seulement) ----
const SECRET_PATTERNS = [
  ['clé privée', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['clé AWS', /\bAKIA[0-9A-Z]{16}\b/],
  ['clé GitHub', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ['clé Slack', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['clé API (sk-)', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['clé Google', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['clé service_role Supabase', /service[_-]?role(?:[_-]?key)?\s*[:=]\s*['"]?[A-Za-z0-9._-]{20,}/i],
  ['mot de passe en clair', /\b(?:password|passwd|secret|api[_-]?key)\s*[:=]\s*['"][^'"\s]{8,}['"]/i],
];
const JWT = /\beyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}/g;

function isGit() {
  return spawnSync('git', ['rev-parse', '--git-dir'], { cwd: root }).status === 0;
}

if (isGit()) {
  const log = spawnSync('git', ['log', '--all', '-p', '--no-color', '--unified=0', '--format=commit %h'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 1024,
  });
  if (log.status !== 0) problems.push(`historique git illisible : ${log.stderr?.slice(0, 200)}`);
  else {
    let commit = '?';
    let file = '?';
    for (const line of log.stdout.split('\n')) {
      if (line.startsWith('commit ')) commit = line.slice(7).trim();
      else if (line.startsWith('+++ ')) file = line.slice(4).trim();
      else if (line.startsWith('+') && !/^\+\+\+/.test(line)) {
        if (line.length > 4000) continue; // JSON de données, pas de secret
        for (const [name, re] of SECRET_PATTERNS) {
          if (re.test(line)) problems.push(`secret possible (${name}) : commit ${commit}, ${file}`);
        }
        for (const m of line.matchAll(JWT)) {
          try {
            const payload = JSON.parse(Buffer.from(m[1], 'base64url').toString('utf8'));
            if (payload.role && payload.role !== 'anon') problems.push(`jeton non « anon » (${payload.role}) : commit ${commit}, ${file}`);
          } catch {
            /* pas un vrai jeton */
          }
        }
      }
    }
  }
} else {
  console.log('(historique git absent : contrôle des secrets ignoré)');
}

// ---- 2. Fonctions dangereuses dans src/ et index.html ----
const SINKS = [
  [/\.innerHTML\b/, 'innerHTML'],
  [/\.outerHTML\b/, 'outerHTML'],
  [/\binsertAdjacentHTML\b/, 'insertAdjacentHTML'],
  [/\bdocument\.write(?:ln)?\s*\(/, 'document.write'],
  [/\beval\s*\(/, 'eval'],
  [/\bnew\s+Function\b/, 'new Function'],
  [/\bdangerouslySetInnerHTML\b/, 'dangerouslySetInnerHTML'],
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|jsx?|mjs|html)$/.test(name)) out.push(p);
  }
  return out;
}

for (const file of [...walk(join(root, 'src')), join(root, 'index.html')]) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return; // commentaires
    for (const [re, name] of SINKS) {
      if (re.test(line)) problems.push(`${name} interdit : ${file.slice(root.length + 1)}:${i + 1}`);
    }
  });
}

// ---- 3. Dépendances ----
const audit = spawnSync('npm audit --audit-level=high', { cwd: root, encoding: 'utf8', shell: true });
if (audit.status !== 0) problems.push(`npm audit : vulnérabilité grave ou critique (ou audit impossible)\n${(audit.stdout + audit.stderr).split('\n').slice(0, 12).join('\n')}`);

if (problems.length) {
  console.error(`check:securite : ${problems.length} problème(s)`);
  for (const p of problems) console.error(` - ${p}`);
  process.exit(1);
}
console.log('check:securite : OK (secrets, fonctions dangereuses, dépendances)');
