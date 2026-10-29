# Séance manquée, reportée, sautée : règles codables v1
Rédigé le 29/10/2026 (`coach`), à partir de knowledge/schedule-adaptation.md (PROVISOIRE), generateur-v1.md §2.4 (V-JOURS) et V-ROT, program-logic.md, regles-securite-communes.md, progression-et-bilan-v1.md, src/session/calendar.ts et src/session/program.ts. **Statut du fichier : PROVISOIRE, à contrôler par `relecteur` (lancé à neuf) avant tout codage** (CLAUDE.md règle 10). Légende : OK / PROVISOIRE / NON SOURCÉ (règle 10). Tout ce qui est « choix prudent » est NON SOURCÉ sauf mention.

## 0. Sources relues le 29/10/2026 (ne rien déformer)
| Id | Source | Ce qu'elle dit (et ne dit pas) | Niveau de preuve | Public | Statut |
|---|---|---|---|---|---|
| SM-S1 | Nuckols, « Detraining », Stronger By Science, 2022, https://www.strongerbyscience.com/detraining/ (page relue le 29/10/2026) | Cite Bosquet et al. 2013 (méta-analyse, 103 études) : force maximale quasiment inchangée jusqu'à 28 jours d'arrêt (effets triviaux, g < 0,2), pertes plus rapides ensuite ; chez les plus de 65 ans, perte environ deux fois plus forte. Taille du muscle : baisse non significative dans les 20 jours chez les jeunes adultes (Psilander 2019, Bjørnsen, Seaborne 2018). Endurance de force : baisse plus tôt et plus forte que la force (g = 0,48 jeunes), **aucun délai en jours indiqué**. Maintien : 1/9 du volume sur 8 mois (Bickel 2011) ; 1 série par exercice sur 8 semaines chez des femmes de plus de 60 ans (Antunes 2022). Reprise : arrêt de moins d'un mois = charges environ 20 % plus basses la première semaine ; pauses longues (exemple à 12 semaines) = environ un tiers des charges la semaine 1, 5 répétitions en réserve sur la première série la semaine 2. **Les études citées ne sont pas relues** ; les chiffres de reprise sont l'avis de l'auteur, non recoupé. | synthèse de blog sur une méta-analyse (preuve de départ élevée, relais secondaire) | adultes entraînés (jeunes et seniors) | PROVISOIRE |
| SM-S2 | schedule-adaptation.md (21/10/2026) | Aucune étude lue sur « rattraper » une séance en doublant la suivante ; la recherche sur les pics de charge (ratio aigu/chronique) est contestée et n'a pas été ouverte : **aucun seuil précis ne doit être présenté comme prouvé**. | absence de preuve | tous | PROVISOIRE |
| SM-S3 | ACSM 2026 (Currier, Phillips et coll., MSSE 2026;58(4):851-872, https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823), via program-logic.md §0 | Tous les grands groupes au moins 2 jours/semaine ; au moins 2 séries par exercice ; hypertrophie >= 10 séries/semaine ; **ne dit rien** sur les séances manquées, la reprise ni la décharge. | position d'organisme, revue de revues | adultes sains | OK (pour ces seuls points) |
| SM-S4 | regles-securite-communes.md R2, R4, R5, R7, G5, G7 ; progression-et-bilan-v1.md §1.5 (V-PROG-E8) | Règles de sécurité et de gel de progression de l'app. | règles du projet | adultes | voir ces fichiers |

Conséquence honnête : les sources disent seulement qu'**une pause courte coûte peu** et que **la reprise après plusieurs semaines demande de la prudence**. Aucune source ne fixe les seuils en jours ni les pourcentages ci-dessous ; ce sont des choix prudents dans des fourchettes mentionnées.

