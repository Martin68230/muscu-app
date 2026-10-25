// Les textes du fichier public (public/data/fiches.json) ne contiennent aucune mention interne :
// rédacteurs, codes de règle, numéros de question, statuts de source, noms de fichiers de travail.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-ignore -- module d'outil (JS)
import { INTERNAL_MENTION, scrubFinal, scrubRaw, textFields } from '../../tools/public-text.mjs';

const ALL: any[] = JSON.parse(readFileSync('public/data/fiches.json', 'utf8')).fiches;

describe('fiches.json public : aucune mention interne', () => {
  it('aucun texte affichable ne contient coach, kine, Qxx, NON SOURCÉ, codes de règle, noms de fichiers de travail', () => {
    const bad: string[] = [];
    for (const f of ALL)
      for (const [get] of textFields(f)) {
        const t = get();
        if (typeof t === 'string' && INTERNAL_MENTION.test(t)) bad.push(`${f.id} : ${t.slice(0, 120)}`);
      }
    expect(bad).toEqual([]);
  });

  it('le fichier public ne contient ni statut de source ni nom de rédacteur nulle part (JSON entier, hors identifiants)', () => {
    const raw = readFileSync('public/data/fiches.json', 'utf8');
    expect(raw).not.toMatch(/NON SOURC|PROVISOIRE|QUESTIONS\.md|regles-securite|knowledge\//);
    expect(raw).not.toMatch(/"(?:source_brouillon|sources)"/);
  });

  it('le nettoyage retire les mentions internes mais garde les phrases de sécurité', () => {
    const t = scrubFinal(scrubRaw('barre sur le dos : retiré par prudence, confirmé par kine. Aucune durée chiffrée : voir program-logic.md. Arrête en cas de douleur.'));
    expect(t).not.toMatch(INTERNAL_MENTION);
    expect(t).toContain('retiré par prudence');
    expect(t).toContain('Arrête en cas de douleur');
  });

  it('chaque fiche garde ses consignes, ses signes d\'arrêt et sa sécurité après nettoyage', () => {
    for (const f of ALL) {
      expect(f.consignes.length, f.id).toBeGreaterThanOrEqual(4);
      expect(f.securite.signesArret.length, f.id).toBeGreaterThan(0);
      for (const s of f.consignes) expect(s.trim().length, f.id).toBeGreaterThan(5);
    }
  });
});
