# Logique des programmes : ordre, répartition, volume, matériel, rotation
Dernière vérification : 21/10/2026. Rôle : agent `coach` valide chaque ligne "provisoire" avant qu'elle soit codée en dur.
Légende statut : OK = source primaire ou méta-analyse lue au moins en résumé ; PROVISOIRE = vu via source secondaire ou à recouper ; NON SOURCÉ = hypothèse de conception, à valider.
Voir aussi knowledge/sources.md (ce qui a été réellement lu).

## 0. Référence de base : position de l'ACSM d'avril 2026 (remplace celle de 2009)
- ACSM, "Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews", Med Sci Sports Exerc, avril 2026 (137 revues, +30 000 participants). Lien : https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx (page non lisible depuis ici : contenu connu via la page ACSM https://acsm.org/science-spotlight-acsm-releases-new-position-stand-on-resistance-training/ et un article de presse médicale -> PROVISOIRE).
- Points rapportés : tous les grands groupes musculaires au moins 2 jours/semaine ; FORCE : charges lourdes (~80 % du max ou plus), 2-3 séries par exercice, exercices placés en début de séance, amplitude complète ; HYPERTROPHIE : plus de séries au total (au moins 10 séries par muscle et par semaine), accent sur la phase de descente (excentrique) ; PUISSANCE : 30-70 % du max, exécution rapide ; aller jusqu'à l'échec n'est pas nécessaire en moyenne ; le type de matériel, la complexité et la variété changent peu les résultats ; les bases valent pour débutants comme avancés ; les circuits fonctionnent aussi ; la régularité prime.
- Conséquence : le moteur reste simple. Ne pas sur-compliquer (pas de rotation aléatoire, pas d'échec systématique).

## 1. Ordre des exercices dans une séance
- Force : exercice prioritaire d'abord, gros mouvements (pompes, squats, tractions, rowing) avant l'isolation. (ACSM 2026 ; Nunes 2021, Eur J Sport Sci, méta-analyse 11 études, DOI 10.1080/17461391.2020.1733672.) Statut : OK.
- Muscle (hypertrophie) : ordre flexible, pas d'effet significatif sur la croissance (Nunes 2021). On peut commencer par un muscle en retard. Statut : OK.
- Muscu + cardio intense dans la même séance : muscu d'abord (Eddens 2018, vu via synthèse). Statut : PROVISOIRE.
- Toujours : échauffement avant, retour au calme à la fin.

## 2. Choisir la répartition selon le nombre de jours par semaine (sélecteur)
Principes : (a) chaque grand muscle au moins 2 fois/semaine (ACSM 2026 ; Schoenfeld, Ogborn, Krieger 2016, Sports Med 46:1689, PubMed 27102172) ; (b) le volume hebdomadaire par muscle est le moteur principal : à volume égal, répartition "split" ou "corps entier" donne la même croissance (méta-analyse 2024 "Efficacy of Split Versus Full-Body Resistance Training...", 14 études, 392 personnes, vue via synthèses : PROVISOIRE) ; (c) la fréquence en elle-même compte peu quand le volume est égal (Schoenfeld et coll. 2019, vu via synthèses : PROVISOIRE).
Table de décision (logique de conception dérivée des sources ci-dessus) :
| Jours/semaine | Répartition conseillée | Fréquence par muscle | Remarques |
|---|---|---|---|
| 1 | Corps entier | 1 | Avertir : en dessous de 2/semaine, résultats limités. |
| 2 | Corps entier x2 | 2 | |
| 3 | **Corps entier x3** (par défaut) | 3 | Haut/bas en 3 jours = 1,5x/semaine en moyenne : seulement si la personne le préfère, avec avertissement. **Push/pull/legs en 3 jours = 1x/semaine : déconseillé.** Corps entier est aussi le plus tolérant si une séance est ratée. |
| 4 | Haut/bas x2 (ou corps entier x4 si séances courtes) | 2 | |
| 5 | Haut/bas + push/pull/legs (ou 4 jours + 1 jour cardio/point faible) | ~2 | |
| 6 | Push/pull/legs x2 | 2 | |
- Si la personne choisit une répartition qui donne moins de 2 fois/semaine : afficher un avertissement et proposer l'alternative.
- Si l'objectif principal n'est pas la muscu (perte de poids, cardio, sport) : voir sections 6 et 7.
- Récupération : au moins ~48 h avant de retravailler fortement le même muscle (ACSM 2011, Garber et coll. ; ACSM 2009 : 24-48 h selon le niveau). Statut : PROVISOIRE (valeur par défaut prudente).

## 3. Volume (séries par muscle et par semaine)
- Hypertrophie : au moins 10 séries "dures" par muscle et par semaine (ACSM 2026 via synthèse ; Schoenfeld, Ogborn, Krieger 2017, J Sports Sci, méta-analyse 15 études : gain croissant jusqu'à 10+ séries). Fourchette courante 12-20 pour entraînés, rendements décroissants au-delà (méta-analyse Baz-Valle, vue via synthèses). Un débutant progresse avec moins (4-6 vues via synthèse). Statut : PROVISOIRE sauf le seuil de 10.
- Force : 2-3 séries par exercice, charges lourdes, au moins 2 séances/semaine (ACSM 2026 via synthèse). PROVISOIRE.
- Le moteur répartit le volume du muscle sur ses séances de la semaine ; ne pas dépasser un nombre de séries raisonnable par séance et par muscle (limite non sourcée : à définir par `coach`).
- Débutant : démarrer bas (valeur à définir par `coach` avec source) et augmenter progressivement.

## 4. Charges, matériel et exercices à la maison
- Hypertrophie : charges légères et lourdes donnent une croissance musculaire similaire quand les séries sont menées près de l'échec (Schoenfeld et coll. 2017, J Strength Cond Res 31(12):3508-3523, méta-analyse 21 études, PubMed 28834797 ; Grgic 2020, J Hum Kinet 74:51-58, niveau fibre). Mais la force maximale (1RM) progresse davantage avec des charges lourdes (même méta-analyse). Statut : OK.
- Point de vigilance : l'ACSM 2026 dit que l'échec n'est pas nécessaire en moyenne ; pour des charges légères, des travaux indiquent qu'il faut quand même s'en approcher (vu via synthèse). -> règle provisoire : avec peu de matériel, séries longues (reps élevées) et proche de l'échec technique (laisser environ 1-3 répétitions en réserve), jamais à l'échec sur des mouvements lourds ou risqués sans partenaire. À valider par `coach`.
- Personnalisation par matériel (règles de conception) :
  1. Chaque exercice déclare le matériel requis (et les alternatives). Le profil déclare le matériel disponible, y compris l'implicite (chaise, mur, sol, serviette, première marche d'escalier). Les objets du quotidien (sac à dos chargé, bidons ou sacs, box stable) ne sont JAMAIS implicites : ils sont cochés dans le profil (equipment-taxonomy.md §2). La table n'est pas un matériel (tirage sous table écarté le 21/10/2026).
  2. Le moteur couvre les grands schémas de mouvement : poussée horizontale, poussée verticale, tirage horizontal, tirage vertical, flexion de jambes (squat/fente), charnière de hanche, gainage. Si un schéma n'est pas couvert avec le matériel déclaré, le dire et proposer une alternative (ex. rowing aux haltères ou à l'élastique ; le tirage sous une table est écarté).
  3. Progression sans charges lourdes : variantes plus difficiles (pompes surélevées pieds, unilatéral, tempo lent et descente contrôlée, pauses, plus de répétitions), conformément à l'accent sur l'excentrique pour l'hypertrophie (ACSM 2026 via synthèse).
  4. Objectif force avec seulement du poids du corps ou des élastiques : être honnête, la force maximale se développe mieux avec des charges lourdes ; proposer des variantes unilatérales difficiles et signaler la limite.
  5. Haltères réglables : tenir compte des paliers de poids disponibles pour la progression.

## 5. Supersets, circuits et durée de séance
- Supersets : gagnent du temps sans réduire le volume, l'activation musculaire ni les adaptations (force, endurance de force, hypertrophie) : Zhang, Weakley, Li, Li, Garcia-Ramos 2025, Sports Med, 19 études, 313 participants. Lien : https://eprints.leedsbeckett.ac.uk/id/eprint/11908. Statut : OK (résumé lu).
- Règle : enchaîner des muscles antagonistes (poussée/tirage, quadriceps/ischios, biceps/triceps) ou des muscles qui ne se chevauchent pas : le volume est maintenu (plus de répétitions possibles avec des paires agoniste-antagoniste). Éviter d'enchaîner deux exercices sur le même muscle sauf intention précise (technique d'intensification) : le volume de charge chute fortement (même méta-analyse).
- Fatigue interne plus élevée en supersets : prévoir des temps de récupération entre paires.
- Circuits : l'ACSM 2026 indique qu'ils fonctionnent aussi. Repos courts surtout pour cardio/endurance/perte de poids.
- Durée d'une séance = échauffement + somme des séries x (temps d'exécution + repos) + retour au calme ; en supersets, le repos est partagé par la paire. Afficher avant de commencer, adapter si "durée max" demandée (réduire séries accessoires en dernier, jamais l'exercice prioritaire ni l'échauffement).
- Repos entre séries : voir rest-and-volume-rules.md.

