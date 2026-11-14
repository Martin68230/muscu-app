# D22 : import LOCAL des images d'exercices Gym visual (14/11/2026)

**Principe** : aucune image dans le dépôt, le build ni l'export. Chaque personne importe SA copie du jeu (ZIP ≈ 295 Mo ou GIF isolés) ; les fichiers restent dans son navigateur. Aucune requête réseau (test automatique sur `src/images/`).

## Flux
Profil > « Images de mes exercices » : avertissement (« importe seulement des images dont tu as le droit d'usage ; elles ne sont jamais envoyées nulle part ») > « Choisir le ZIP » ou « Choisir des images (GIF) » > barre de progression > compte rendu (ajoutées, déjà là, erreurs) > « Supprimer les images importées » (avec confirmation). « Tout supprimer » du profil efface aussi ces images.

## Correspondance (la bonne image sur le bon exercice, sinon rien)
- Source : `CORRESPONDANCE-GYMVISUAL.tsv` (revue du coach incluse), lignes **« validé » seulement** (33 GIF, 31 fiches / variantes). « À relire » et « sans équivalent » = pas d'image.
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
