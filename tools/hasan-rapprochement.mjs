// D22 (préparation, vague 1 de D23) : table de correspondance entre les exercices du jeu hasaneyldrm/exercises-dataset (MIT pour le texte)
// et NOS fiches. Lecture seule : name, target, secondary_muscles, equipment, body_part, id, media_id, gif_url. Aucun texte d'instructions n'est lu ici,
// aucune image ni aucun GIF n'est utilisé. Le rapprochement se fait ICI (jamais dans l'app) ; l'import futur (D22) appliquera cette table.
// Usage : node tools/hasan-rapprochement.mjs <dossier-des-données> ; écrit knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv et un résumé.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { schemaFamille } from './validate-fiches.mjs';

const dir = process.argv[2];
if (!dir) { console.error('Usage : node tools/hasan-rapprochement.mjs <dossier>'); process.exit(2); }
const COMMIT = readFileSync(join(dir, 'COMMIT.txt'), 'utf8').trim();
const data = JSON.parse(readFileSync(join(dir, 'exercises.json'), 'utf8'));

const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const STOP = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'a', 'au', 'aux', 'en', 'sur', 'avec', 'the', 'with', 'on', 'of', 'and', 'un', 'une', 'male', 'female', 'version', 'exercice', 'l', 'd', 'sans', 'pour', 'to']);

// expressions anglaises -> mots de nos fiches (ordre : les plus longues d'abord)
const PHRASES = [
  ['romanian deadlift', 'souleve de terre roumain'], ['stiff leg deadlift', 'souleve de terre jambes tendues'], ['sumo deadlift', 'souleve de terre sumo'], ['deadlift', 'souleve de terre'],
  ['push-up', 'pompe'], ['push up', 'pompe'], ['pushup', 'pompe'], ['sit-up', 'releve de buste'], ['sit up', 'releve de buste'], ['pull-up', 'traction'], ['pull up', 'traction'], ['chin-up', 'traction'], ['chin up', 'traction'],
  ['step-up', 'montee sur'], ['step up', 'montee sur'], ['hip thrust', 'hip thrust'], ['good morning', 'good morning'], ['bench press', 'developpe couche'], ['overhead press', 'developpe epaules'], ['shoulder press', 'developpe epaules'], ['military press', 'developpe epaules'],
  ['lat pulldown', 'tirage vertical'], ['pulldown', 'tirage vertical'], ['bent over row', 'rowing penche'], ['seated row', 'rowing assis'], ['calf raise', 'mollets elevation'], ['russian twist', 'rotation russe'], ['mountain climber', 'grimpeur'],
  ['glute bridge', 'pont fessier'], ['hip bridge', 'pont fessier'], ['bird dog', 'bird dog'], ['dead bug', 'dead bug'], ['wall sit', 'chaise murale'], ['leg raise', 'releve de jambes'], ['side plank', 'planche laterale'], ['plank', 'planche'],
  ['bulgarian split squat', 'squat bulgare'], ['split squat', 'squat fendu'], ['lunge', 'fente'], ['squat', 'squat'], ['lateral raise', 'elevation laterale'], ['front raise', 'elevation frontale'], ['shrug', 'haussement epaules'],
  ['jumping jack', 'jumping jack'], ['pallof press', 'pallof'], ['face pull', 'face pull'], ['kickback', 'kickback'], ['crunch', 'crunch'], ['twist', 'rotation'], ['curl', 'curl'], ['dip', 'dips'], ['fly', 'ecarte'], ['flye', 'ecarte'], ['row', 'rowing'], ['press', 'developpe'],
  ['stability ball', 'swiss ball'], ['medicine ball', 'medecine ball'], ['bosu ball', 'bosu'], ['ez barbell', 'barre ez'], ['ez-bar', 'barre ez'], ['dumbbell', 'halteres'], ['barbell', 'barre'], ['kettlebell', 'kettlebell'], ['cable', 'poulie'], ['resistance band', 'elastique'], ['band', 'elastique'],
  ['one arm', 'un bras unilateral'], ['single arm', 'un bras unilateral'], ['single leg', 'unijambiste'], ['one leg', 'unijambiste'], ['bulgarian', 'bulgare'], ['front', 'avant'], ['incline', 'incline'], ['decline', 'decline'],
  ['close grip', 'prise serree'], ['wide grip', 'prise large'], ['reverse', 'inverse'], ['seated', 'assis'], ['standing', 'debout'], ['lying', 'allonge'], ['kneeling', 'genoux'], ['hanging', 'suspendu'], ['raise', 'elevation'], ['extension', 'extension'],
];
const stem = (t) => (t.length > 3 ? t.replace(/(s|x)$/, '') : t);
const tokens = (s) => [...new Set(strip(s).replace(/[^a-z0-9]+/g, ' ').split(' ').filter((t) => t && !STOP.has(t)).map(stem))];
const translate = (name) => { let s = ` ${strip(name).replace(/[()]/g, ' ')} `; for (const [en, fr] of PHRASES) s = s.split(` ${en} `).join(` ${fr} `).split(` ${en}s `).join(` ${fr} `); return s; };