## 6. Perte de poids / santé / cardio
- OMS 2020 (Bull et coll., Br J Sports Med 54(24):1451-1462, DOI 10.1136/bjsports-2020-102955) : adultes 150-300 min/semaine d'activité aérobie modérée (ou 75-150 min intense), plus du renforcement musculaire sur les grands groupes au moins 2 jours/semaine. Statut : OK.
- Perte de poids : un document relayant l'ACSM indique >250 min/semaine d'activité pour perdre du poids et que 150-250 min aident surtout à ne pas en reprendre (source secondaire, ancienne) : PROVISOIRE. Le déficit calorique relève du nutritionniste.
- Garder du renforcement musculaire dans un plan de perte de poids : à sourcer (préservation de la masse maigre).
- Muscu + cardio le même jour : muscu d'abord pour la force (section 1).

## 7. Rotation des exercices (entre jours et semaines)
- Faits : une variation systématique peut aider (hypertrophie régionale, force dynamique), une variation excessive ou aléatoire peut nuire (Kassiano et coll. 2022, J Strength Cond Res, revue systématique, 8 études). Pas de différence de croissance entre variation aléatoire et exercices fixes sur 8 semaines, mais motivation plus élevée avec variation (Baz-Valle et coll. 2019, PLoS One). L'ACSM 2026 (via synthèse) ne juge pas la variété nécessaire.
- Règle de conception : garder les exercices "piliers" fixes pendant un bloc (progression mesurable), varier les accessoires de façon organisée (autre angle, autre appui), jamais de rotation aléatoire à chaque séance. Pour un même muscle travaillé 2 fois/semaine, l'une des deux fois peut utiliser une variante.
- Durée d'un bloc (4-6 semaines) : NON SOURCÉ, à valider.
- Semaine de décharge (deload) : NON SOURCÉ, à rechercher avant de l'implémenter.

