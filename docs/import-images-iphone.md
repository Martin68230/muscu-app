# À vérifier sur l'iPhone : import des images (D22)
Test réel, par l'utilisateur, dans l'app installée sur l'écran d'accueil.
1. Profil > Images de mes exercices : l'avertissement est lisible, boutons faciles à toucher, mode sombre correct.
2. **ZIP de 295 Mo** (copié dans Fichiers) > « Choisir le ZIP » : l'app reste fluide, la barre avance, durée notée (attendu : quelques secondes à 1 min), pas de rechargement de page. Noter : durée, plantage éventuel, message affiché.
3. Compteur « N images importées sur 33 ». Si le ZIP a d'autres noms de fichiers : « Aucun fichier reconnu ».
4. Bibliothèque > Pompe (variante mur / genoux), Rowing barre penché, Traction : l'image animée apparaît sur la fiche ET dans le lecteur de séance, seulement pour la variante correspondante ; un exercice sans correspondance garde son écran actuel.
5. Mode avion : les images s'affichent toujours ; l'import n'a fait aucune requête.
6. Si le ZIP échoue (ZIP64, Safari ancien) : « Choisir des images (GIF) » après les avoir dépliées dans Fichiers.
7. Sauvegarde (export JSON) : le fichier ne contient aucune image. « Supprimer les images importées » : les écrans reviennent à l'état d'origine.
8. Note : Safari peut vider le stockage d'un site non ouvert pendant longtemps ; ré-importer si les images disparaissent.

## Miniatures dans les listes (ajout)
Les listes (Bibliothèque, aperçu de séance, création de séance) n'affichent plus jamais le GIF animé : une **miniature statique** (JPEG carré 160 px, quelques Ko, 1re image du GIF) est créée à l'import et stockée dans `muscu-images` (table `thumbs`). Le GIF animé reste sur la fiche et dans le lecteur. Fiches importées avant : la miniature est créée à la volée au premier affichage, en tâche de fond. Chargement à la demande (IntersectionObserver), cache mémoire limité à 150 vignettes. Aucune requête réseau ; rien dans l'export JSON ni dans le dépôt.
À vérifier sur l'iPhone :
9. Bibliothèque : défilement fluide, les vignettes des exercices importés apparaissent (Pompe, etc.) ; les autres ont un pictogramme (matériel / corps), jamais un carré noir ; clair et sombre.
10. Aperçu d'une séance et « Créer une séance » : même vignette devant chaque exercice.
11. Profil > Images : « N miniatures pour les listes » ; « Régénérer les miniatures » fonctionne ; « Supprimer » vide aussi les miniatures.
