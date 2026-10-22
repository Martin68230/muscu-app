# Lot 05 (vague 1) : banc, 13 fiches (décision D7)
Rédigé par `coach` le 22/10/2026. Statut des fiches : `complete_kine` (sécurité reprise par `kine` ; contrôle `relecteur` du 22/10/2026 fait ; `utilisable` seulement après correction des points A1 à A7 et recontrôle). `npm run check:fiches` : 0 erreur, 0 avertissement (WebP et illustrations présents).

## Fiches
| id | schéma | niveau | variantes (échelon) | matériel | image |
|---|---|---|---|---|---|
| developpe-couche-halteres | poussée H | débutant | prise neutre (1), classique (1), un bras (2) | halteres, banc | 2 photos |
| developpe-incline-halteres | poussée H | débutant | pente douce (1), pente moyenne (2) | halteres, banc_inclinable | 2 photos |
| ecarte-couche-halteres | poussée H | intermédiaire | banc plat (1), banc incliné (1) | halteres, banc / banc_inclinable | 4 photos |
| rowing-poitrine-appuyee-banc | tirage H | débutant | prise neutre (1), pronation (1) | halteres, banc_inclinable | 2 photos (recadrage) |
| hip-thrust-banc | charnière | débutant | poids du corps (1), haltère (2), une jambe (3) | banc ; halteres | illustration SVG |
| dips-banc-triceps | poussée H | débutant | banc genoux pliés (1), chaise (1), jambes tendues (2), pieds surélevés (3) | banc, chaise, box_ou_step | 2 photos (échelon 3 : jambes tendues sur box, mention) |
| montee-sur-banc | fente | intermédiaire | poids du corps (1) | banc | illustration SVG (sans haltères) |
| squat-gobelet-banc | squat | débutant | sans charge (1), haltères côté (2), gobelet (2) | banc ; halteres | 2 photos |
| developpe-epaules-assis-dossier-incline | poussée V | débutant | dossier presque droit (1), banc sans dossier (2) | banc_inclinable ; banc ; halteres | 2 photos |
| curl-incline-halteres | tirage H (substitut) | débutant | supination (1), marteau (1) | halteres, banc_inclinable | 4 photos |
| extension-triceps-couche-halteres | poussée H (substitut) | intermédiaire | deux haltères (1), un haltère (1) | halteres, banc | 2 photos |
| extension-triceps-assis-halteres | poussée H (substitut) | débutant | chaise (1), banc (1) | halteres, chaise / banc | 2 photos |
| elevation-laterale-assis-halteres | poussée V (substitut) | débutant | chaise (1), banc (1) | halteres, chaise / banc | 2 photos |

## Doublons évités (fiches déjà existantes, non recréées)
- **Rowing un bras appuyé sur le banc** : déjà la variante `rowing-un-bras-banc` de `rowing-unilateral-haltere` (pilote).
- **Pull-over** : variante `pullover-banc-haltere` de `pullover-haltere-au-sol` (pilote).
- **Squat bulgare** : fiche `squat-bulgare` (pilote, pied sur chaise ou marche) ; elle n'a pas de variante `banc` : `coach` peut l'ajouter (photo `Split_Squat_with_Dumbbells`, pied sur un banc, déjà en place).
- **Oiseau banc incliné** : `oiseau-banc-incline` (lot 04).

## Couverture apportée (profils E et F : tag `banc` / `banc_inclinable` ; plusieurs variantes marchent aussi avec `chaise`)
Poussée H : +5 mouvements (E, F) ; poussée V : +2 (dont un assis sur chaise, profil C et plus) ; tirage H : +2 ; charnière : +1 ; squat : +1 ; fente : +1. Profils A et B : dips sur chaise (poids du corps seul). Profil C (haltères sans banc) : extension triceps assis, élévation latérale assise, sur chaise. À confirmer avec `node tools/couverture.mjs` (pas lancé : seuls les 13 fichiers de ce dossier ont été créés).

## Fiches avec illustration (faites)
- **`hip-thrust-banc`** : pas de photo libre adaptée (free-exercise-db n'a que la version à la barre) ; illustration SVG originale posée.
- **`montee-sur-banc`** : photos `Dumbbell_Step_Ups` non utilisées (haltères sur un banc, contraire à la décision du 21/10/2026) ; illustration SVG originale (sans haltères) posée.

## WebP (créés par `dev` ; recadrage du rowing appliqué) (je n'ai modifié que ce dossier ; images vues avec Read le 22/10/2026, source https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<Dossier>/<n>.jpg, Unlicense)
Largeur 600 px, WebP qualité 70, puis lignes à ajouter dans tools/photos.md. Fichiers : `Dumbbell_Bench_Press`, `Incline_Dumbbell_Press`, `Dumbbell_Flyes`, `Incline_Dumbbell_Flyes`, `Dumbbell_Incline_Row`, `Bench_Dips`, `Dumbbell_Squat_To_A_Bench`, `Seated_Dumbbell_Press`, `Incline_Dumbbell_Curl`, `Incline_Hammer_Curls`, `Lying_Dumbbell_Tricep_Extension`, `Seated_Triceps_Press`, `Seated_Side_Lateral_Raise` (chacun 0 et 1).
**Recadrage obligatoire pour `Dumbbell_Incline_Row` (0 et 1)** : garder x de 0 à 680 (sur 850), hauteur entière, avant le redimensionnement : cela retire la marque d'une machine en arrière-plan (testé sur un montage : tête et haltères restent entiers). Photo écartée : `Dumbbell_Bench_Press_with_Neutral_Grip` (marque d'une machine visible). `Dumbbell_Step_Ups` : déjà en WebP dans public/photos, non utilisée ici (voir plus haut).
Écarts photo / consigne (D6), état après contrôle : écarté photo 1 `non` (coudes trop pliés) ; extension couchée photo 0 `non` (bras inclinés, haltère près du visage) et photo 1 gardée avec mention ; dips (échelon 3) et développé épaules (échelon 2) et développé couché (prise classique) gardés avec mention explicite de la variante montrée ; extension triceps assis, élévation latérale (banc sans dossier), squat au banc (tabouret) : mention dans la fiche. La liaison photo-variante n'est pas codée : l'écran doit afficher la mention de la fiche.

