// D22 : fréquence d'apparition de chaque fiche dans les programmes générés (≈150 profils) ; sert à classer les fiches sans image. Lecture seule.
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

const eqs = [eq(HE), eq(E), eq(['poids_du_corps', 'tapis']), salle];
const goals = ['muscle', 'force', 'perte_gras', 'sport'];
for (const level of ['debutant', 'intermediaire', 'avance']) for (const g of goals) for (const [k, e] of eqs.entries()) for (const d of [2, 3, 4]) {
  const salleP = e === salle ? { place: 'salle', sessionDurationMin: 60 } : {};
  P.push([`${level}/${g}/eq${k}/${d}j`, mk({ profile: { level, daysPerWeek: d, ...salleP }, equipment: e, goal: g })]);
}

const count = new Map();
let ok = 0;
for (const [, input] of P) {
  const r = gen.generateProgram(input);
  if (!r.ok) continue;
  ok++;
  const seen = new Set();
  for (const s of r.program.sessions) for (const e of s.exercises) for (const id of [e.ficheId, e.alt?.ficheId]) if (id) seen.add(id);
  for (const id of seen) count.set(id, (count.get(id) ?? 0) + 1);
}
console.log(JSON.stringify({ programmes: ok, usage: Object.fromEntries([...count].sort((a, b) => b[1] - a[1])) }));
