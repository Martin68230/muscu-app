// D23/D22 vague 1 : contrôle des données hasaneyldrm/exercises-dataset (JSON, MIT pour le texte) AVANT toute utilisation.
// Les fichiers téléchargés sont des DONNÉES NON FIABLES : ce script ne fait que les LIRE (JSON.parse), jamais les exécuter.
// Usage : node tools/hasan-controle.mjs <dossier-des-données> ; écrit controle-rapport.json dans ce dossier (hors dépôt).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('Usage : node tools/hasan-controle.mjs <dossier>'); process.exit(2); }

const ATTRIBUTION = '© Gym visual — https://gymvisual.com/';
const BODY_PARTS = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
const LANGS = ['en', 'es', 'it', 'tr', 'ru', 'zh', 'hi', 'pl', 'ko', 'fr'];
const REQUIRED = ['id', 'name', 'category', 'body_part', 'equipment', 'instructions', 'instruction_steps', 'muscle_group', 'secondary_muscles', 'target', 'media_id', 'image', 'gif_url', 'attribution', 'created_at'];
const MAX_STRING = 1500; const MAX_STEPS = 30; const MAX_NAME = 120;

const URL_RE = /(https?:\/\/|ftp:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|dev|ru|cn|tk|xyz)\b)/i;
const CMD_RE = /(`|\$\(|\|\||&&|\bsudo\b|\brm\s+-|\bcurl\s+(-|https?)|\bwget\b|\bchmod\b|\bnpm\s|\bpip\s|\bpowershell\b|<script|javascript:|\beval\(|\bexec\()/i;
const ADDRESSEE_RE = /(ignore (all |your |the )?(previous|prior|above)|ignore tes|ignore vos|oublie tes|system prompt|as an ai|assistant|you must now|tu dois maintenant|télécharge|telecharge|download (the|this)|execute (the|this)|exécute|send (the|your) (file|data|key|token|password)|api[ _-]?key|password|mot de passe|token)/i;
// caractères invisibles ou de contrôle (hors \n et \t) : zéro-largeur, bidirectionnels, BOM, séparateurs, contrôles C0 / C1
const invisible = (s) => {
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c <= 8 || (c >= 0x0b && c <= 0x1f) || (c >= 0x7f && c <= 0x9f) || c === 0xad || c === 0x61c || c === 0x180e || (c >= 0x200b && c <= 0x200f) || (c >= 0x2028 && c <= 0x202e) || (c >= 0x2060 && c <= 0x206f) || c === 0xfeff || (c >= 0xfff9 && c <= 0xfffb)) return ch;
  }
  return null;
};

const issues = [];
const flag = (id, name, field, kind, extra = '') => issues.push({ id, name, field, kind, extra: String(extra).slice(0, 80) });

let data;
try { data = JSON.parse(readFileSync(join(dir, 'exercises.json'), 'utf8')); } catch (e) { console.error('JSON invalide :', e.message); process.exit(1); }
if (!Array.isArray(data)) { console.error('exercises.json n\'est pas un tableau'); process.exit(1); }

const ids = new Set(); const mediaIds = new Set();
const scanText = (rec, field, text, { allowAttribution = false } = {}) => {
  if (typeof text !== 'string') return;
  if (allowAttribution && text === ATTRIBUTION) return;
  if (text.length > MAX_STRING) flag(rec.id, rec.name, field, 'taille', text.length);
  const inv = invisible(text);
  if (inv) flag(rec.id, rec.name, field, 'caractère invisible ou de contrôle', 'U+' + inv.codePointAt(0).toString(16));
  if (URL_RE.test(text)) flag(rec.id, rec.name, field, 'adresse web', text.match(URL_RE)[0]);
  if (CMD_RE.test(text)) flag(rec.id, rec.name, field, 'motif de commande', text.match(CMD_RE)[0]);
  if (ADDRESSEE_RE.test(text)) flag(rec.id, rec.name, field, 'texte qui s\'adresse à un agent ou demande une action', text.match(ADDRESSEE_RE)[0]);
};
const isStr = (v) => typeof v === 'string' && v.length > 0;

for (const rec of data) {
  const id = rec?.id; const name = rec?.name;
  if (typeof rec !== 'object' || rec === null || Array.isArray(rec)) { flag(id, name, '(fiche)', 'schéma', 'pas un objet'); continue; }
  for (const k of REQUIRED) if (!(k in rec)) flag(id, name, k, 'schéma', 'champ manquant');
  for (const k of Object.keys(rec)) if (!REQUIRED.includes(k)) flag(id, name, k, 'schéma', 'champ inattendu (ignoré)');
  if (!/^[0-9]{4}$/.test(id ?? '')) flag(id, name, 'id', 'schéma', 'format');
  if (ids.has(id)) flag(id, name, 'id', 'schéma', 'doublon'); ids.add(id);
  if (!isStr(name) || name.length > MAX_NAME) flag(id, name, 'name', 'schéma', 'vide ou trop long');
  if (!BODY_PARTS.includes(rec.body_part)) flag(id, name, 'body_part', 'schéma', rec.body_part);
  for (const k of ['category', 'equipment', 'muscle_group', 'target', 'media_id']) if (!isStr(rec[k])) flag(id, name, k, 'schéma', 'chaîne vide ou absente');
  if (!Array.isArray(rec.secondary_muscles) || rec.secondary_muscles.some((m) => !isStr(m))) flag(id, name, 'secondary_muscles', 'schéma', 'tableau de chaînes attendu');
  if (!/^images\/[A-Za-z0-9._-]+\.(jpg|jpeg|png)$/.test(rec.image ?? '')) flag(id, name, 'image', 'schéma', rec.image);
  if (!/^videos\/[A-Za-z0-9._-]+\.gif$/.test(rec.gif_url ?? '')) flag(id, name, 'gif_url', 'schéma', rec.gif_url);
  if (rec.attribution !== ATTRIBUTION) flag(id, name, 'attribution', 'schéma', rec.attribution);
  if (!Number.isFinite(Date.parse(rec.created_at ?? ''))) flag(id, name, 'created_at', 'schéma', rec.created_at);
  if (mediaIds.has(rec.media_id)) flag(id, name, 'media_id', 'schéma', 'doublon'); mediaIds.add(rec.media_id);
  for (const [field, v] of [['instructions', rec.instructions], ['instruction_steps', rec.instruction_steps]]) {
    if (typeof v !== 'object' || v === null) { flag(id, name, field, 'schéma', 'objet attendu'); continue; }
    for (const l of LANGS) if (!(l in v)) flag(id, name, `${field}.${l}`, 'schéma', 'langue manquante');
  }
  for (const k of ['name', 'category', 'body_part', 'equipment', 'muscle_group', 'target', 'media_id', 'image', 'gif_url']) scanText(rec, k, rec[k]);
  scanText(rec, 'attribution', rec.attribution, { allowAttribution: true });
  for (const m of rec.secondary_muscles ?? []) scanText(rec, 'secondary_muscles', m);
  for (const [l, t] of Object.entries(rec.instructions ?? {})) scanText(rec, `instructions.${l}`, t);
  for (const [l, steps] of Object.entries(rec.instruction_steps ?? {})) {
    if (!Array.isArray(steps) || steps.length === 0 || steps.length > MAX_STEPS || steps.some((s) => !isStr(s))) { flag(id, name, `instruction_steps.${l}`, 'schéma', 'tableau de 1 à 30 chaînes non vides attendu'); continue; }
    for (const s of steps) scanText(rec, `instruction_steps.${l}`, s);
  }
}

const parKind = {};
for (const i of issues) parKind[i.kind] = (parKind[i.kind] ?? 0) + 1;
const sains = data.length - new Set(issues.map((i) => i.id)).size;
writeFileSync(join(dir, 'controle-rapport.json'), JSON.stringify({ fiches: data.length, sansAlerte: sains, parKind, issues }, null, 1));
console.log(`${data.length} fiches lues ; ${sains} sans alerte ; ${new Set(issues.map((i) => i.id)).size} avec au moins une alerte (${issues.length} alertes)`);
console.log(parKind);
for (const i of issues.slice(0, 25)) console.log(`- ${i.id} « ${i.name} » · ${i.field} · ${i.kind}${i.extra ? ` : ${i.extra}` : ''}`);
if (issues.length > 25) console.log(`… ${issues.length - 25} autres dans controle-rapport.json`);
