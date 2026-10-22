---
id: pompe-ecartee
nom: Pompe mains écartées
schema: poussee_h
type: force
niveau_min: intermediaire
muscles_principaux: [pectoraux]
muscles_secondaires: [deltoides_anterieurs, triceps, abdominaux]
source_brouillon: [M1325, M0739]
statut: utilisable
---
Variante de la pompe qui insiste sur les pectoraux (moins de triceps) : fiche séparée (décision de l'utilisateur, 21/10/2026). Régression : `pompe-genoux` ou `pompe-chaise` (fiche `pompe`).

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile (même fiche, rangé du plus facile au plus dur). `niveau` : debutant / intermediaire / avance. Échelons et niveaux : choix de coach, NON SOURCÉ (décision de format de l'utilisateur, 21/10/2026).

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| pompe-ecartee-sol | Au sol | 1 | intermediaire | poids_du_corps | Mains au sol nettement plus larges que les épaules, sur les pointes de pieds. |

## Consignes
1. Place les mains plus larges que les épaules, doigts vers l'avant.
2. Corps en planche, de la tête aux talons ; ventre et fessiers serrés.
3. Descends la poitrine près du sol, coudes ouverts mais pas à l'horizontale.
4. Pousse le sol pour tendre les bras.
5. Trop dur ? Fais-la sur les genoux, ou mains sur une chaise.

## Points d'attention
- Écartement modéré : si l'épaule gêne, rapproche les mains.
- Amplitude contrôlée, jamais « tombée » en bas.
- Tête dans le prolongement du corps.

## Erreurs fréquentes
- Mains beaucoup trop larges, épaules sollicitées en fin de course.
- Bassin qui tombe.
- Demi-répétitions.

## Progression / régression
- plus-facile : pompe-genoux, pompe-chaise
- plus-dur : pompe-archer
pompe-sol (fiche `pompe`) -> **pompe-ecartee-sol** ; version plus facile : pompe-genoux ou pompe-chaise

## Repères de dosage
Voir program-logic.md.

## Sécurité et contre-indications
Rédigé par `kine` le 2026-10-22. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md. Rien ici n'est un diagnostic : l'app parle seulement de zone et de niveau de gêne. Statut : NON SOURCÉ (extrapolation de `kine` des règles communes ; aucune étude ne teste ces adaptations exercice par exercice).

**Contre-indications par zone** (profil blessures : 1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action (`garder`, `adapter: ...`, `retirer`, `retirer: ...`) ; format dans knowledge/format-fiches.md §4, vocabulaire dans regles-securite-communes.md §0. Zone non listée = garder. Plusieurs zones gênées : la plus prudente s'applique (retirer > adapter > garder). Niveau 2 : aucune augmentation de charge ni de difficulté sur la zone (R2). Niveau 3 : retirer (R3).

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | adapter: amplitude:reduite | retirer: remplacant:pompe-chaise | retirer |
| Coude | garder | adapter: variante:pompe-chaise | retirer |
| Poignet | adapter: appui:poings-fermes | adapter: variante:pompe-chaise | retirer |
| Dos | garder | adapter: variante:pompe-genoux | retirer |

**Notes**
- epaule-n1 : mains écartées = épaule étirée en bas de mouvement : ne descends pas plus bas que sans gêne.
- grossesse : mains hautes, respiration continue, jamais jusqu'à l'échec. Post-partum : G7.

**Grossesse** : adapter: variante:pompe-chaise
**Version plus douce** : pompe-genoux

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente à l'épaule, au coude, au poignet ou au bas du dos.
- Bassin qui s'effondre ou bas du dos qui se creuse.
- Support qui glisse ou bouge.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.

## Photo
- `Pushups_Close_and_Wide_Hand_Positions/0.jpg` : affichable : non (vue le 22/10/2026 : mains rapprochées, pas écartées : ne montre pas la pompe écartée)
- `Pushups_Close_and_Wide_Hand_Positions/1.jpg` : affichable : non (vue le 22/10/2026 : mains à peine plus larges que les épaules : ne montre pas la pompe écartée)

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Mains plus larges que les épaules pour la position large, descente poitrine près du sol, retour bras tendus ; pectoraux en principal, épaules et triceps en secondaire | free-exercise-db « Pushups (Close and Wide Hand Positions) » (M0739) https://github.com/yuhonas/free-exercise-db/blob/main/exercises/Pushups_Close_and_Wide_Hand_Positions.json (niveau source : beginner) ; réécrit par coach | base d'exercices (domaine public), pas d'étude | 2026-10-21 | PROVISOIRE |
| Niveau « intermediaire » (la source dit beginner) | choix de coach : mains très écartées plus exigeantes pour l'épaule ; changement tracé le 21/10/2026 | - | - | NON SOURCÉ |
| Existence du mouvement | brouillon M1325 (maxwu « Wide Hand Push Up ») : texte non copié | - | 2026-10-21 | NON SOURCÉ |
| Conseil d'écartement modéré | pratique courante | - | - | NON SOURCÉ |
| Sécurité de cette fiche (tableau par zone, grossesse, version plus douce, signes d'arrêt) | choix de `kine` par extrapolation des règles communes (knowledge/regles-securite-communes.md : R1 à R3, R7, R8 NON SOURCÉ ; R4 à R6, R10 PROVISOIRE ; G4 PROVISOIRE) ; aucune étude ne teste ces adaptations exercice par exercice | avis d'expert (extrapolation) | 2026-10-22 | NON SOURCÉ (extrapolation, à valider) |
| Grossesse : éviter isométrique prolongé, risque de chute, charge légère | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf et fiche HAS 2022 https://www.has-sante.fr/upload/docs/application/pdf/2022-11/ap_fiche_grossesse.pdf | recommandations officielles ; aucun essai par exercice | 2026-10-21 | principe : OK ; classement de cette fiche : PROVISOIRE (extrapolation de `kine`) |
