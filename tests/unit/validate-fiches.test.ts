import { describe, expect, it } from 'vitest';
import { parseCase, validateLot } from '../../tools/validate-fiches.mjs';

const TAGS = { ids: new Set(['poids_du_corps', 'mur', 'chaise', 'halteres', 'marche_escalier', 'box_ou_step']), remplaces: { marche_ou_box: 'marche_escalier' } };

/** Fiche minimale valide ; `over` remplace des morceaux. */
function fiche(over: Partial<Record<'fm' | 'variantes' | 'secu' | 'progression' | 'photo' | 'consignes' | 'sources', string>> = {}, id = 'pompe-inclinee') {
  const fm = over.fm ?? `id: ${id}
nom: Pompe inclinée
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps]   # commentaire
source_brouillon: [M1418]
statut: complete_kine`;
  return `---
${fm}
---
## Variantes (installation + matériel)
${over.variantes ?? `| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| ${id}-mur | Au mur | 1 | debutant | mur | Face au mur. |
| ${id}-chaise | Sur chaise | 2 | debutant | chaise, mur | Chaise calée. |
| ${id}-chaise-b | Autre chaise | 2 | debutant | chaise | Chaise basse. |
| ${id}-marche | Sur marche | 3 | intermediaire | marche_escalier | Première marche. |`}
## Consignes
${over.consignes ?? '1. A\n2. B\n3. C\n4. D'}
## Points d'attention
- x
## Erreurs fréquentes
- x
## Progression / régression
${over.progression ?? `- plus-facile : aucun
- plus-dur : ${id}-marche, a-creer:pompe-archer`}
## Repères de dosage
Voir program-logic.md.
## Sécurité et contre-indications
${over.secu ?? `| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | adapter: variante:${id}-mur | retirer |
| Poignet | adapter: appui:poings-fermes | adapter: charge:legere | retirer: sans-zone:${id}-mur |
| Dos | garder | retirer: remplacant:${id}-mur | retirer |

**Version plus douce** : ${id}-mur
**Grossesse** : adapter: variante:${id}-chaise

**Notes**
- epaule-n2 : texte affiché.
- grossesse : post-partum, voir G7.`}
## Photo
${over.photo ?? '- `Incline_Push-Up/0.jpg` : affichable : non (logo de salle)\n- `Incline_Push-Up/1.jpg` : affichable : à vérifier (non regardée)'}
## Sources
${over.sources ?? `| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste | free-exercise-db | base | 2026-10-21 | PROVISOIRE |`}
`;
}

const run = (files: Record<string, string>) =>
  validateLot(Object.entries(files).map(([name, text]) => ({ name, text })), { tags: TAGS });
const msgs = (r: ReturnType<typeof run>) => r.errors.map((e) => `[${e.categorie}] ${e.message}`);

describe('parseCase : une case = une action', () => {
  it.each(['garder', 'retirer', 'retirer: remplacant:dead-bug', 'retirer: sans-zone:planche', 'adapter: variante:pompe-genoux', 'adapter: charge:legere', 'adapter: sans-charge', 'adapter: amplitude:reduite', 'adapter: appui:coussin'])('accepte « %s »', (c) => {
    expect(parseCase(c).error).toBeNull();
  });

  it.each([
    ['garder : version mur', /garder/],
    ['adapter: charge:legere, amplitude:reduite', /plusieurs actions/],
    ['adapter: variante:a ou variante:b', /« ou »/],
    ['retirer (remplacant : dead-bug)', /parenthèses/],
    ['adapter : appui:avant-bras', /espace avant/],
    ['adapter: appui:coussin plié sous les genoux', /libre/],
    ['adapter: amplitude:enorme', /liste fermée/],
    ['adapter: charge:légère', /accent|inconnue/],
    ['', /vide/],
    ['n’importe quoi', /non conforme/],
  ])('refuse « %s »', (c, re) => {
    expect(parseCase(c).error).toMatch(re as RegExp);
  });

  it('classe garder < adapter < retirer et relève les références', () => {
    expect(parseCase('garder').rank).toBe(0);
    expect(parseCase('adapter: sans-charge').rank).toBe(1);
    expect(parseCase('retirer: remplacant:x').rank).toBe(2);
    expect(parseCase('adapter: variante:x').refs).toEqual([{ type: 'variante', id: 'x' }]);
  });
});

