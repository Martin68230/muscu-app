## Analyse rédigée (lue par tools/demo-programmes.mjs)

Les chiffres bruts sont dans les sections « Analyse (a) » et « Chiffres de répétitivité » ci-dessus (recalculés à chaque lancement). Cette partie est rédigée à la main après lecture des résultats ; si le générateur change, relire les chiffres avant de la croire.

### (a) Pourquoi aucune séance avec sauts (volley et prise de muscle, intermédiaire, 3 jours)

Résultat : 0 séance avec sauts par semaine dans les deux cas, avec ou sans l'option « Ajouter une séance de cardio ». Le générateur n'a aucun saut dans la musculation (la pliométrie en tête de séance, R-PLIO, n'est pas codée) ; les sauts n'existent que dans la séance dédiée du sport « à sauts » (volley, basket, hand, danse, détente), jamais dans l'option cardio (3.2ter A : modéré continu, sans saut ni course ajoutés).

Cause, vérifiée dans `src/generator/impact.ts` (`jumpDayAllowed`) et `index.ts` :
- Volley, 3 jours : la séance de sport est bien proposée (Cardio le dimanche, 30 min), mais sans saut. Les 3 séances de corps entier (lundi, mercredi, vendredi) comptent toutes comme « jambes lourdes » (squat, fente, charnière). Un jour de sauts exige que ce jour, la veille et l'avant-veille ne soient pas des jours de jambes lourdes (48 h et deux jours calendaires). Avec lundi / mercredi / vendredi, il ne reste aucun jour de la semaine circulaire qui remplisse cette condition (il faudrait trois jours libres consécutifs ; le plus long trou est samedi-dimanche, soit 2 jours). La séance de sport retombe donc en « modérée sans saut ».
- Les fiches ne sont pas en cause : `jumping-jacks-saut`, `rebonds-deux-pieds` (intermédiaire) et les versions douces existent ; seuls corde, squat petit saut, saut en longueur et patineur sont « non disponibles ».
- Plafond de séances dédiées (1 par semaine pour le sport, `JUMPS.maxPerWeek` = 1) et règle des 72 h entre deux séances de sauts : jamais atteints ici (il n'y a même pas une première séance avec sauts).
- Prise de muscle intermédiaire : pas de sport déclaré, donc jamais de sauts ; l'option cardio ajoute seulement une marche rapide modérée le dimanche. Même résultat avec haltères.
- Contre-épreuve : volley intermédiaire à 2 jours de force (lundi, jeudi) donne bien 1 séance avec sauts (dimanche). Volley avec jours disponibles lundi / mardi / jeudi seulement : 0 (le seul jour libre possible, le dimanche, est indisponible). Volley débutant 3 jours : 0 (même cause, avec en plus l'interdiction de la veille d'un jour lourd).
- Conclusion : à 3 jours de corps entier ou plus, la règle « 48 h + 2 jours calendaires » rend les sauts structurellement impossibles pour un sport à sauts ; le volleyeur est le profil le plus touché.

### (b) Ce qui est peu intéressant ou répétitif

1. Doses uniformes : 3 à 7 doses distinctes seulement par semaine. Débutants : 2 x 10-12 ou 2 x 10-15 partout, RIR 3 ; sans matériel, 3 doses différentes en tout. Intermédiaire à la maison : toujours 2 x 10-15.
2. Séances A / B quasi identiques en corps entier : A et B partagent 5 exercices sur 8 (profils 1 et 4) et 4 sur 7 (profil 5). Un exercice (tirage vertical élastique, squat gobelet, développé épaules) revient 2 à 3 fois dans la semaine. Profil 1 : 23 exercices placés pour 17 distincts ; profil 4 : 23 pour 17 ; profil 5 : 21 pour 15 ; profil 3 : 17 pour 15.
3. Aucun superset pour 5 profils sur 6 malgré « Gagner du temps » activé (1 paire seulement en force 4 jours salle : développé couché haltères + rowing). Les débutants n'en ont aucun ; le repos reste à 90 s en série.
4. Séances très courtes ou minces en haut / bas et en 5 jours : PUSH-B et PULL-B n'ont que 3 exercices (30 à 35 min pour une durée demandée de 75 min), séances HAUT / BAS de 35 min pour 60 demandées ; les emplacements de volume sont donc peu remplis, et le calendrier du jour 5 est pauvre.
5. Aucune variété d'une semaine à l'autre : le programme dure 4 semaines avec les mêmes exercices (seul l'étalonnage et la progression de charge changent) ; tous les exercices marqués « étalonnage » la première fois.
6. Incohérences de matériel en salle (profils 2 et 6, préréglage « salle » sans tag) : tirage vertical à l'élastique, développé épaules avec un sac à dos, squat sur bosu et planche apparaissent à côté de la barre et de la poulie : la salle propose peu de machines dans les fiches, et le générateur complète avec des exercices maison.
7. Profil 3 (perte de gras + cardio en secondaire + option) : un seul cardio de 30 min le dimanche, aucun bloc de cardio après les séances (le secondaire est remplacé par la séance dédiée) ; durée toujours 45 min, volume de séances court (17 exercices en tout) avec des messages de volume bas (9 séries pectoraux et dorsaux).
8. Volley : le programme est celui de la prise de muscle (corps entier) + marche modérée ; le message affiché dit « Les programmes par sport arrivent dans une prochaine version ». Aucun travail spécifique (épaules, sauts, mollets, réception) n'est proposé.

### (c) Pistes d'amélioration sans affaiblir la sécurité

| Piste | Gain | Coût |
|---|---|---|
| R-PLIO : pliométrie en tête de séance le jour des jambes (déjà décidée), sauts légers comptés dans les contacts, échauffement de 5 min | Seul moyen de donner des sauts à un volleyeur à 3 jours et plus ; garde le plafond de contacts | Moyen (génération, durée, messages, tests) |
| Séance de sauts dédiée sur un jour sans jambes lourdes : choisir un jour de repos entre séances en rendant les jambes plus légères un jour (haut du corps), ou accepter 2 jours de force corps entier + 1 jour haut du corps pour les sports à sauts | Débloque les sauts sans toucher aux 48 h | Moyen (nouveau gabarit de répartition, tests de jours) |
| Variété entre semaines (R3) : alterner les variantes ou les exercices du même emplacement une semaine sur deux (A1/A2) | Corrige les points 2 et 5, ajoute de la motivation | Moyen (règle de rotation, historique, tests ; données déjà dans les fiches) |
| Varier les doses : fourchettes de répétitions et séries par rôle (principal lourd 3 x 6-8, accessoire 2 x 12-15), vague de progression sur 4 semaines | Corrige le point 1 | Faible à moyen (config + tests ; valeurs à faire valider par `coach`) |
| Supersets proposés aussi aux débutants sur des paires sûres (haut / bas, sans technique) et aux séances de plus de 6 exercices | Corrige le point 3 (gain de temps réel) | Faible (SUP-3 interdit aujourd'hui les variantes `avance` seulement ; valider avec `coach` et `kine`) |
| Remplir les séances à la durée demandée : ajouter des emplacements de volume quand la durée le permet (PUSH / PULL à 3 exercices pour 75 min) | Corrige le point 4 | Faible à moyen |
| Nettoyer la salle : exclure les exercices « maison » (sac à dos, élastique, bosu) quand la machine ou la poulie existe, ajouter les fiches de machines | Corrige le point 6 | Moyen (fiches : travail du coach ; filtre : faible) |
| Objectif sport : volet musculation spécifique (épaules, mollets, gainage, réception) + message honnête | Corrige le point 8 | Élevé (contenu sourcé à rédiger et à contrôler) |