// muscle ciblé par Hasan -> muscles principaux possibles chez nous
const MUSCLES = {
  abs: ['abdominaux', 'transverse', 'obliques'], pectorals: ['pectoraux'], biceps: ['biceps'], glutes: ['fessiers', 'moyen_fessier'], delts: ['deltoides_anterieurs', 'deltoides_lateraux', 'deltoides_posterieurs'],
  triceps: ['triceps'], 'upper back': ['rhomboides', 'trapezes', 'grand_dorsal', 'deltoides_posterieurs'], lats: ['grand_dorsal'], calves: ['mollets', 'tibial_anterieur', 'peroniers'], quads: ['quadriceps'],
  forearms: ['avant_bras'], hamstrings: ['ischios'], spine: ['erecteurs_rachis', 'carre_des_lombes'], traps: ['trapezes'], adductors: ['adducteurs'], 'serratus anterior': ['dentele_anterieur'],
  abductors: ['moyen_fessier', 'fessiers'], 'levator scapulae': ['trapezes'], 'cardiovascular system': [],
};
const BASE = new Set(['poids_du_corps', 'tapis', 'chaise', 'mur', 'marche_escalier', 'serviette', 'porte', 'box_ou_step', 'banc', 'banc_inclinable']);
const EQUIP = {
  'body weight': [], dumbbell: ['halteres'], cable: ['poulie', 'machine'], barbell: ['barre', 'disques', 'rack'], 'olympic barbell': ['barre', 'disques', 'rack'], 'ez barbell': ['barre_ez', 'disques'],
  'leverage machine': ['machine'], 'smith machine': ['machine', 'barre', 'disques'], 'sled machine': ['machine'], band: ['elastique', 'mini_bande', 'partenaire_ou_ancrage'], 'resistance band': ['elastique', 'mini_bande', 'partenaire_ou_ancrage'],
  kettlebell: ['kettlebell'], weighted: ['lest', 'sac_a_dos', 'bidons_ou_sacs', 'sac_de_sable', 'halteres'], 'stability ball': ['swiss_ball'], 'medicine ball': ['medecine_ball'], rope: ['corde_a_sauter', 'poulie'], roller: ['rouleau_massage'],
  'wheel roller': ['roue_abdos'], 'bosu ball': ['bosu'], assisted: ['machine', 'elastique'], 'stationary bike': ['machine_cardio'], 'elliptical machine': ['machine_cardio'], 'stepmill machine': ['machine_cardio'],
  'upper body ergometer': ['machine_cardio'], 'skierg machine': ['machine_cardio'], 'trap bar': ['materiel_specialise'], hammer: ['materiel_specialise'], tire: ['materiel_specialise'],
};
// indice de schéma d'après le nom traduit
const SCHEMA_HINTS = [['souleve de terre', 'charniere'], ['hip thrust', 'charniere'], ['good morning', 'charniere'], ['pont fessier', 'charniere'], ['pompe', 'poussee_h'], ['developpe couche', 'poussee_h'], ['developpe epaules', 'poussee_v'], ['traction', 'tirage_v'], ['tirage vertical', 'tirage_v'],
  ['rowing', 'tirage_h'], ['fente', 'squat'], ['squat', 'squat'], ['montee sur', 'squat'], ['planche', 'gainage'], ['rotation', 'rotation'], ['pallof', 'anti_rotation'], ['mollets', 'cheville_mollet']];

