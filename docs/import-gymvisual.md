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