## 1. États d'un jour planifié (SM-1)
**SM-1** : un jour planifié (jour de la semaine d'une séance du programme, `plannedDates`) est dans un seul de ces états. Statut : NON SOURCÉ (vocabulaire de conception), cohérent avec calendar.ts (`PlannedMark`, `DayMark`, `SessionStatus`).
| État | Texte affiché | Définition | Stockage | Marque (texte + forme) |
|---|---|---|---|---|
| prévue | « Prévue » | jour planifié, aujourd'hui ou à venir, sans séance | dérivé (aucune ligne) ; ou ligne `status = prevue` | ○ (existe) |
| faite | « Faite » | séance `faite` | `status = faite` | ✓ ou ◆ avec douleur (existe) |
| reportée | « Reportée » | la personne a choisi un autre jour de la même période ; la séance d'origine est conservée à l'historique | ligne sur le jour d'origine `status = reportee` ; le nouveau jour devient une séance **prévue** (même `programDayIndex`, nouvelle `plannedDate`) | ↷ (existe) ; le nouveau jour affiche « Prévue » |
| non faite | « Non faite » | jour planifié passé, aucune séance, aucune décision (cas courant : l'app n'a pas été ouverte) | dérivé (aucune ligne), règle de « couverture » actuelle de `plannedMark` conservée | ◌ (existe) |
| sautée | « Sautée » | la personne renonce à cette séance | ligne `status = sautee` avec **nouvelle** valeur `endReason = 'renonce'` | nouveau : forme distincte de « Arrêtée » (–), par exemple « » » à décider par `dev` |
Règles d'état :
- Un état n'est jamais effacé en silence : l'historique reste honnête (schedule-adaptation.md règle 10).
- **Écart avec le code actuel (pour `dev`)** : aujourd'hui `status = sautee` sert aussi à l'abandon et au symptôme (`endReason = abandon | symptome`), et calendar.ts les affiche « Arrêtée ». Une séance **sautée par choix** (aucune séance commencée) doit être distincte d'une séance **abandonnée** : valeur `renonce` à ajouter, texte « Sautée ». L'abandon et le symptôme ne changent pas.
- « Non faite » ne déclenche jamais de reproche, de compteur de « séances ratées » ni de couleur d'alerte.

## 2. Quand l'app propose quelque chose (SM-2 à SM-5)
**SM-2 — déclencheur.** L'app affiche UNE proposition quand toutes ces conditions sont vraies : (a) un jour planifié D est passé (jour civil local) sans aucune ligne de séance et reste « non faite » selon `plannedMark` ; (b) aujourd'hui >= D + 1 ; (c) le prochain jour planifié n'est pas encore arrivé (aujourd'hui < prochain jour planifié) ; (d) aucune séance en cours ; (e) un seul jour manqué concerné : le plus récent (jamais une liste de retards) ; (f) la proposition n'a pas déjà été répondue ou fermée pour ce jour D ; (g) pas d'exclusion SM-15 (symptôme). Elle apparaît à la première ouverture de l'app dès le lendemain, jamais par notification, jamais le jour même. Si deux jours planifiés ou plus sont manqués : pas de proposition « décaler » ; voir SM-12 (reprise) et le seul message d'accueil. Statut : NON SOURCÉ (choix prudent : un seul message par écran, déjà décidé le 29/10/2026).
**SM-3 — où et comment.** Sur l'Accueil, à la place du bandeau « séance du jour » et jamais en plus d'un autre message (un seul message par écran). Fenêtre modale évitée : carte avec 3 gros boutons (44 px minimum, règle 27), le choix « La faire quand je peux » étant aussi l'effet de la fermeture de la carte. Aucune notification, aucun badge, aucun rappel répété. NON SOURCÉ (règle 8, 27).
**SM-4 — les 3 choix** (libellés exacts en §7) :
1. **Décaler à un autre jour de cette semaine** : affiché seulement si SM-5 donne au moins un jour. Mène à une liste de jours (gros boutons).
2. **La faire quand je peux** : aucun changement de données ; la séance reste la **prochaine séance de la rotation** (comportement actuel de `nextSession`). La carte ne revient pas pour D.
3. **Sauter cette séance** : avec confirmation (texte T-9) ; état « sautée » (SM-1) ; la rotation avance (SM-18).
**SM-5 — jours proposés pour « Décaler » (tous les critères ensemble).** Un jour J est proposé si :
- J est un **jour libre du profil** (hors `blockedWeekdays`) ;
- J est entre aujourd'hui et la fin de la semaine (dimanche) **inclus** et **strictement avant** le prochain jour planifié du programme (ordre A, B, C conservé : sinon la rotation montrerait déjà la séance reportée au prochain jour planifié) ;
- J est à **2 jours civils ou plus** de toute autre séance de musculation faite, prévue ou déjà décalée (48 h, V-JOURS ; mêmes jours civils que le code). Une séance de cardio dédiée (`isCardioDay`) n'est pas concernée par cette distance (cardio-regles.md §3.6) ;
- J n'a aucune autre séance (jamais deux séances le même jour) ;
- le nombre de séances de musculation de la semaine, avec celle-ci, ne dépasse pas `daysPerWeek` du profil (le décalage remplace une séance, il n'en ajoute pas) ;
- la séance D n'a pas déjà été décalée une fois (une seule fois par séance : SM-6).
Si aucun jour ne convient, le bouton « Décaler » n'est pas affiché et un texte d'une ligne dit pourquoi (§7). Le jour d'aujourd'hui est proposé s'il remplit les critères (la personne peut s'entraîner maintenant). Statut : 48 h = PROVISOIRE (program-logic.md §2, ACSM 2009/2011 via synthèses) ; tout le reste NON SOURCÉ (application stricte de schedule-adaptation.md règles 1, 3 et 8, avec la restriction « avant le prochain jour planifié » ajoutée ici).
**SM-6 — une seule fois.** Une séance ne peut être décalée qu'une fois. Si le jour décalé passe sans séance : état « non faite » sur ce jour, pas de nouvelle proposition de décalage ; les choix 2 et 3 restent disponibles par l'écran de la séance, sans carte. NON SOURCÉ (évite l'harcèlement).

## 3. Séance double, intensité, compensation de volume (SM-7 à SM-10)
**SM-7 — jamais de séance double.** Jamais deux séances de musculation le même jour civil, ni à moins de 2 jours civils l'une de l'autre dans les propositions de l'app. La personne reste libre de s'entraîner quand elle veut (avertissement `tooSoon` existant). Test obligatoire (schedule-adaptation.md « Tests obligatoires »). Statut : 48 h PROVISOIRE ; règle « jamais de double » NON SOURCÉ (conception, SM-S2).
**SM-8 — jamais de rattrapage en intensité.** Une séance décalée ou reprise a exactement les charges, échelons, séries et réserve cible qu'elle aurait eus à sa date prévue, sauf réduction de SM-12. Jamais d'échec forcé, jamais de charge augmentée « pour compenser ». Statut : NON SOURCÉ (schedule-adaptation.md règle 6 ; ACSM 2026 : l'échec n'est pas nécessaire).
**SM-9 — compensation de volume : aucune en v1 (valeur retenue : +0 série).** Choix prudent. Raisons : (a) manquer une séance n'est pas grave (SM-S1 : force et muscle inchangés sur des semaines) ; (b) aucune étude lue sur la compensation (SM-S2) ; (c) en corps entier 3 jours, il reste 2 séances par semaine, ce qui respecte « chaque muscle au moins 2 fois par semaine » (SM-S3) ; (d) le déficit n'est jamais « mémorisé » : la semaine suivante repart sur le volume normal. Valeur maximale **autorisable plus tard, désactivée** : +1 série sur 2 exercices « autre » au plus, jamais sur un pilier, jamais pour un débutant, jamais sous douleur/symptôme/grossesse/post-partum, jamais au-delà de la limite de séries par séance du générateur ; elle exigerait une nouvelle validation de `coach` puis de `relecteur`. Statut : NON SOURCÉ.
**SM-10 — priorité si la séance doit être raccourcie** (par exemple jour décalé avec moins de temps) : on garde les exercices piliers, puis les accessoires, puis le fonctionnel/cardio optionnel ; on coupe dans l'ordre inverse (schedule-adaptation.md règle 4 ; generateur-v1.md durée max). Jamais moins de 2 séries sur un exercice conservé (ACSM 2026, au moins 2 séries par exercice). Statut : NON SOURCÉ pour l'ordre, OK pour « au moins 2 séries ».
**SM-11 — fréquence réduite une semaine.** Programme de 2 jours dont une séance est sautée ou non faite : une seule séance cette semaine. Message d'information neutre (§7), jamais d'avertissement rouge. Les séances de la semaine suivante ne sont pas modifiées. Statut : message NON SOURCÉ ; affirmation « presque sans effet » PROVISOIRE (SM-S1, maintien avec peu de volume).

## 4. Après une absence : « reprise douce » (SM-12 à SM-16)
**SM-12 — seuils.** Mesure : nombre de jours civils entre la dernière séance de **musculation faite** (`faite`, hors cardio dédié ; les séances sautées, reportées, abandonnées ne comptent pas) et le jour où la personne ouvre sa prochaine séance. Palier atteint au moment de démarrer la séance, pas avant.
| Palier | Jours sans séance | Ce qui change à la première séance de reprise | Source |
|---|---|---|---|
| 0 normal | 0 à 9 | rien (une ou deux séances manquées ne justifient aucune baisse) | SM-S1 : force inchangée jusqu'à ~28 j ; seuil 9 j NON SOURCÉ |
| 1 reprise légère | 10 à 20 | mêmes charges et échelons qu'avant, **aucune montée** pendant 1 séance valable, étalonnage RIR de nouveau (la première série de travail décide ; seuls « garder » et « descendre » sont possibles) | SM-S1 : muscle inchangé avant ~20 j ; bornes NON SOURCÉ |
| 2 reprise douce | 21 à 34 | un cran en dessous : charge à l'étape inférieure du palier réel de l'appareil (environ -10 %), ou échelon -1 (poids du corps) ; 1 série de moins sur chaque exercice « autre » (plancher 2 séries) ; étalonnage RIR de nouveau (garder / descendre) ; aucune montée pendant 2 séances valables | SM-S1 : « environ -20 % si moins d'un mois » (avis d'auteur, non recoupé) ; valeur retenue -10 % : plus douce, car la force reste inchangée ~28 j ; NON SOURCÉ |
| 3 reprise progressive | 35 à 89 | séance 1 : charge environ -20 % (fourchette de SM-S1 : -20 % à -33 %), ou échelon -1 ; 1 série de moins sur les « autre » (plancher 2) ; étalonnage RIR de nouveau ; séances 2 et 3 : environ -10 % ; aucune montée pendant 3 séances valables ; puis progression normale | SM-S1 (avis d'auteur) ; schedule-adaptation.md règle 5 (« au-delà de 4 semaines : reprise progressive sur 2 semaines », NON SOURCÉ) ; seuils NON SOURCÉ |
| 4 reprise complète | 90 et plus | comme un premier jour : étalonnage de chaque exercice comme à la première séance (load-calibration.md), niveau et durée du profil inchangés ; aucune montée pendant 3 séances valables | NON SOURCÉ (choix prudent) |
- La baisse ne s'applique jamais en dessous de la charge d'étalonnage minimale ni sous le plus bas échelon de la fiche ; elle s'arrondit au palier réel inférieur (paliers réels des haltères, règle 17).
- La durée annoncée de la séance de reprise est recalculée avec les séries retirées, pas d'avance.
- Seuils en **jours civils** (changements d'heure sans effet). Les seniors perdent plus vite (SM-S1) : l'app v1 ne connaît pas l'âge exact (adultes majeurs) ; aucun seuil par âge en v1, noté comme limite.
- Arrêt plus court pour **un exercice précis** (14 jours sans cet exercice, Q10 de progression-et-bilan-v1.md) : **hors v1**, rien n'est codé.
**SM-13 — lien avec la progression.** Ajouter à la liste des interdits V-PROG-E8 (progression-et-bilan-v1.md §1.5) : « reprise douce active » (paliers 1 à 4 de SM-12) = aucune proposition de montée (échelon, niveau, charge, durée, série) tant que le nombre de séances valables du palier n'est pas atteint. **Séance valable** = `faite`, au moins une série de travail de l'exercice, sans douleur ni symptôme (définition du §1.3). Une séance avec douleur ne compte pas et ne fait pas redescendre de palier. Les baisses restent permises. Statut : NON SOURCÉ.
**SM-14 — message à la reprise.** Une seule fois, sur l'écran de la séance ou l'Accueil (jamais les deux) : texte §7, ton positif, sans mot « retard » ni « rattraper ». Le palier 0 n'affiche rien.
**SM-15 — sécurité avant tout.**
- **Douleur ou symptôme déclaré** : aucune compensation (SM-9 vaut 0 de toute façon), pas de séance « ajoutée ». Si la dernière séance s'est terminée sur un symptôme (`endReason = symptome`, R5) : **aucune carte de proposition** (SM-2 (g)) et aucune reprise avant le message de sécurité de R5/U1 ; la reprise douce SM-12 ne s'affiche qu'ensuite. Douleur dans une série (R4) : le gel de progression existant s'applique en plus ; la carte de proposition reste permise car elle ne rajoute aucun volume. Blessures de niveau 2 : plafond R2 inchangé ; niveau 3 : exercices déjà retirés.
- **Grossesse / post-partum (réglage coché)** : aucune compensation (SM-9), jamais plus de 3 séances par semaine ni deux jours de suite (G5) : donc « Décaler » reste soumis à SM-5 (qui n'ajoute aucune séance) ; la reprise douce SM-12 s'applique **telle quelle ou plus prudente, jamais moins** (palier 1 inclus : aucune montée de toute façon, G5 plafonne déjà) ; l'impact reste retiré (G7). Aucun message de reprise ne mentionne la grossesse (la personne a déjà G1/G2). Validation de `kine` requise avant codage.
- **Maladie, fatigue forte** (déclarées par la personne à la carte : voir §7, texte « Je ne me sens pas bien » = équivalent de « Sauter » avec phrase d'accueil) : pas de compensation ; schedule-adaptation.md règle 7 propose une séance courte de maintien (1 série par exercice pilier) : **non codée en v1** (NON SOURCÉ ; piste : SM-S1, Antunes 2022).
Statut : OK pour « douleur : pas de progression » (R4, PROVISOIRE au sens de regles-securite-communes.md), G5 PROVISOIRE ; le reste NON SOURCÉ, `kine` à relire.

## 5. Comment la rotation A/B/C avance (SM-16 à SM-19)
Rappel du code : `nextSession` prend la séance qui suit la dernière séance **faite** ; abandon et symptôme n'avancent pas la rotation.
**SM-16 — séance reportée puis faite** : compte comme la séance prévue (même `programDayIndex`), la rotation avance normalement. Si la séance décalée n'est pas faite, rien ne change : elle reste la prochaine (SM-6).
**SM-17 — séance « La faire quand je peux »** : reste la prochaine séance, aucune ligne créée ; faite à n'importe quel jour libre (sans nouvelle carte).
**SM-18 — séance sautée** : **la rotation avance d'un cran** (la prochaine séance est celle qui suit la sautée), sans compter comme séance faite pour la régularité, le palier de reprise ni les 48 h. Raison du choix : « Sauter » doit avoir un effet visible sinon il est identique à « La faire quand je peux » ; en corps entier, chaque séance couvre tous les grands muscles (generateur-v1.md §2.3), donc rien de capital ne se perd ; la semaine type A, B, C reprend. Exception documentée : programme de 2 jours avec N < 7 exercices (A = poussée/tirage horizontaux, B = verticaux, V-MSG-PLANS) : sauter A puis B de suite laisserait un plan non travaillé ; message d'information V-MSG-PLANS déjà prévu, aucun correctif automatique. Code : `nextSession` doit compter les séances `sautee` avec `endReason = renonce` pour l'indice de rotation (pas pour `availableAtMs`). Statut : NON SOURCÉ (choix prudent).
**SM-19 — dans un bloc.** Les séances sautées ne rallongent pas le bloc de 4 semaines (`Program.weeks`) ; le bilan de bloc ne compte que les séances faites. Statut : NON SOURCÉ.

## 6. Autres règles
**SM-20 — cardio dédié manqué** : mêmes états et mêmes 3 choix ; la distance de 48 h ne s'applique pas à une séance de cardio d'effort modéré ; pas de cardio « de rattrapage » plus long (schedule-adaptation.md règle 9 ; OMS 2020 : 150-300 min modérées par semaine, OK). Une séance de cardio manquée ne compte pas dans les jours sans musculation de SM-12.
**SM-21 — changement de programme.** Si le programme est régénéré (jours, matériel, profil modifiés), les cartes en attente sont effacées et les états passés restent à l'historique. NON SOURCÉ.
**SM-22 — historique et données.** Les décisions (reportée, sautée) sont stockées localement, incluses dans l'export JSON, supprimées avec le compte ; jamais partagées par défaut (règle 7). La date de la décision est conservée. NON SOURCÉ (règles 6, 7).
**SM-23 — jamais de culpabilisation.** Pas de « raté », « retard », « échec », « tu dois », « il faut », pas d'émoji ni de couleur rouge pour un jour non fait, pas de comparaison entre personnes, pas de compteur de séries ratées ni de pourcentage d'assiduité négatif. La série de semaines (`regularity`) continue de compter les semaines avec au moins une séance. Règle du projet (règle 8, calendar.ts « ton neutre »).

## 7. Textes affichés (français simple, tutoiement, ton positif)
| Id | Où | Texte |
|---|---|---|
| T-1 | Titre de la carte | « Ta séance de {jour} n'a pas eu lieu. Pas de souci. » |
| T-2 | Sous-titre | « « {nom de la séance} » t'attend toujours. Qu'est-ce qui te convient ? » |
| T-3 | Bouton 1 | « Décaler à un autre jour de cette semaine » |
| T-4 | Bouton 2 | « La faire quand je peux » |
| T-5 | Bouton 3 | « Sauter cette séance » |
| T-6 | Liste des jours | titre « Choisis un jour » ; boutons « Mardi », « Samedi »… ; bouton « Retour » |
| T-7 | Confirmation du décalage | « C'est noté : « {nom} » est décalée à {jour}. Elle est dans ton calendrier. » |
| T-8 | Confirmation de « quand je peux » | « C'est noté. Elle sera ta prochaine séance, quand tu veux. » |
| T-9 | Confirmation de « Sauter » (avant d'agir) | « Sauter « {nom} » ? Tu passeras directement à la suivante. » boutons « Oui, la sauter » et « Non, retour » |
| T-10 | Après avoir sauté | « Ok, on passe à la suivante. » |
| T-11 | Pas de jour possible pour décaler | « Aucun autre jour libre ne laisse assez de repos cette semaine. » (une ligne, sous les deux boutons restants) |
| T-12 | Programme de 2 jours, une séance en moins (SM-11) | « Cette semaine, une seule séance. Ce n'est pas grave : la semaine prochaine, on reprend le rythme normal. » |
| T-13 | Reprise palier 1 (10-20 j) | « Content de te revoir ! Pour reprendre en douceur, on garde tes charges d'avant et on voit comment ça se passe. » |
| T-14 | Reprise paliers 2 et 3 (21-89 j) | « Content de te revoir ! Pour reprendre en douceur, on démarre un peu plus léger que la dernière fois. Tu remonteras vite. » |
| T-15 | Reprise palier 4 (90 j et plus) | « Content de te revoir ! On repart du début, en douceur : on cherche ensemble les bonnes charges. » |
| T-16 | Après un symptôme (SM-15) | aucun texte nouveau : message de sécurité existant (R5/U1) |
| T-17 | Réglage grossesse coché | mêmes textes ; aucune mention supplémentaire |
Les textes de §7 sont NON SOURCÉ (rédaction de conception). Le mot « décaler » est conservé car il est dans la décision de l'utilisateur. Longueur : un bouton tient sur au plus 2 lignes à 375 px.

## 8. Cas d'essai (12) pour les tests de `dev`
Convention : semaine du lundi (0) au dimanche (6), « libre » = non bloqué, « aujourd'hui » = jour d'ouverture, programme actif corps entier.
| N° | Situation | Résultat attendu |
|---|---|---|
| E1 | 2 jours (lundi, jeudi), séance du lundi non faite, aujourd'hui = mardi, dernière séance faite = jeudi précédent, rien de bloqué | Carte affichée avec 3 choix ; jours proposés : mardi seulement (mercredi est à 1 jour du jeudi planifié ; vendredi est après le prochain jour planifié) |
| E2 | Idem E1 avec mardi bloqué | Carte avec 2 boutons (« quand je peux », « sauter ») et T-11 ; pas de bouton « Décaler » |
| E3 | 3 jours (lundi, mercredi, vendredi), lundi manqué, aujourd'hui = mardi | Aucun jour proposé (mardi à 1 jour du mercredi) : 2 boutons + T-11 |
| E4 | 3 jours, vendredi manqué, aujourd'hui = samedi, lundi suivant planifié, mercredi fait | Samedi proposé (2 jours de mercredi, 2 jours de lundi) ; dimanche non proposé (1 jour de lundi) |
| E5 | E1 puis choix « Décaler » jour mardi | Lundi = « Reportée » (↷), mardi = « Prévue » avec le même jour de programme (A) ; faite le mardi : rotation passe à B ; lundi n'est jamais « Non faite » |
| E6 | E5 mais mardi sans séance, aujourd'hui = mercredi | Mardi = « Non faite » ; aucune nouvelle carte de décalage (SM-6) ; la séance A reste la prochaine |
| E7 | E1 puis « La faire quand je peux » ; ouverture le mercredi | Aucune donnée créée ; carte non réaffichée ; séance du jeudi = A, rotation inchangée ; lundi = « Non faite » |
| E8 | E1 puis « Sauter » puis « Non, retour » | Rien n'est enregistré ; retour à la carte |
| E9 | E1 puis « Sauter » confirmé | Lundi = « Sautée » (`endReason = renonce`), pas d'« Arrêtée » ; prochaine séance = B (rotation avance) ; aucune séance ajoutée ; aucun message de reproche |
| E10 | Deux jours planifiés manqués, dernière séance faite il y a 12 jours | Pas de carte de décalage ; palier 1 (SM-12) : charges d'avant, étalonnage RIR (garder / descendre seulement), aucune proposition de montée pendant 1 séance valable ; message T-13 une seule fois |
| E11 | Dernière séance faite il y a 40 jours, 3 séries prévues sur un exercice « autre », charge 20 kg | Palier 3 : séance 1 à environ 16 kg arrondi au palier réel inférieur, 2 séries (plancher 2), étalonnage RIR de nouveau ; séances 2 et 3 environ -10 % ; aucune montée avant 3 séances valables ; une séance avec douleur ne compte pas |
| E12 | Dernière séance terminée sur un symptôme (`endReason = symptome`), jour planifié manqué | Aucune carte ; aucune compensation ; le message de sécurité R5/U1 existant ; réglage grossesse coché : mêmes résultats, aucune séance ajoutée, aucune mention supplémentaire |
Tests transversaux à ajouter : jamais deux séances de musculation à moins de 2 jours civils dans les jours proposés ; jamais plus de `daysPerWeek` séances par semaine après un décalage ; aucun jour proposé dans `blockedWeekdays` ; nombre de séries d'une séance de reprise jamais inférieur à 2 par exercice conservé ; charge jamais supérieure à la dernière charge sans douleur pendant une reprise ; aucun texte de §7 ne contient « raté », « retard », « rattraper ».

## 9. Récapitulatif des statuts et décisions à valider
- **OK** : au moins 2 séries par exercice et chaque grand muscle au moins 2 fois par semaine (SM-S3) ; 150-300 min/semaine d'aérobie modérée (OMS 2020, program-logic.md §6).
- **PROVISOIRE** : force inchangée jusqu'à ~28 jours, muscle jusqu'à ~20 jours, maintien avec peu de volume (SM-S1, relais de blog) ; 48 h entre deux séances (program-logic.md §2) ; gel de progression après douleur (R4).
- **NON SOURCÉ (choix prudents à valider par l'utilisateur et `coach`/`kine`, puis `relecteur`)** : tous les seuils en jours et pourcentages de SM-12 ; compensation = 0 ; rotation qui avance après « Sauter » ; « décaler » restreint avant le prochain jour planifié et une seule fois ; carte unique, sans notification ; textes §7.
- **À faire relire par `kine` avant codage** : SM-15 (symptôme, grossesse, post-partum), pourcentages de reprise, absence de seuil par âge.
- **Pour `dev` (écarts avec le code, rien n'est modifié ici)** : valeur `renonce` et marque « Sautée » ; `nextSession` à étendre (indice de rotation) ; entrée « reprise douce » dans V-PROG-E8 et dans le calcul de la charge de départ ; état de décalage (nouvelle date prévue) et jour décalé ajouté aux jours planifiés de la semaine.
