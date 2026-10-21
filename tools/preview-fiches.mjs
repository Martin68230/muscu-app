// Aperçu des fiches d'exercices au format téléphone (relecture par l'utilisateur, pas l'écran final de l'app).
// Usage : node tools/preview-fiches.mjs <fiche1.md> <fiche2.md> ...  -> screenshots/fiches/<id>.png
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { webkit } from '@playwright/test';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(https?:\/\/[^\s|)]+)/g, '<span class="url">$1</span>');

function render(md) {
  const [, front, body] = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [null, '', md];
  const meta = Object.fromEntries(
    front.split('\n').filter((l) => l.includes(':')).map((l) => {
      const i = l.indexOf(':');
      return [l.slice(0, i).trim(), l.slice(i + 1).replace(/#.*$/, '').trim()];
    }),
  );
  const out = [];
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith('## ')) out.push(`<h2>${inline(l.slice(3))}</h2>`);
    else if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      i--;
      const cells = (r) => r.slice(1, -1).split('|').map((c) => c.trim());
      const [head, , ...rest] = rows;
      out.push(`<div class="tw"><table><tr>${cells(head).map((c) => `<th>${inline(c)}</th>`).join('')}</tr>${rest
        .map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</table></div>`);
    } else if (/^(\d+\.|-) /.test(l)) {
      const ordered = /^\d+\./.test(l);
      const items = [];
      while (i < lines.length && /^(\d+\.|-) /.test(lines[i])) items.push(lines[i++].replace(/^(\d+\.|-) /, ''));
      i--;
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</${tag}>`);
    } else if (l.trim()) out.push(`<p>${inline(l)}</p>`);
  }
  const chips = ['schema', 'type', 'niveau_min', 'statut'].filter((k) => meta[k]).map((k) => `<span class="chip">${esc(k)} : ${esc(meta[k])}</span>`).join('');
  return `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;background:#0f1115;color:#f2f4f8;font:16px/1.45 -apple-system,'Segoe UI',sans-serif;padding:20px 16px 40px}
h1{font-size:26px;margin:0 0 8px} h2{font-size:17px;margin:22px 0 8px;color:#5ee0a0}
.chip{display:inline-block;font-size:12px;background:#232733;border:1px solid #2e3340;border-radius:99px;padding:3px 9px;margin:0 6px 6px 0;color:#a9b0bf}
.muscles{font-size:14px;color:#a9b0bf;margin:6px 0 0}
ol,ul{padding-left:22px;margin:0 0 8px} li{margin:4px 0}
.tw{overflow-x:auto;margin:0 -16px;padding:0 16px} table{border-collapse:collapse;font-size:12.5px;min-width:100%}
th,td{border:1px solid #2e3340;padding:5px 6px;vertical-align:top;text-align:left} th{background:#191c23}
code{font-size:12.5px;background:#232733;padding:1px 4px;border-radius:4px} .url{word-break:break-all;color:#8fb7ff}
p{margin:0 0 8px}
</style>
<h1>${esc(meta.nom ?? '')}</h1>${chips}
<p class="muscles">Muscles : ${esc((meta.muscles_principaux ?? '').replace(/[[\]]/g, ''))} · secondaires : ${esc((meta.muscles_secondaires ?? '').replace(/[[\]]/g, ''))}</p>
${out.join('\n')}`;
}

const files = process.argv.slice(2);
mkdirSync('screenshots/fiches', { recursive: true });
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2 });
for (const f of files) {
  const id = basename(f, '.md');
  const html = resolve(`screenshots/fiches/${id}.html`);
  writeFileSync(html, render(readFileSync(f, 'utf8').replace(/\r\n/g, '\n')));
  await page.goto(pathToFileURL(html).href);
  await page.screenshot({ path: `screenshots/fiches/${id}.png`, fullPage: true });
  console.log(`screenshots/fiches/${id}.png`);
}
await browser.close();