describe('validateLot', () => {
  it('accepte une fiche valide (références croisées, a-creer en avertissement)', () => {
    const r = run({ 'pompe-inclinee.md': fiche() });
    expect(msgs(r)).toEqual([]);
    expect(r.warnings.some((w) => /à créer/.test(w.message))).toBe(true);
  });

  it('accepte doux_pour: [cou] et refuse une zone inconnue, une liste vide ou une fiche retirée au niveau 1', () => {
    const fm = (extra: string) => `id: pompe-inclinee
nom: Pompe inclinée
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: []
source_brouillon: []
statut: complete_kine
${extra}`;
    const secu = (cou: string) => `| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Cou | ${cou} |

**Version plus douce** : aucune
**Grossesse** : garder`;
    const err = (extra: string, cou?: string) => msgs(run({ 'pompe-inclinee.md': fiche({ fm: fm(extra), ...(cou ? { secu: secu(cou) } : {}) }) })).join('|');
    expect(err('doux_pour: [cou]', 'garder | adapter: amplitude:reduite | retirer')).toBe('');
    expect(err('doux_pour: [nuque]')).toMatch(/zone « nuque » hors de la liste/);
    expect(err('doux_pour: []')).toMatch(/doux_pour vide/);
    expect(err('doux_pour: cou')).toMatch(/liste entre crochets/);
    expect(err('doux_pour: [cou]', 'retirer | retirer | retirer')).toMatch(/ne peut pas être retirée aux niveaux 1 ou 2/);
    expect(err('doux_pour: [genou]')).toMatch(/pas de ligne/);
  });

  it('refuse un id différent du nom du fichier et un champ obligatoire manquant', () => {
    const r = run({ 'autre.md': fiche({ fm: 'id: pompe-inclinee\nnom: X\nschema: poussee_h\ntype: force\nniveau_min: debutant\nmuscles_principaux: [pectoraux]\nmuscles_secondaires: []\nstatut: verifie' }) });
    const m = msgs(r).join('\n');
    expect(m).toMatch(/différent du nom du fichier/);
    expect(m).toMatch(/source_brouillon/);
  });

  it('refuse des valeurs hors liste (accents, schéma, muscle)', () => {
    const r = run({ 'pompe-inclinee.md': fiche({ fm: 'id: pompe-inclinee\nnom: X\nschema: poussee\ntype: force\nniveau_min: débutant\nmuscles_principaux: [biceps_fantome]\nmuscles_secondaires: [pectoraux]\nsource_brouillon: []\nstatut: verifie' }) });
    const m = msgs(r).join('\n');
    expect(m).toMatch(/schema/);
    expect(m).toMatch(/niveau_min.*sans accent/);
    expect(m).toMatch(/muscle inconnu/);
  });

  it('contrôle les échelons et le niveau', () => {
    const v = `| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| a-1 | A | 2 | intermediaire | mur | x |
| a-2 | B | 4 | debutant | mur | x |`;
    const m = msgs(run({ 'pompe-inclinee.md': fiche({ variantes: v }) })).join('\n');
    expect(m).toMatch(/premier echelon doit être 1/);
    expect(m).toMatch(/échelon 4 après 2|echelon 4 après 2/);
    expect(m).toMatch(/plus bas/);
    expect(m).toMatch(/différent de niveau_min/);
  });

  it('refuse un tag inconnu ou remplacé', () => {
    const v = `| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| a-1 | A | 1 | debutant | marche_ou_box | x |
| a-2 | B | 2 | debutant | trampoline | x |`;
    const m = msgs(run({ 'pompe-inclinee.md': fiche({ variantes: v }) })).join('\n');
    expect(m).toMatch(/remplacé par « marche_escalier »/);
    expect(m).toMatch(/inconnu « trampoline »/);
  });

  it('refuse les cases de sécurité composées et le niveau 3 non retiré', () => {
    const secu = `| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule / cou | garder | adapter: sans-charge | retirer |
| Dos | garder | adapter: sans-charge, amplitude:reduite | adapter: sans-charge |
| Genou | garder | retirer | adapter: sans-charge |
| Genou | garder | garder | retirer |

**Version plus douce** : pompe-inclinee-mur (à privilégier)
**Grossesse** (G1 à G8) : garder`;
    const m = msgs(run({ 'pompe-inclinee.md': fiche({ secu }) })).join('\n');
    expect(m).toMatch(/une seule zone par ligne/);
    expect(m).toMatch(/plusieurs actions/);
    expect(m).toMatch(/niveau 3 : toujours « retirer »/);
    expect(m).toMatch(/en double/);
    expect(m).toMatch(/Version plus douce/);
    expect(m).toMatch(/Grossesse/);
  });

  it('refuse un niveau moins prudent que le précédent et sans-zone hors niveau 3', () => {
    const secu = `| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | retirer | garder | retirer |
| Cou | retirer: sans-zone:pompe-inclinee-mur | retirer | retirer |

**Version plus douce** : aucune
**Grossesse** : garder`;
    const m = msgs(run({ 'pompe-inclinee.md': fiche({ secu }) })).join('\n');
    expect(m).toMatch(/moins prudent/);
    expect(m).toMatch(/sans-zone n'existe qu'au niveau 3/);
  });

  it('refuse les ids inconnus (variante, remplacant, sans-zone, progression, version douce)', () => {
    const secu = `| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | adapter: variante:fantome-1 | retirer: remplacant:fantome-2 | retirer: sans-zone:fantome-3 |

**Version plus douce** : fantome-4
**Grossesse** : garder`;
    const progression = '- plus-facile : fantome-5\n- plus-dur : aucun';
    const m = msgs(run({ 'pompe-inclinee.md': fiche({ secu, progression }) })).join('\n');
    for (const n of [1, 2, 3, 4, 5]) expect(m).toContain(`fantome-${n}`);
  });

  it('résout les ids entre fiches du lot', () => {
    const secu = `| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Dos | garder | adapter: variante:pompe-genoux | retirer: remplacant:pompe-genoux-pieds |

**Version plus douce** : pompe-genoux
**Grossesse** : garder`;
    const r = run({
      'pompe-inclinee.md': fiche({ secu }),
      'pompe-genoux.md': fiche({}, 'pompe-genoux'),
    });
    expect(r.errors.filter((e) => e.categorie === 'ids').map((e) => e.message)).toEqual([expect.stringContaining('pompe-genoux-pieds')]);
  });

  it('refuse deux fiches de même id et deux variantes de même id', () => {
    const dup = fiche({}, 'pompe-inclinee');
    const m = msgs(run({ 'pompe-inclinee.md': dup, 'copie.md': dup.replace('id: pompe-inclinee', 'id: copie') })).join('\n');
    expect(m).toMatch(/id variante « pompe-inclinee-mur » déjà pris/);
  });

  it('refuse sections manquantes, consignes hors 4 à 6, photo mal écrite, source sans statut', () => {
    const r = run({
      'pompe-inclinee.md': fiche({
        consignes: '1. A\n2. B',
        photo: '- `Incline_Push-Up/0.jpg` et `/1.jpg` : affichable : non\n- `Incline_Push-Up/2.jpg` : affichable : non',
        sources: '| Affirmation | Source | Niveau de preuve | Lu le | Statut |\n|---|---|---|---|---|\n| Geste | x | y | z | bientôt |',
      }).replace('## Erreurs fréquentes\n- x\n', ''),
    });
    const m = msgs(r).join('\n');
    expect(m).toMatch(/section obligatoire manquante : « Erreurs fréquentes »/);
    expect(m).toMatch(/4 à 6 attendues/);
    expect(m).toMatch(/écriture attendue : « - `Dossier/);
    expect(m).toMatch(/demande une raison/);
    expect(m).toMatch(/statut absent/);
  });

  it('avertit (sans bloquer) quand une photo « oui » n\'a pas son WebP', () => {
    const r = validateLot([{ name: 'pompe-inclinee.md', text: fiche({ photo: '- `Inconnue_X/0.jpg` : affichable : oui' }) }], { tags: TAGS, photosDir: 'dossier-inexistant' });
    expect(r.errors).toEqual([]);
    expect(r.warnings.some((w) => /sans fichier WebP/.test(w.message))).toBe(true);
  });

  it('compte une illustration « oui » comme image affichable ; sans image, une fiche utilisable est en erreur', () => {
    const sans = validateLot([{ name: 'pompe-inclinee.md', text: fiche({ fm: undefined }).replace('statut: complete_kine', 'statut: utilisable') }], { tags: TAGS });
    expect(sans.errors.some((e) => e.categorie === 'image')).toBe(true);
    const ill = "- aucune photo\n- illustration : public/illustrations/pompe-inclinee.svg : affichable : oui (illustration originale de l'app)";
    const avec = validateLot([{ name: 'pompe-inclinee.md', text: fiche({ photo: ill }).replace('statut: complete_kine', 'statut: utilisable') }], { tags: TAGS });
    expect(avec.errors).toEqual([]);
    const absent = validateLot([{ name: 'pompe-inclinee.md', text: fiche({ photo: ill }).replace('statut: complete_kine', 'statut: utilisable') }], { tags: TAGS, illustrationsDir: 'dossier-inexistant' });
    expect(absent.errors.some((e) => /sans fichier/.test(e.message))).toBe(true);
  });

  it("refuse une illustration dont le nom ne suit pas l'id de la fiche", () => {
    const r = validateLot([{ name: 'pompe-inclinee.md', text: fiche({ photo: '- illustration : public/illustrations/autre-chose.svg : affichable : oui (x)' }) }], { tags: TAGS });
    expect(r.errors.some((e) => /id de la fiche/.test(e.message))).toBe(true);
  });

  it('indique le fichier et la ligne de chaque problème', () => {
    const r = run({ 'pompe-inclinee.md': fiche({ consignes: '1. A' }) });
    expect(r.errors[0].file).toBe('pompe-inclinee.md');
    expect(r.errors[0].line).toBeGreaterThan(0);
  });
});
