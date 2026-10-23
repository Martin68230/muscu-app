# Recontrôle de knowledge/generateur-v1.md (relecteur, 23/10/2026)

Recontrôle ciblé après les commits 9ad3877 (`coach`) et 654446f (`kine`), sur la base de knowledge/CONTROLE-generateur-v1-relecteur.md. Le relecteur ne corrige rien.

Vérifications faites :
- Lecture complète de la nouvelle version (507 lignes).
- Recalcul de l'exemple 3 de §4.4 (1 456, puis 1 351, puis 1 191 s : juste).
- Contrôle des 5 fiches de l'exemple 3 (schéma, muscles principaux, statut `utilisable` : conformes).
- Recherche des références « S1 » restantes : toutes désignent désormais les signes d'alerte, chaque fois avec le préfixe « signe(s) ».

## 1. Suivi des points du premier contrôle

| n° | Gravité initiale | État | Commentaire |
|---|---|---|---|
| 1 | bloquant | **résolu** | Ce qui a été ajouté :<br>• V-PRIO (§6.0) : les plafonds passent après la dose de base et ne font que baisser.<br>• P-GROS : famille ramenée à `sante`, 10-15 répétitions, réserve >= 3, 1 série pour une débutante, E3 à ~50 % seulement, aucun superset, 60 min.<br>• Exception explicite dans l'action 7 (« sauf plafond »), texte d'explication propre à la grossesse.<br>• T17 couvre chaque famille et chaque niveau.<br>Conforme à G5 (HAS). |
| 2 | à corriger | **résolu en partie** | P-CAP (corrigé par `kine`) et T35 : la charge la plus légère et l'échelon le plus bas ne s'appliquent qu'à une variante **sans historique**. Mais §6.3 (« sous un plafond : échelon le plus bas, quel que soit le niveau ») n'a pas repris cette condition, et contredit donc P-CAP quand il y a un historique. Voir le nouveau point N2. |
| 3 | à corriger | résolu | `rir >= min(cible + 2, 4)` ; T39. |
| 4 | à corriger | résolu | Aucun pilier ni charnière en superset ; la réserve de SRC2 est citée ; P3 pour un débutant seulement sans charge ; T25c. |
| 5 | à corriger | résolu | Les interdits valent pour toutes les familles. |
| 6 | à corriger | résolu | §2.1 dit maintenant clairement que la couverture n'est pas garantie à 20-30 min. Ordre de retrait tourné en 3 jours (vérifié : chaque groupe reste couvert 2 fois sur 3 après un seul retrait par séance). Le critère F3 est renvoyé à l'utilisateur (question 10.1.6). |
| 7 | à corriger | résolu | N de départ = 5 à 20 min ; exemple 3 et T3 recalculés, et justes. T3bis ajouté. |
| 8 | à corriger | résolu | T25a et T25b portent sur des séances construites à la main ; l'exemple 2 est juste (2 809 s, puis 2 644 s). |
| 9 | à corriger | résolu | E3 seulement avant les piliers ; actions 4 et 5 définies ; E1 réduit à 60 s à l'action 5. |
| 10 | à corriger | résolu | V-MSG-JOURS2 ; T41 ; question 10.1.7. |
| 11 | à corriger | résolu en partie | Harmonisé à « 3 emplacements du noyau sur 5 » (P-ZONE3, §6.8.4, §9, T30, T30bis). Reste à définir « vide » : voir N3. |
| 12 | remarque | résolu | V-MSG-GROS-DUREE ; §9 ; T37. |
| 13 | à corriger | résolu | Sources renommées SRC1-SRC15 ; T42. |
| 14 | à corriger | résolu | T33 à T42 sont dans le tableau du §11. |
| 15 à 23 | remarques | résolus | Ordre des sections, liste des fiches cou d'échauffement, supersets décidés une fois pour tout le bloc, plafond de 20 séries marqué NON SOURCÉ, auteurs de SRC3, PMID de SRC4, « 2-3 séries par séance », Kassiano marqué PROVISOIRE, `pompe-piquee` en grossesse, nombre de fiches. |
| 24 | remarque | en attente | `InjuryZone` sans `cuisse` ni `aine` : demande à `dev` toujours ouverte (normal à ce stade). |

