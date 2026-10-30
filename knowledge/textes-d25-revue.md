# Relecture des textes de D25 écrits par `dev` (31/10/2026, `coach`)

Textes lus en lecture seule dans `src/generator/messages.ts`, `src/generator/index.ts` (fonction `explain`) et `src/session/messages.ts`. Règle de rédaction : français simple, tutoiement, une idée par phrase, aucune promesse médicale ni de résultat. Statut de tous les textes corrigés : **PROPOSITION de `coach`, à relire par `kine` (celui qui porte sur une gêne ou un malaise), puis contrôle `relecteur`, puis reprise par `dev`**. Aucun fichier de `src/` n'a été modifié.

## 1. V-MSG-UN-JOUR-DUREE (`messages.ts`, `unJourDuree`)
- Texte actuel : « Avec une seule séance par semaine, elle dure {min} min au plus pour l'instant. »
- Verdict : **à corriger**. « pour l'instant » ne dit pas ce qui change ; le lecteur ne sait pas pourquoi la séance est plafonnée.
- Texte corrigé : « Avec un seul jour par semaine, ta séance dure {min} min au plus. Si tu ajoutes un deuxième jour, tu pourras avoir deux séances plus courtes. »
- Remarque : le plafond de 45 min vient d'une règle de `kine` (STR-REP-1) ; la phrase ne promet rien sur le résultat.

## 2. V-MSG-LEGERS, cas « zone » (`messages.ts`, `legers('zone')`)
- Texte actuel : « Avec la gêne déclarée, 4 séances de force suffisent ; les autres jours sont légers. » (même verdict que le cas « débutant » : voir ci-dessous)
- Verdict : **à corriger**. « la gêne déclarée » sonne administratif ; « suffisent » est une affirmation que l'app ne peut pas prouver ; « jours légers » n'est pas expliqué.
- Texte corrigé : « À cause de la gêne que tu as indiquée, l'app limite à 4 séances de force par semaine. Les autres jours sont légers : mobilité douce, rien de lourd. »
- Cas « débutant » (« Pour débuter, 4 séances de force suffisent ; les autres jours sont légers. ») : **à corriger aussi** (décision du chef de projet, 31/10/2026 : même verdict que le cas « zone »). « suffisent » promet quelque chose que l'app ne peut pas prouver, même si la phrase vient du fichier de règles. Texte corrigé, qui ne promet rien : « Pour débuter, l'app limite à 4 séances de force par semaine. Les autres jours sont légers : mobilité douce, rien de lourd. » Pour le cas « zone », la version ci-dessus est déjà sans promesse. `dev` applique le même principe à toute phrase du type « X suffit ».

## 3. Phrases « grisé » de l'option « Gagner du temps » (`session/messages.ts`, `GAIN_TEXT`)
- `offBeginner` : « Pas pour débuter : les exercices se font un par un. » Verdict : **à corriger** (ton sec, laisse croire à un jugement). Texte corrigé : « Cette option n'est pas proposée au début : tu fais les exercices un par un. »
- `offPregnancy` : « Pendant la grossesse ou après un accouchement, les exercices se font un par un. » Verdict : **OK**.
- Aucun commentaire sur `explain` et `honest` (texte du fichier de règles, repris mot pour mot).

## 4. Phrase « aucun exercice enchaîné » (`GAIN_TEXT.noPairToday`)
- Texte actuel : « Aucun exercice n'est enchaîné dans cette séance. »
- Verdict : **à corriger** : « enchaîné » est ambigu (enchaîné avec quoi ?), et rien n'indique ce que la personne doit faire.
- Texte corrigé : « Dans cette séance, aucun exercice n'est fait par deux : tu les fais un par un. »