## 8. Progression
- Principe : surcharge progressive (augmenter charge, répétitions, séries, contrôle du mouvement, réduire les repos, ou augmenter la vitesse) (ACSM 2026 via synthèse). Le moteur propose une progression simple et mesurable à partir de l'historique des séries (reps, charge).
- Règle précise de montée en charge (double progression, pas de poids) : à définir par `coach` avec source.

## 9. À sourcer en priorité (agent coach)
- [ ] Lire le texte complet de l'ACSM 2026 (repos, fréquence, échec, volume, circuits) et corriger cette page.
- [ ] Repos et organisation en circuit/superset selon l'objectif.
- [ ] Volume de départ pour débutants, limite de séries par séance et par muscle.
- [ ] Récupération minimale entre deux séances d'un même muscle.
- [ ] Semaine de décharge ; durée des blocs.
- [ ] Échauffement (contenu et durée).
- [ ] Préservation de la masse maigre en perte de poids.
- [ ] Sports (volley, foot...) : qualités à développer et exercices associés.
- [ ] Blessures : exercices à adapter ou éviter par zone.

## 10. Exercices fonctionnels (portés, locomotion, puissance, rotation)
- Définition de travail : mouvements de la vie réelle et du sport : pousser, tirer, s'accroupir, charnière de hanche, fente, porter, marcher/courir, sauter, lancer, tourner / résister à la rotation. (Source : articles de vulgarisation, PROVISOIRE.)
- Preuves, honnêtement : "fonctionnel" décrit le mouvement, pas une supériorité prouvée ; la recherche sur les portés est encore limitée (article NSCA ; synthèses grand public), même si l'activation du tronc et de la prise est bien documentée. Intérêt reconnu : prise de la main, stabilité du tronc, équilibre. L'ACSM 2026 (via synthèse) inclut la puissance et des critères de fonction physique (vitesse de marche, équilibre, escaliers) et dit que les formes d'entraînement non traditionnelles sont très efficaces. Statut : PROVISOIRE.
- Règle de conception (NON SOURCÉ, valeur par défaut à valider par `coach`) : chaque semaine d'un programme "forme / santé / sport / fonctionnel" inclut au moins un porté, un exercice de locomotion ou de saut, et un exercice de rotation ou d'anti-rotation, en bloc final ou en circuit ; pour un programme purement "muscle", ils restent optionnels (profil : case "ajouter du fonctionnel").
- Sauts (décision D3, 22/10/2026) : niveau intermédiaire, réception contrôlée (reception-saut-stabilisee) en entrée ; priorité aux personnes qui pratiquent un sport de saut (volley, danse, foot) (sports.md). Aucun exercice d'équilibre yeux fermés.
- Placement : puissance (sauts, lancers, kettlebell swing léger) en début de séance, quand on est frais ; portés en fin de séance ou en circuit ; mobilité à l'échauffement. (Cohérent avec : exercice prioritaire en premier, ACSM 2026.)
- Dosage des portés : en distance ou en temps ; progresser en charge, distance ou en passant à une seule main (suitcase), valeurs à définir par `coach` avec source.
- Disponibilité : le moteur ne propose un exercice fonctionnel que si le matériel est présent (y compris objets du quotidien déclarés : sac à dos, bidons, sacs de courses) ; sinon, alternative ou message.
- Exercices techniques (snatch, clean...) : réservés aux niveaux avancés (voir exercise-catalog.md section 5).
