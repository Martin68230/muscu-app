// Démo du générateur v1 : affiche en texte le programme de 3 profils d'exemple.
// Usage : node tools/demo-generateur.mjs
// Le générateur (TypeScript) est empaqueté à la volée avec rolldown (déjà installé avec Vite), puis importé.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = await rolldown({ input: join(root, 'src/generator/index.ts'), platform: 'node', logLevel: 'silent' });
const { output } = await bundle.generate({ format: 'esm' });
const gen = await import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString('base64')}`);
const { fiches } = JSON.parse(readFileSync(join(root, 'public/data/fiches.json'), 'utf8'));

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const eq = (tags, extra = {}) => ({ preset: 'perso', tags, disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [], ...extra });

const PROFILS = [
  {
    titre: '1. Maison sans matériel, débutant, 3 jours, 30 min, objectif santé',
    input: { profile: { level: 'debutant', daysPerWeek: 3, blockedWeekdays: [], sessionDurationMin: 30, place: 'maison' }, equipment: eq([]), goals: [{ goalKey: 'sante', rank: 1 }] },
  },
  {
    titre: '2. Haltères + élastique, intermédiaire, 2 jours, 45 min, muscle, genou niveau 2',
    input: {
      profile: { level: 'intermediaire', daysPerWeek: 2, blockedWeekdays: [], sessionDurationMin: 45, place: 'maison' },
      equipment: eq(['halteres', 'elastique'], { dumbbellWeightsKg: [4, 6, 8, 10, 12] }),
      goals: [{ goalKey: 'muscle', rank: 1 }],
      injuries: [{ zone: 'genou', level: 2, active: true }],
    },
  },
  {
    titre: '3. Salle, avancé, 3 jours, sans limite, objectif force, enceinte',
    input: {
      profile: { level: 'avance', daysPerWeek: 3, blockedWeekdays: [], sessionDurationMin: null, place: 'salle', pregnancy: 'enceinte' },
      equipment: { ...eq([], { dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], kettlebellWeightsKg: [8, 12, 16] }), preset: 'F' },
      goals: [{ goalKey: 'force', rank: 1 }],
    },
  },
];

const dose = (e) => {
  const reps = e.unit === 'sec' ? `${e.holdSec} s` : `${e.repsMin}-${e.repsMax}${e.unit === 'reps_par_cote' ? '/côté' : ''}`;
  const rir = e.rirAsked ? `, réserve ${e.rirTarget}` : '';
  const load = e.startLoadKg != null ? `, départ ${e.startLoadKg} kg` : '';
  const flags = [e.capped ? 'charge bloquée' : '', e.substitut ? 'substitut' : '', e.supersetGroup ? `superset ${e.supersetGroup}` : '', e.adaptations.join(' ')].filter(Boolean).join(' ; ');
  return `${e.sets} x ${reps}${rir}, repos ${e.restSec} s${load}${flags ? ` [${flags}]` : ''}`;
};

for (const { titre, input } of PROFILS) {
  console.log(`\n=== ${titre} ===`);
  const r = gen.generateProgram({ ...input, fiches });
  if (!r.ok) {
    console.log(`Pas de programme (${r.code}) :`);
    for (const m of r.messages) console.log(`  - ${m.text}`);
    continue;
  }
  const p = r.program;
  console.log(p.explanation.join('\n'));
  console.log(`Durée choisie ${p.durationMin} min ; bloc de ${p.weeks} semaines ; famille ${p.family}.`);
  for (const s of p.sessions) {
    console.log(`\n Séance ${s.label} (${JOURS[s.weekday]}) — environ ${s.estimatedMin} min (${Math.round(s.estimatedSec)} s)`);
    const w = s.warmup;
    console.log(`   Échauffement : ${w.general ? w.general.nom : 'marche'} ${w.generalSec} s ; ${w.mobility.map((m) => m.nom).join(', ') || '—'}`);
    for (const e of s.exercises) console.log(`   - [${e.slot}] ${e.nom} / ${e.variantNom} (éch. ${e.echelon}) : ${dose(e)}`);
    if (s.removedCore.length) console.log(`   retiré pour la durée : ${s.removedCore.join(', ')}`);
  }
  if (p.messages.length) {
    console.log('\n Messages :');
    for (const m of p.messages) console.log(`  - [${m.id}${m.session ? ` ${m.session}` : ''}] ${m.text}`);
  }
}