## Sources
Photos et gestes : free-exercise-db (PROVISOIRE). Études lues par résumé seulement via moteur de recherche (texte complet non lu) : Lauver 2016 (angle du banc, barre, 14 hommes), Contreras 2015 (hip thrust à la barre, 13 femmes), Maeo 2023 (triceps bras levé, poulie, 21 adultes), Oliveira 2009 (curl incliné, 22 sujets) : toutes PROVISOIRE. Aucune source pour : dips sur banc (limite de profondeur, NON SOURCÉ), élévation latérale, montée sur banc, squat au banc, rowing appuyé. Échelons, niveaux, charges légères : NON SOURCÉ. Aucune série, répétition ni charge chiffrée.

## Sécurité : ce que `kine` devait faire (fait ; reste A6, A7 et mineurs sécurité du contrôle)
Pour chaque fiche : revoir le tableau zone x niveau (proposition de `coach`, prudente), la ligne Grossesse, la version plus douce ; rédiger les signes qui doivent faire arrêter, les objets du quotidien (banc stable, réglage bloqué, haltères R9) et les notes. Points sensibles : **dips sur banc** (épaule en extension, limite 90 degrés NON SOURCÉE), **écarté** (étirement de l'épaule), **extension triceps couché** (haltères près du visage, R9), **curl incliné** (biceps étiré, bras en arrière), **hip thrust** (cou, bas du dos), **montée sur banc** (hauteur du banc, chute), position **couchée sur le dos ou semi-allongée en grossesse** (retirée par prudence).

## Questions pour l'utilisateur (toujours ouvertes, aucune réponse reçue ; choix prudent appliqué, rien ne bloque)
1. **Haltères sur un banc (montée sur banc)** : la décision du 21/10/2026 interdit les haltères sur une box haute ; j'ai fait une seule variante sans charge. Veux-tu autoriser des haltères légers sur un banc stable, comme sur la première marche ?
2. **Un « banc » plat sans dossier suffit-il pour l'assis ?** Les variantes assises (élévation latérale, extension triceps, développé épaules échelon 2) existent aussi avec `chaise` ; le tag `banc` = banc plat, `banc_inclinable` = dossier réglable. OK ainsi ?
3. **Muscles secondaires et schémas** : curl et extensions triceps n'ont pas de schéma propre (marqués `couverture: substitut` dans tirage H ou poussée H). Veut-on un schéma « isolation bras » ?
4. **Hip thrust avec haltère** : serviette pliée sur les hanches, sans valeur chiffrée. OK, ou à retirer à la maison ?

## Journal des corrections (contenu d'entraînement, 22/10/2026, après contrôle `relecteur`)
- A1 dips : photos gardées `oui` avec mention explicite (elles montrent l'échelon 3 seulement) ; M2 ligne de sources sans haltère corrigée.
- A2 développé épaules : photos gardées avec mention (banc sans dossier = échelon 2 ; échelon 1 dos appuyé).
- A3 écarté : photo 1 passée `non` (coudes trop pliés) ; photo 0 et banc incliné gardées.
- A4 développé couché : photos rattachées à la prise classique, mention pour la prise neutre.
- A5 extension couchée : photo 0 `non` ; photo 1 gardée avec mention (bras légèrement inclinés).
- M1 README mis à jour ; M2 ligne de sources corrigée aussi dans montee-sur-banc. Statuts inchangés. Non touchés : A6, A7, M3 à M10 (sécurité ou autres), pour `kine`.

## Statuts (22/10/2026, après recontrôle RECONTROLE-relecteur.md : 0 bloquant)
12 fiches `utilisable` (D8). `dips-banc-triceps` reste `complete_kine` : les photos montrent l'échelon 3 (jambes tendues sur box) et aucune image n'illustre les échelons 1-2. Choix prudent : à régler plus tard par une illustration SVG (dev) ou des photos « non » ; le lien photo-variante n'est pas codé dans l'app.
Développé couché et développé épaules assis : mention de variante à afficher obligatoirement avec la photo. Restes mineurs N1-N4 du recontrôle (README périmé en partie, « WebP à créer » dans des lignes Photo, « reste assis » en position allongée, cheville n2 montée sur banc) : à reprendre.
