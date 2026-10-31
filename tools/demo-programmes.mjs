// Exemples complets de programmes (6 profils, option « Gagner du temps » activée) écrits dans docs/programmes-exemples.md,
// puis analyse (sauts, répétitions) calculée ; le commentaire rédigé est lu dans tools/demo-programmes-analyse.md s'il existe.
// Usage : node tools/demo-programmes.mjs   (le générateur TypeScript est empaqueté à la volée avec rolldown, comme demo-d26.mjs)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = await rolldown({ input: join(root, 'src/generator/index.ts'), platform: 'node', logLevel: 'silent' });
const { output } = await bundle.generate({ format: 'esm' });
const gen = await import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString('base64')}`);
const { fiches } = JSON.parse(readFileSync(join(root, 'public/data/fiches.json'), 'utf8'));

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const eq = (tags) => ({ preset: 'perso', tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
const salle = { preset: 'F', tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
const MAISON_HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
const MAISON_E = ['elastique', 'chaise', 'poids_du_corps', 'tapis'];

const mkInput = (o) => ({
  profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], ...o.profile },
  equipment: o.equipment,
  goals: [{ goalKey: o.goal, rank: 1 }, ...(o.second ? [{ goalKey: o.second, rank: 2 }] : [])],
  injuries: [], fiches,
  options: { gagnerDuTemps: true, ...(o.options ?? {}) },
});

const PROFILS = [
  { titre: '1. Débutant, prise de muscle, 3 jours, maison (haltères + élastique)', input: mkInput({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(MAISON_HE), goal: 'muscle' }) },
  { titre: '2. Intermédiaire, force, 4 jours, salle (haut / bas)', input: mkInput({ profile: { level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle' }, equipment: salle, goal: 'force' }) },
  { titre: '3. Intermédiaire, perte de gras + cardio en objectif secondaire, 3 jours, séance de cardio ajoutée', input: mkInput({ profile: { level: 'intermediaire', daysPerWeek: 3, sessionDurationMin: 45 }, equipment: eq(MAISON_HE), goal: 'perte_gras', second: 'cardio', options: { seanceCardio: true } }) },
  { titre: '4. Intermédiaire, volley (objectif sport), 3 jours, maison (élastique + chaise)', input: mkInput({ profile: { level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, equipment: eq(MAISON_E), goal: 'sport' }) },
  { titre: '5. Débutant, sans matériel, 3 jours (poids du corps)', input: mkInput({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(['poids_du_corps', 'tapis']), goal: 'muscle' }) },
  { titre: '6. Avancé, 5 jours, salle', input: mkInput({ profile: { level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle' }, equipment: salle, goal: 'muscle' }) },
];

const dose = (e) => (e.unit === 'sec' ? `${e.sets} x ${e.holdSec} s` : `${e.sets} x ${e.repsMin}-${e.repsMax}${e.unit === 'reps_par_cote' ? ' par côté' : ''}`);
const wu = (w) => (w ? `${w.nom} (${w.sec} s)` : 'aucun');
const out = ['# Exemples de programmes générés (option « Gagner du temps » activée)', '',
  'Document produit par `node tools/demo-programmes.mjs` avec le vrai générateur (`generateProgram`). Ne pas modifier à la main : relancer le script.', ''];
const stats = [];

function sessionBlock(s) {
  const L = [];
  L.push(`### Séance ${s.label} (${s.type}), ${JOURS[s.weekday]}, environ ${s.estimatedMin} min`);
  L.push(`- Échauffement : ${wu(s.warmup.general)}`);
  if (s.warmup.mobility.length) L.push(`- Mobilité : ${s.warmup.mobility.map((m) => `${m.nom} (${m.sec} s)`).join(' ; ')}`);
  const groups = {};
  s.exercises.forEach((e) => { if (e.supersetGroup) (groups[e.supersetGroup] ??= []).push(e.nom); });
  L.push('- Exercices :');
  s.exercises.forEach((e, i) => {
    const tag = e.supersetGroup ? ` [SUPERSET ${e.supersetGroup}]` : '';
    L.push(`  ${i + 1}. ${e.nom}${e.variantNom && e.variantNom !== e.nom ? ` (${e.variantNom})` : ''} : ${dose(e)}, repos ${e.restSec} s, RIR ${e.rirTarget}${e.isCalibration ? ', étalonnage' : ''}${e.capped ? ', charge maintenue' : ''}${tag}`);
  });
  const pairs = Object.entries(groups).map(([g, n]) => `${g} = ${n.join(' + ')}`);
  L.push(`- Paires de superset : ${pairs.length ? pairs.join(' ; ') : 'aucune'}`);
  if (s.cardio) L.push(`- Bloc de cardio : ${s.cardio.nom}, ${s.cardio.minutes} min (semaines : ${s.cardio.weekMin.join(', ')}), intensité ${s.cardio.intensity}${s.cardio.fromWeek ? `, à partir de la semaine ${s.cardio.fromWeek}` : ''}`);
  else L.push('- Bloc de cardio : aucun');
  L.push(`- Retour au calme : ${wu(s.warmup.cooldown)}`);
  return L;
}

