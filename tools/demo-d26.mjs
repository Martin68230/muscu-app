// Démo D26 : répartition du core (tronc) par semaine et paires formées, pour les 4 profils de démonstration
// (knowledge/core-et-supersets.md §7.3 : D1 à D4). Usage : node tools/demo-d26.mjs
// Le générateur (TypeScript) est empaqueté à la volée avec rolldown (déjà installé avec Vite), comme tools/demo-generateur.mjs.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = await rolldown({ input: join(root, 'src/generator/index.ts'), platform: 'node', logLevel: 'silent' });
const { output } = await bundle.generate({ format: 'esm' });
const gen = await import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString('base64')}`);
const { fiches } = JSON.parse(readFileSync(join(root, 'public/data/fiches.json'), 'utf8'));

const B1 = ['barre', 'barre_ez', 'disques', 'rack', 'kettlebell', 'lest', 'sac_de_sable', 'machine', 'poulie'];
/** PR-B-H : squat-gobelet et soulevé roumain aux haltères forcés, jambes et tirages sans matériel lourd (0 séance lourde). */
const fixBH = fiches.flatMap((f) => {
  if (f.schema === 'squat' && f.id !== 'squat-gobelet') return [];
  if (f.schema === 'charniere' && f.id !== 'souleve-de-terre-roumain-halteres') return [];
  if (!['squat', 'fente', 'charniere', 'tirage_h', 'tirage_v'].includes(f.schema)) return [f];
  const v = f.variantes.filter((x) => !x.tags.some((t) => B1.includes(t)));
  return v.length ? [{ ...f, variantes: v.map((x, i) => (i === 0 ? { ...x, echelon: 1 } : x)) }] : [];
});
/** PR-B-L : squat arrière et soulevé de terre à la barre forcés dans les 3 séances (3 séances lourdes). */
const fixBL = fiches.filter((f) => !((f.schema === 'squat' && f.id !== 'squat-arriere-barre') || f.schema === 'fente' || (f.schema === 'charniere' && f.id !== 'souleve-de-terre-barre')));

const eq = (tags, extra = {}) => ({ preset: 'perso', tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10], kettlebellWeightsKg: [8, 12], ...extra });
const salle = { ...eq([]), preset: 'F' };
const base = (o) => ({ profile: { blockedWeekdays: [], place: 'maison', ...o.profile }, equipment: o.equipment, goals: [{ goalKey: o.goal, rank: 1 }], injuries: o.injuries ?? [], fiches: o.fiches ?? fiches, options: { gagnerDuTemps: true } });

const PROFILS = [
  ['D1 débutant maison 2 jours (PR-A), « gagner du temps »', base({ profile: { level: 'debutant', daysPerWeek: 2, sessionDurationMin: 30 }, equipment: eq(['elastique']), goal: 'sante' })],
  ['D2 intermédiaire salle (PR-B-H, 3 jours en attendant la phase 4)', base({ profile: { level: 'intermediaire', daysPerWeek: 3, sessionDurationMin: 60, place: 'salle' }, equipment: salle, goal: 'muscle', fiches: fixBH })],
  ['D2 bis : version PR-B-L (charges lourdes forcées)', base({ profile: { level: 'intermediaire', daysPerWeek: 3, sessionDurationMin: 60, place: 'salle' }, equipment: salle, goal: 'muscle', fiches: fixBL })],
  ['D3 grossesse 3 jours (PR-G, débutante)', base({ profile: { level: 'debutant', daysPerWeek: 3, sessionDurationMin: 45, pregnancy: 'enceinte' }, equipment: eq(['elastique']), goal: 'sante' })],
  ['D3 bis : grossesse, intermédiaire', base({ profile: { level: 'intermediaire', daysPerWeek: 3, sessionDurationMin: 45, pregnancy: 'enceinte' }, equipment: eq(['elastique']), goal: 'sante' })],
  ['D4 douleur lombaire niveau 2 (PR-I)', base({ profile: { level: 'intermediaire', daysPerWeek: 3, sessionDurationMin: 60, place: 'salle' }, equipment: salle, goal: 'muscle', injuries: [{ zone: 'dos', level: 2, active: true }] })],
];

const FAM = { gainage: 'CF1 gainage', anti_rotation: 'CF2 anti-rotation', rotation: 'CF3 rotation', flexion: 'CF4 flexion', extension: 'CF5 extension' };
const dose = (e) => (e.unit === 'sec' ? `${e.sets} x ${e.holdSec} s` : `${e.sets} x ${e.repsMin}-${e.repsMax}${e.unit === 'reps_par_cote' ? ' par côté' : ''}`);
const lines = [];
for (const [titre, input] of PROFILS) {
  lines.push(`\n=== ${titre} ===`);
  const r = gen.generateProgram(input);
  if (!r.ok) {
    lines.push(`Aucun programme (${r.code}) : ${r.messages.map((m) => m.text).join(' ')}`);
    continue;
  }
  let sessions = 0;
  let sets = 0;
  for (const s of r.program.sessions) {
    const core = s.exercises.filter((e) => e.slot === 'tronc' && e.coreFamily);
    const pairs = [...new Set(s.exercises.map((e) => e.supersetGroup).filter(Boolean))].map((g) => s.exercises.filter((e) => e.supersetGroup === g).map((e) => e.nom).join(' + '));
    if (core.length) sessions++;
    sets += core.reduce((a, e) => a + e.sets, 0);
    const pos = core.map((e) => `${s.exercises.indexOf(e) + 1}/${s.exercises.length}`).join(', ');
    lines.push(`Séance ${s.label} : core ${core.length ? core.map((e) => `${e.nom} (${FAM[e.coreFamily]}, ${dose(e)}${e.capped ? ', capped' : ''}, position ${pos})`).join(' ; ') : 'aucun'}`);
    lines.push(`  paires : ${pairs.length ? pairs.join(' ; ') : 'aucune'}`);
  }
  lines.push(`Semaine : ${sessions} séance(s) avec core, ${sets} série(s) de core.`);
  const neutral = r.program.messages.filter((m) => ['V-MSG-TRONC', 'R3'].includes(m.id)).map((m) => m.text);
  if (neutral.length) lines.push(`Messages : ${neutral.join(' | ')}`);
}
console.log(lines.join('\n'));
