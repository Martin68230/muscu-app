// Contrôle des fichiers vidéo (D12) : exclu de tsc (pas de types Node dans le projet), exécuté par Vitest.
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateLot } from '../../tools/validate-fiches.mjs';

const fiche = (video: string) => `---
id: pompe-inclinee
nom: Pompe inclinée
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps]
source_brouillon: [M1418]
statut: complete_kine
---
## Variantes
| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-inclinee-mur | Au mur | 1 | debutant | mur | Face au mur. |
## Consignes
1. A
2. B
3. C
4. D
## Points d'attention
- x
## Erreurs fréquentes
- x
## Progression / régression
- plus-facile : aucun
- plus-dur : aucun
## Repères de dosage
Voir program-logic.md.
## Sécurité et contre-indications
| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | garder | retirer |
## Photo
- aucune photo
## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Geste | x | base | 2026-10-21 | PROVISOIRE |
## Vidéo
${video}
`;

const TAGS = { ids: new Set(['poids_du_corps', 'mur']) };

describe('fichier vidéo de l’utilisateur (D12)', () => {
  it('doit exister et peser moins de 500 Ko', () => {
    const dir = mkdtempSync(join(tmpdir(), 'videos-'));
    const line = '- video : fichier:pompe-inclinee.mp4 | Martin | ajoutée le 2026-10-23';
    const run = () => validateLot([{ name: 'pompe-inclinee.md', text: fiche(line) }], { tags: TAGS, videosDir: dir }).errors.filter((e) => e.categorie === 'video').map((e) => e.message).join();
    expect(run()).toMatch(/absent/);
    writeFileSync(join(dir, 'pompe-inclinee.mp4'), new Uint8Array(100_000));
    expect(run()).toBe('');
    writeFileSync(join(dir, 'pompe-inclinee.mp4'), new Uint8Array(600_000));
    expect(run()).toMatch(/trop lourd/);
  });
});
