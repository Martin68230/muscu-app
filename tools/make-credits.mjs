// Produit src/data/credits.json (page « Crédits », D12) : node tools/make-credits.mjs
// Sources : les fichiers réellement présents dans public/photos/ et public/illustrations/, et les licences
// vérifiées notées dans tools/photos.md. Une source sans image dans le dépôt n'apparaît pas dans l'app.
// Everkinetic et wger : un fichier public/photos/<source>/credits.json liste chaque image
// [{ "file", "titre", "auteur", "licence", "licenceUrl", "url" }] (auteur et licence PAR IMAGE pour wger).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const count = (dir, ext) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(ext)).length : 0);
const perImage = (dir) => {
  const p = join(dir, 'credits.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : [];
};

const photos = join(root, 'public', 'photos');
const sources = [];

const fed = count(join(photos, 'free-exercise-db'), '.webp');
if (fed) sources.push({
  id: 'free-exercise-db',
  titre: 'free-exercise-db (yuhonas)',
  detail: 'Photos d\'exercices, recadrées et réduites pour l\'app.',
  licence: 'Unlicense (domaine public)',
  licenceUrl: 'https://unlicense.org/',
  url: 'https://github.com/yuhonas/free-exercise-db',
  images: fed,
});

const ever = perImage(join(photos, 'everkinetic'));
if (ever.length) sources.push({
  id: 'everkinetic',
  titre: 'Everkinetic',
  detail: 'Dessins d\'exercices de Greg Priday, recadrés et réduits ; ils restent sous la même licence (partage dans les mêmes conditions).',
  licence: 'CC BY-SA 4.0',
  licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.fr',
  url: 'https://github.com/everkinetic/data',
  images: ever.length,
  liste: ever,
});

const wger = perImage(join(photos, 'wger'));
if (wger.length) sources.push({
  id: 'wger',
  titre: 'wger',
  detail: 'Images de la base publique wger.de ; auteur et licence de chaque image ci-dessous.',
  licence: 'selon l\'image (CC0, CC BY, CC BY-SA)',
  licenceUrl: 'https://wger.de/fr/software/api',
  url: 'https://wger.de',
  images: wger.length,
  liste: wger,
});

const illustrations = count(join(root, 'public', 'illustrations'), '.svg');
sources.push({
  id: 'illustrations',
  titre: 'Illustrations de l\'app',
  detail: 'Dessins schématiques créés pour cette app. Ils ne reprennent aucune image d\'une autre application.',
  licence: 'Création de l\'app',
  licenceUrl: null,
  url: null,
  images: illustrations,
});

const credits = {
  sources,
  videos: 'Les vidéos affichées par le bouton « Voir une vidéo » sont des vidéos YouTube publiques, lues avec le lecteur officiel (mode sans cookies) et seulement après ton appui. Elles restent la propriété de leurs auteurs ; l\'app ne les copie pas.',
};

mkdirSync(join(root, 'src', 'data'), { recursive: true });
writeFileSync(join(root, 'src', 'data', 'credits.json'), JSON.stringify(credits, null, 2) + '\n');
console.log(`credits.json : ${sources.map((s) => `${s.id} ${s.images}`).join(', ')}`);
