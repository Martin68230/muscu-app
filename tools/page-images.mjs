// Génère images-a-trouver/verification-images.html : page autonome (hors connexion) pour
// relire, fiche par fiche, les images affichables. Usage : npm run page:images
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFrontmatter } from './validate-fiches.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fichesDir = join(root, 'knowledge', 'exercices');
const photosDir = join(root, 'public', 'photos', 'free-exercise-db');
const outFile = join(root, 'images-a-trouver', 'verification-images.html');
const STATUTS = ['utilisable', 'verifie', 'complete_kine'];
const MAX = 15 * 1024 * 1024;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function walk(dir, lot) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'ecartees') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, e.name));
    else if (e.name.endsWith('.md')) out.push({ path: p, lot: lot ?? '(racine)' });
  }
  return out;
}

function photoLines(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const i = lines.findIndex((l) => /^##\s+Photo\s*$/.test(l));
  if (i < 0) return [];
  const res = [];
  for (let k = i + 1; k < lines.length && !/^##\s/.test(lines[k]); k++) res.push(lines[k]);
  return res;
}

function collect(onlyOne) {
  const fiches = [];
  for (const f of walk(fichesDir)) {
    const text = readFileSync(f.path, 'utf8');
    let fm;
    try { fm = readFrontmatter(f.path); } catch { continue; }
    if (!fm?.id || !STATUTS.includes(fm.statut)) continue;
    const imgs = [], refus = [], aVerifier = [];
    for (const l of photoLines(text)) {
      let m = l.match(/^\s*[-*]\s*illustration\s*:\s*(public\/illustrations\/[a-z0-9-]+\.svg)\s*:\s*affichable\s*:\s*(oui|non|à vérifier|a verifier)\b\s*(?:\((.+)\))?/);
      if (m) {
        const file = join(root, m[1]);
        const nom = m[1].split('/').pop();
        if (m[2] === 'oui') {
          if (existsSync(file)) imgs.push({ kind: 'svg', file, name: nom, source: 'illustration app' });
          else refus.push(`${nom} : fichier introuvable`);
        } else (m[2] === 'non' ? refus : aVerifier).push(`${nom}${m[3] ? ' (' + m[3] + ')' : ''}`);
        continue;
      }
      m = l.match(/^\s*[-*]\s*`([A-Za-z0-9_\-]+\/\d+\.jpg)`\s*:\s*affichable\s*:\s*(oui|non|à vérifier|a verifier)\b\s*(?:\((.+)\))?/);
      if (!m) continue;
      const [dir, n] = m[1].split('/');
      const name = `${dir}-${n.replace(/\.jpg$/, '')}.webp`;
      const raison = m[3] ? ` (${m[3]})` : '';
      if (m[2] === 'oui') {
        const file = join(photosDir, name);
        if (existsSync(file)) imgs.push({ kind: 'webp', file, name, source: /wger/i.test(l) ? 'wger' : 'free-exercise-db' });
        else refus.push(`${name} : fichier WebP introuvable`);
      } else (m[2] === 'non' ? refus : aVerifier).push(`${name}${raison}`);
    }
    fiches.push({ id: fm.id, nom: fm.nom ?? fm.id, statut: fm.statut, lot: f.lot, imgs, refus, aVerifier });
  }
  fiches.sort((a, b) => a.lot.localeCompare(b.lot) || a.nom.localeCompare(b.nom, 'fr'));
  if (onlyOne) for (const f of fiches) f.imgs = f.imgs.slice(0, 1);
  return fiches;
}

const cache = new Map();
function dataUri(img) {
  if (cache.has(img.file)) return cache.get(img.file);
  const buf = readFileSync(img.file);
  const uri = (img.kind === 'svg' ? 'data:image/svg+xml;base64,' : 'data:image/webp;base64,') + buf.toString('base64');
  cache.set(img.file, uri);
  return uri;
}

const CSS = `:root{--bg:#10141a;--card:#1a212b;--tx:#eef2f7;--mut:#9aa7b8;--bd:#2c3644;--ok:#2e9e5b;--okx:#fff;--ko:#d9503f;--kox:#fff;--ac:#4c8dff;--img:#fff}
@media (prefers-color-scheme:light){:root{--bg:#f3f5f8;--card:#fff;--tx:#14181f;--mut:#566273;--bd:#d3d9e2;--ok:#1f8a4a;--ko:#c63b2a;--ac:#1f5fd6}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.4 -apple-system,system-ui,sans-serif;padding:0 env(safe-area-inset-right) calc(96px + env(safe-area-inset-bottom)) env(safe-area-inset-left)}
main{max-width:430px;margin:0 auto;padding:0 12px}
header{position:sticky;top:0;z-index:5;background:var(--bg);padding:calc(8px + env(safe-area-inset-top)) 0 8px;border-bottom:1px solid var(--bd)}
h1{font-size:18px;margin:0 0 4px}
#cnt{font-size:14px;color:var(--mut);margin:0 0 8px}
.filtres{display:flex;gap:6px}
.filtres button{flex:1;min-height:44px;border-radius:10px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font:inherit;font-size:14px}
.filtres button[aria-pressed=true]{background:var(--ac);border-color:var(--ac);color:#fff}
article{background:var(--card);border:1px solid var(--bd);border-radius:14px;margin:14px 0;padding:12px}
article.hide{display:none}
article{overflow-wrap:anywhere;min-width:0}main{min-width:0}
article h2{font-size:17px;margin:0 0 2px}
.meta{font-size:13px;color:var(--mut);margin:0 0 8px;word-break:break-all}
figure{margin:8px 0;padding:0}
figure img{display:block;width:100%;height:auto;min-height:120px;background:var(--img);border-radius:10px}
figcaption{font-size:12px;color:var(--mut);margin-top:3px;word-break:break-all}
.note{overflow-wrap:anywhere;font-size:13px;color:var(--mut);margin:6px 0}.note b{color:var(--tx)}
.btns{display:flex;gap:8px;margin:10px 0 8px}
.btns button{flex:1;min-height:56px;font:inherit;font-size:18px;font-weight:700;border-radius:12px;border:2px solid var(--bd);background:transparent;color:var(--tx)}
.btns .ok[aria-pressed=true]{background:var(--ok);border-color:var(--ok);color:var(--okx)}
.btns .ko[aria-pressed=true]{background:var(--ko);border-color:var(--ko);color:var(--kox)}
textarea{width:100%;min-height:64px;font:inherit;font-size:16px;color:var(--tx);background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:8px}
#copier{position:fixed;left:12px;right:12px;bottom:calc(10px + env(safe-area-inset-bottom));max-width:406px;margin:0 auto;min-height:56px;font:inherit;font-size:18px;font-weight:700;border:0;border-radius:14px;background:var(--ac);color:#fff;z-index:6}
#repli{display:none;position:fixed;inset:0;z-index:9;background:var(--bg);padding:calc(12px + env(safe-area-inset-top)) 12px 12px}
#repli textarea{height:70vh}#repli button{min-height:48px;width:100%;margin-top:8px;font:inherit;font-size:16px}`;

const JS = `(function(){
var KEY='verif-images-v1',S={};
try{S=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){S={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var arts=[].slice.call(document.querySelectorAll('article')),filtre='tout';
function st(id){return S[id]||(S[id]={c:'',r:''})}
function paint(a){var s=S[a.dataset.id]||{c:'',r:''};
 a.querySelector('.ok').setAttribute('aria-pressed',s.c==='ok');
 a.querySelector('.ko').setAttribute('aria-pressed',s.c==='ko');
 if(a.querySelector('textarea').value!==(s.r||''))a.querySelector('textarea').value=s.r||'';
 var show=filtre==='tout'||(filtre==='ko'&&s.c==='ko')||(filtre==='new'&&!s.c);
 a.classList.toggle('hide',!show)}
function count(){var v=0,o=0,k=0;arts.forEach(function(a){var s=S[a.dataset.id];if(s&&s.c){v++;if(s.c==='ok')o++;else k++}});
 document.getElementById('cnt').textContent=v+' vues sur '+arts.length+' · '+o+' OK · '+k+' à changer'}
arts.forEach(function(a){var id=a.dataset.id;
 a.querySelector('.ok').onclick=function(){var s=st(id);s.c=s.c==='ok'?'':'ok';save();paint(a);count()};
 a.querySelector('.ko').onclick=function(){var s=st(id);s.c=s.c==='ko'?'':'ko';save();paint(a);count()};
 a.querySelector('textarea').oninput=function(e){st(id).r=e.target.value;save()};
 paint(a)});
count();
[].forEach.call(document.querySelectorAll('.filtres button'),function(b){b.onclick=function(){filtre=b.dataset.f;
 [].forEach.call(document.querySelectorAll('.filtres button'),function(x){x.setAttribute('aria-pressed',x===b)});arts.forEach(paint)}});
function texte(){var l=[];arts.forEach(function(a){var s=S[a.dataset.id];if(!s)return;var r=(s.r||'').replace(/\\s+/g,' ').trim();
 if(s.c==='ko'||r)l.push(a.dataset.id+' — '+(s.c==='ko'?'À changer':s.c==='ok'?'OK':'pas de choix')+(r?' — '+r:''))});
 return l.join('\\n')||'(aucune remarque)'}
function repli(t){var d=document.getElementById('repli'),ta=d.querySelector('textarea');ta.value=t;d.style.display='block';ta.focus();ta.select();ta.setSelectionRange(0,t.length)}
document.getElementById('copier').onclick=function(){var t=texte(),btn=this;
 function fin(){btn.textContent='Copié !';setTimeout(function(){btn.textContent='Copier mes remarques'},1800)}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(fin,function(){repli(t)})}else repli(t)};
document.getElementById('fermer').onclick=function(){document.getElementById('repli').style.display='none'};
})();`;

function build(fiches) {
  const arts = fiches.map((f) => {
    const figs = f.imgs.map((im) => `<figure><img loading="lazy" decoding="async" alt="${esc(f.nom)} : ${esc(im.name)}" src="${dataUri(im)}"><figcaption>${esc(im.name)} · ${esc(im.source)}</figcaption></figure>`).join('');
    const notes = [
      f.imgs.length === 0 ? '<p class="note"><b>Aucune image affichable.</b></p>' : '',
      f.refus.length ? `<p class="note"><b>Refusées (non) :</b> ${esc(f.refus.join(' ; '))}</p>` : '',
      f.aVerifier.length ? `<p class="note"><b>À vérifier :</b> ${esc(f.aVerifier.join(' ; '))}</p>` : '',
    ].join('');
    return `<article data-id="${esc(f.id)}"><h2>${esc(f.nom)}</h2><p class="meta">${esc(f.id)} · ${esc(f.lot)} · ${esc(f.statut)}</p>${figs}${notes}<div class="btns"><button type="button" class="ok" aria-pressed="false">OK</button><button type="button" class="ko" aria-pressed="false">À changer</button></div><textarea rows="2" placeholder="Remarque (facultatif)" aria-label="Remarque pour ${esc(f.nom)}"></textarea></article>`;
  }).join('\n');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="dark light"><title>Vérification des images</title><style>${CSS}</style></head><body><main><header><h1>Vérification des images</h1><p id="cnt"></p><div class="filtres"><button type="button" data-f="tout" aria-pressed="true">Tout</button><button type="button" data-f="ko" aria-pressed="false">À changer</button><button type="button" data-f="new" aria-pressed="false">Pas encore vu</button></div></header>
${arts}
</main><button type="button" id="copier">Copier mes remarques</button><div id="repli"><p>Copie ce texte à la main :</p><textarea readonly></textarea><button type="button" id="fermer">Fermer</button></div><script>${JS}</script></body></html>`;
}

let fiches = collect(false);
let html = build(fiches);
let size = Buffer.byteLength(html);
if (size > MAX) {
  cache.clear();
  fiches = collect(true);
  html = build(fiches);
  size = Buffer.byteLength(html);
  console.log('Plus de 15 Mo : une seule image par fiche.');
}
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, html);
const nImg = fiches.reduce((n, f) => n + f.imgs.length, 0);
console.log(`${fiches.length} fiches, ${nImg} images, ${(size / 1048576).toFixed(2)} Mo -> ${outFile}`);
