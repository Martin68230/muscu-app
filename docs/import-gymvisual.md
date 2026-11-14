# D22 : import LOCAL des images d'exercices Gym visual (14/11/2026)

**Principe** : aucune image dans le dépôt, le build ni l'export. Chaque personne importe SA copie du jeu (ZIP ≈ 295 Mo ou GIF isolés) ; les fichiers restent dans son navigateur. Aucune requête réseau (test automatique sur `src/images/`).

## Flux
Profil > « Images de mes exercices » : avertissement (« importe seulement des images dont tu as le droit d'usage ; elles ne sont jamais envoyées nulle part ») > « Choisir le ZIP » ou « Choisir des images (GIF) » > barre de progression > compte rendu (ajoutées, déjà là, erreurs) > « Supprimer les images importées » (avec confirmation). « Tout supprimer » du profil efface aussi ces images.

## Correspondance (la bonne image sur le bon exercice, sinon rien)
- Sources : `CORRESPONDANCE-GYMVISUAL.tsv` (lignes « validé ») puis, pour l'élargissement du 14/11, `CORRESPONDANCE-VARIANTES-coach.tsv` (par variante, niveau **sûr** = même mouvement et matériel, **proche** = même geste, autre matériel ou charge, légende « exercice proche » à l'écran) et `SANS-IMAGE-coach.tsv` (pas_dans_le_jeu / ambigu). La revue par variante l'emporte sur l'ancienne table. Couverture chiffrée et fiches sans image : `docs/import-gymvisual-couverture.md`. Un GIF peut servir plusieurs fiches du même schéma (test). Retrait manuel : rebonds de chevilles / 1373.
- `tools/gen-gv-table.mjs` génère `src/images/gv-table.ts` (texte : id, nom de fichier, fiche, variante). Clé d'affichage = **fiche + variante exacte** (une image de banc ne s'affiche pas sur la variante au sol). Les deux tractions n'avaient pas de variante dans la table : forcées d'après les notes du coach (1326 = supination, 0652 = pronation).
- Un fichier n'est retenu que si son nom de base est EXACTEMENT celui de la table (`0659-LEH9jxP.gif`) ; un autre nom est ignoré.
- Tests : table à jour, fiches et variantes existantes, un GIF = une seule fiche.

## Stockage et import
- Base IndexedDB séparée `muscu-images` (hors `muscu-app` : jamais dans l'export JSON). GIF gardés tels quels (l'animation compte) ; pas de conversion WebP. Vérifs : signature GIF, 8 Mo maximum par image.
- ZIP lu sans bibliothèque : index lu en fin de fichier (`File.slice`), puis seulement les ~33 entrées utiles, décompression par `DecompressionStream('deflate-raw')` (Safari 16.4+). Le ZIP n'est jamais chargé en entier. Pas de ZIP64 (message clair, proposer le dossier).
- Seules ~33 images sont stockées (quelques Mo) : le quota n'est pas un enjeu ; il est vérifié (`navigator.storage.estimate`) avec message clair, et `QuotaExceededError` est traité.
- Reprise après erreur : les images déjà stockées sont sautées ; relancer avec le même fichier.
- Affichage : `FicheImages` (fiche, lecteur de séance) prend une prop `variantId` ; image importée si elle existe, sinon écran actuel. Légende : « En cas de doute, suis la consigne écrite. » Images en `data:` URL (CSP inchangée).
- Aucune dépendance ajoutée.

## Limites iPhone connues
Mémoire Safari (une entrée à la fois, ≤ 8 Mo), stockage Safari purgeable si l'appli n'est pas ouverte longtemps (ré-importer), « Ajouter à l'écran d'accueil » conserve les données séparément de Safari : importer dans l'app installée.