## 5. Textes du cardio (`session/messages.ts`, `CARDIO_PLAY_TEXT`)
- `easy` : « Effort facile : tu parles en phrases entières. » Verdict : **OK**.
- `moderate` : « Effort modéré (5-6 sur 10). » Verdict : **OK** (l'écran ajoute déjà la phrase T7 « tu peux parler, mais pas chanter »).
- `slowEnd(min)` : « Les {min} dernières minutes : ralentis (marche lente ou pédalage très doux). Ensuite, ne t'assieds pas et ne t'allonge pas d'un coup ; si la tête tourne, arrête la séance. » Verdict : **à corriger**. « ne t'assieds pas et ne t'allonge pas d'un coup » peut se lire « ne t'assieds pas du tout » ; « arrête la séance » ne dit pas quoi faire de la tête qui tourne. Texte corrigé : « Pendant les {min} dernières minutes, ralentis : marche lente ou pédalage très doux. Ensuite, ne t'assieds pas et ne t'allonge pas brusquement : marche encore un peu. Si la tête tourne, arrête, assieds-toi doucement et bois de l'eau. Si ça ne passe pas, demande l'avis d'un médecin. » **À valider par `kine`** (conduite à tenir en cas de malaise).
  - **Avis du kiné (31/10/2026) : à corriger encore, plus prudent.** Un vertige ou un malaise à l'effort est un signe d'arrêt immédiat (R5 de regles-securite-communes.md : pas de reprise avant un avis médical) ; « si ça ne passe pas » laisse croire qu'on peut reprendre quand ça passe. Texte retenu : « Pendant les {min} dernières minutes, ralentis : marche lente ou pédalage très doux. Ne t'arrête pas net : marche encore un peu avant de t'asseoir. Si la tête tourne, si tu as une douleur dans la poitrine ou si tu es essoufflé de façon anormale (le souffle ne revient pas, tu ne peux plus dire une phrase), arrête, assieds-toi doucement et bois de l'eau. Ne refais pas de séance avant d'avoir l'avis d'un médecin. » **[Précision du chef de projet, 31/10/2026 : douleur de poitrine et essoufflement anormal ajoutés ; renvoi explicite à R5 (signes d'arrêt) et à U1 (urgence : si la douleur de poitrine ne passe pas au repos, si le souffle manque au repos ou en cas de perte de connaissance, « Urgence : appelle le 15 (SAMU) ou le 112. »).]** Le texte U1 (« Urgence : appelle le 15 (SAMU) ou le 112. », avec bouton d'appel) s'affiche à part, sans attendre, si la personne perd connaissance, a une douleur de poitrine qui ne passe pas au repos ou du mal à respirer au repos (U1, U2). Statut : conduite de bon sens, **NON SOURCÉ** pour « marche encore un peu » ; R5 PROVISOIRE.
  - Avis du kiné sur les autres textes : les corrections de `coach` (sections 1 à 4, 6, 7) sont **validées sans changement** (aucune promesse médicale) ; `offBeginner` : « Cette option n'est pas proposée au début » est bien plus neutre que l'original ; pour V-MSG-LEGERS, « mobilité douce, rien de lourd » est confirmé (aucun jour léger n'implique de saut ni de course).
- `pregnancy` : « Après le cardio, ne reste pas debout immobile longtemps. » Verdict : **OK** (G4).

## 6. Explication de 1 jour (`index.ts`, `explain`, cas `nDays === 1`)
- Texte actuel (exemple) : « 1 séance de force par semaine en corps entier : chaque grand muscle travaille 1 fois. »
- Verdict : **à corriger** : juste mais froid, et il ne dit pas que les repères demandent plus (le message V-MSG-UN-JOUR le dit déjà plus bas).
- Texte corrigé : « 1 séance de force par semaine, en corps entier : chaque grand muscle est travaillé une fois. »
- Variante « ne tient pas » : « {low} ne tient pas dans {dMin} min » (accord à vérifier selon `GG_LABEL`, par exemple « les jambes ne tiennent pas » et « le dos ne tient pas ») : verdict **à corriger** si l'étiquette est au pluriel. Texte corrigé : « …, mais il n'y a pas assez de place pour {muscle} en {dMin} min. »

## 7. Explications de 4 à 6 jours (`index.ts`, `explain`, cas `split !== 'corps_entier'`)
- Texte actuel (exemples) : « 4 séances de force par semaine en haut / bas : chaque grand muscle travaille au moins 2 fois. » ; « 5 séances de force par semaine en haut / bas puis poussée, tirage, jambes : … » ; « 6 séances de force par semaine en poussée, tirage, jambes : … » ; avec les jours légers : « …, plus 2 jours légers ».
- Verdict : **à corriger** en deux points. (1) « en haut / bas puis poussée, tirage, jambes » décrit mal 5 jours (2 séances haut / bas, puis 3 séances poussée, tirage, jambes). (2) « poussée, tirage » et « jours légers » ne sont pas expliqués à un débutant.
- Textes corrigés :
  - 4 jours : « 4 séances de force par semaine : 2 pour le haut du corps, 2 pour le bas. Chaque grand muscle est travaillé au moins 2 fois. »
  - 5 jours : « 5 séances de force par semaine : haut du corps, bas du corps, puis poussée (pectoraux, épaules, triceps), tirage (dos, biceps) et jambes. Chaque grand muscle est travaillé au moins 2 fois. »
  - 6 jours : « 6 séances de force par semaine : poussée (pectoraux, épaules, triceps), tirage (dos, biceps) et jambes, deux fois chacune. »
  - Jours légers (ajouter à la fin si besoin) : « Les {n} autres jours sont légers : mobilité douce, rien de lourd. »
- Remarque : « chaque grand muscle travaille au moins 2 fois » reste vrai quand `m >= 2` ; sinon garder la phrase « {muscle} ne tient pas dans {dMin} min » corrigée en 6.

## Résumé
| Texte | Verdict |
|---|---|
| V-MSG-UN-JOUR-DUREE | à corriger |
| V-MSG-LEGERS (zone) | à corriger |
| V-MSG-LEGERS (débutant) | à corriger (même verdict que « zone ») |
| GAIN offBeginner | à corriger |
| GAIN offPregnancy | OK |
| noPairToday | à corriger |
| CARDIO easy, moderate, pregnancy | OK |
| CARDIO slowEnd | à corriger, texte du kiné du 31/10/2026 (ci-dessus) |
| Explication 1 jour | à corriger |
| Explications 4 à 6 jours | à corriger |
