---
id: curl-halteres
nom: Curl aux haltères
alias: [curl biceps, curl marteau]
schema: tirage_h
type: force
niveau_min: debutant
muscles_principaux: [biceps]
muscles_secondaires: [avant_bras, deltoides_anterieurs]
source_brouillon: []
statut: utilisable
---
Fiche du lot 11B (variété du générateur, programmes-v3.md §9 ligne 4). **Vérification du 2026-11-01 : aucune fiche non écartée ne couvre le curl aux haltères debout ou assis sur chaise** : `curl-incline-halteres` demande un banc incliné et `curl-barre` une barre (toutes deux `substitut`) ; la prise marteau debout n'existe pas hors du banc incliné. Isolation : emplacements du générateur (src/generator/config.ts, ISOLATION, liste fermée d'identifiants) ; la fiche n'y entre qu'après ajout de son id par `dev`, une fois la fiche `utilisable`.

## Variantes (installation + matériel, avec échelon de difficulté)
`echelon` : 1 = plus facile. Échelons et niveaux : choix de coach, NON SOURCÉ.

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
| curl-halteres-debout | Debout, paumes vers le haut | 1 | debutant | halteres | Debout, pieds à largeur de hanches, genoux souples, un haltère par main, bras le long du corps, paumes vers l'avant, ventre serré. |
| curl-halteres-marteau | Debout, prise marteau | 1 | debutant | halteres | Même position ; paumes face aux cuisses (pouces vers l'avant) pendant tout le mouvement. |
| curl-halteres-assis | Assis sur une chaise, dos contre le dossier | 1 | debutant | halteres, chaise | Chaise stable à 4 pieds, sans roulettes, non pliante, dossier calé contre un mur ; assis, dos contre le dossier, pieds à plat, un haltère par main, bras le long du corps. |

## Consignes
1. Choisis des haltères légers et mets-toi en position, ventre serré, épaules loin des oreilles, coudes contre les côtes.
2. Plie les coudes pour monter les haltères vers les épaules, sans avancer les coudes.
3. En haut, serre le biceps une seconde, sans basculer le buste en arrière.
4. Redescends en 3 secondes jusqu'à presque tendre les bras, sans les verrouiller.
5. Respire en continu : expire en montant, inspire en descendant.
6. Garde les poignets droits ; si le dos se creuse ou si tu t'aides de l'élan, l'haltère est trop lourd.

## Points d'attention
- Le buste reste immobile : pas d'élan du dos ni des hanches.
- Charge légère pour commencer (NON SOURCÉ) ; série arrêtée avant que la technique se dégrade, jamais jusqu'à l'échec.
- Prise marteau : plus douce pour le poignet pour certaines personnes (choix de coach, NON SOURCÉ).
- Aucune valeur chiffrée propre à ce mouvement (aucune source).

## Erreurs fréquentes
- Balancer le buste pour monter la charge.
- Coudes qui partent vers l'avant ou sur les côtés.
- Poignets qui plient.
- Descente rapide, bras verrouillés en bas.

## Progression / régression
- plus-facile : aucun
- plus-dur : aucun

## Repères de dosage
Doses du générateur (isolation : config.ts ISOLATION et structure-programmes.md STR-ISO ; load-calibration.md). Charge légère pour commencer, aucune hausse tant qu'une gêne est signalée (R2). Aucune valeur propre à ce mouvement (NON SOURCÉ).

## Sécurité et contre-indications
Rédigé par `coach` le 2026-11-01 ; relu et corrigé par `kine` le 2026-11-01 ; à contrôler par `relecteur`. Règles communes R1 à R10 et grossesse (G) : knowledge/regles-securite-communes.md ; objets du quotidien : §7. Rien ici n'est un diagnostic. Tous les choix par zone sont des choix prudents NON SOURCÉS.

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Coude | adapter: charge:legere | retirer | retirer |
| Poignet | adapter: variante:curl-halteres-marteau | retirer | retirer |
| Épaule | garder | adapter: amplitude:mi-course | retirer |
| Dos | garder | adapter: variante:curl-halteres-assis | retirer |

**Notes**
- coude-n1 : haltères les plus légers, jamais augmentés (R2).
- coude-n2 : retrait.
- poignet-n1 : prise marteau, poignets droits.
- poignet-n2 : retrait.
- epaule-n2 : montée à mi-hauteur seulement, sans augmenter (R2).
- general : l'emplacement d'isolation du générateur retire déjà cette fiche dès le niveau 1 des zones coude et poignet ; les cases de niveau 1 ci-dessus ne servent donc que si la fiche est choisie ailleurs (substitut d'un autre emplacement, choix de la personne) : elles sont moins sévères que le retrait mais ne le contredisent pas (vérifié par `kine` le 2026-11-01).
- general : zones non listées (cou, hanche, genou, cheville) : garder (choix de `kine`, NON SOURCÉ).
- dos-n2 : assis, dos contre le dossier, charge légère, sans élan.
- grossesse : assis, dossier droit, charge légère, respiration continue (G4). Post-partum : G7.

**Grossesse** : adapter: variante:curl-halteres-assis
**Version plus douce** : curl-halteres-assis

**Signes qui doivent faire arrêter**
- Douleur (pas la simple brûlure du muscle qui travaille) qui apparaît ou augmente au coude, au poignet, à l'épaule ou au dos.
- Buste qui bascule, dos qui se creuse, haltère qui échappe.
- Chaise qui bouge ou craque (variante assise) : arrête tout de suite.
- Bras ou main qui s'engourdit ou fourmille.
- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance ; si la douleur de poitrine ne passe pas au repos : urgence (U1).
- Douleur qui dure, qui s'aggrave ou qui réveille la nuit, perte de force, engourdissement, fourmillements : consulte un professionnel de santé (S1, S2).
- Si le réglage enceinte / post-partum est coché : saignement, contractions, fuite d'urine, pesanteur dans le bas-ventre : arrête et contacte ta sage-femme ou ton médecin (G6, G7).

**Objets du quotidien**
- Haltères : manchons et disques bien serrés ; sol dégagé ; pose-les au sol sans les lâcher d'en haut.
- Chaise (regles-securite-communes.md §7) : solide, 4 pieds, sans roulettes, non pliante, dossier contre un mur, sol non glissant ; test avant la séance : appuie-toi dessus de tout ton poids ; si elle bouge, glisse ou grince, ne l'utilise pas.

## Photo
- illustration : public/illustrations/curl-halteres.svg : affichable : oui (illustration originale de l’app)
- légende : Debout, haltères vus par le bout. Prise marteau : même geste, paumes face aux cuisses. Coudes fixes.

## Sources
| Affirmation | Source | Niveau de preuve | Lu le | Statut |
|---|---|---|---|---|
| Existence du mouvement (curl aux haltères, prise marteau, debout ou assis) | pratique courante ; piste de programmes-v3.md §9 ; aucune source primaire lue ; texte d'aucune autre app repris | pratique (pas une étude) | 2026-11-01 | NON SOURCÉ |
| Consignes (coudes contre les côtes, buste immobile, descente lente) | réécriture de coach par analogie avec `curl-incline-halteres` ; aucune source lue | - | 2026-11-01 | NON SOURCÉ |
| Échelons, niveaux, muscles principaux et secondaires | choix de coach | - | 2026-11-01 | NON SOURCÉ |
| Tableau par zone, version plus douce, signes d'arrêt | choix prudents de `coach` par extrapolation des règles communes, relus et corrigés par `kine` le 2026-11-01 ; aucune étude ne teste ces adaptations | avis d'expert (extrapolation) | 2026-11-01 | NON SOURCÉ |
| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md (HAS 2019, NICE NG59, Smith 2017, Riebe 2015, Mottola 2019) | voir ce fichier | 2026-11-01 | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |
| Grossesse : adapter (assis, charge légère) | HAS 2019 https://www.has-sante.fr/upload/docs/application/pdf/2019-07/app_329_ref_aps_grossesse_vf.pdf ; Mottola 2019 https://csepguidelines.ca/?p=1037 ; ces textes ne citent pas cet exercice | recommandations officielles et de consensus | 2026-11-01 | principe : OK ; classement de la fiche : NON SOURCÉ (extrapolation de coach) |