## Sécurité du ZIP, quota, suppression (relecture du 14/11)
- Plafonds : 20 000 entrées et 8 Mo d'index au maximum (message clair au-delà) ; image décompressée ≤ 8 Mo, flux annulé au-delà.
- Les noms d'entrée ne servent jamais de chemin : seul le nom de base est comparé à la table (zip slip sans effet, testé).
- Quota : `navigator.storage.estimate` est INDICATIF ; une écriture refusée (`QuotaExceededError`) arrête l'import avec un message et la base `muscu-app` reste intacte (testé).
- `wipeAllData` supprime aussi la base `muscu-images` (testé). **À re-vérifier à la phase 6 (synchronisation Supabase)** : les images ne doivent jamais entrer dans la synchronisation ni dans les exports partagés.

## Couverture : pourquoi la moitié (analyse du 14/11/2026)
**1. Le jeu.** 1 324 exercices, donc 1 324 GIF (media_id, gif_url distincts ; 1 318 noms distincts). Le chiffre « 179 » est le nombre de GIF **utilisés par notre table** (13,5 % du jeu), pas la taille du jeu. Beaucoup de GIF du jeu sont inutilisables pour nous : machines, poulies, barres, Smith, sled (≈ 480 GIF, 36 %), étirements, cardio en salle.
**2. Matériel : d'où vient l'écart.** Jeu : poids du corps 325, haltères 294, poulie 157, barre 154 (+ EZ 23 + olympique 2), machine à levier 81, élastique 54 + 7, Smith 48, kettlebell 41, lesté 36, ballon 28, autres < 20. Nos 574 variantes (271 fiches) : 267 sont « poids du corps / mobilier » (chaise, mur, tapis, serviette, porte), 90 haltères, 35 élastique, 20 swiss ball, 19 barre + rack, 15 médecine-ball, 9 mini-bande. Couverture par matériel : **haltères 73/90 (81 %)**, barre 23/29 (79 %), poulie 6/9, élastique 22/35 + 13/19 (ancrage porte), **poids du corps / mobilier 66/267 (25 %)**, mini-bande 0/9 (aucun GIF de mini-bande dans le jeu). Là où le jeu a le matériel, le rapprochement trouve (≈ 80 %). Le manque est dans le poids du corps « maison » : le jeu est orienté salle, il ne contient ni bird dog, ni gainage creux, ni planche simple, ni chaise murale, ni marche latérale, ni bonjour sans barre, ni relevé de tibial au mur, ni exercices à la serviette sur le sol, ni exercices originaux du projet (porte-valise, ours, crabe…). Vérifié par recherche directe dans l'index du jeu.
**3. Les 20 fiches sans image les plus utilisées dans les programmes (150 profils).** 14 sans équivalent dans le jeu (bird-dog 150, gainage-creux 150, bonjour-poids-du-corps 84, assis-debout 80, charnière dos au mur 80, adduction-serrage-genoux 57, marche latérale 48, pompe piquée pieds surélevés 47, cheville-élastique 46, relevé tibial mur 44, écartement serviette 41, rotation bûcheron 38, tirage vertical allongé 37, marche pointes-talons 35) et 6 ambiguës refusées : pompe piquée (meilleur : 3662 « pike-to-cobra push-up », enchaîne une cobra), curl ischios serviette (0730 « single leg platform slide », le nom ne confirme pas le geste), dead bug jambes seules (0276 montre aussi les bras), face pull élastique (0203 « rear delt row with rope », autre geste), planche (2135 « weighted front plank », disque sur le dos), chaise murale (0624 « march sit (wall) », ajoute une marche).
**4. Rapprochement trop strict ?** Non : la recherche par mouvement / muscle / matériel (seconde passe, coach) avait déjà autorisé le niveau « proche » (autre matériel, même geste) ; les 57 fiches / 140 variantes « proche » en viennent. Élargir encore reviendrait à afficher un autre geste (pompe piquée → pompe + cobra, planche → planche lestée), ce que la règle interdit. Chiffres inchangés : 86 sûres, 57 proches, 128 sans image sur 271 fiches. La seule voie pour monter est d'ajouter des images libres (free-exercise-db, Everkinetic, dessins du projet) pour ces exercices maison, pas de forcer le jeu Gym visual.