for (const p of PROFILS) {
  out.push(`## ${p.titre}`, '');
  const r = gen.generateProgram(p.input);
  const st = { titre: p.titre, ok: r.ok, jumpSessions: 0, jumpDetail: [] };
  stats.push(st);
  if (!r.ok) { out.push(`Aucun programme (${r.code}) : ${r.messages.map((m) => m.text).join(' ')}`, ''); continue; }
  const g = r.program;
  out.push(`Répartition : ${g.split}, ${g.sessions.length} séance(s) de force, ${g.cardioSessions?.length ?? 0} séance(s) dédiée(s) de cardio, ${g.lightDays.length} jour(s) léger(s). Durée visée : ${g.targetMin} min, programme de ${g.weeks} semaines.`, '');
  out.push('### Semaine type');
  const week = [
    ...g.sessions.map((s) => ({ d: s.weekday, t: `Séance ${s.label} (${s.type})`, m: s.estimatedMin + (s.cardio ? ` (dont bloc de cardio ${s.cardio.minutes})` : '') })),
    ...(g.cardioSessions ?? []).map((c) => ({ d: c.weekday, t: `${c.label}${c.kind ? ` [${c.kind}]` : ''}${c.jumps ? ' avec sauts' : ''}`, m: c.estimatedMin })),
    ...g.lightDays.map((l) => ({ d: l.weekday, t: 'Jour léger (facultatif)', m: l.estimatedMin })),
  ].sort((a, b) => a.d - b.d);
  week.forEach((w) => out.push(`- ${JOURS[w.d]} : ${w.t}, ${w.m} min`));
  out.push('', '### Détail des séances', '');
  g.sessions.forEach((s) => out.push(...sessionBlock(s), ''));
  (g.cardioSessions ?? []).forEach((c) => {
    out.push(`### ${c.label}${c.kind ? ` [${c.kind}]` : ''}, ${JOURS[c.weekday]}, environ ${c.estimatedMin} min`);
    if (c.warmup) out.push(`- Échauffement : ${wu(c.warmup)}`);
    if (c.jumps) {
      st.jumpSessions++; st.jumpDetail.push(`${c.label} (${JOURS[c.weekday]})`);
      out.push(`- Sauts en tête (contacts ${c.jumps.contacts}/${c.jumps.capContacts}) : ${c.jumps.items.map((j) => `${j.nom} ${j.sets} x ${j.reps}, repos ${j.restSec} s${j.soft ? ' [version douce]' : ''}`).join(' ; ')}`);
    } else out.push('- Sauts : aucun');
    out.push(`- Cardio : ${c.cardio.nom}, ${c.cardio.minutes} min (semaines : ${c.cardio.weekMin.join(', ')}), intensité ${c.cardio.intensity}, ${c.cardio.slowEndMin} min lentes à la fin${c.cardio.outdoor ? ', dehors possible' : ''}`, `- Repère : ${c.cardio.note}`, '');
  });
  if (g.lightDays.length) {
    out.push('### Jours légers');
    g.lightDays.forEach((l) => out.push(`- ${JOURS[l.weekday]} : ${l.general ? wu(l.general) : 'sans échauffement'} ; mobilité : ${l.mobility.map((m) => `${m.nom} (${m.sec} s)`).join(' ; ') || 'aucune'}${l.cardio ? ` ; cardio doux : ${l.cardio.nom} ${l.cardio.minutes} min` : ''}`));
    out.push('');
  }
  out.push('### Messages affichés');
  [...new Map([...r.messages, ...g.messages].map((m) => [m.id + m.text, m])).values()].forEach((m) => out.push(`- [${m.id}]${m.session ? ` (séance ${m.session})` : ''} ${m.text}`));
  out.push('', '### Explication du générateur', ...g.explanation.map((x) => `- ${x}`), '');
  const all = g.sessions.flatMap((s) => s.exercises.map((e) => e.ficheId));
  st.nbEx = all.length; st.distinct = new Set(all).size;
  st.doses = new Set(g.sessions.flatMap((s) => s.exercises.map((e) => dose(e)))).size;
  st.pairs = g.sessions.reduce((a, s) => a + new Set(s.exercises.map((e) => e.supersetGroup).filter(Boolean)).size, 0);
  const cnt = {}; all.forEach((f) => { cnt[f] = (cnt[f] ?? 0) + 1; });
  st.repeats = Object.entries(cnt).filter(([, n]) => n > 1).map(([f, n]) => `${f} x${n}`);
  st.overlap = [];
  for (let i = 0; i < g.sessions.length; i++) for (let j = i + 1; j < g.sessions.length; j++) {
    const a = new Set(g.sessions[i].exercises.map((e) => e.ficheId)); const b = g.sessions[j].exercises.map((e) => e.ficheId);
    st.overlap.push(`${g.sessions[i].label}/${g.sessions[j].label} : ${b.filter((x) => a.has(x)).length} commun(s) sur ${b.length}`);
  }
}

