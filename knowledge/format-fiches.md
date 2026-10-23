# Format strict des fiches d'exercices (lisible par `coach`, `kine`, `relecteur`, lu par le générateur)

Rédigé par `dev` le 21/10/2026, suite au point R4 de `knowledge/exercices/pilote/RECONTROLE-relecteur.md` (cases de sécurité non codables). Ce fichier est la référence ; le script `tools/validate-fiches.mjs` (`npm run check:fiches`) l'applique à toutes les fiches de `knowledge/exercices/pilote/`. En cas de désaccord entre ce fichier et le script, corriger les deux. Valeurs sport/santé : ce fichier fixe seulement la FORME ; le contenu reste sous la règle 10 de CLAUDE.md (statut OK / PROVISOIRE / NON SOURCÉ).

Principe : **ce que le générateur lit tient dans une case, une action, un mot d'une liste fermée. Tout le reste est du texte pour l'affichage et ne se mélange jamais avec le code.** Une phrase d'explication va dans les « Notes » (§4), pas dans la case.

## 1. Frontmatter (début du fichier, entre deux lignes `---`)

| Champ | Obligatoire | Valeur permise |
|---|---|---|
| `id` | oui | kebab-case ASCII (`a-z`, `0-9`, `-`), égal au nom du fichier sans `.md`, unique dans le lot |
| `nom` | oui | texte français affiché |
| `schema` | oui | `squat`, `charniere`, `fente`, `poussee_h`, `poussee_v`, `tirage_h`, `tirage_v`, `gainage`, `anti_rotation`, `rotation`, `porte`, `saut`, `mobilite`, `cardio`, `cheville_mollet`, `hanche_laterale` |
| `type` | oui | `force`, `fonctionnel`, `gainage`, `mobilite_recup`, `cardio` |
| `niveau_min` | oui | `debutant`, `intermediaire`, `avance` (ASCII, sans accent) ; égal au `niveau` de la variante d'échelon 1 |
| `muscles_principaux` | oui | liste `[a, b]` non vide, valeurs de la liste des muscles ci-dessous |
| `muscles_secondaires` | oui | liste `[...]`, peut être `[]` ; aucun muscle déjà en principal |
| `source_brouillon` | oui | liste `[M1418, M0482]` d'identifiants `M` + chiffres ; `[]` = ajout hors du brouillon |
| `statut` | oui | `brouillon_coach` -> `complete_kine` -> `controle_relecteur` -> `utilisable` -> `verifie` (le générateur utilise `verifie` et `utilisable`). `utilisable` = 0 bloquant au contrôle de `relecteur`, 0 erreur à `npm run check:fiches`, réserves limitées à des choix prudents marqués NON SOURCÉ ; `verifie` = aucune réserve (décision du 22/10/2026) |
| `couverture` | non | `substitut` seulement (la fiche ne remplit le schéma qu'à moitié) |
| `doux_pour` | non | liste `[cou]` de zones (valeurs de la liste des zones du §4.1) pour lesquelles la fiche est une alternative douce : le générateur peut la proposer quand cette zone est au niveau 1 ou 2, jamais au niveau 3 (regle-securite-communes.md §9 C1). Exemple : `doux_pour: [cou]`. Une fiche douce doit avoir `retirer` au niveau 3 de chaque zone listée |

Muscles permis : `pectoraux`, `grand_dorsal`, `trapezes`, `rhomboides`, `dentele_anterieur`, `deltoides_anterieurs`, `deltoides_lateraux`, `deltoides_posterieurs`, `biceps`, `triceps`, `avant_bras`, `abdominaux`, `obliques`, `transverse`, `erecteurs_rachis`, `carre_des_lombes`, `fessiers`, `moyen_fessier`, `quadriceps`, `ischios`, `adducteurs`, `mollets`, `flechisseurs_hanche`, `coiffe_des_rotateurs`, `peroniers`, `tibial_anterieur`. Un autre muscle : l'ajouter d'abord ici et dans le script.

Syntaxe : `cle: valeur`, une par ligne ; listes entre crochets ; un commentaire `# ...` en fin de ligne est ignoré. Pas d'autre YAML.

## 2. Sections obligatoires (titres `## ` ; le titre commence par le texte indiqué)

1. `Variantes` (tableau §3)
2. `Consignes` : liste numérique de 4 à 6 étapes
3. `Points d'attention`
4. `Erreurs fréquentes`
5. `Progression / régression` (lignes §5)
6. `Repères de dosage`
7. `Sécurité et contre-indications` (§4)
8. `Photo` (§6)
9. `Sources` : tableau `| Affirmation | Source | Niveau de preuve | Lu le | Statut |` ; chaque ligne a, dans la colonne Statut, au moins un des mots `OK`, `PROVISOIRE`, `NON SOURCÉ`

## 3. Tableau des variantes

Colonnes, dans cet ordre exact : `| id variante | nom | echelon | niveau | materiel_tags | installation |`

- `id variante` : kebab-case ASCII, unique dans tout le lot (jamais l'`id` d'une AUTRE fiche) ; stable (le générateur s'en sert pour progresser).
- `echelon` : entier. Le premier est 1 ; ensuite chaque ligne garde le même échelon (variante qui ne change que le matériel ou la charge) ou passe à l'échelon +1 (jamais de trou, jamais de retour en arrière). 1 = plus facile.
- `niveau` : `debutant`, `intermediaire`, `avance` ; ne baisse jamais d'une ligne à la suivante ; celui de l'échelon 1 = `niveau_min`.
- `materiel_tags` : un ou plusieurs tags séparés par des virgules, tous dans `knowledge/materiel-tags.json`. **ET** : la variante n'est proposée que si TOUS les tags sont dans le profil. Une alternative (« chaise ou box ») = deux variantes, pas un « ou ». Sans matériel : `poids_du_corps`. Anciens noms refusés : `marche_ou_box` (-> `marche_escalier`), `box_stable` (-> `box_ou_step`).
- `installation` : texte libre affiché.

## 4. Sécurité et contre-indications

### 4.1 Tableau zone x niveau

En-tête exact : `| Zone | Niveau 1 | Niveau 2 | Niveau 3 |`. Une ligne par zone, **une seule zone par ligne** (« Coude / poignet » est refusé : deux lignes). Zones : `cou`, `epaule`, `coude`, `poignet`, `dos`, `hanche`, `genou`, `cheville`, `cuisse` (face arrière : ischios), `aine` (adducteurs) (écrites avec ou sans accent et majuscule : « Épaule » est accepté). Zone absente = `garder`. Niveaux d'après `regles-securite-communes.md` : 1 gêne légère, 2 gêne nette, 3 douleur.

**Une case = exactement une action**, parmi :

| Case | Sens pour le générateur |
|---|---|
| `garder` | exercice tel quel |
| `adapter: variante:<id>` | remplacer par cette variante (id d'une variante du lot, ou id d'une fiche du lot = son échelon 1) |
| `adapter: charge:legere` | charge de départ de l'étalonnage, jamais augmentée |
| `adapter: sans-charge` | sans haltère ni charge |
| `adapter: amplitude:<valeur>` | voir liste fermée |
| `adapter: appui:<valeur>` | voir liste fermée |
| `retirer` | exercice non proposé, autre exercice du même schéma qui ne sollicite pas la zone |
| `retirer: remplacant:<id>` | non proposé ; remplacé par cet id (fiche ou variante du lot) |
| `retirer: sans-zone:<id>` | niveau 3 seulement : une variante qui ne sollicite pas du tout la zone reste permise |

Si une fiche a besoin de DEUX modifications (ex. charge légère ET amplitude réduite) : choisir la plus importante dans la case, mettre l'autre en note (§4.3), ou créer une variante qui porte les deux et utiliser `adapter: variante:<id>`.

Règles vérifiées par le script :
- Écriture exacte : mots ASCII (`legere`, `remplacant`), un espace après `adapter:` / `retirer:`, aucun texte entre parenthèses, aucun `ou`, aucune virgule.
- Niveau 3 : toujours `retirer` (avec ou sans suite) ; `sans-zone` n'existe qu'au niveau 3.
- Pas moins prudent en montant : garder < adapter < retirer ; niveau 2 pas plus permissif que niveau 1, niveau 3 pas plus permissif que niveau 2.
- Les ids cités existent dans le lot.

**Valeurs d'`amplitude`** (liste fermée) : `reduite`, `mi-course`, `sans-gene`, `maintien-court`, `sans-rotation`, `bras-bas` (bras moins hauts), `bras-au-sol`, `jambes-seules`, `tete-alignee`, `lente`.

**Valeurs d'`appui`** (liste fermée) : `coussin`, `serviette`, `poings-fermes`, `avant-bras`, `paumes-face-a-face`, `mains-vers-exterieur`, `main-sur-rampe`, `main-sur-support` (support stable testé : R8), `mur`, `assise-rehaussee`, `pieds-ecartes`, `buste-redresse`, `charges-surelevees` (charges posées sur un support au lieu du sol), `premiere-marche`, `coudes-pres-du-corps`, `front-pose`.

Une valeur manque ? `coach` ou `kine` la demande ; on l'ajoute ici ET dans `tools/validate-fiches.mjs` (listes `AMPLITUDES`, `APPUIS`). Pas de valeur libre.

### 4.2 Ligne Grossesse et ligne Version plus douce

Deux lignes, chacune sur une seule ligne de texte, avec cette écriture exacte :

```
**Grossesse** : <case>
**Version plus douce** : <id>
```

`<case>` suit la même grammaire que le tableau (pas de « garder (…) » : explication en note). `<id>` = fiche ou variante du lot, ou `aucune`. Le post-partum (G7) n'est pas codable : en note `grossesse`.

### 4.3 Notes affichables (jamais lues par le générateur comme règle)

Sous le tableau, bloc facultatif :

```
**Notes**
- epaule-n2 : texte affiché avec la case correspondante.
- grossesse : texte affiché.
- general : texte affiché.
```

Cible : `<zone>-n<1|2|3>`, `grossesse` ou `general`. Le reste de la section (signes d'arrêt, objets du quotidien...) est du texte libre pour l'affichage.

## 5. Progression / régression

Deux lignes obligatoires, ids séparés par des virgules ; `aucun` si rien :

```
- plus-facile : pompe-inclinee-mur, pompe-genoux
- plus-dur : pompe
```

Ids : variante ou fiche du lot, ou `a-creer:<id>` pour une fiche prévue mais pas encore écrite (non vérifié par le script, signalé comme avertissement). Le texte libre (schéma avec flèches) reste permis en plus.

## 6. Photo

Une ligne par image : `- \`<DossierFreeExerciseDb>/<n>.jpg\` : affichable : <oui|non|à vérifier>` suivi, entre parenthèses, de la raison. Raison obligatoire pour `non` et `à vérifier`. Seul `oui` s'affiche (règle 12). Pas de photo : une ligne `- aucune photo`. Le fichier affiché est `public/photos/free-exercise-db/<Dossier>-<n>.webp` (voir `tools/photos.md`) ; le script avertit si une image `oui` n'a pas son WebP.

**Illustration originale** (décision D6, quand aucune photo libre ne convient) : une ligne `- illustration : public/illustrations/<id-fiche>.svg : affichable : oui (illustration originale de l'app)`. Le fichier porte exactement l'id de la fiche ; il est généré par `node tools/make-illustrations.mjs` (une entrée de pose par fiche dans `tools/illustrations-poses.mjs`, voir `tools/photos.md`). Elle compte comme image affichable.

**Contrôle** : une fiche `utilisable` ou `verifie` sans au moins une image `affichable : oui` (photo ou illustration) est une ERREUR de `npm run check:fiches` ; une illustration `oui` sans son fichier SVG est aussi une erreur.

## 6 bis. Vidéo (facultative, D12)

Section `## Vidéo` (après `Photo`, hors des 9 sections obligatoires). Une ligne par vidéo :
- `- video : youtube:<id> | <chaîne> | vérifiée le AAAA-MM-JJ` : id de 11 caractères ; seul l'identifiant est stocké, jamais la vidéo.
- `- video : fichier:<nom>.mp4 | <auteur> | ajoutée le AAAA-MM-JJ` : vidéo de l'utilisateur dans `public/videos/` (3 à 5 s, moins de 500 Ko, prioritaire sur YouTube).
- `- aucune vidéo`.
`npm run check:fiches` contrôle l'écriture, l'id, la date, la présence et le poids du fichier (erreurs). L'app affiche le bouton « Voir une vidéo » (`src/ui/VideoButton.tsx`) seulement en ligne ; le lecteur `youtube-nocookie.com` n'est chargé qu'après l'appui.

## 7. Exemple minimal valide

```markdown
---
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
| pompe-inclinee-mur | Au mur | 1 | debutant | mur | Debout face au mur. |

## Sécurité et contre-indications
| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | adapter: variante:pompe-inclinee-mur | retirer |

**Grossesse** : garder
**Version plus douce** : pompe-inclinee-mur
```

(les autres sections obligatoires suivent ; voir une fiche du lot.)