// --- nos fiches ---
const fiches = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (!/ecartees|pilote$/.test(p) || /pilote$/.test(p)) { if (!/ecartees/.test(p)) walk(p); } continue; }
    if (!e.name.endsWith('.md')) continue;
    const t = readFileSync(p, 'utf8').replace(/^﻿/, '');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(t)?.[1] ?? '';
    const g = (k) => (new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(fm)?.[1] ?? '').trim();
    const list = (k) => g(k).replace(/[[\]]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
    const id = g('id'); if (!id) continue;
    const variants = [];
    for (const l of t.split('\n')) {
      const c = l.split('|').map((x) => x.trim());
      if (c.length >= 7 && /^[a-z0-9-]+$/.test(c[1]) && !/^id variante$/.test(c[1]) && /^[0-9]+$/.test(c[3])) variants.push({ id: c[1], nom: c[2], tags: c[5].split(',').map((x) => x.trim()).filter(Boolean) });
    }
    fiches.push({ id, nom: g('nom'), alias: list('alias'), schema: g('schema'), muscles: list('muscles_principaux'), statut: g('statut'), variants, strings: [g('nom'), ...list('alias'), id.replace(/-/g, ' ')] });
  }
})('knowledge/exercices');
for (const f of fiches) f.cand = [...f.strings.map((s) => ({ s, v: null })), ...f.variants.map((v) => ({ s: v.nom, v }))].map((c) => ({ ...c, tok: tokens(c.s) }));

const NEUTRAL = new Set(['haltere', 'barre', 'ez', 'kettlebell', 'poulie', 'elastique', 'swiss', 'medecine', 'bosu', 'lest', 'ballon', 'ball', 'machine', 'levier', 'lever', 'smith', 'bande', 'mini', 'exercise', 'body', 'weight', 'poids', 'corp', 'un', 'bras', 'cable', 'band', 'dumbbell', 'barbell', 'stability']);
const dice = (a, b) => { if (!a.length || !b.length) return 0; const B = new Set(b); const inter = a.filter((x) => B.has(x)).length; return (2 * inter) / (a.length + b.length); };
const specific = (tags) => tags.filter((t) => !BASE.has(t));

