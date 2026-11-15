// Mesure des mollets dans les séances de jambes (BAS / LEGS) : balayage de profils (niveau, 3 à 6 jours, durée, lieu, matériel, objectif).
// Usage : node tools/mesure-mollets.mjs [--detail]   (lecture seule ; générateur empaqueté avec rolldown ; npm run fiches avant)
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
const tagsJson = JSON.parse(readFileSync(join(root, 'knowledge/materiel-tags.json'), 'utf8'));
const QUOT = ['sac_a_dos', 'bidons_ou_sacs', 'box_ou_step'];
const D = [...QUOT, 'halteres', 'elastique', 'barre_traction'];
const PROFILES = {
  A0: { tags: [], preset: 'perso' }, B: { tags: [...QUOT, 'elastique'], preset: 'perso' }, C: { tags: [...QUOT, 'halteres'], preset: 'perso' },
  E: { tags: [...new Set([...D, ...tagsJson.tags.filter((t) => t.groupe === 'maison').map((t) => t.id)])], preset: 'perso' }, F: { tags: [], preset: 'F' },
};
const mk = ({ profile, level, days, dur, place, goal }) => ({
  profile: { level, daysPerWeek: days, blockedWeekdays: [], sessionDurationMin: dur, place, pregnancy: null },
  equipment: { preset: PROFILES[profile].preset, tags: PROFILES[profile].tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10], kettlebellWeightsKg: [8, 12] },
  goals: [{ goalKey: goal, rank: 1 }], injuries: [], fiches, options: { gagnerDuTemps: true },
});
const one = process.argv.includes('--one');
const isCalf = (e) => e.musclesPrincipaux.includes('mollets');
const legType = (l) => /^(BAS|LEGS)/.test(l);
let total = 0; let without = 0; const byCause = {}; const rows = [];
for (const level of one ? [] : ['debutant', 'intermediaire', 'avance']) for (const days of [3, 4, 5, 6]) for (const dur of [45, 60, 75])
  for (const profile of Object.keys(PROFILES)) for (const goal of ['muscle', 'force', 'perte_gras'])
    for (const place of profile === 'F' ? ['salle'] : ['maison']) {
      const r = gen.generateProgram(mk({ profile, level, days, dur, place, goal }));
      if (!r.ok) continue;
      for (const s of r.program.sessions) {
        if (!legType(s.label)) continue;
        total++;
        const sets = s.exercises.filter(isCalf).reduce((a, e) => a + e.sets, 0);
        if (sets === 0) {
          without++;
          const key = `${level}|${goal}`; byCause[key] = (byCause[key] ?? 0) + 1;
          if (detail) rows.push(`libre ${Math.round(dur*60-s.estimatedSec)}s ${level} ${days}j ${dur}min ${profile} ${goal} ${s.label} (${s.exercises.length} ex)`);
        }
      }
    }
console.log(`séances de jambes (BAS / LEGS) : ${total} ; sans mollets : ${without}`);
console.log('par niveau|objectif :', JSON.stringify(byCause));
if (detail) console.log(rows.slice(0, 80).join('\n'));
if (process.argv.includes('--one')) {
  const [level, days, dur, profile, goal] = process.argv[process.argv.indexOf('--one') + 1].split(',');
  const r = gen.generateProgram(mk({ profile, level, days: +days, dur: +dur, place: profile === 'F' ? 'salle' : 'maison', goal }));
  for (const s of r.program.sessions) console.log(s.label, `~${s.estimatedMin ?? '?'}min`, s.exercises.map((e) => `${e.slot}:${e.ficheId}${e.slot === "tronc" ? "[" + e.variantId + (e.perSide ? " cote" : "") + "]" : ""}x${e.sets}`).join(' | '));
  console.log((r.program.messages ?? []).map((m) => m.id).join(','));
}
