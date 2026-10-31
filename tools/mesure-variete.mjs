// D34 : mesure de la variété (recouvrement R entre séances, semaines 1 et 2) pour les 6 profils de tools/demo-programmes.mjs.
// Usage : node tools/mesure-variete.mjs [--detail]   (lecture seule ; le générateur TypeScript est empaqueté à la volée avec rolldown)
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = await rolldown({ input: join(root, 'src/generator/index.ts'), platform: 'node', logLevel: 'silent' });
const { output } = await bundle.generate({ format: 'esm' });
const gen = await import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString('base64')}`);
const { fiches } = JSON.parse(readFileSync(join(root, 'public/data/fiches.json'), 'utf8'));
const detail = process.argv.includes('--detail');

const eq = (tags) => ({ preset: 'perso', tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
const salle = { preset: 'F', tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
const HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
const E = ['elastique', 'chaise', 'poids_du_corps', 'tapis'];
const mk = (o) => ({
  profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], ...o.profile }, equipment: o.equipment,
  goals: [{ goalKey: o.goal, rank: 1 }, ...(o.second ? [{ goalKey: o.second, rank: 2 }] : [])], injuries: [], fiches,
  options: { gagnerDuTemps: true, ...(o.options ?? {}) },
});
const P = [
  ['P1 débutant muscle 3 j', mk({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(HE), goal: 'muscle' })],
  ['P2 interm. force 4 j salle', mk({ profile: { level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle' }, equipment: salle, goal: 'force' })],
  ['P3 interm. perte de gras 3 j', mk({ profile: { level: 'intermediaire', daysPerWeek: 3 }, equipment: eq(HE), goal: 'perte_gras', second: 'cardio', options: { seanceCardio: true } })],
  ['P4 interm. volley 3 j', mk({ profile: { level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, equipment: eq(E), goal: 'sport' })],
  ['P5 débutant sans matériel 3 j', mk({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(['poids_du_corps', 'tapis']), goal: 'muscle' })],
  ['P6 avancé 5 j salle', mk({ profile: { level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle' }, equipment: salle, goal: 'muscle' })],
];
const typeOf = (l) => (l.includes('-') ? l.split('-')[0] : 'CE');
const wk = (s, w) => s.exercises.map((e) => (w === 2 && e.alt ? e.alt : e));
for (const [t, input] of P) {
  const r = gen.generateProgram(input);
  if (!r.ok) { console.log(t, 'aucun programme', r.code); continue; }
  const g = r.program;
  const line = [];
  for (const w of [1, 2]) {
    let same = 0; let diff = 0;
    for (let i = 0; i < g.sessions.length; i++) for (let j = i + 1; j < g.sessions.length; j++) {
      const a = new Set(wk(g.sessions[i], w).map((e) => e.ficheId));
      const c = wk(g.sessions[j], w).filter((e) => a.has(e.ficheId)).length;
      if (typeOf(g.sessions[i].label) === typeOf(g.sessions[j].label)) same = Math.max(same, c); else diff = Math.max(diff, c);
    }
    line.push(`S${w} Rmax même type ${same}, types différents ${diff}`);
  }
  const rot = g.sessions.reduce((a, s) => a + s.exercises.filter((e) => e.alt && e.alt.ficheId !== e.ficheId).length, 0);
  const n = g.sessions.reduce((a, s) => a + s.exercises.length, 0);
  console.log(`${t} : ${line.join(' | ')} | rotation ${rot}/${n} | pénurie variété [${(g.penurieVariete ?? []).join(', ')}]`);
  if (detail) for (const s of g.sessions) console.log(`  ${s.label}: ${s.exercises.map((e) => `${e.slot}=${e.ficheId}${e.alt ? (e.alt.ficheId !== e.ficheId ? ` / ${e.alt.ficheId}` : ' (paire)') : ''}`).join(' ; ')}`);
}
