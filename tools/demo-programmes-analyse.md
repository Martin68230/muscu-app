## Analyse rédigée (lue par tools/demo-programmes.mjs)

Les chiffres bruts sont dans les sections « Analyse (a) » et « Chiffres de répétitivité » ci-dessus (recalculés à chaque lancement). Cette partie est rédigée à la main après lecture des résultats du générateur v1.6 (D32, 31/10/2026) ; si le générateur change, relire les chiffres avant de la croire. Revue complète : docs/programmes-exemples-revue-coach.md.

### (a) Pourquoi aucune séance avec sauts (volley et prise de muscle, intermédiaire, 3 jours)

Résultat : 0 séance avec sauts par semaine dans les deux cas, avec ou sans l'option « Ajouter une séance de cardio ». Le générateur n'a aucun saut dans la musculation ; les sauts n'existent que dans la séance dédiée d'un sport « à sauts » (volley, basket, hand, danse, détente), jamais dans l'option cardio (3.2ter A : modéré continu, sans saut ni course ajoutés).

Conformité :
- **Prise de muscle : 0 saut est conforme et voulu** (3.2ter A).
- **Volley à 3 jours : 0 saut est conforme à la lettre des règles (3.2ter B (d), 5.1 (5)), mais contraire à l'intention de l'utilisateur** (un sport de saut devait recevoir un bloc de sauts légers). Cause, vérifiée dans `src/generator/impact.ts` (`jumpDayAllowed`) : les 3 séances de corps entier (lundi, mercredi, vendredi) sont toutes à « jambes lourdes » ; un jour de sauts exige que ce jour, la veille et l'avant-veille ne le soient pas ; aucun jour de la semaine ne remplit la condition. La séance de sport retombe en « modérée sans saut ».
- **R-PLIO (pliométrie en tête de séance, cardio-regles.md §5.1 (ii), §5.2bis) est écrite pour « Créer une séance »** : l'appliquer à un programme généré n'est ni écrit ni validé. C'est **une décision de l'utilisateur**, pas un correctif prévu. Lecture de R-PLIO si elle était appliquée : avec lundi / mercredi / vendredi seul le lundi passerait (une séance avec sauts par semaine), et la force des jambes de ce jour serait légère (condition 11).
- Contre-épreuve : volley intermédiaire à 2 jours de force (lundi, jeudi) donne 1 séance avec sauts (dimanche). Volley avec jours disponibles lundi / mardi / jeudi seulement : 0. Volley débutant 3 jours : 0 (même cause, et la veille d'un jour lourd est interdite au débutant).
- Les fiches ne sont pas en cause : `jumping-jacks-saut`, `rebonds-deux-pieds` et les versions douces existent.

### (b) Ce qui est peu intéressant ou répétitif (chiffres de la version régénérée)

1. **Doses peu variées selon la famille d'objectif.** Débutants : 2 x 10-12 ou 2 x 10-15, RIR 3 partout (profil 1 : 4 doses distinctes ; profil 5, sans matériel : 3). Le volley (famille forme, profil 4) est à 2 x 10-15, RIR 3 : 4 doses distinctes, soit la dose d'un débutant pour un intermédiaire. En revanche les profils d'objectif muscle, force ou perte de gras ont des doses variées : profil 3 (perte de gras) en 3 x 8-12 et 4 x 10-15, 2 x 30 s, 6 doses ; profil 2 (force) 8 doses ; profil 6 (avancé) 7 doses.
2. **Séances A / B quasi identiques en corps entier.** A et B partagent 5 exercices sur 8 (profil 1), 4 sur 7 (profils 4 et 5), 2 sur 6 (profil 3). Exercices placés / distincts : profil 1 : 23 / 17 ; profil 2 : 24 / 23 ; profil 3 : 17 / 15 ; profil 4 : 23 / 18 ; profil 5 : 21 / 15 ; profil 6 : 25 / 23. Un exercice revient jusqu'à 3 fois dans la semaine (tirage vertical élastique : profils 1 et 4 ; pompe au mur : profil 5). Profil 4 : la même fiche de pompe 2 fois, la famille 4 fois (pompe x2, mains écartées, piquée).
3. **Supersets : 2 paires dans les 6 programmes** (profil 2 HAUT-B, profil 4 séance B) après la correction D32 (ordre de formation des paires). Les autres absences sont conformes à SUP-0 à SUP-10 : débutants (SUP-4, interdiction confirmée par `kine`, à ne pas assouplir) ; `poussee_2` verticale en gabarit A ; fiche de fente à ligne dos non « garder » (SUP-2 point 4) ; PUSH / PULL sans paire ; matériel B1 en salle ; `tirage_2` ou `jambes_2` absent à 45 min. Pour un débutant ou une séance de salle, l'option « Gagner du temps » est sans effet.
4. **Séances HAUT / BAS / PUSH / PULL courtes** : HAUT et BAS à 35 min pour 60 demandées (profil 2) ; PUSH-B 35 min et PULL-B 30 min (3 exercices chacune), LEGS-B 40 min pour 75 demandées (profil 6). Cause : tous les emplacements du type sont remplis ; l'ajout s'arrête au premier emplacement qui dépasserait 10 séries fractionnaires par muscle et par séance (V-PLAF, STR-REP-4 ; STR-REP-3 : jamais rajouté). Ce n'est pas le gain de temps des supersets qui manque (une seule paire, 5 min).
5. **Aucune variété d'une semaine à l'autre** : le programme dure 4 semaines avec les mêmes exercices (seuls l'étalonnage et la charge changent). R3 non codée.
6. **Incohérences de matériel en salle** (profils 2 et 6) : tirage vertical à l'élastique, développé épaules avec un sac à dos, squat sur bosu à côté de la barre et de la poulie ; peu de fiches de machines.
7. **Perte de gras + cardio secondaire (profil 3)** : un seul cardio de 30 min le dimanche, aucun bloc après les séances (conforme à D31) ; pectoraux 9 et dos 9 séries (messages de volume honnêtes) ; le texte d'explication dit encore « cardio retiré en premier » alors que la séance de cardio existe.
8. **Volley** : le programme est celui de la prise de muscle (forme) + marche modérée ; message « Les programmes par sport arrivent dans une prochaine version ». Aucun travail spécifique (épaules, sauts, mollets, réception).
9. **Échauffement, mobilité et retour au calme identiques** dans toutes les séances des 6 programmes.

### (c) Défauts de sécurité corrigés en D32 (relus sur les exemples régénérés)
- Squat sur bosu : réserve 2 (profil 6 LEGS-B).
- Montée sur marche aux haltères légers : 3 x 8-12 (profils 2 et 3).
- Good morning et rowing Pendlay : 3 séries (profil 6).
- À confirmer : tirage au visage à la poulie en RIR 1 (profil 6 HAUT-A) alors que la fiche face-pull-elastique dit « jamais jusqu'à l'échec » (mention probablement propre à la variante élastique).

### (d) Pistes d'amélioration sans affaiblir la sécurité

| Piste | Gain | Coût | Décision |
|---|---|---|---|
| Sauts pour un sport à sauts à 3 jours et plus : étendre R-PLIO au programme généré, ou libérer un jour sans jambes lourdes (séance HAUT) | Seul moyen de donner des sauts au volleyeur | Moyen à élevé | **Décision de l'utilisateur**, puis `coach`, `kine`, `relecteur` |
| Variété entre semaines (R3) : alterner les accessoires, garder les piliers | Corrige (b) 2 et 5 | Moyen | Utilisateur |
| Doses plus variées : principal lourd 3 x 6-8, accessoires 2 x 12-15, onde de charge ; intermédiaire en sport ne reçoit plus la dose de débutant | Corrige (b) 1 | Faible à moyen | `coach` |
| Remplir les séances : isolation (biceps, triceps, deltoïdes, mollets) en PUSH / PULL / LEGS pour intermédiaire et avancé, hors limite de 10 séries du pectoral ou du dos | Corrige (b) 4 | Faible à moyen | Utilisateur |
| Salle : fiches de machines, exclure sac à dos / élastique / bosu quand la machine ou la poulie existe | Corrige (b) 6 | Moyen | Utilisateur (matériel `machine` / `poulie`) |
| Supersets : étendre P1 à `poussee_3` / `tirage_3` horizontaux ; jambes poids du corps + tirage léger ; paire d'isolation. **SUP-4 (débutant) n'est pas assoupli** | Plus de paires pour intermédiaire et avancé | Faible à moyen | À valider par `kine` |
| Objectif sport : volet musculation spécifique (épaules, mollets, gainage, réception) + message honnête | Corrige (b) 8 | Élevé (contenu sourcé) | `coach` + `kine` |
| Échauffement et retour au calme adaptés à la séance ; texte « cardio retiré » du profil 3 | Corrige (b) 7 et 9 | Faible | `coach` + `dev` |
