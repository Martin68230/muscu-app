# Contrôle `relecteur` du lot 01 (vague 1), 21 fiches

Contrôle à neuf, le 22/10/2026. Je n'ai pas écrit ces fiches et je ne les corrige pas. Références : CLAUDE.md, knowledge/format-fiches.md, knowledge/regles-securite-communes.md. Le README du lot n'a servi que de contexte.

## Méthode et limites
- `npm run check:fiches` : 54 fiches, 0 erreur, 0 avertissement. La forme est donc conforme (cases, listes fermées, ids existants). Ce qui suit porte sur le fond.
- Sondage free-exercise-db (dist/exercises.json, lu en ligne le 22/10/2026) : les 9 identifiants cités existent, avec images 0 et 1 : Dead_Bug, Shoulder_Press_-_With_Bands, Band_Pull_Apart, Plank, Pallof_Press, Side_Bridge, Single-Arm_Push-Up, Single_Leg_Glute_Bridge, Handstand_Push-Ups.
  - Concordent avec la fiche : Dead_Bug (beginner, une jambe, bas du dos plaqué, 90 degrés), Shoulder_Press_-_With_Bands (beginner), Band_Pull_Apart (beginner), Plank (beginner, « un bras ou une jambe peut être levé »), Pallof_Press (beginner, **à la poulie**), Single-Arm_Push-Up (intermediate, pieds écartés, main libre dans le dos), Single_Leg_Glute_Bridge (beginner), Handstand_Push-Ups (Expert, dos au mur, « kick up »).
  - **Écart** : Side_Bridge a un champ « instructions » vide (voir planche-laterale-jambe-levee).
- Non vérifié : la page ACE « Bird dog » (lue par le rédacteur le 21/10, non rouverte), les images (non regardées), les notices de fabricants d'ancrage.
- J'ai comparé chaque fiche du lot à ses fiches voisines du pilote (cases par zone des remplaçants, progressions). Règle appliquée : un exercice plus dur ne doit pas être moins restreint par une zone que son prédécesseur plus facile.

## Synthèse
- OK : 12 (assis-debout-mains-cuisses, bird-dog-jambe-seule, dead-bug-jambes-seules, developpe-epaules-elastique, ecartement-elastique, marche-sac-a-dos, pont-fessier-une-jambe, porte-un-haltere-epaule, rowing-elastique, rowing-sac-a-dos, tirage-bras-tendus-elastique, tirage-vertical-elastique-haut), certaines avec des remarques.
- À corriger : 6 (bird-dog-pause, gainage-creux, pallof-elastique, planche-bras-jambe-leves, planche-laterale-jambe-levee, porte-serveur).
- Bloquants : 3 (developpe-epaules-sac-a-dos, pompe-equilibre-mur, pompe-un-bras).
- Rien n'est validé tant que ces 3 points bloquants restent ouverts. Aucune fiche ne peut passer à `controle_relecteur` puis `verifie` sans correction par son auteur et recontrôle.

## Remarques communes (aucune n'est bloquante)
- C1. Les 4 fiches à ancrage de porte (pallof-elastique, rowing-elastique, tirage-bras-tendus-elastique, tirage-vertical-elastique-haut) ont, dans « Sources », deux lignes pour la même affirmation « ancrage de porte selon la notice », l'une NON SOURCÉ et l'autre PROVISOIRE. La version la plus prudente (NON SOURCÉ) est sûre, mais les deux lignes se contredisent. Auteur : kine (garder une ligne, avec PROVISOIRE limité à la source Serious Steel, extraits de moteur de recherche).
- C2. Les fiches élastique en grossesse sont traitées différemment : `garder` avec une note « résistance légère » dans ecartement-elastique et tirage-bras-tendus-elastique, mais `adapter: charge:legere` dans rowing-elastique. La note dit « légère », la case ne le code pas. Auteur : kine.
- C3. Le lien source « HAS lombalgie » des fiches pointe vers la page de prise en charge alors que la preuve lue est la fiche mémo PDF (URL du fichier regles-securite-communes.md §5). Auteur : kine.

