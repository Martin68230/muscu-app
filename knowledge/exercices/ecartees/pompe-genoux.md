> fusionnée dans pompe le 21/10/2026 (décision de l'utilisateur : une fiche `pompe` à échelons). Archive, ne plus utiliser.

---
id: pompe-genoux
nom: Pompe sur les genoux
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps, deltoides_anterieurs, abdominaux]
source_brouillon: [M1497, M1504]
statut: complete_kine
---
## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). Les variantes qui ne changent que le matériel ou la charge (haltère, kettlebell, chaise ou box de même hauteur) gardent le même échelon. `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-genoux-tapis | Sur tapis | 1 | debutant | poids_du_corps, tapis | Genoux sur un tapis ou une serviette pliée. |

## Consignes
1. À genoux, mains au sol un peu plus larges que les épaules.
2. Avance les mains : épaules, hanches et genoux en ligne droite.
3. Plie les coudes pour descendre la poitrine vers le sol.
4. Coudes à environ 45° du corps.
5. Pousse le sol pour tendre les bras.

## Points d'attention
- Ligne droite des épaules aux genoux : pas les fesses en l'air.
- Ventre et fessiers serrés.
- Poitrine en premier, pas le menton.
- Amplitude complète si possible.

## Erreurs fréquentes
- Fesses en arrière (on fait une révérence au lieu d'une pompe).
- Bassin qui s'affaisse.
- Coudes grands ouverts.

## Progression / régression
pompe-inclinee <- **pompe-genoux** -> pompe

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-21. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne.

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Chaque case contient un seul choix : `garder` (exercice tel quel), `adapter : <action précise>` (`variante:<id>`, `charge:légère`, `sans-charge`, `amplitude:...`, `appui:...`) ou `retirer` (avec `remplaçant` ou `sans-zone:<id>` si la fiche en nomme un) ; vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | adapter : variante:pompe-inclinee | retirer |
| Coude | garder | adapter : variante:pompe-inclinee | retirer |
| Poignet | garder | adapter : variante:pompe-inclinee (moins de poids sur les mains) | retirer |
| Genou | adapter : appui:coussin plié sous les genoux | adapter : variante:pompe-inclinee (aucun appui sur les genoux) | retirer ; sans-zone:pompe-inclinee (genoux non chargés) |

**Version plus douce** : `pompe-inclinee`.

**Grossesse** (G1 à G8 de regles-securite-communes.md ; avis du médecin ou de la sage-femme avant tout programme) : adapter : variante:pompe-inclinee. Post-partum : G7.

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au genou.
- Bassin qui s'effondre.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
Aucune photo affichable (affichable : sans objet). La seule photo du brouillon vient de maxwu : interdite.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mouvement | Brouillon M1497 (wger « knee push-ups ») et M1504 ; ACE liste une « Bent Knee Push-up » de niveau débutant (page d'index seulement, détail non lu) https://www.acefitness.org/resources/everyone/exercise-library/ | organisme de certification, pratique professionnelle | 2026-10-21 | NON SOURCÉ (sources non lues ; le brouillon wger prouve seulement que le mouvement existe) |
| Consignes | adaptées de la pompe (free-exercise-db « Pushups ») par coach | pratique courante | 2026-10-21 | NON SOURCÉ |
| Muscles (pectoraux en principal ; triceps en secondaire) | comme la pompe (free-exercise-db « Pushups ») ; changement par rapport à la première version (triceps était principal) | base d'exercices (domaine public) | 2026-10-21 | PROVISOIRE |
| Ordre pompe inclinée / sur genoux dans l'échelle | choix de coach (ordre discuté : à trancher) | - | - | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U (niveaux de gêne, arrêt si douleur, pas de progression, signes d'arrêt, quand consulter, grossesse) | knowledge/regles-securite-communes.md (sources : HAS 2019 lombalgie et grossesse, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-10-21 | R1, R2, R3, R7, R8 : NON SOURCÉ ; R4, R5, R6, R9 (partie), R10 : PROVISOIRE ; G : voir ce fichier |
| Tableau par zone, version plus douce et signes d'arrêt de cette fiche | choix de `kine` par extrapolation des règles communes ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-21 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse et post-partum, classement de cette fiche | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 | recommandations officielles et de consensus ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
