# Passation du chef de projet (25/11/2026) : LIRE AVANT TOUTE ACTION

Ce fichier remplace, pour la période du 13 au 25/11/2026, la dernière section de `docs/reprendre-ici.md` (devenue ancienne). Lire aussi `CLAUDE.md`, `docs/plan-fichiers.md`, `docs/decisions-prises.md` (fin du fichier), `docs/couverture-fiches.md`, `docs/nutrition-reprise.md`.

## 1. État en ligne (main = 79e6eb3, déploiement vert au 25/11/2026)
- 515 fiches (+ 540 contrôlées par `check:fiches` avec variantes), GIF branchés par identifiant pour les fiches du jeu hasaneyldrm (table texte `knowledge/exercices/CORRESPONDANCE-FICHES-HASAN.json` puis `node tools/gen-gv-table.mjs` -> `src/images/gv-table.ts`). Aucune image dans le dépôt : l'utilisateur importe SA copie du ZIP (Profil > Images de mes exercices ; miniatures, « Mes images », bouton de test).
- Générateur : plafonds relevés (24 par muscle principal ; 20 pour épaules / trapèzes / triceps / biceps / avant-bras / lombaires), cou réservé en séance de jambes (CAL-12 strict ; paliers P1 à P4 validés par le kiné), rattrapage par cycle, règles sport A1 / A2, mollets garantis en jambes, choix salle / maison / dehors / repos PAR JOUR avec priorité aux exercices de salle (option A : poussée horizontale quand pectoraux < 9), rotation par bloc de 4 semaines des exercices principaux.
- Nutrition (phase 7) en ligne : « Mes besoins », « Semaine » (plan 7 jours mémorisé, validation vers le calendrier, historique, courses mémorisées, changement de repas / aliment, repas hors plan : resto / sauté), goûter auto sous la cible, 54+ recettes (produits achetés, jamais fabriqués), export 2 personnes / IA, aliments exclus, rappel de pesée.
- Design : accueil, « Ma progression » (graphiques, records), lecteur avec avancement, bibliothèque avec filtres, calendrier (états en couleur + forme + texte, point repas réduit), vocabulaire simple (« garde N en réserve »).
- Fiches par matériel (au 25/11) : kettlebell 19, barre_ez 12, rack 15, medecine_ball 11, marche_escalier 10, mini_bande 6, box_ou_step 6, sac_a_dos 5, bosu 4, sangles_suspension 4, sac_de_sable 4, bidons_ou_sacs 4, lest 7 (lest = gilet). Objectif de l'utilisateur : au moins 15 fiches par matériel (seule voie pour les matériels absents du jeu : variantes sur fiches existantes).

## 2. Travail NON fusionné (à reprendre en premier)
- Branche `fiches-lot10` (af3322a) : 55 variantes de matériel sur fiches existantes (sac à dos, mini-bande, box / step, rack, bidons, sac de sable…) ; kiné passé, relecteur en cours à l'arrêt ; à rebaser sur origin/main, régénérer la baseline, lancer les tests de données, puis pousser. Session : « Fiches kettlebell » (`fiches-kettlebell`).
- Branche `claude/spec-nutrition-eb35f9` (115970d) : 6 sauces du commerce (barbecue, carbonara, moutarde, aigre-douce, tomate-champignons, tomate-fromage) NON validées par la nutritionniste, absentes de main : à valider (relecteur allergènes) ou abandonner.
- Fiches B (tirage) : lots 21 et suivants possibles (tranche 20 à 29). Fiches A / C / D : zones épuisées dans le jeu, sessions à supprimer.
- Poussée horizontale du jeu NON activée dans le générateur (`HASAN_UPPER_ACTIVE` dans `src/generator/config.ts`) : trapèzes / dos large faisaient dépasser les plafonds protégés ; à activer par famille avec balayage de profils.