const rows = [];
for (const h of data) {
  const tr = translate(h.name); const H = tokens(tr);
  const hIdTok = tokens(h.name.replace(/\(.*?\)/g, ''));
  const muscles = new Set(MUSCLES[h.target] ?? []);
  const allowed = new Set(EQUIP[h.equipment] ?? []);
  const hint = SCHEMA_HINTS.find(([k]) => tr.includes(` ${k} `) || tr.trimStart().startsWith(`${k} `) || tr.includes(k))?.[1];
  let best = null;
  for (const f of fiches) {
    let name = 0; let bestVar = null; let bestTok = [];
    for (const c of f.cand) { const sc = Math.max(dice(H, c.tok), dice(hIdTok, c.tok)); if (sc > name || (sc === name && c.v && !bestVar)) { name = sc; bestVar = c.v; bestTok = c.tok; } }
    if (name < 0.34) continue;
    // qualificatifs : mots du nom Hasan absents chez nous (inclinaison, une jambe, prise large…) et mots à nous absents du nom Hasan
    const hCore = H.filter((t) => !NEUTRAL.has(t)); const cCore = bestTok.filter((t) => !NEUTRAL.has(t));
    const unmatched = hCore.filter((t) => !cCore.includes(t)); const extra = cCore.filter((t) => !hCore.includes(t));
    const muscleOk = [...muscles].some((m) => f.muscles.includes(m)) || (muscles.size === 0 && f.schema === 'cardio');
    const spec = allowed.size === 0 ? (v) => specific(v.tags).length === 0 : (v) => specific(v.tags).length > 0 && specific(v.tags).every((t) => allowed.has(t));
    const vOk = f.variants.filter(spec);
    const equipOk = vOk.length > 0;
    if (equipOk && (!bestVar || !spec(bestVar))) {
      let bv = null; let bs = -1;
      for (const v of vOk) { const sc = dice(H, tokens(v.nom)); if (sc > bs) { bs = sc; bv = v; } }
      bestVar = bv;
    }
    const schemaBad = hint && schemaFamille(f.schema) !== schemaFamille(hint) && !(hint === 'squat' && ['squat', 'fente'].includes(f.schema));
    const score = Math.max(0, name * 0.7 + (muscleOk ? 0.2 : 0) + (equipOk ? 0.1 : 0) - (schemaBad ? 0.2 : 0));
    if (!best || score > best.score) best = { f, score, name, muscleOk, equipOk, schemaBad, unmatched, extra, variant: equipOk ? bestVar : null };
  }
  let statut = 'sans équivalent'; let notre = ''; let variante = ''; let conf = 0; let note = '';
  if (best && best.name >= 0.6) {
    notre = best.f.id; variante = best.variant?.id ?? ''; conf = Math.round(best.score * 100) / 100;
    // « validé » : même mouvement mot pour mot (aucun qualificatif en trop ou en moins), même muscle, matériel couvert, même schéma
    const identique = best.unmatched.length === 0 && best.extra.length === 0;
    if (identique && best.muscleOk && best.equipOk && !best.schemaBad && best.name >= 0.8) statut = 'validé';
    else statut = 'à relire';
    const notes = [];
    if (!best.muscleOk) notes.push('muscle ciblé différent');
    if (!best.equipOk) notes.push('matériel sans variante équivalente');
    if (best.schemaBad) notes.push('schéma différent');
    if (best.unmatched.length) notes.push(`qualificatif Hasan absent chez nous : ${best.unmatched.join(' ')}`);
    if (best.extra.length) notes.push(`qualificatif chez nous absent chez Hasan : ${best.extra.join(' ')}`);
    note = notes.join(' ; ');
  }
  rows.push({ h, statut, notre, variante, conf, note });
}

// Décisions du coach (relecture humaine) : knowledge/exercices/CORRESPONDANCE-REVUE-coach.tsv (hasan_id, decision, motif). Elles l'emportent sur le score.
let revue = new Map();
try {
  for (const l of readFileSync('knowledge/exercices/CORRESPONDANCE-REVUE-coach.tsv', 'utf8').split(String.fromCharCode(10)).slice(1)) {
    const [hid, decision, motif] = l.split(String.fromCharCode(9)); if (hid && ['validé', 'à relire', 'sans équivalent'].includes(decision)) revue.set(hid, { decision, motif: motif ?? '' });
  }
} catch { /* pas encore de revue */ }
for (const r of rows) { const d = revue.get(r.h.id); if (d) { r.statut = d.decision; r.revue = 'coach'; r.note = d.motif || r.note; if (d.decision === 'sans équivalent') { r.notre = ''; r.variante = ''; } } }
const head = ['hasan_id', 'media_id', 'gif', 'notre_id', 'notre_variante', 'confiance', 'statut', 'note', 'revue', 'nom_hasan', 'commit_hasan'];
const tsv = [head.join('\t'), ...rows.map((r) => [r.h.id, r.h.media_id, r.h.gif_url.replace(/^videos\//, ''), r.notre, r.variante, r.notre ? r.conf : '', r.statut, r.note, r.revue ?? '', r.h.name, COMMIT].join('\t'))].join('\n') + '\n';
writeFileSync('knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv', tsv);
const n = (s) => rows.filter((r) => r.statut === s).length;
console.log(`Hasan ${data.length} | validé ${n('validé')} | à relire ${n('à relire')} | sans équivalent ${n('sans équivalent')} | nos fiches ${fiches.length} | commit ${COMMIT.slice(0, 7)}`);
const couvertes = new Set(rows.filter((r) => r.statut !== 'sans équivalent').map((r) => r.notre));
console.log(`Nos fiches avec au moins une correspondance : ${couvertes.size}/${fiches.length}`);