## 2. Nouveaux points créés par les corrections

| n° | Section | Problème | Gravité | Source vérifiée |
|---|---|---|---|---|
| N1 | §5.2 (« Interdits pendant l'étalonnage »), P-GROS, §5.3 `capped` | Pour la grossesse, deux règles se contredisent :<br>• la ligne « Charge de départ » de §5.2 et le champ `capped` disent « jamais augmenté » ;<br>• la ligne « Interdits » permet encore une hausse si la réserve est >= 3 (« aucune hausse … au-delà de fatigue modérée »).<br>Le tableau P-GROS ne tranche pas. Écrire si une hausse pendant l'étalonnage est permise en grossesse ; la lecture prudente, cohérente avec V-PRIO, est « jamais de hausse ». Ajouter un test. | à corriger | G5 ; generateur §5.2, §6.0 |
| N2 | §6.3 (« Sous un plafond de sécurité ») et P-GROS | L'ajout de `kine` (« seulement pour une variante sans historique ; avec historique : variante et dernière charge sans douleur conservées ») figure dans P-CAP mais pas dans §6.3. Pour P-GROS, rien ne dit si « charge la plus légère, échelon le plus bas » vaut aussi avec un historique. Aligner les deux phrases ; sinon un développeur doit choisir lui-même. | à corriger | §6.0 P-CAP (kine 23/10) |
| N3 | §6.0 P-ZONE3, §9, T30 | « Emplacement du noyau vide à cause du niveau 3 » : faut-il compter avant ou après les replis b, c et d du §7.1 ? Le choix décide entre un programme partiel et aucun programme. À préciser, par exemple : « vide après le repli e et cause santé ». | à corriger | R3 ; §7.1 |
| N4 | §6.7 clé 3 (nouvelle) | Pour un intermédiaire, une fiche ayant une variante à son niveau est préférée, même sous `capped` ou en grossesse. L'échelon le plus bas d'une fiche de niveau `intermediaire` peut alors être plus dur qu'une fiche débutant, ce qui va contre l'esprit de V-PRIO. Désactiver cette sous-clé sous plafond. | à corriger | R2, G5 ; §6.0 |
| N5 | §8.1 ligne 1 (3 jours) | « Chaque grand muscle travaille 3 fois » reste affiché quand l'action 6 a retiré des emplacements. Cela contredit V-PRIO point 5 (« les textes décrivent la dose finale »). Il manque une ligne 1 « 3 jours, groupe retiré ». | à corriger | §6.0 point 5 ; §4.4 action 6 |
| N6 | T1, §4.4 | T1 exige « T <= durée choisie » pour toutes les combinaisons, alors que §4.4 admet maintenant T > D quand la séance ne garde que les piliers (T3bis). Ajouter cette exception dans T1. | remarque | §4.4 |
| N7 | §8.2 V-MSG-JOURS2 | Le déclencheur indique seulement « 2 jours demandés », alors que §2.4 l'applique aussi quand une demande de 3 jours est ramenée à 2. | remarque | §2.4 |
| N8 | §10.1, en-tête | Les « choix par défaut prudents, en attente de l'utilisateur » sont marqués « appliqués ». Selon CLAUDE.md règle 10, une valeur NON SOURCÉ n'est codée en dur qu'après validation. `dev` doit donc les coder comme des réglages modifiables, et le plan doit le dire ; sinon il faut attendre les réponses aux questions 1 à 7. | remarque | CLAUDE.md règle 10 |
| N9 | §4.4 exemple 3 | Le choix des fiches par §6.7 (`assis-debout-mains-cuisses`, etc.) est plausible, mais je ne l'ai pas recalculé sur toute la bibliothèque : T3 dépend de la bibliothèque, comme T4. | remarque | fiches (statut et schéma vérifiés) |

## 3. Verdict
**Validé sous réserve.**
- Le point bloquant n° 1 est résolu, et aucun nouveau point bloquant n'apparaît.
- Les n° 3 à 10 et 12 à 14 sont résolus ; les n° 2 et 11 le sont en partie.
- 5 points restent à corriger (N1 à N5) : ce sont des précisions de codabilité, toutes du côté de la prudence. Aucune dose dangereuse et aucune contre-indication oubliée.
- 4 remarques (N6 à N9).

Recontrôle court des points N1 à N5 après correction, avant le codage de F3.

## Recontrôle 2 (relecteur, 23/10/2026, commit d901d07)
Vérifications faites :
- diff complet de generateur-v1.md depuis 654446f ;
- relecture de D15 point 6 (DECISIONS-utilisateur.md) ;
- relecture du critère F3 (docs/phase-2-criteres.md, ligne 25, désormais aligné : « ou V-MSG-FREQ, pas de durée minimale ») ;
- confrontation avec G1-G8 de regles-securite-communes.md.

| n° | État | Commentaire |
|---|---|---|
| N1 | résolu | Dans §5.2 (ligne « Interdits ») et dans P-GROS : grossesse = `capped` sur tous les exercices, aucune hausse « ni à l'étalonnage ni ensuite », baisses permises. T43. |
| N2 | résolu | §6.3, §5.2, P-CAP et P-GROS disent la même chose. Sans historique : charge la plus légère et échelon le plus bas. Avec historique : variante et dernière charge sans douleur conservées, sans hausse. T44. |
| N3 | résolu | « Vide » se compte après les replis a à d du §7.1 et seulement si la cause est « santé », séance par séance. Le programme est refusé dès qu'une séance atteint 3 emplacements vides. T46. |
| N4 | résolu | La sous-clé « niveau de la personne » du §6.7 est désactivée sous plafond ; la fiche de `niveau_min` le plus bas est alors préférée. T45. |
| N5 | résolu | La ligne 1 de l'explication est calculée sur la semaine finale (m = 3, m = 2, m < 2 ; la ligne 2 jours avec un groupe < 2 fois est conservée). T47. |
| N6 | résolu | T1 admet l'exception « piliers seuls » (T3bis). |
| N7 | résolu | V-MSG-JOURS2 couvre aussi le cas « 3 jours ramenés à 2 ». Le message suit D15 point 6 : bouton « Modifier mes jours » et jour proposé calculé de façon déterministe. T41 étendu. |
| N8 | résolu | Toutes les valeurs NON SOURCÉ sont codées comme des réglages modifiables (fichier de configuration, référence V-… en commentaire), conformément à CLAUDE.md règle 10. Les questions 6 et 7 sont tranchées par l'utilisateur (D15). |
| N9 | résolu | Le calcul est couvert par T3c, indépendant de la bibliothèque ; T3 est marqué « dépend de la bibliothèque ». |

**Cohérence de « grossesse : jamais de hausse » avec G1-G8.** La règle est cohérente et plus prudente que les sources :
- G5 dit que l'app sert de **plafond, pas de prescription** (intensité modérée, 8-15 répétitions jusqu'à fatigue modérée, jamais d'effort maximal) : geler les hausses ne dépasse aucun repère HAS.
- G4 : les lignes Grossesse s'appliquent toujours.
- G7 : aucune fiche `saut`.
- G1, G2, G3, G6 : affichages et écrans fixes, non touchés.
- G8 : pas de plan alimentaire, hors de ce fichier.

Effet à connaître, sans danger : une personne enceinte reste à la charge la plus légère de son profil pendant toute la durée du réglage, puisque le gel ne se lève qu'en décochant. C'est une limite d'utilité, pas un risque. Le statut est bien noté (NON SOURCÉ, prudence, à relire par `kine`).

**Nouveaux points** : aucun bloquant, aucun à corriger.
- Une seule remarque : le gel des hausses en grossesse et ses effets (charge la plus légère pendant toute la grossesse) devraient être expliqués dans le texte affiché à la coche du réglage, à côté de G1. Cela relève de l'écran du réglage, pas du générateur.

### Verdict final : **validé**
- Les points n° 1 à 24 du contrôle et N1 à N9 du recontrôle sont résolus. Seule reste ouverte la demande à `dev` du n° 24 (`InjuryZone` + `cuisse`, `aine`), à faire avant F3.
- Les valeurs PROVISOIRE et NON SOURCÉ restent soumises à la règle 10 (réglages modifiables, choix par défaut 1 à 5 en attente de l'utilisateur).
- Le contenu de sécurité ajouté (P-GROS, gel en grossesse) reste à relire par `kine`, comme l'indique le fichier.