## Par fiche

### assis-debout-mains-cuisses : OK
- Ids, échelons, niveaux (débutant), progression (`squat-assis-debout` existe), photo « aucune photo » justifiée : OK. Grossesse `garder` identique à squat-assis-debout (G4) : OK.
- Remarque (kine) : Genou et Hanche n1 sont plus restrictifs (`appui:assise-rehaussee`) que la fiche plus dure squat-assis-debout (`garder`). Ce n'est pas dangereux, mais la régression est plus contrainte que l'exercice qu'elle prépare. Voir si c'est voulu.
- Remarque : C3.

### bird-dog-jambe-seule : OK
- Cohérent avec bird-dog du pilote (remplaçants dead-bug-jambes-seules, `plus-dur: bird-dog`). Consignes en français, 5 étapes, pas de photo.
- Source ACE : PROVISOIRE correct (page lue le 21/10) ; « un seul membre » : NON SOURCÉ honnête.
- Remarque (kine) : Dos n1 `amplitude:reduite`, n2 `amplitude:mi-course`. L'ordre de prudence entre `reduite` et `mi-course` n'est pas défini dans format-fiches.md §4.1, donc n2 peut sembler plus permissif que n1. Préciser dans le format ou utiliser `amplitude:reduite` aux deux niveaux. La même remarque vaut pour planche-laterale-jambe-levee si une valeur analogue y apparaît.

### bird-dog-pause : à corriger
1. **Note hanche-n2** (« bird dog sans pause, petite amplitude ») : la case est `adapter: variante:bird-dog`, qui n'applique pas « petite amplitude ». Deux modifications décrites, une seule codée (format-fiches §4.1 : choisir la plus importante, l'autre en note, sans la présenter comme appliquée). Correction : retirer « petite amplitude » de la note, ou créer une variante qui porte les deux. Auteur : kine.
2. **Note general** (« remplacée là où une case demande une variante ou un retrait ») : texte ambigu pour l'affichage. Le reformuler en une phrase claire. Auteur : kine (faible).
- Le reste est cohérent : niveau_min intermédiaire = échelon 1, plus-facile `bird-dog`, grossesse `retirer: remplacant:bird-dog` justifiée (pause = maintien).

