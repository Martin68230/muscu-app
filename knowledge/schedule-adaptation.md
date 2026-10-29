# Séance manquée : décaler, compenser ou laisser tomber (moteur de replanification)
> **REMPLACÉ le 29/10/2026 par knowledge/seance-manquee-v1.md** (règles codables, cas d'essai, données à stocker, corrections `kine`). Les sources ci-dessous restent valables ; les règles de conception 2b, 5, 6, 8 et 10 sont réécrites pour ne plus contredire ce fichier. En cas de désaccord, seance-manquee-v1.md fait foi. Ne rien coder d'après ce fichier.

Vérifié le 21/10/2026, aligné le 29/10/2026. Statut global : PROVISOIRE (valeurs à valider par `coach`).

## Ce que disent les sources
- Arrêt court : Bosquet et al. 2013, méta-analyse de 103 études : la force maximale est restée à peu près inchangée jusqu'à environ 28 jours d'arrêt ; la perte s'accélère ensuite. La taille du muscle baisse peu en moins de 20 jours (Psilander 2019, Bjørnsen 2018, Seaborne 2018). L'endurance de force baisse plus tôt. Source lue : https://www.strongerbyscience.com/detraining/ (synthèse de blog qui cite ces études, PROVISOIRE ; études non lues).
- Retour après une pause de moins d'un mois : traiter comme une semaine de décharge, charges environ 20 % plus basses la première semaine (même source, avis de l'auteur, NON recoupé).
- Maintien : un volume très réduit suffit à conserver force et muscle (Bickel 2011 : 1/9 du volume sur 8 mois ; Antunes 2022 : 1 série par exercice chez des femmes âgées). Même source.
- Conséquence : manquer UNE séance n'est pas grave. Le risque vient plutôt de la compensation brutale.
- Non trouvé / non vérifié : aucune étude lue sur "rattraper" une séance en doublant la suivante. La recherche sur les pics de charge (ratio aigu/chronique) est contestée ; le texte n'a pas pu être ouvert. Ne pas présenter de seuil précis comme prouvé.

## Règles de conception proposées (à valider par `coach`)
Entrées : séances prévues, séances faites, jours restants, jours bloqués, récupération par muscle (>= ~48 h avant de retravailler fortement le même groupe), volume hebdomadaire cible par muscle, limite de séries par séance et par muscle.
1. **Manquée 1 séance, il reste des jours libres dans la semaine** : DÉCALER la séance au prochain jour libre, en respectant 48 h par groupe musculaire et sans enchaîner deux séances lourdes. L'ordre des séances est conservé.
2. **Plus de jour libre** : ne pas empiler. (a) Laisser la séance (« La faire quand je peux » ou « Sauter », seance-manquee-v1.md SM-4). (b) ~~Répartir les séries manquantes sur les séances restantes~~ **supprimé en v1 : compensation de volume = +0 série** (SM-9) ; la seule option de rattrapage possible plus tard (+1 série sur 2 accessoires) est désactivée et exigerait une nouvelle validation.
3. **Jamais de "séance double" de rattrapage** le même jour, ni deux jours consécutifs sur les mêmes muscles.
4. **Priorité à conserver** : exercices piliers du programme > accessoires > fonctionnel/cardio optionnel. On coupe dans cet ordre inverse.
5. **Absence** : reprendre là où on s'est arrêté (ne pas "rattraper" la semaine). Les paliers de reprise (jours d'absence 0-9 / 10-14 / 15-27 / 28-89 / 90 et plus), les pourcentages et le nombre de séances valables avant montée sont dans **seance-manquee-v1.md SM-12 et K2** (valeurs NON SOURCÉES ; les anciennes valeurs de cette règle, "-10 % à -20 %", "au-delà de 2 semaines", "au-delà de 4 semaines", sont abandonnées).
6. **"Durcir" les séances suivantes** : **jamais** (ni volume, ni intensité, ni échec) : seance-manquee-v1.md SM-8 et SM-9.
7. **Maladie, douleur, fatigue forte** : ne pas compenser du tout ; renvoyer vers un professionnel si la douleur persiste (seance-manquee-v1.md SM-15, K1, K7). La séance courte de maintien (1 série par exercice pilier) **n'est pas codée en v1**.
8. **Blocage de jours dans le profil ou imprévu** : la personne choisit entre "décaler" (proposé en premier, jamais appliqué sans son geste), "la faire quand je peux" et "sauter" ; "répartir" n'existe plus (SM-4, SM-9).
9. **Programmes de perte de poids / cardio** : les minutes hebdomadaires visées (OMS : 150-300 min modérées) peuvent se répartir sur les jours restants ; pas de séance cardio très longue de rattrapage.
10. **Calendrier** : les séances décalées sont marquées "reportée" (`reportee`) ; une séance à laquelle la personne renonce est "sautée" (`sautee` avec `endReason = renonce` ou `pas_bien`) ; une séance **abandonnée** en cours ou arrêtée sur un symptôme reste "arrêtée" (`abandon`, `symptome`), distincte de "sautée" (SM-1) ; l'historique reste honnête (pas de séance cochée à tort).
Tests obligatoires (détaillés dans seance-manquee-v1.md §8) : jamais deux séances de musculation à moins de 2 jours civils (plus strict que 48 h par muscle) ; volume hebdomadaire jamais supérieur à la cible + marge définie ; aucune séance ajoutée un jour bloqué.