out.push('## Analyse (a) : séances avec sauts', '');
const variantes = [
  ['Volley intermédiaire 3 jours (séance de sport incluse par défaut)', { goal: 'sport', profile: { sports: ['volley'] }, equipment: eq(MAISON_E) }],
  ['Volley, séance de sport retirée par la personne', { goal: 'sport', profile: { sports: ['volley'] }, equipment: eq(MAISON_E), options: { seanceCardio: false } }],
  ['Prise de muscle intermédiaire 3 jours, sans option', { goal: 'muscle', profile: {}, equipment: eq(MAISON_E) }],
  ['Prise de muscle intermédiaire 3 jours, option « Ajouter une séance de cardio »', { goal: 'muscle', profile: {}, equipment: eq(MAISON_E), options: { seanceCardio: true } }],
  ['Volley intermédiaire, jours disponibles lundi / mardi / jeudi seulement', { goal: 'sport', profile: { sports: ['volley'], blockedWeekdays: [2, 4, 5, 6] }, equipment: eq(MAISON_E) }],
  ['Volley intermédiaire, 2 jours', { goal: 'sport', profile: { sports: ['volley'], daysPerWeek: 2 }, equipment: eq(MAISON_E) }],
  ['Volley débutant, 3 jours', { goal: 'sport', profile: { sports: ['volley'], level: 'debutant' }, equipment: eq(MAISON_E) }],
  ['Prise de muscle intermédiaire 3 jours, avec haltères, option cardio', { goal: 'muscle', profile: {}, equipment: eq(MAISON_HE), options: { seanceCardio: true } }],
];
for (const [t, o] of variantes) {
  const r = gen.generateProgram(mkInput({ ...o, profile: { level: 'intermediaire', daysPerWeek: 3, ...o.profile } }));
  if (!r.ok) { out.push(`- ${t} : aucun programme (${r.code})`); continue; }
  const g = r.program;
  const js = (g.cardioSessions ?? []).filter((c) => c.jumps && c.jumps.items.length);
  const heavy = g.sessions.map((s) => `${s.label}=${JOURS[s.weekday]}`).join(', ');
  const cs = (g.cardioSessions ?? []).map((c) => `${c.label}=${JOURS[c.weekday]}${c.jumps ? ' (sauts)' : ' (sans saut)'}`).join(', ') || 'aucune';
  const plyoMuscu = g.sessions.reduce((a, s) => a + s.exercises.filter((e) => /saut|jump|pliom/i.test(`${e.nom} ${e.variantNom}`)).length, 0);
  const msgs = [...r.messages, ...g.messages].filter((m) => ['T8', 'V-MSG-SPORT-MATCH', 'V-MSG-CARDIO-JOURS', 'V-MSG-CARDIO-IMPOS'].includes(m.id)).map((m) => `[${m.id}] ${m.text}`);
  out.push(`- ${t} : séances de force ${heavy} ; séances dédiées : ${cs} ; séances avec sauts : ${js.length} ; exercices de saut dans la musculation : ${plyoMuscu}.${msgs.length ? ' Messages : ' + msgs.join(' | ') : ''}`);
}
out.push('', '## Chiffres de répétitivité (semaine type, force)', '');
out.push('| Profil | Exercices placés | Distincts | Doses distinctes | Paires de superset |', '|---|---|---|---|---|');
stats.filter((s) => s.ok).forEach((s) => out.push(`| ${s.titre.slice(0, 60)} | ${s.nbEx} | ${s.distinct} | ${s.doses} | ${s.pairs} |`));
out.push('');
stats.filter((s) => s.ok).forEach((s) => out.push(`- ${s.titre.slice(0, 40)} : chevauchements ${s.overlap.join(' ; ')} ; exercices répétés : ${s.repeats.join(', ') || 'aucun'}`));
out.push('');
const prose = join(root, 'tools/demo-programmes-analyse.md');
if (existsSync(prose)) out.push(readFileSync(prose, 'utf8'));
writeFileSync(join(root, 'docs/programmes-exemples.md'), out.join('\n') + '\n');
console.log('ok', out.length, 'lignes');