### dead-bug-jambes-seules : OK
- Concorde avec Dead_Bug (jambe qui s'étend, bras fixes, bas du dos plaqué, 90 degrés). Photo : « à vérifier » avec raison, non affichée : OK. Le lien `plus-dur: dead-bug` existe. Grossesse retirée (sur le dos, G4), remplaçant bird-dog-jambe-seule : OK.
- Remarque (kine) : Cou n1 `garder`, alors que le dead-bug du pilote (plus dur) est à `adapter: appui:coussin` dès n1. Aligner.

### developpe-epaules-elastique : OK
- Concorde avec Shoulder_Press_-_With_Bands. Photo « à vérifier » avec raison. Épaule n2 retiré (poussée au-dessus de la tête) : cohérent avec developpe-epaules-halteres. Grossesse : variante assise, cohérent avec G4. Avertissements de rupture d'élastique présents.
- Remarque (kine) : la variante « élastique passé sous l'assise » n'a aucune consigne de contrôle propre (tenue de l'élastique sous la chaise). Ajouter une phrase dans « Objets du quotidien ».

### developpe-epaules-sac-a-dos : BLOQUANT
1. **R9 non appliquée** : charge poussée au-dessus de la tête et du visage, tenue par les bretelles ou la poignée (prise instable). regles-securite-communes.md R9 demande de ne jamais lâcher une charge au-dessus de soi, et porte-serveur l'applique. Ici rien dans « Points d'attention », « Signes qui doivent faire arrêter » ni « Objets du quotidien » sur la conduite à tenir si le sac glisse ou penche (le texte dit seulement « repose-le »). Correction attendue : consigne explicite (sac léger au départ, que faire si le sac glisse, ne jamais le lâcher au-dessus de la tête, espace dégagé et plafond), avec le statut NON SOURCÉ de R9 assumé dans « Sources ». Auteur : kine.
2. **Niveau débutant** pour une charge improvisée au-dessus de la tête, sans « léger » en consigne de départ (seulement Dos n1, `charge:legere`). Correction : « sac léger, poids connu » dès la consigne 1, et décision `coach`/utilisateur sur le niveau (question 3 du README). Auteur : coach.
3. **Grossesse** : `adapter: charge:legere`, avec une seule variante debout. G4 prévoit le développé épaules assis (dossier droit) et déconseille la station debout immobile prolongée. Correction : retirer avec remplaçant `developpe-epaules-elastique-assis`, ou ajouter une variante assise. Auteur : kine.
- Le reste est correct : pas de photo (justifié), sources NON SOURCÉ honnêtes, ids existants, `plus-dur: developpe-epaules-halteres`.

### ecartement-elastique : OK
- Concorde avec Band_Pull_Apart. `couverture: substitut` est cohérent avec la mention affichée dans « Points d'attention ». Photo « à vérifier » avec raison.
- Remarques (coach / kine) : (a) `plus-dur: rowing-elastique-assis` est un autre schéma, pas une progression d'intensité évidente ; (b) « Serre le haut du dos une seconde » donne une durée alors que la fiche dit n'avoir aucune durée sourcée (retirer « une seconde ») ; (c) « Ne lâche jamais une poignée » alors qu'il n'y a pas de poignée (adapter) ; (d) C2.

### gainage-creux : à corriger
1. **Mouvement entièrement NON SOURCÉ** (ligne « Existence du mouvement » : brouillon M1390 seulement, licence image à contrôler). La fiche est honnête sur ce point, mais la question 5 du README (garder ou attendre une source) est sans réponse. Elle ne peut pas aller au statut `verifie` sans cette décision de l'utilisateur ou une source. Correction : soit une source lue, soit décision écrite de l'utilisateur ; sinon la laisser hors générateur. Auteur : coach (source) ; décision : utilisateur.
2. **Consigne et échelon 2** : la consigne 3 ne mentionne pas « bras tendus derrière la tête » (échelon 2 du tableau) ; l'épaule n1/n2 renvoie à la variante genoux pliés, ce qui suppose cette position des bras. Ajouter la position des bras dans les consignes. Auteur : coach.
3. Niveau « intermédiaire » de l'échelon 2 (jambes tendues, bras derrière la tête) : jugement de coach NON SOURCÉ, à confirmer. Auteur : coach.
- Le reste est cohérent : grossesse retirée avec remplaçant bird-dog, cases cou/hanche/épaule/dos prudentes.

### marche-sac-a-dos : OK
- Pas de mention fausse ; sources NON SOURCÉ honnêtes ; interdiction d'escalier et de sol glissant ; sangles de poitrine et de ceinture ; grossesse sans sac contre le ventre (G4). Niveau débutant acceptable (poids connu, pas de distance donnée).

### pallof-elastique : à corriger
1. **Contradiction entre cases** : Dos n2 = `adapter: variante:pallof-elastique-genoux`, mais Genou n1 et n2 = `adapter: variante:pallof-elastique-debout`. Une personne avec dos n2 et genou n1 reçoit deux variantes opposées ; la règle « la plus prudente » ne tranche pas entre deux `adapter` différents. Correction : décider une règle (par exemple `retirer` pour l'une des deux combinaisons, ou une variante qui satisfait les deux). Auteur : kine.
2. **Note epaule-n1** (« sans augmenter la résistance ») : c'est la règle R2 du niveau 2, pas du niveau 1. La case n1 est `adapter: amplitude:reduite`. Corriger la note. Auteur : kine.
3. Source : Pallof_Press est « à la poulie » (cable), l'adaptation à l'élastique ancré est un choix de coach. La fiche le dit déjà ; le statut PROVISOIRE ne couvre que la forme du mouvement, pas la version élastique : l'écrire explicitement. Auteur : coach.
- Remarque : C1. Photo « aucune photo » justifiée (poulie).

### planche-bras-jambe-leves : à corriger
1. **Moins restrictif que la fiche plus facile planche (pilote)** : Coude n1 = `garder` et n2 = `adapter: appui:coussin`, alors que planche donne `adapter: appui:serviette` (n1) et `adapter: variante:planche-genoux` (n2). Un exercice plus dur ne doit pas être moins limité. Correction : Coude n1 `adapter: appui:coussin`, n2 `adapter: variante:planche-genoux` ou `retirer: remplacant:planche-genoux`. Auteur : kine.
2. **Cou** : planche a une ligne Cou (n2 `variante:planche-genoux`) ; cette fiche n'en a pas. Ajouter la zone. Auteur : kine.
3. **Photo** : `Plank/1.jpg` : « non (montre la planche simple... contredit la consigne) ». Le README dit qu'aucune image n'a été regardée ; la raison décrit pourtant le contenu. Ne pas affirmer le contenu d'une image non vue : écrire « à vérifier » ou noter que l'image a été regardée (par qui, quand). Sécurité : sans effet, l'image n'est pas affichée. Auteur : coach.
- Cohérent : source Plank (« un bras ou une jambe peut être levé ») vérifiée ; niveaux 1 intermédiaire, 2 intermédiaire, 3 avancé sans baisse ; `plus-facile: planche`.

### planche-laterale-jambe-levee : à corriger
1. **Source Side_Bridge non vérifiable** : la ligne « Planche latérale : appui sur le côté, corps aligné, hanches hautes » est attribuée à Side_Bridge en PROVISOIRE ; or l'entrée n'a **aucune instruction** (champ vide). Correction : NON SOURCÉ, ou renvoyer à la fiche du pilote planche-laterale en précisant sa propre source. Auteur : coach.
2. **Plus dur mais moins restrictif que planche-laterale (pilote)** : Coude n2 `adapter: appui:coussin` (pilote : `variante:planche-laterale-genoux`) ; Hanche n2 `amplitude:reduite` (pilote : `variante:planche-laterale-genoux`) ; Épaule n1 `variante:...-avant-bras` (pilote : genoux). Correction : aligner au moins sur la fiche plus facile. Auteur : kine.
3. **Remplaçants retirés** : Épaule n2 `retirer: remplacant:planche-laterale`, mais planche-laterale est elle-même `retirer: remplacant:dead-bug` à l'épaule n2. Le remplaçant ne sera donc jamais proposé (règle §0 : jamais un remplaçant retiré par le profil). La note affichée « remplacé par planche-laterale » est fausse dans ce cas. Remplacer par `dead-bug` ou corriger la note. Auteur : kine.
4. **Note hanche-n2** : « jambe levée peu, ou pas du tout » dépasse la case (`amplitude:reduite`). Corriger la note ou la case. Auteur : kine.
5. Photo : même remarque que ci-dessus sur le contenu de `Side_Bridge/0.jpg` affirmé sans l'avoir regardée. Auteur : coach.

### pompe-equilibre-mur : BLOQUANT
1. **Décision de l'utilisateur en attente** (question 1 du README : garder ou retirer cette fiche). Mouvement avancé, tête sous le niveau du cœur, avec sources en grande partie NON SOURCÉ (la seule fiche libre est dos au mur, niveau Expert, avec « kick up »). Rien de cet exercice ne peut être codé tant que l'utilisateur n'a pas tranché. Auteur : utilisateur, puis kine.
2. **Moins restrictif que la fiche plus facile pompe-piquee-pieds-sureleves (pilote)** : Épaule n1 = `adapter: variante:pompe-equilibre-mur-pieds` (pilote : retour à `pompe-piquee`) ; Poignet n1 = `appui:poings-fermes` (pilote : `variante:pompe-piquee`). L'équilibre mur est plus dur mais moins limité à ces deux zones. Correction : Épaule n1 et Poignet n1 vers `retirer: remplacant:pompe-piquee-pieds-sureleves`, ou plus prudent encore. Auteur : kine.
3. **Échelon 2 (ventre au mur, presque vertical)** : aucune consigne pour un bras qui flanche ou une chute (fléchir, redescendre les pieds, jamais tomber sur la tête). Ajouter une procédure de sortie et rester prudent sur les signes d'arrêt. Auteur : kine.
4. **Note epaule-n1** (« descente moins profonde ») : la case ne code que la variante. Corriger la note. Auteur : kine.
- Correct : Cou `retirer` aux 3 niveaux, grossesse retirée (remplaçant pompe-chaise), photo « aucune photo » justifiée (Handstand_Push-Ups = autre mouvement, Expert, dos au mur), sources NON SOURCÉ honnêtes.

### pompe-un-bras : BLOQUANT
1. **Contradiction avec pompe-archer (pilote)**, qui est le plus facile de la chaîne : pompe-archer est `retirer: remplacant:pompe-ecartee` dès n1 pour Épaule, Coude et Poignet. Ici, au niveau 1 : Épaule, Coude = `adapter: variante:pompe-un-bras-chaise` et Poignet = `appui:poings-fermes`. Un exercice sur un seul bras, plus dur, resterait donc proposé à une personne dont l'archer est retiré (contre-indication oubliée). Correction : Épaule/Coude/Poignet n1 en `retirer: remplacant:pompe-ecartee` (l'archer étant lui-même retiré dans ces cas, il ne peut pas servir de remplaçant). Auteur : kine.
2. **Remplaçant retiré** : Épaule n2 `retirer: remplacant:pompe-archer` ; or pompe-archer est retiré à l'épaule n2. Le remplaçant ne sera jamais proposé ; la note « remplaçant : pompe archer » est fausse. Même remarque pour Dos n2 (pompe-chaise : à vérifier avec la fiche pilote pompe). Auteur : kine.
3. **Note epaule-n1, coude-n1, dos-n1** : « descente moins profonde » n'est pas codée (la case est `variante`). Corriger les notes. Auteur : kine.
4. Chaise : une charge latérale sur une seule main d'appui sur l'assise ; la fiche demande une chaise calée contre un mur. Ajouter que le dossier doit être contre le mur côté opposé au déplacement et tester l'appui avec une main. Auteur : kine (remarque).
- Correct : source Single-Arm_Push-Up vérifiée (intermediate dans la source, avancé ici, écart tracé NON SOURCÉ) ; photo « à vérifier » avec raison ; `plus-facile: pompe-archer, pompe-sol` existent ; grossesse retirée.

### pont-fessier-une-jambe : OK
- Concorde avec Single_Leg_Glute_Bridge (beginner, intermédiaire ici : écart tracé). Plus restrictif que pont-fessier (Dos n2 `retirer` contre `sans-charge`). Grossesse retirée (sur le dos). Photo « à vérifier » avec raison, échelon au sol seulement : OK.

### porte-serveur : à corriger
1. **Contradiction de consigne en cas d'incident** : « Bras qui plie ou charge qui glisse : poser la charge tout de suite, devant soi » alors que R9 interdit de lâcher la charge au-dessus de soi. Préciser : ramener la charge à l'épaule puis la poser, sans la lâcher au-dessus de la tête. Auteur : kine.
2. **Note dos-n2** (« remplaçant : porté sur l'épaule, charge légère ») : porte-un-haltere-epaule est lui-même `retirer: remplacant:porte-valise` au dos n2. Le remplaçant réel est donc porte-valise. Corriger la case (`remplacant:porte-valise`) et la note. Auteur : kine.
3. **R9 et statut** : R9 est NON SOURCÉ ; la fiche le dit. Garder cette mention. Pas de nouvelle source nécessaire, mais le niveau « intermédiaire » reste un choix de coach. Rien d'autre.
- Correct : Épaule `retirer` dès n1 (charge au-dessus de la tête), grossesse retirée (remplaçant porte-valise existant), mise en garde plafond/luminaire, haltères réglables : disques serrés.

### porte-un-haltere-epaule : OK
- Cohérent : plus-dur porte-serveur (niveau intermédiaire aussi), Dos n2 remplaçant porte-valise (adapté dans cette fiche pour Dos n2 : `variante:marche-du-fermier`, donc l'ordre est acceptable), grossesse `adapter: charge:legere`, charge jamais contre le ventre.
- Remarque : « Objets du quotidien » cite R9, qui concerne la charge au-dessus du visage ; ici le porté est sur l'épaule : citer R8 seulement ou préciser. Auteur : kine.

### rowing-elastique : OK
- Pas de photo (Inverted_Row = autre mouvement) : correct. Sources NON SOURCÉ honnêtes (brouillons existants seulement). Trois variantes sans ancrage ou avec ancrage de porte correctement taguées. Grossesse `adapter: charge:legere`.
- Remarques : C1, C2. Dos n1 `garder` pour la variante buste penché, alors que le rowing-buste-penche-halteres du pilote adapte déjà au dos n1 : à aligner (kine).

### rowing-sac-a-dos : OK
- Dos n2 `retirer` (plus restrictif que le rowing aux haltères du pilote), grossesse avec appui d'une main sur une chaise stable. `plus-dur: rowing-buste-penche-halteres` existe.
- Remarque (coach) : le texte « consulte la fiche rowing-buste-penche-halteres » renvoie à une fiche que l'utilisateur ne voit pas : recopier la précaution (dos plat, charge qui n'oblige pas à arrondir). Hanche et cou non traités : acceptable pour un porté penché à charge légère.

### tirage-bras-tendus-elastique : OK
- `couverture: substitut` cohérent. Les consignes (remonter à hauteur d'épaules) sont compatibles avec la note « bras jamais au-dessus de la tête ». Ancrage de porte bien décrit. Pas de photo : OK.
- Remarques : C1, C2. Le tag `porte` impose un vrai ancrage (cf. materiel-tags.json).

### tirage-vertical-elastique-haut : OK
- Variantes à ancrage haut, genoux/assis ; Genou n1/n2 vers la variante assise ; Épaule n2 `retirer: remplacant:rowing-elastique-assis` (adapté à l'épaule n2 dans rowing-elastique : proposé avec amplitude réduite, cohérent). « Jamais derrière la nuque » : bon. Chaise : consignes de test présentes.
- Remarque : C1.

## Les 5 points principaux
1. developpe-epaules-sac-a-dos : charge au-dessus de la tête sans conduite en cas de glissement (R9 non appliquée), débutant, grossesse debout contraire à G4. BLOQUANT.
2. pompe-un-bras : moins restreint que pompe-archer (pilote) à l'épaule, au coude et au poignet dès n1 ; remplaçant pompe-archer lui-même retiré. BLOQUANT.
3. pompe-equilibre-mur : décision utilisateur en attente (question 1), moins restreint que pompe-piquee-pieds-sureleves, pas de procédure de sortie. BLOQUANT.
4. Alignement avec les fiches plus faciles du pilote : coude n1/n2 de planche-bras-jambe-leves, hanche/coude/épaule de planche-laterale-jambe-levee ; remplaçants retirés par le profil (planche-laterale, pompe-archer, porte-un-haltere-epaule) avec des notes fausses.
5. Contradictions de cases ou de notes : pallof-elastique (dos n2 contre genou n1), notes qui décrivent des modifications non codées (bird-dog-pause, pompe-un-bras, pompe-equilibre-mur, planche-laterale-jambe-levee), source Side_Bridge sans instructions, photos « non » justifiées par un contenu d'image non regardé.
