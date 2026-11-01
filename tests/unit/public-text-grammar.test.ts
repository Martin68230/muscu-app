// Grammaire des textes publics : un remplacement de jargon (étiquettes d'action « amplitude:mi-course »,
// « appui:avant-bras ») ne doit JAMAIS casser une phrase ordinaire (« descente à mi-course », « planche sur les avant-bras »).
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-ignore -- module d'outil (JS)
import { textFields } from '../../tools/public-text.mjs';
import { cleanText } from '../../src/data/fiches';

/** Motifs d'une tournure fautive. Chacun a un nom lisible pour le message d'échec. */
export const FAULTS: [string, RegExp][] = [
  // « seulement seulement », « sur les sur les » : un mot ou un groupe de deux mots répété à la suite.
  ['doublon de mots adjacents', /(?<![\p{L}'’-])([\p{L}'’-]{2,}(?:\s+[\p{L}'’-]{2,})?)\s+\1(?![\p{L}-])/iu],
  // Libellé d'amplitude inséré dans une phrase ordinaire.
  ['« moitié seulement » / « mouvement à moitié »', /moitié seulement|mouvement à moitié/i],
  ['« à mouvement » (préposition + libellé d’amplitude)',/\bà mouvement\b/i],
  // Libellé d'appui (« sur les avant-bras ») collé après un article, une préposition ou une élision : l'étiquette a remplacé un nom.
  ['« sur les avant-bras » après article ou élision', /(?:\b(?:le|la|les|des|du|aux?|ses|tes|leurs?|mes|nos|vos|ces?|cette|tout|tous)\s+|\b[ldjnmtsc]['’])sur les avant-bras/i],
  ['« sur les avant-bras » précédé d\'une préposition + « sur »', /\b(?:sur|à|de|avec)\s+sur les\b/i],
  // Étiquette brute restée dans le texte.
  ['étiquette technique brute (amplitude:, appui:, variante:)', /\b(?:amplitude|appui|variante|charge):[a-z_.-]+|`/i],
];

export function grammarFaults(text: string): string[] {
  return FAULTS.filter(([, re]) => re.test(text)).map(([name]) => name);
}

const ALL: any[] = JSON.parse(readFileSync('public/data/fiches.json', 'utf8')).fiches;

function publishedFaults(fiches: any[]): string[] {
  const bad: string[] = [];
  for (const f of fiches)
    for (const [get] of textFields(f)) {
      const t = get();
      if (typeof t !== 'string') continue;
      for (const name of grammarFaults(t)) bad.push(`${f.id} [${name}] : ${t.slice(0, 140)}`);
    }
  return bad;
}

describe('textes publics : aucune tournure issue d\'un remplacement de jargon raté', () => {
  it('fiches.json : aucune phrase publiée ne contient un doublon de mots ou un libellé mal placé', () => {
    expect(publishedFaults(ALL)).toEqual([]);
  });

  it('le détecteur échoue sur une phrase fautive injectée (preuve que le test voit les défauts)', () => {
    const copy = JSON.parse(JSON.stringify(ALL));
    copy[0].consignes[0] = 'Descends à mouvement à moitié seulement seulement, coudes sur les sur les avant-bras.';
    const bad = publishedFaults(copy);
    expect(bad.length).toBeGreaterThanOrEqual(3);
  });

  it('chaque motif reconnaît sa tournure fautive et laisse passer la phrase correcte', () => {
    expect(grammarFaults('coudes qui descendent à mouvement à moitié seulement seulement')).toEqual(
      expect.arrayContaining(['doublon de mots adjacents', '« moitié seulement » / « mouvement à moitié »']),
    );
    expect(grammarFaults("poignets alignés avec l'sur les avant-bras")).toContain('« sur les avant-bras » après article ou élision');
    expect(grammarFaults('appuie-toi sur les sur les avant-bras')).toContain('doublon de mots adjacents');
    expect(grammarFaults('adapter : amplitude:mi-course')).toHaveLength(1);
    expect(grammarFaults('descente à mi-course ; planche sur les avant-bras, coudes sous les épaules')).toEqual([]);
    expect(grammarFaults('Appuie-toi sur les poings fermés ou sur les avant-bras.')).toEqual([]);
  });
});

describe('cleanText : le français ordinaire n\'est jamais remplacé', () => {
  it('« mi-course » et « avant-bras » dans une phrase restent tels quels', () => {
    expect(cleanText('Descente à mi-course, appui sur l\'avant-bras.')).toBe('Descente à mi-course, appui sur l\'avant-bras.');
    expect(cleanText('Les avant-bras restent à plat.')).toBe('Les avant-bras restent à plat.');
  });
  it('les étiquettes techniques, elles, sont traduites', () => {
    expect(cleanText('adapter : amplitude:mi-course')).toBe('adapter : mouvement à moitié seulement');
    expect(cleanText('adapter : appui:avant-bras')).toBe('adapter : sur les avant-bras');
  });
});