## 3. Procédure qui a marché (à garder)
1. Une session fille par chantier (`start_session`, worktree, brief complet), commits fréquents, JAMAIS de push par les sessions : seul le chef fusionne et pousse.
2. Fusion : branche depuis origin/main, `git merge --no-ff`, conflits habituels résolus ainsi : `docs/*`, `*.css`, `*.tsv` = garder les deux côtés ; `CORRESPONDANCE-FICHES-HASAN.json` = union par clé `hasan_id|fiche|variante` puis `node tools/hasan-vers-fiches.mjs nettoyer` puis `node tools/gen-gv-table.mjs` ; `knowledge/exercices/hasan/lots.json` = union des clés ; `tests/fixtures/generator-baseline.json` = régénérer (`WRITE_BASELINE=1 TZ=UTC npx vitest run tests/unit/generator-nonregression.test.ts`).
3. Avant de pousser : `tsc`, `check:fiches`, `check:securite`, build, + les tests ciblés (tous `tests/unit/*.test.tsx`, tests de données de fiches : `ls tests/unit | grep -iE "fiche|name|lest|ancrage|per-side|dose|repet|core|muscle|build|kettlebell|images"`, plafonds-releves, d25 / d26 / d33, cal11-cal12, mollets-jambes, sport-*). La suite complète locale dépasse 15 minutes (jusqu'à 25 sur cette machine quand elle est chargée) : c'est GitHub qui la fait ; ne jamais lancer deux suites complètes en parallèle sur la machine.
4. Après le push : attendre le déploiement VERT (API publique `api.github.com/repos/Martin68230/muscu-app/actions/runs`) avant de dire « en ligne » ; si rouge, lire les annotations du job, corriger en priorité (le site reste sur le dernier vert).
5. Causes de CI rouge déjà vues : texte d'interface changé sans mise à jour du test ; liste exacte de fiches dans un test (`repetitions-regles` : liste REVUES) ; nom de variante qui cite un matériel sans le porter (`generator-names`) ; baseline à régénérer après nouvelles fiches ; tests de sécurité du générateur (A1 : jambes seulement dans la séance A1 ; cou ; plafonds).
6. Ménage : supprimer une session seulement si sa branche est fusionnée et sa copie propre (`git cherry origin/main <branche>` sans `+`, `git status` vide), puis `git worktree remove` si le dossier reste.

## 4. Décisions de l'utilisateur de cette période
- Fait confiance à Kaggle et au dépôt hasaneyldrm : consignes traduites et simplement relues ; la SÉCURITÉ ne se desserre pas (règle 23, CAL-12, plafonds protégés).
- Import local des images Gym visual autorisé pour son usage privé (décision écrite dans `docs/decisions-prises.md`).
- Plafonds relevés ; cou : paliers prudents ; jours de salle choisis par jour ; pectoraux >= 9 en salle.
- Nutrition : plan par semaine, courses mémorisées, repas optionnels (petit-déj, goûter, en-cas), resto jour par jour, produits achetés (jamais fabriqués).
- Au moins 15 fiches par matériel ; variantes d'angle / prise pour les pompes et développés.
- REGLE D'USAGE : à 90 % d'utilisation hebdomadaire, tout mettre en pause (interrompre les sessions, ne rien lancer). Lire l'usage avec `get_usage`.

## 5. À faire par l'utilisateur (je ne peux pas)
- Tests sur iPhone : `docs/design-iphone.md`, `docs/nutrition-iphone.md`, `docs/import-images-iphone.md`, `docs/tests-iphone.md` (ZIP de 295 Mo sur Safari : mémoire, durée, quota).
- Dépôt à télécharger pour les GIF : github.com/hasaneyldrm/exercises-dataset (commit 7455efae41b330c265e7cd4b78dfa848e7ce5ebd) ; choisir les GIF, pas les vidéos.

## 6. Backlog (ordre proposé)
1. Fusionner `fiches-lot10` (variantes) ; continuer jusqu'à 15 fiches par matériel (sangles, bosu, sac de sable, bidons : variantes seulement).
2. Activer la poussée horizontale / dos large du jeu avec balayage de profils.
3. Design « convivial » : onboarding en 3 écrans, saisie rapide des séries, navigation à 4-5 entrées, accessibilité VoiceOver.
4. Nutrition : lot de 80 recettes viande / poisson + 20 végétariennes, validation des 6 sauces.
5. Phase 6 (comptes et amis, Supabase UE) avec audit de sécurité complet : demande des décisions de l'utilisateur (données exposées) : ne pas lancer sans accord.
6. Règle de sport A1 : mode jambes légères déjà codé ; A2 en ligne.

## 7. Retrouver ce que faisaient les sessions
- Les conversations des sessions filles restent consultables tant qu'elles ne sont pas supprimées : `list_sessions`, `list_events` (transcription), `search_session_transcripts`. Un nouveau chef n'en est pas le « parent » : il les écrit avec `SendMessage` en copiant leur `session_id`.
- Branches locales restantes visibles avec `git branch` et `git worktree list`.

## 8. Idées de l'utilisateur (25/11/2026), à instruire à la reprise (aucune n'est commencée)
Notes brutes de l'utilisateur, reformulées sans rien ajouter :
1. **Suivi de la douleur entre deux séances du même exercice** : pouvoir voir, d'une séance à l'autre sur un même exercice, comment la douleur a évolué (règle : douleur = pas de progression, déjà dans le moteur ; ici c'est l'affichage et l'historique par exercice). À spécifier avec le kiné.
2. **Créer sa propre séance** (l'écran « Créer une séance » existe déjà, D28) en choisissant soi-même les exercices : option superset ou non, minuteurs de repos comme dans le lecteur, et la séance créée s'ajoute au calendrier ET au rapport de la semaine (carte des zones, volume).
3. **Filtre de matériel à vérifier** : en ne laissant que « barre de traction » et « élastique » dans le matériel (en retirant sol, etc.), l'appli a quand même proposé des exercices au sol, et pas de dips ; l'utilisateur n'est pas sûr qu'il existe des dips. À reproduire avec le profil exact : (a) un matériel retiré ne doit jamais laisser passer une fiche qui l'exige (tapis / sol), (b) vérifier la couverture des exercices à la barre de traction et aux barres parallèles (dips, tractions, relevés de jambes suspendus) et ajouter les fiches manquantes.
4. **Remplacer un exercice qu'on ne peut pas faire, pendant la séance** : un bouton qui régénère un exercice équivalent (même muscle principal, matériel disponible) en le comparant (a) au reste de la semaine pour combler les muscles qui manquent et (b) au reste de la séance pour éviter les doublons. Sécurité : mêmes règles que le générateur (plafonds, règle 23, CAL-12) ; le moteur d'adaptation existant (`src/session/adaptation.ts`, `swapForZone` dans `src/zones/catchup.ts`) est un point de départ.

## 9. Annexe : script de fusion utilise (a recreer dans un fichier temporaire, ex. mergebr.sh)
Usage : `./mergebr.sh <branche> "<message>"` depuis une branche partie de origin/main. Il fusionne en `--no-ff`, resout les conflits connus (correspondance JSON : union ; lots.json : union des cles ; docs / css / tsv : garder les deux cotes ; gv-table.ts : regenere) puis commite. Tout autre conflit est signale (`CONFLIT NON GERE`) : le traiter a la main. Apres lui : `node tools/hasan-vers-fiches.mjs nettoyer`, `node tools/gen-gv-table.mjs`, `npm run fiches`, tests, baseline.

```bash
#!/bin/bash
# usage: mergebr.sh <branch> <message>
br="$1"; msg="$2"
git merge --no-ff -q "$br" -m "$msg

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" >/dev/null 2>&1
conf=$(git status --short | grep -E "^(UU|AA|DU|UD)" | awk '{print $2}')
[ -z "$conf" ] && { echo "$br: fusion sans conflit"; exit 0; }
echo "$br: conflits: $(echo $conf | tr '\n' ' ')"
for f in $conf; do
  case "$f" in
    knowledge/exercices/CORRESPONDANCE-FICHES-HASAN.json)
      node -e "
const {execSync}=require('child_process');const fs=require('fs');
const get=(n)=>JSON.parse(execSync('git show :'+n+':knowledge/exercices/CORRESPONDANCE-FICHES-HASAN.json',{maxBuffer:1e8}).toString());
const key=(c)=>c.hasan_id+'|'+c.fiche+'|'+c.variante;const m=new Map();
for(const c of [...get(2),...get(3)])if(!m.has(key(c))||(c.niveau==='sûr'&&m.get(key(c)).niveau!=='sûr'))m.set(key(c),c);
fs.writeFileSync('$f',JSON.stringify([...m.values()])+'\n');" && git add "$f" ;;
    knowledge/exercices/hasan/lots.json)
      node -e "const {execSync}=require(\"child_process\");const fs=require(\"fs\");const g=(n)=>JSON.parse(execSync(\"git show :\"+n+\":knowledge/exercices/hasan/lots.json\",{maxBuffer:1e8}).toString());const a=g(2),b=g(3);const out={...b,...a};for(const k of Object.keys(out)){if(Array.isArray(a[k])&&Array.isArray(b[k]))out[k]=[...new Set([...a[k],...b[k]])]}fs.writeFileSync(\"knowledge/exercices/hasan/lots.json\",JSON.stringify(out))" && git add "$f" ;;
    src/images/gv-table.ts) git checkout --ours "$f" 2>/dev/null; git add "$f" ;;
    docs/*|*.md|*.tsv|*.css)
      node -e "
const fs=require('fs');let t=fs.readFileSync('$f','utf8');
t=t.replace(/^<<<<<<< .*\r?\n/gm,'').replace(/^=======\r?\n/gm,'').replace(/^>>>>>>> .*\r?\n/gm,'');fs.writeFileSync('$f',t)" && git add "$f" ;;
    *) echo "  CONFLIT NON GERE: $f"; exit 2 ;;
  esac
done
timeout 120 node tools/gen-gv-table.mjs && git add src/images/gv-table.ts
git commit -q -m "Merge $br (conflits resolus)

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && echo "  commit ok"
```
