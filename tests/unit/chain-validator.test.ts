// D23 : « plus facile » / « plus dur » ne relient que des fiches de même schéma ET de même muscle principal.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-ignore -- module d'outil (JS)
import { listFiches, validateLot } from '../../tools/validate-fiches.mjs';

const fiche = (id: string, schema: string, muscle: string, facile = 'aucun', dur = 'aucun') => ({
  name: `${id}.md`,
  text: `---\nid: ${id}\nnom: ${id}\nschema: ${schema}\ntype: force\nniveau_min: debutant\nmuscles_principaux: [${muscle}]\nmuscles_secondaires: []\nsource_brouillon: []\nstatut: brouillon_coach\n---\n\n## Progression / régression\n- plus-facile : ${facile}\n- plus-dur : ${dur}\n`,
});
const chain = (files: { name: string; text: string }[], exempt: string[] = []) =>
  (validateLot(files, { chainExemptions: new Set(exempt) }).issues as { categorie: string; severite: string; message: string }[]).filter((i) => i.categorie === 'chaine-muscle');

describe('chaînes de progression pilotées par le muscle principal et le schéma', () => {
  it('même schéma et même muscle principal : accepté', () => {
    expect(chain([fiche('pompe', 'poussee_h', 'pectoraux', 'aucun', 'pompe-archer'), fiche('pompe-archer', 'poussee_h', 'pectoraux', 'pompe', 'aucun')])).toEqual([]);
  });
  it('cas imposé : la pompe diamant (triceps) ne peut pas être un « plus dur » de la pompe classique (pectoraux)', () => {
    const r = chain([fiche('pompe', 'poussee_h', 'pectoraux', 'aucun', 'pompe-diamant'), fiche('pompe-diamant', 'poussee_h', 'triceps', 'aucun', 'aucun')]);
    expect(r).toHaveLength(1);
    expect(r[0].severite).toBe('erreur');
    expect(r[0].message).toMatch(/muscle principal différent \(pectoraux \/ triceps\)/);
  });
  it('autre schéma : refusé (pompe piquée : poussée verticale)', () => {
    const r = chain([fiche('pompe', 'poussee_h', 'pectoraux', 'aucun', 'pompe-piquee'), fiche('pompe-piquee', 'poussee_v', 'pectoraux')]);
    expect(r[0].message).toMatch(/schéma différent \(poussee_h \/ poussee_v\)/);
  });
  it('écart connu listé : simple avertissement ; exception devenue inutile : erreur', () => {
    const files = [fiche('pompe', 'poussee_h', 'pectoraux', 'aucun', 'pompe-diamant'), fiche('pompe-diamant', 'poussee_h', 'triceps')];
    expect(chain(files, ['pompe>pompe-diamant']).map((i) => i.severite)).toEqual(['avertissement']);
    const fixed = [fiche('pompe', 'poussee_h', 'pectoraux'), fiche('pompe-diamant', 'poussee_h', 'triceps')];
    const r = chain(fixed, ['pompe>pompe-diamant']);
    expect(r).toHaveLength(1);
    expect(r[0].severite).toBe('erreur');
    expect(r[0].message).toMatch(/n'existe plus/);
  });
  it('bibliothèque réelle : aucun NOUVEL écart (seuls les écarts de CHAINES-A-CORRIGER.json restent, en avertissement)', () => {
    const dir = 'knowledge/exercices';
    const files = (listFiches(dir) as string[]).map((n) => ({ name: n, text: readFileSync(`${dir}/${n}`, 'utf8') }));
    const exempt: string[] = JSON.parse(readFileSync(`${dir}/CHAINES-A-CORRIGER.json`, 'utf8')).ecarts;
    expect(chain(files, exempt).filter((i) => i.severite === 'erreur')).toEqual([]);
    expect(exempt).toContain('pompe>pompe-diamant');
  });
});
