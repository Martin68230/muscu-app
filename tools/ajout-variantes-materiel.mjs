// Ajoute des variantes de MATÉRIEL à des fiches existantes quand le geste est identique (décision du 25/11/2026 : objectif >= 15 fiches par matériel).
// La variante est ajoutée en dernière ligne du tableau (échelon de la dernière ligne, niveau = max(dernier niveau, niveau minimal du matériel)). Idempotent.
// Usage : node tools/ajout-variantes-materiel.mjs   (lit la table ci-dessous ; écrit dans les fichiers des fiches)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAT = {
  sac_a_dos: { nom: 'Avec un sac à dos', min: 'debutant', ins: 'Sac à dos chargé (livres, bouteilles), sangles serrées, sac qui ne bouge pas' },
  bidons_ou_sacs: { nom: 'Avec des bidons ou des sacs', min: 'debutant', ins: 'Deux bidons ou sacs de courses de poids égal, anses solides' },
  sac_de_sable: { nom: 'Avec un sac de sable', min: 'intermediaire', ins: 'Sac de sable fermé et stable, poids que tu contrôles' },
  mini_bande: { nom: 'Avec une mini-bande', min: 'debutant', ins: 'Mini-bande élastique en boucle, placée comme indiqué, sans qu’elle roule ni glisse' },
  box_ou_step: { nom: 'Avec une box', min: 'debutant', ins: 'Box ou step large et stable, qui ne glisse pas' },
  marche_escalier: { nom: 'Avec une marche', min: 'debutant', ins: 'Marche solide et antidérapante, rebord large' },
};
// [fiche, matériel, tags en plus, précision de position]
const L = [];
const add = (mat, extra, list) => list.forEach(([f, ex = extra, pos]) => L.push([f, mat, ex, pos]));
add('sac_a_dos', [], [['squat-gobelet', [], 'tenu serré contre la poitrine, à deux bras'], ['fente-avant', [], 'porté sur le dos'], ['fente-arriere', [], 'porté sur le dos'], ['squat-fendu', [], 'porté sur le dos'], ['pont-fessier', ['tapis'], 'posé sur les hanches, tenu à deux mains'], ['squat-sumo', [], 'tenu à deux mains entre les jambes'], ['porte-valise', [], 'tenu par la poignée d’une main'], ['montee-sur-marche', ['marche_escalier'], 'porté sur le dos'], ['releve-mollets', [], 'porté sur le dos'], ['souleve-de-terre-roumain-unijambiste', [], 'tenu devant les cuisses'] ]);
add('bidons_ou_sacs', [], [['squat-gobelet', [], 'un bidon tenu contre la poitrine'], ['fente-avant', [], 'un bidon dans chaque main, bras le long du corps'], ['squat-fendu', [], 'un bidon dans chaque main'], ['squat-sumo', [], 'un bidon tenu entre les jambes'], ['pont-fessier', ['tapis'], 'un bidon posé sur les hanches'], ['releve-mollets', [], 'un bidon dans chaque main'], ['montee-sur-marche', ['marche_escalier'], 'un bidon dans chaque main'], ['fente-arriere', [], 'un bidon dans chaque main'], ['souleve-de-terre-roumain-unijambiste', [], 'un bidon tenu devant les cuisses'], ['squat-cosaque', [], 'un bidon tenu contre la poitrine'], ['squat-gobelet-banc', ['banc'], 'un bidon tenu contre la poitrine'] ]);
add('sac_de_sable', [], [['porte-valise', [], 'un sac dans une main'], ['marche-du-fermier', [], 'un sac dans chaque main'], ['squat-gobelet', [], 'tenu contre la poitrine'], ['squat-sumo', [], 'tenu entre les jambes'], ['fente-avant', [], 'tenu contre la poitrine'], ['squat-fendu', [], 'tenu contre la poitrine'], ['pont-fessier', ['tapis'], 'posé sur les hanches'], ['montee-sur-marche', ['marche_escalier'], 'tenu contre la poitrine'], ['souleve-de-terre-roumain-unijambiste', [], 'tenu devant les cuisses'], ['fente-arriere', [], 'tenu contre la poitrine'], ['squat-cosaque', [], 'tenu contre la poitrine'] ]);
add('mini_bande', [], [['squat-poids-du-corps', [], 'au-dessus des genoux, genoux poussés vers l’extérieur'], ['pont-fessier', ['tapis'], 'au-dessus des genoux, genoux poussés vers l’extérieur'], ['pont-fessier-pause', ['tapis'], 'au-dessus des genoux'], ['pont-fessier-pieds-sureleves', ['tapis', 'chaise'], 'au-dessus des genoux'], ['squat-sumo', [], 'au-dessus des genoux'], ['fente-laterale', [], 'au-dessus des genoux'], ['marche-laterale-poids-du-corps', [], 'au-dessus des genoux'], ['squat-descente-lente', [], 'au-dessus des genoux'], ['extension-hanche-debout-appui', ['mur'], 'autour des chevilles'] ]);
add('box_ou_step', [], [['squat-bulgare', [], 'pied arrière posé sur la box'], ['montee-sur-banc', [], 'pied posé sur la box'], ['pont-fessier-pieds-sureleves', ['tapis'], 'pieds sur la box'], ['hip-thrust-banc', ['banc'], 'haut du dos appuyé sur la box'], ['releve-mollets', [], 'pointes de pieds sur le bord de la box'], ['montee-laterale-marche', [], 'pied posé sur la box'], ['montee-rapide-chaise', ['mur'], 'pied posé sur la box'], ['releve-bassin-marche', ['tapis'], 'pieds sur la box'], ['releve-mollets-assis', ['chaise'], 'pieds sur la box'] ]);
add('marche_escalier', [], [['pont-fessier-pieds-sureleves', ['tapis'], 'pieds sur la marche'], ['montee-sur-banc', [], 'pied posé sur la marche'], ['squat-assis-debout', [], 'assis sur la marche du bas'], ['montee-rapide-chaise', ['mur'], 'pied posé sur la marche'], ['releve-bassin-marche', ['tapis'], 'pieds sur la marche'] ]);
const LV = ['debutant', 'intermediaire', 'avance'];
const files = []; (function w(d) { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) { if (e.name !== 'ecartees') w(p); } else if (e.name.endsWith('.md') && !/README|CONTROLE|BILAN|CAMPAGNE/.test(e.name)) files.push(p); } })(join(root, 'knowledge', 'exercices'));
const byId = new Map(); for (const p of files) { const m = /^id:\s*(\S+)/m.exec(readFileSync(p, 'utf8')); if (m) byId.set(m[1], p); }
const slug = (s) => s.replace(/_/g, '-');
let n = 0; const manque = [];
for (const [fiche, mat, extra, pos] of L) {
  const p = byId.get(fiche); if (!p) { manque.push(fiche); continue; }
  const eol = readFileSync(p, 'utf8').includes('\r\n') ? '\r\n' : '\n';
  const lines = readFileSync(p, 'utf8').split(/\r?\n/);
  const vid = fiche + '-' + slug(mat);
  if (lines.some((l) => l.startsWith('| ' + vid + ' |'))) continue;
  const i0 = lines.findIndex((l) => l.startsWith('| id variante'));
  let i = i0 + 2; while (lines[i]?.startsWith('|')) i++;
  const last = lines[i - 1].split('|').map((x) => x.trim()); // ['', id, nom, echelon, niveau, tags, install, '']
  const niveau = LV[Math.max(LV.indexOf(last[4]), LV.indexOf(MAT[mat].min))];
  const tags = [mat, ...extra, ...(last[5].includes('mur') && extra.includes('mur') ? [] : [])];
  const row = `| ${vid} | ${MAT[mat].nom} | ${last[3]} | ${niveau} | ${[...new Set(tags)].join(', ')} | ${MAT[mat].ins} : ${pos}. |`;
  lines.splice(i, 0, row);
  writeFileSync(p, lines.join(eol)); n++;
}
console.log(n + ' variantes ajoutées' + (manque.length ? ' ; fiches introuvables : ' + manque.join(', ') : ''));
