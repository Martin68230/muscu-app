# D26 étape 1 : supersets et core dans le générateur actuel (lecture du code, 25/10/2026)

## (a) Comment le générateur crée un superset (src/generator/duration.ts, règle V-SUP)
- Seulement si la personne active l'option « gagner du temps » (défaut : non) ; jamais en grossesse.
- Trois paires fermées : P1 = poussée 2 + tirage 2 ; P2 = tirage 1 + poussée 2 (si P1 n'est pas déjà formée) ; P3 = jambes 2 + tronc (core).
- Jamais : les emplacements principaux (jambes_genou, poussee_1, charniere) ; un exercice « sous plafond » (blessure, douleur niveau 2), adapté ou remplacé ; deux exercices de jambes ensemble ; deux exercices qui ont un muscle principal en commun ; pour un débutant, P3 avec un exercice chargeable.
- Le lecteur de séance annonce « Superset : A puis B » et enchaîne avec 15 s de transition, puis le repos après la paire.
- Pas encore : interdiction explicite des supersets sur les exercices « lourds à risque » (soulevé de terre, squat chargé) au-delà des emplacements principaux ; pas d'interdiction « deux exercices lourds sur le même schéma » (couverte par le muscle commun seulement) ; pas de vérification quand une douleur est déclarée en cours de séance (les exercices sous plafond sont déjà exclus à la génération).

## (b) Comment le core est réparti dans la semaine (slots.ts, config.ts)
- Un seul emplacement « tronc » par séance : séance A = gainage ; B = anti-rotation ; C = rotation, puis anti-rotation, puis gainage si vide. Avec 2 jours (A et B) : gainage + anti-rotation par semaine ; avec 3 jours : gainage + anti-rotation + rotation.
- Absents : flexion latérale / obliques dédiés, flexion du tronc, extension lombaire / fessiers comme famille « core », et aucune fréquence minimale par semaine garantie.
- Le tronc est le PREMIER emplacement retiré quand le temps manque (CORE_REMOVAL_ORDER : séances A et B à 2 ou 3 jours) : le core peut donc disparaître d'une semaine courte. C'est le principal écart avec la règle voulue (core chaque semaine, quel que soit l'objectif).

## À faire (D26 étapes 2 et 3, après la remise à zéro, avant D25)
Règles par coach (sources, fréquence minimale, 5 familles de core), contrôle automatique « chaque programme généré contient du core chaque semaine et respecte les règles de supersets », 4 profils de démonstration. Coût : 25 à 30 %.
