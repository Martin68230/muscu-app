# Spécification de la phase 7 « Nutrition » (13/11/2026)

Statut : SPÉCIFICATION seulement, aucun code. Valeurs chiffrées : **uniquement** dans `knowledge/nutrition-rules.md` (avec source et statut OK / PROVISOIRE / NON SOURCÉ) ; ce document donne les mécanismes et nomme les paramètres. Le dev code une valeur seulement si elle est OK, ou PROVISOIRE validée (règle 10 de CLAUDE.md). Reprise du chantier : `docs/nutrition-reprise.md`.

## 0. Demande de l'utilisateur et principes

1. **Recettes et liste de courses** avec beaucoup de variété selon l'objectif, les allergies et les préférences.
2. **Objectif de poids** avec une **courbe** alimentée par **une pesée par semaine** (poids lissé).
3. **Besoins** (kcal, glucides, protéines, lipides) qui **s'adaptent aux séances de la semaine** (salle, jours lourds / légers) et au **poids mesuré**, en **variant glucides et protéines** d'un jour à l'autre.

Principes (règles du projet) :
- Tout est **local d'abord** (IndexedDB), hors ligne, exporté et supprimé avec le compte. Aucun service payant, aucune API payante pour les recettes : la base de recettes est un **fichier statique** dans le dépôt (comme `fiches.json`).
- **Privé par défaut** : `nutrition` et `poids_corporel` sont déjà dans `SENSITIVE_SHARE_TYPES`, jamais partagés par défaut ; jamais de classement ni de comparaison de poids entre amis ; l'objectif de poids n'est jamais partagé.
- **Un calcul d'estimation, jamais un diagnostic** : tout chiffre est présenté comme estimation, recalé par la courbe réelle. Avertissement « pas un avis médical » avant le premier calcul (règle 11).
- **Échec sûr** : si une donnée manque ou si un doute existe (allergène inconnu, profil exclu, plancher atteint), l'app **ne propose rien** plutôt que de deviner.
- **IA** (phase 8) : aucune dépendance. Le plan se génère par des règles du code. IA coupée = rien d'IA visible (règle 9).
- Simplicité : une pesée par semaine, pas de saisie de calories obligatoire. Pas de chat, pas de photos, pas de pubs.

## 1. Portes d'entrée et navigation

Barre du bas inchangée (5 onglets). Pas de 6e onglet (question Q1).
- **Accueil** : carte « Aujourd'hui, à manger » (repas du jour, type de jour : lourd / léger / repos) et, le jour de pesée, carte « Pesée de la semaine ».
- **Profil > Poids et objectif** : courbe, objectif, historique des pesées (existait au cahier des charges : « Poids (suivi) »).
- **Bibliothèque > Nutrition** : **première entrée de la Bibliothèque** (en tête de liste, décision du 13/11/2026), accès au hub **Alimentation** (plan, recettes, courses, compléments), aux explications sourcées et à la composition des aliments (Ciqual).
- Le hub Alimentation est aussi atteint par la carte de l'Accueil.

## 2. Écrans et flux

Nommage N1 à N15 (réutilisé par les lots, §12).

### N1. Préambule et orientation (premier accès, une fois)
Avertissement « pas un avis médical », rappel « réservé aux majeurs » (déjà confirmé à l'inscription : `adultConfirmedAt`), présentation en 3 lignes de ce que l'app fait et ne fait pas. Bouton « Continuer ».

### N2. Questions de sécurité (dépistage, avant tout calcul)
Une question par écran, réponses « Non / Oui / Je préfère ne pas répondre ». Détail et formulation : `nutrition-rules.md` section E (les questions de dépistage d'un trouble alimentaire sont des questions originales de l'app, pas le texte d'un questionnaire protégé). **Questions bloquantes** (liste complète, toutes de la section E) : grossesse, allaitement, post-partum (réutilise `Profile.pregnancy`, recalculé à chaque changement de ce champ), maladie suivie (diabète, rein, foie, cœur, hypertension non contrôlée, autre), antécédent ou inquiétude sur le rapport à l'alimentation, traitement médicamenteux régulier. Autres : allergie grave (n'exclut pas, active le mode strict §8).
Résultat, calculé par une fonction pure testable `screenNutrition(answers, bmi, age, sex)` à **trois sorties** :
- **Libre** : calcul complet.
- **Prudent** : âge ≥ 65 ans (déficit plafonné à 10 % du besoin, avis médical conseillé, règle E) ; aucun surplus ni déficit au-delà.
- **Repères seulement** : grossesse / allaitement / post-partum, pathologie, trouble alimentaire déclaré ou inquiétude, médicament régulier, IMC sous le seuil, « Oui » ou « je préfère ne pas répondre » à une question bloquante, **ou donnée manquante** (âge, taille donc IMC, sexe « non précisé ») : échec sûr, jamais de déficit sans ces données. **Aucun déficit, aucun objectif chiffré, aucune cible kcal, aucune portion chiffrée** ; l'écran montre des repères généraux sourcés et le message « parle à un professionnel ». Un utilisateur en Repères qui déclare une allergie accède aux **recettes** (N10 en mode « sans chiffres », voir plus bas) mais **jamais** à un plan à cibles.
- Le résultat est recalculé si l'une des entrées change (grossesse, poids, taille, âge, réponses). Aucun détail de la raison n'est stocké hors du téléphone.
- Les réponses sont locales, exportées, supprimées avec les données, jamais partagées, jamais envoyées à l'IA.

### N3. Mon profil nutrition
Champs : sexe pour le calcul (3 choix : « homme », « femme », « ne pas préciser » : voir la note sur le modèle §4, le profil actuel n'a ni sexe ni âge), année de naissance (âge seulement, confirmer ≥ 18), taille (reprise de `Profile.heightCm`, sinon demandée), poids actuel (première pesée), niveau d'activité hors séances (peu actif / actif / très actif, texte de `nutrition-rules.md`).
Le poids est saisi en kg, 0,1 près, clavier numérique 16 px.

### N4. Mon objectif
- Type : **perdre du gras / garder / prendre du muscle** (pré-rempli depuis l'objectif principal du générateur : `perte_gras`, `muscle`, `force` -> « garder » ou « prendre », `sante` -> « garder » ; modifiable).
- **Poids cible** et **date visée** (facultative) ; l'écran affiche le **rythme implicite** en kg et en % du poids par semaine et le compare au plafond de l'app. Au-delà du plafond : le champ date se corrige tout seul à la date minimale (« la date la plus tôt raisonnable est le … ») ; il n'y a pas de bouton pour passer outre.
- Rythme : curseur à 3 crans (doux / standard / ferme) qui reste toujours sous le plafond (paramètres `RYTHME_*` du fichier de règles). Standard par défaut. Le plafond de rythme dépend de l'IMC et de l'âge exactement comme dans `nutrition-rules.md` C (IMC < 22 : aucun déficit chiffré ; 22 à 25 ou masse grasse basse : plafond réduit ; ≥ 65 ans : 10 %) : l'écran n'offre jamais un cran au-dessus.
- Poids cible refusé s'il donnerait un IMC sous le seuil de sécurité (valeur dans les règles) ; message neutre.
- Un seul objectif actif à la fois (table `nutritionGoal`, l'ancien est conservé en historique).

### N5. Préférences, allergies, régimes
- **Allergies et intolérances** : liste des **14 allergènes officiels de l'UE** (pastilles à cocher, libellés français) + « autre à exclure » (texte libre : chaque mot normalisé exclut les ingrédients dont le nom ou une étiquette le contient ; **sans synonymes**, donc l'écran précise « utilise les mots de la liste d'ingrédients » et propose les noms d'ingrédients de l'app en autocomplétion ; en cas de doute l'exclusion est large). Les **sulfites** (≥ 10 mg/kg ou 10 mg/L) sont un allergène comme les autres : tout ingrédient étiqueté sulfites (vin, fruits secs, certains vinaigres) l'est explicitement. Case « allergie grave (réaction forte) » : active le mode strict renforcé (§8).
- **Régime** : sans restriction / végétarien / végétalien / sans porc / halal / casher (étiquettes de recettes) ; intolérances courantes : sans lactose, sans gluten (cœliaque ou non : une case « cœliaque ou sensible » active le mode strict).
- **Aliments à éviter** (recherche dans la liste d'ingrédients) et **aliments aimés**.
- **Cuisiner pour 2** (décision du 13/11/2026) : réglage « nous sommes 2 » : les recettes sont multipliées en quantités de cuisine, **chaque personne garde ses propres grammes dans l'assiette** (voir N15). Les données de la personne 2 ne sont jamais enregistrées au-delà de ses objectifs saisis à la main (kcal, protéines, glucides, lipides, allergies à exclure) ; pas de compte, pas de partage.
- **Pratique** : repas par jour (3 à 5, collation facultative), heures habituelles, temps de cuisine maximum (15 / 30 / 45 min / peu importe), niveau de cuisine, matériel (four, micro-ondes, plaques, blender, « repas à emporter / sans réchauffage »), budget (économique / normal : étiquette de coût relative, aucun prix en euros), nombre de portions (1 personne ; « cuisiner pour 2 » en lot ultérieur), repas préparés d'avance (« batch cooking » : oui / non).
- Rappel visible en permanence sur cet écran et sur chaque recette : « Vérifie toujours l'étiquette des produits ; l'app peut se tromper. »

### N6. Mes besoins (récapitulatif)
Carte « Ma journée type » : kcal, protéines, glucides, lipides (grammes, % de l'énergie) pour une journée moyenne, avec la mention « estimation, recalée sur ta courbe de poids ». Détail repliable : comment c'est calculé (formule, activité, déficit / surplus appliqué, plancher). Boutons « Modifier mon objectif », « Voir mes jours de la semaine ».

### N7. Ma semaine (besoins par jour)
Barres des 7 jours (lundi à dimanche) : type de jour (lourd / moyen / léger / repos / sport), kcal et grammes de glucides et protéines. Tapote un jour : détail et explication « pourquoi » (« jour de jambes : plus de glucides »). La **moyenne de la semaine égale la cible hebdomadaire** (§6). Mode d'emploi du tableau en une phrase.

### N8. Pesée de la semaine (Accueil, Profil)
Carte sur l'Accueil le **jour de pesée** choisi (par défaut le même jour que la première pesée), et rattrapable pendant 3 jours (« pesée en retard »). Écran : champ poids, date (par défaut aujourd'hui, modifiable dans les 14 derniers jours), « comment s'est passée la semaine ? » (3 choix : « j'ai suivi le plan » / « à peu près » / « pas vraiment »), note libre facultative locale. Conseils de standardisation (même jour, au réveil, après les toilettes, avant de manger : consigne de bon sens, NON SOURCÉE dans les règles, validation `nutritionniste` avant affichage).
Après enregistrement : retour immédiat « Pesée enregistrée » + nouvelle valeur du poids lissé + une phrase d'interprétation neutre (§5.4).
Une pesée manquée n'est jamais reprochée : pas de série à maintenir, pas de message culpabilisant.

### N9. Courbe de poids
Graphique SVG maison (pas de bibliothèque, hors ligne, mode sombre, 375 px) : points bruts (petits), **poids lissé** (trait), **ligne d'objectif** (de la pesée de départ au poids cible à la date visée), zone de rythme sain (bande), **projection** (pointillé, à partir du poids lissé et du rythme réel des 3 dernières semaines, jamais affichée avant 3 semaines de données). Sélecteur de période (8 semaines / 6 mois / tout). Lecture accessible : tableau des pesées sous le graphique, `aria-label` résumant la tendance. Appui sur un point : date, poids, poids lissé, adhérence déclarée.
Zéro comparaison avec les amis. Le poids n'est pas montré sur l'Accueil (seulement la phrase de tendance, désactivable dans N14).

### N10. Plan de repas de la semaine
Grille jours x repas (3 à 5), chaque case = une recette (photo SANS : pas d'image de nourriture non libre ; pastille de couleur et icône), kcal, protéines, durée. Bascule « Aujourd'hui / semaine ». Actions par repas : **Remplacer** (3 alternatives proches en macros et en type de repas, tirées du même jeu de règles), **Substituer un ingrédient** (§9), **J'ai mangé** (coche : crée un `Meal`), **Pas cette recette** (la bloque ; confirmation, annulable dans N5), **Favori**. Action semaine : « Régénérer la semaine » (garde les repas verrouillés par un cadenas).
Le plan chiffré (cibles, portions) s'affiche seulement si N2 est « Libre » ou « Prudent ». En « Repères seulement », une personne qui a déclaré une allergie ne voit que le **catalogue de recettes filtré** (portion de base de la recette, **sans cible, sans kcal par jour, sans mise à l'échelle, sans liste de courses chiffrée**) ; sans allergie déclarée, rien. Si une recette ne peut pas respecter les allergènes et les macros, la case reste vide avec « Aucune recette ne convient : élargis tes préférences » (jamais de repli silencieux vers un allergène).

### N11. Fiche recette
Titre, étiquettes (objectif, type de repas, durée, régime), **allergènes présents** (pastilles rouges + texte, toujours en haut), portions, ingrédients (grammes **crus**, ajustables par le plan), étapes courtes (texte réécrit par l'app, §10), macros par portion (calculés), source des valeurs « Ciqual, ANSES » et mention de la licence en pied. Bouton « Ajouter à ma liste de courses ». Stepper de portions (1 à 4) qui recalcule.

### N12. Liste de courses
Générée depuis la semaine (ou les jours choisis). Regroupée par **rayon** (fruits et légumes, viandes et poissons, produits laitiers et œufs, féculents, épicerie, surgelés, assaisonnements). Quantités additionnées par ingrédient, converties en unités achetables (œufs à la pièce, boîtes, sachets ; poids sinon), arrondies au conditionnement habituel (voir paramètre `ARRONDI_COURSES`). Case « j'ai déjà » (garde-manger : sel, huile, épices : masqués par défaut mais modifiables), cocher en magasin (état stocké local), recherche, ajout d'un article libre, **Copier en texte / Partager** (feuille de partage du téléphone, rien n'est envoyé par l'app), mode sans réseau. Aucun prix, aucune enseigne, aucun lien d'achat.

### N13. Compléments (journal) et alertes
Reprend le modèle `Supplement` existant : l'utilisateur **enregistre** ce qu'il prend (nom, dose, fréquence, début / fin, macros éventuelles, mg de caféine pour les produits qui en contiennent). Le total du jour compte les macros et la caféine ; **alerte** (jaune) au-delà du seuil de caféine des règles : 400 mg/jour, et **200 mg/jour** si la personne est enceinte ou allaitante (lien avec `Profile.pregnancy` et le dépistage N2) ; alerte « créatine : demande l'avis d'un médecin » si une maladie rénale est déclarée (règles §4 et E). Aucun complément n'est recommandé par l'app, aucune dose conseillée ; seules les informations sourcées de `nutrition-rules.md` §4 s'affichent. Protéines en poudre = un aliment (macros).

### N15. Export pour une IA externe ou pour un proche (courses, repas, recettes)
Bouton « Exporter » dans N10 (semaine) et N12 (courses). Flux : 1) **choisir les jours** (cases par jour, « toute la semaine » par défaut, par exemple en début de semaine) ; 2) choisir le contenu : liste de courses des jours choisis (par rayon), repas et recettes complètes (ingrédients en grammes, étapes, macros par portion), **mes cibles du jour** (kcal, protéines, glucides, lipides), **allergies et régimes à exclure** ; 3) option **« Pour 2 personnes »** : saisie à la main des cibles de la personne 2 (kcal, protéines, glucides, lipides, allergies), non enregistrées sauf si on coche « garder » ; **contrôles** : kcal sous 1200 refusés (« cette valeur est trop basse pour être exportée »), alerte entre 1200 et 1500, plausibilité des macros (protéines et lipides au minimum des règles) ; l'app ne calcule **aucun déficit** pour la personne 2 et ne lui pose aucune question de dépistage : l'écran dit « la personne 2 doit avoir fait ses propres vérifications (grossesse, maladie, rapport à l'alimentation) ; sinon, qu'elle consulte un professionnel » ; 4) format : **texte** (copier, ou feuille de partage du système) et fichier JSON ; 5) option **« Modèle de demande pour une IA »** : texte à coller avec l'export (« adapte les doses de chaque assiette à ces deux personnes, mélange ou fusionne les repas pour respecter les deux objectifs, recalcule macros et allergènes »).
Sécurité et vie privée : **rien n'est envoyé par l'app** (copie ou fichier, la personne le colle elle-même dans l'IA de son choix) ; aucun nom, aucun poids, aucun IMC, aucune réponse de dépistage, aucune pathologie dans l'export ; avertissement avant export : « Tu envoies ces données à un service tiers, hors de l'app. Vérifie toujours les allergènes toi-même : une IA peut se tromper. » ; ce n'est pas une fonction « IA de l'app » (règle 9) : il reste visible IA coupée, car l'app ne fait que produire du texte. Dépistage « Repères seulement » : l'export ne contient **aucune cible ni mise à l'échelle** ; seules les recettes en portion de base sont exportables, sans courses chiffrées ni option « Pour 2 personnes » (qui rouvrirait une mise à l'échelle). Le contenu exporté est listé avant l'export (« tu partages : … ») ; il ne mentionne jamais un objectif de perte, un poids cible, un déficit, le mode strict ni le dépistage ; les régimes déclarés sont exportés seulement si cochés. Allergie déclarée **grave** : avertissement renforcé (« ne te fie pas à une IA pour tes allergènes »). Le modèle de demande dit « ne retire jamais un allergène, ne remplace aucun ingrédient sans le signaler, et signale tout doute » ; il ne confie pas le contrôle des allergènes à l'IA. **Règle 9 : l'option « Modèle de demande pour une IA » est masquée quand l'interrupteur IA est coupé** (`Profile.aiEnabled` faux) ; l'export neutre « pour un proche » (texte, JSON) reste. La phase 8 pourra plus tard proposer le même échange intégré.

### N14. Réglages nutrition
Jour de pesée, rappel (une carte dans l'app seulement, pas de notification sans serveur) ; unités ; masquer la tendance sur l'Accueil ; **recommencer le dépistage** ; **exporter / supprimer** les données nutrition (en plus de l'export global) ; crédits Ciqual et licences (renvoi à la page crédits).

## 3. Flux principaux

**Première fois** : N1 -> N2 -> (Libre) N3 -> N4 -> N5 -> N6 -> N7 -> N10. Chaque étape est enregistrée à part : on peut s'arrêter et reprendre. Aucun plan avant la fin de N5.
**Chaque semaine** : carte Accueil -> N8 (pesée) -> recalage (§5.5, silencieux ou avec une phrase) -> « Ta semaine est prête » -> N10.
**Chaque jour** : Accueil -> repas du jour -> N11 -> « J'ai mangé » ; complément si besoin ; N12 en magasin.
**Quand la semaine de séances change** (séance sautée, déplacée, nouveau programme, séance supplémentaire) : les besoins du jour et les jours restants de la semaine sont recalculés (§6.4) ; le plan de repas déjà généré n'est PAS remplacé sans accord : bandeau « Tes besoins ont changé aujourd'hui, adapter les portions ? » (agrandit ou réduit les quantités de glucides, jamais le choix des recettes ; ou régénère si la personne le demande).

## 4. Modèle de données ajouté

Existant et conservé tel quel : `BodyWeight {date, kg}`, `Meal {date, time, label, items[{foodCode, grams}]}`, `Supplement`. Le profil ne contient ni sexe ni âge : on **n'ajoute pas** ces champs à `Profile` (donnée sensible, local seulement) ; on crée un enregistrement nutrition séparé, qui n'est jamais partagé.

Nouvelles tables (toutes avec `SyncFields`, `ownerId`, suppression douce, RLS phase 6 : lecture et écriture **réservées au propriétaire**, jamais lisibles par un ami, y compris en cas de partage « nutrition » : ce type de partage, déjà prévu, n'expose que les agrégats que la personne choisit, voir §11) :

```ts
// SCHEMA_VERSION 4 -> 5 (migration IndexedDB : création des tables, aucune donnée existante modifiée)
export interface NutritionProfile extends SyncFields {
  birthYear: number | null;            // âge calculé, jamais stocké en clair ailleurs
  sexForFormula: 'homme' | 'femme' | 'non_precise' | null;
  activityLevel: 'peu' | 'actif' | 'tres_actif' | null;   // hors séances
  screening: ScreeningAnswers;         // réponses N2 (locales)
  screeningResult: 'libre' | 'reperes' | null;
  screenedAt: string | null;
  // N5
  allergens: AllergenKey[];            // parmi les 14 officiels
  allergenFree: string[];              // « autre à exclure » (mots normalisés)
  severeAllergy: boolean;
  diet: DietKey[];                     // vegetarien, vegetalien, sans_porc, halal, casher, sans_lactose, sans_gluten
  glutenStrict: boolean;               // cœliaque ou sensible
  mealsPerDay: 3 | 4 | 5;
  mealTimes: string[];                 // 'HH:MM'
  maxCookMin: 15 | 30 | 45 | null;
  appliances: ApplianceKey[];
  budget: 'eco' | 'normal';
  batchCooking: boolean;
  dislikedFoods: string[];             // codes ingrédients de l'app
  likedFoods: string[];
  weighDay: number;                    // 0 = lundi
  showTrendOnHome: boolean;        // défaut : true (décision Q4)
}

export interface NutritionGoal extends SyncFields {
  kind: 'perte' | 'maintien' | 'prise';
  startDate: string; startKg: number;
  targetKg: number | null; targetDate: string | null;
  pace: 'doux' | 'standard' | 'ferme';
  endedAt: string | null;
}

export interface WeeklyCheckin extends SyncFields {
  weekStart: string;                   // lundi de la semaine, 'YYYY-MM-DD'
  bodyWeightId: string | null;         // lien vers BodyWeight
  adherence: 'oui' | 'peu_pres' | 'non' | null;
  trendKgAfter: number | null;         // poids lissé après cette pesée (calculé, mis en cache, recalculable)
  kcalAdjust: number;                  // ajustement appliqué à partir de la semaine suivante, en kcal/jour (borné)
  note: string;
}

export interface MealPlan extends SyncFields {
  weekStart: string;
  generatorVersion: string;            // « N1.0 » : comme le générateur de séances, invalide un plan périmé
  dayTargets: DayTarget[];             // copie figée des besoins par jour au moment de la génération
  slots: PlanSlot[];                   // {date, slotIndex, recipeId, scale, locked, eatenMealId}
  inputsHash: string;                  // empreinte profil + objectif + semaine de séances : détecte un plan périmé
}

export interface ShoppingState extends SyncFields {
  weekStart: string;
  checked: string[];                   // clés d'articles cochés
  pantry: string[];                    // clés « j'ai déjà »
  custom: { name: string; qty: string }[];
}

export interface RecipePref extends SyncFields {
  recipeId: string;
  state: 'favori' | 'bloque';
}
```

Les données **statiques** (non synchronisées, générées au build, versionnées) :
- `public/data/aliments.json` : extrait de **Ciqual** (≈ 400 à 800 aliments utiles, pas les 3 000) : code, nom, kcal, protéines, glucides, lipides, fibres, sel, groupe ; clé de **famille de substitution** et **allergènes étiquetés par l'app** (§8). Généré par `tools/build-aliments.mjs` depuis un fichier source téléchargé hors dépôt.
- `public/data/recettes.json` : généré depuis `knowledge/recettes/*.md` par `tools/build-recettes.mjs` ; contrôlé par `tools/check-recettes.mjs` (`npm run check:recettes`, ajouté au workflow, une seule fois avant l'envoi comme les autres contrôles).
- Aucun contenu utilisateur dans ces fichiers.

Calculs **purs** (aucun accès base, testables) dans `src/nutrition/` : `screen.ts` (dépistage), `needs.ts` (besoin de base, cibles, plafonds), `weight-trend.ts` (poids lissé, rythme, recalage), `day-targets.ts` (jours de la semaine), `plan.ts` (générateur de plan), `scale.ts` (portions), `shopping.ts`, `allergens.ts`, `substitutions.ts`, `config.ts` (valeurs et **statuts** comme `src/generator/config.ts`).

## 5. Pesée hebdomadaire, poids lissé et courbe

### 5.1 Données
Une pesée par semaine suffit. On accepte plusieurs pesées (le modèle `BodyWeight` n'a pas de limite) : elles sont **moyennées par semaine** avant le lissage (une semaine = un point). Pesées sans effet sur le calcul si dans un état « maladie / voyage / règles abondantes » : case « cette pesée n'est pas représentative » (exclue du lissage, conservée sur le graphique en grisé).

### 5.2 Lissage (poids lissé = « tendance »)
Lissage exponentiel sur les points hebdomadaires : `T_0 = P_0`, `T_n = T_{n-1} + α (P_n - T_{n-1})` ; α et la durée minimale avant de lire une tendance : `nutrition-rules.md` (poids lissé). Fonction pure `smoothWeights(points, alpha)`. Propriété testée : jamais de valeur lissée hors de [min, max] des points ; une semaine sans pesée n'invente pas de point (le lissage saute la semaine).

### 5.3 Rythme réel
`rateKgPerWeek` = pente du poids lissé sur les 3 dernières semaines avec pesée (au moins 3 points espacés d'au moins 14 jours au total), exprimée aussi en % du poids. Avant : « pas encore assez de pesées » (aucune conclusion).

### 5.4 Phrase d'interprétation (après chaque pesée)
Sortie d'une fonction pure à 6 états, textes neutres, sans « bravo / raté » : « En avance / dans le rythme / plus lent que prévu / plus rapide que prévu / stable / pas assez de données ». Une pesée isolée très différente de la tendance (écart supérieur à un seuil `ECART_HASARD`) : « Un écart ponctuel est normal (eau, repas salé, digestion). Regarde la tendance. »

### 5.5 Recalage des besoins
Une fois par semaine, après la pesée, si les conditions de `nutrition-rules.md` A sont réunies (au moins 3 pesées, apport déclaré sur au moins 10 jours sur 14 : l'adhérence « oui » ou « à peu près » ne suffit pas seule, elle n'est qu'un signal complémentaire) : estimation du **besoin réel** = apport moyen déclaré - (variation de poids lissée en kcal / jours) ; ce besoin réel est **borné à ± 15 % du besoin initial estimé** (garde-fou des règles A) ; la nouvelle cible = besoin réel + écart voulu par l'objectif, **bornée** : variation maximale par semaine `AJUSTEMENT_MAX` kcal/jour, jamais sous le **plancher** (`PLANCHER_KCAL` = max(métabolisme de repos estimé, filet), règle unique de `nutrition-rules.md` C : cible = max(besoin - déficit, plancher) ; si le plancher atteint le besoin, le déficit devient nul et un message neutre l'explique ; la saisie du poids et de la taille est bornée aux valeurs plausibles des règles), jamais au-dessus du plafond de surplus. L'ancien chiffre est affiché (« avant / après ») pour que la personne voie ce qui change. Adhérence « non » : aucun recalage, message « on garde la même cible, reprends quand tu veux » (jamais de baisse de calories parce que le plan n'a pas été suivi).

### 5.6 Alertes de sécurité (fonctions pures, testées)
Les seuils chiffrés sont ceux de `nutrition-rules.md` C, D et E (PROVISOIRES) ; le spec n'en invente aucun.
- Perte réelle supérieure au plafond hebdomadaire **2 semaines de suite** : la cible monte (kcal) de la valeur des règles, bandeau d'information.
- **Gel des déficits** (plus aucune cible de perte, passage en « garder », message neutre vers un professionnel, sortie du gel seulement après nouveau dépistage N2) dans l'un de ces cas : perte > 2 %/semaine ou > 5 % du poids en un mois sans déficit visé ; saut de repas répété (si le journal « J'ai mangé » est actif) ; apport saisi sous le plancher pendant 3 jours ; poids cible sous un IMC de 18,5 (refusé dès N4) ; poids lissé atteignant le seuil d'IMC.
- Perte de poids rapide non voulue en mode « garder » ou « prendre » : message d'orientation vers un professionnel.
- Écart d'une semaine à l'autre supérieur à `ALERTE_SAUT_KG` : « Vérifie ta balance ou la saisie » (pas de lecture santé).
- Aucune de ces alertes ne montre un chiffre alarmant ; aucune ne dépend d'un autre ami.

### 5.7 Atteinte de l'objectif
Quand le poids lissé atteint la cible (fourchette de tolérance) : écran « Objectif atteint » avec trois suites (maintien, nouvel objectif, pause) ; passage automatique en maintien après 14 jours sans réponse. Pas de sur-félicitation.

## 6. Adaptation aux séances de la semaine

### 6.1 Entrées
Pour chaque date de la semaine, le type de jour est dérivé (fonction pure `dayTypeOf(date, program, sessions, profile)` dans `src/nutrition/day-targets.ts`) :
- **séances prévues** : `Program.days[].weekday`, `sessionType` (CE, HAUT, BAS, PUSH, PULL, LEGS), `estimatedMin` ; **jours légers** (`LightDay`) ; **cardio** (D31) ; **séance de sport** déclarée (`Profile.sportPlan`, jour de match) ; **salle** (`salleAccess`) : seulement pour l'étiquette d'explication (les calories se basent sur la dose réelle, pas sur le lieu) ;
- **séances réelles** : `WorkoutSession.status` (`faite`, `sautee`, `reportee`) à la date : une séance **sautée ou reportée** retire le supplément de la journée et le rend neutre (« repos ») ; une séance **faite** non prévue (déplacée ou ajoutée) l'ajoute ; une reprise douce (`reprise`) classe le jour en « léger ».
- Pas d'accès au détail des charges.

### 6.2 Types de jour
| Type | Définition (à valider par le coach, `nutrition-rules.md`) |
|---|---|
| **Lourd** | séance de jambes / bas du corps / corps entier longue (≥ seuil de durée), ou deux séances le même jour, ou match |
| **Moyen** | séance haut du corps, poussée, tirage ou séance de force plus courte |
| **Cardio / léger** | séance de cardio, jour léger D25, marche active, reprise douce |
| **Repos** | aucune séance |

### 6.3 Cibles par jour
- **Cible hebdomadaire** : kcal moyens par jour (§5.5) x 7 = total de la semaine ; protéines en g/kg/jour (valeur `PROT_GKG` selon l'objectif) ; lipides au plancher g/kg ; glucides = le reste.
- **Répartition** : on module les kcal par type de jour avec des coefficients (`COEF_JOUR`) **dont la moyenne pondérée sur la semaine est 1** (la fonction normalise : la somme des kcal de la semaine égale toujours la cible hebdomadaire, test de propriété). La variation passe **surtout par les glucides** (jour lourd : plus ; repos : moins), conformément aux fourchettes g/kg des règles (jamais sous le minimum de glucides ni en dessous du plancher de kcal d'un jour).
- **Protéines : variation modérée** : la cible de la semaine est atteinte en moyenne, avec une variation de ± `VAR_PROT` autour du jour moyen (un peu plus après les jours lourds et les jours de repos qui suivent, un peu moins les jours légers), toujours **au-dessus du seuil par repas** et **sans jamais passer sous le minimum du jour**. But : réaliser la demande « varier glucides et protéines » sans aller contre les données (les protéines varient peu en pratique, voir `nutrition-rules.md`). Décision du 13/11/2026 : pas besoin de varier tous les jours, mais de temps en temps : par défaut les protéines restent à la cible et ne varient (± `VAR_PROT`) que sur 1 ou 2 jours de la semaine (jour le plus lourd et le lendemain) ; les glucides varient chaque jour.
- **Lipides** : stables, au plancher g/kg ou au-dessus.
- **Variation de sources** (hors macros) : voir §7.4.

### 6.4 Recalcul au fil de la semaine
- À l'ouverture de l'app et à chaque changement de séance : `dayTargets(weekStart)` est recalculé. Le jour **passé** n'est jamais modifié. **Le plancher s'applique jour par jour** (un jour de repos ne descend jamais sous le plancher, y compris après normalisation de la semaine et après `AJUSTEMENT_JOUR_MAX` ; test de propriété). Si une séance est ajoutée ou sautée, le **rattrapage est réparti sur les jours restants** de la semaine, borné (`AJUSTEMENT_JOUR_MAX`), et la moyenne hebdomadaire peut légèrement s'écarter (jamais en créant un déficit supérieur au plafond).
- Le plan déjà généré garde ses recettes ; seules les **portions** (grammes de féculents / de protéines) se mettent à l'échelle (§7.3).
- Aucune compensation « punitive » : un jour trop mangé ou non mangé ne change pas les jours suivants. Seul le **changement de séances** modifie les cibles.

### 6.5 Semaine suivante
Au dimanche soir ou lors du changement de bloc du programme, la semaine suivante est préparée avec les séances **prévues** ; la semaine reste modifiable.

## 7. Plan de repas et variété

### 7.1 Génération (fonction pure, déterministe à graine fixe pour les tests, `generatorVersion`)
Entrées : `dayTargets` (7 jours), profil nutrition (N5), recettes, préférences, plan précédent (pour la variété), graine. Sortie : `MealPlan`.
1. **Filtre dur** (jamais assouplissable) : allergènes (§8), régime, aliments évités, temps, matériel, recettes bloquées.
2. **Répartition du jour en repas** : kcal et protéines par repas selon le nombre de repas et l'heure de séance (repas avant et après la séance plus riches en glucides ; protéines au moins au seuil par repas).
3. **Choix** : pour chaque case, candidats de type correspondant ; score = proximité macros + préférence (favori / aimé) + **variété** ; tirage pondéré avec graine.
4. **Mise à l'échelle des portions** (§7.3) pour atteindre la cible du repas, tolérance `TOL_MACRO` ; si impossible : un autre candidat ; en dernier recours la case reste vide (§N10).
5. **Contrôles finaux** : kcal du jour dans la tolérance, aucun allergène (test redondant de sécurité sur le résultat), plancher respecté.

### 7.2 Variété (objectif de la demande)
- Cible de base : **150 recettes minimum au lancement** (≈ 40 petits-déjeuners, 45 déjeuners / dîners protéinés, 25 dîners légers, 25 collations, 15 repas avant / après séance), **étiquetées par objectif** (perte, maintien, prise), et au moins **30 recettes sans allergène majeur par allergène** (chaque allergène exclu doit laisser un choix suffisant : exigé par un test de couverture, §13).
- Règles anti-répétition : la même recette au plus **1 fois par semaine** (2 pour le petit-déjeuner si « batch cooking »), la même **protéine principale** au plus 2 fois par jour-type, au moins 4 protéines principales différentes sur la semaine, 2 jours consécutifs sans la même recette, pas la même recette que dans les **2 semaines précédentes** (sauf si le choix est trop pauvre : on relâche seulement la fenêtre, jamais un filtre dur).
- **Variation de glucides et de protéines par les sources** : chaque recette porte une **source de glucides** (riz, pâtes, pomme de terre, pain, flocons d'avoine, légumineuses, patate douce…) et une **source de protéines** (volaille, poisson maigre, poisson gras, œufs, bœuf maigre, porc maigre, légumineuses, tofu / tempeh, produit laitier…) ; le générateur favorise des sources différentes d'un jour à l'autre et propose **les jours lourds des glucides à haute teneur** (riz, pâtes) et **les jours de repos des glucides à fibres** (légumineuses, légumes). Une limite de fréquence des poissons gras serait utile mais n'existe pas encore dans les règles : NON SOURCÉE, à sourcer (nutritionniste) avant de coder ; en attendant, pas de limite codée.
- **Équilibre** : 5 portions de fruits et légumes par jour visées en repère d'affichage seulement ; la valeur n'est pas dans les règles : NON SOURCÉE, à sourcer avant de l'afficher ; aucune contrainte du générateur.
- Plusieurs variantes d'une même recette (sauce, épice) sont autorisées, mais elles ne comptent que pour une recette.

### 7.3 Mise à l'échelle des portions
Chaque ingrédient de recette est marqué `fixe` ou `ajustable` (féculent, protéine, matière grasse d'assaisonnement). La mise à l'échelle ne modifie que les ingrédients ajustables dans la plage `ECHELLE_MIN`-`ECHELLE_MAX` (jamais moins de 0,5 x ni plus de 1,75 x la portion de base) ; elle arrondit aux **quantités faciles** (5 g, 10 g, 1 œuf). Les macros de chaque repas sont toujours **recalculées depuis Ciqual**, jamais copiées d'un texte.

### 7.4 Préférences
Aliments aimés : bonus de score ; aliments évités : filtre dur ; favoris / bloqués par recette. « Je n'ai pas le temps » : filtre la durée ; « repas à emporter » : filtre le matériel.

### 7.5 Substitutions (fonction `substitutions.ts`)
- Une substitution est une équivalence **dans une famille** (féculents, protéines animales, protéines végétales, laitages, corps gras, fruits, légumes de même type), à **macros proches** (écart borné) et recalcul de la portion pour retrouver les macros du repas.
- **Jamais** d'allergène ajouté : la substitution est filtrée par les mêmes règles que le plan ; l'écran n'affiche que des substituts compatibles.
- Chaque substitution est enregistrée (`PlanSlot.overrides`) et la liste de courses suit.
- Les équivalences viennent d'un fichier sourcé de l'app (`knowledge/recettes/substitutions.md`) ; une paire non listée n'est jamais proposée.

## 8. Allergènes et sécurité alimentaire

- **Liste officielle** : les 14 allergènes à déclaration obligatoire de l'UE (règlement UE n° 1169/2011, annexe II), clés dans `src/nutrition/allergens.ts`, libellés et exemples dans `nutrition-rules.md`.
- **Étiquetage des ingrédients** : Ciqual ne donne pas les allergènes de façon fiable. Chaque ingrédient de `aliments.json` porte donc la liste de ses allergènes (étiquetés par l'app, puis relus : `nutritionniste` rédige, `relecteur` contrôle par lot). Vocabulaire unique, celui des règles F : chaque ingrédient a le statut `valide` / `a_verifier` / `inconnu`. **Dès qu'un allergène ou une intolérance est coché (mode normal ou strict), seuls les ingrédients `valide` peuvent figurer dans une recette proposée** ; `a_verifier` et `inconnu` sont exclus. (Sans allergie cochée, `a_verifier` est toléré mais jamais `inconnu`.) Le contrôle `check:recettes` calcule pour chaque recette son statut = le pire de ses ingrédients.
- **Allergènes d'une recette** = union des allergènes de ses ingrédients, calculée au build (jamais saisie à la main) ; `check:recettes` échoue si une recette a un ingrédient `inconnu`, si un allergène manque pour un ingrédient connu comme contenant un allergène (liste de contrôle de mots-clés : « lait », « farine », « arachide »…) ou si une recette d'un régime étiqueté (végétarien, etc.) contient un ingrédient incompatible.
- **Filtre strict** : un allergène coché exclut toute recette qui le contient, **y compris si l'ingrédient est un produit transformé** (pas de « traces » modélisées : le message dit de lire l'étiquette). Les ingrédients transformés (sauce soja, bouillon, charcuterie, plats préparés, chocolat) sont **absents** des recettes automatiques sauf s'ils sont eux-mêmes étiquetés et marqués `valide`.
- **Mode strict renforcé** (allergie grave ou cœliaque) : seules les recettes dont **tous** les ingrédients sont `valide` et relues (`controle_relecteur`) sont proposées ; un bandeau permanent rappelle de lire les étiquettes et de ne pas se fier à l'app seule ; la substitution libre est désactivée (seuls des substituts `valide`).
- **Aucune** recommandation de « test d'exposition » ni d'introduction d'un allergène ; aucune conduite à tenir en cas de réaction (renvoi : urgences, 15 / 112).
- Les intolérances et régimes utilisent les mêmes étiquettes (lactose, gluten, viande, poisson…).
- **Couverture** : chaque allergène exclu, y compris les combinaisons de deux, laisse au moins `PLAN_MINI_RECETTES` recettes par type de repas ; sinon l'écran N5 prévient (« peu de choix avec ces restrictions : le plan sera répétitif »).

## 9. Base de recettes (sources et fabrication)

- **Contenu original** : les recettes sont **écrites par nous** (composition d'ingrédients et grammes, étapes réécrites), jamais copiées d'un site (droit d'auteur : le texte d'une recette est protégé, une liste d'ingrédients seule beaucoup moins, mais on reste prudent). Pas d'images de plats (aucune source libre sûre ; icône par type).
- **Aliments et macros** : Ciqual (ANSES), Licence Ouverte 2.0 : mention de la source et de la date de version dans l'app et sur la page crédits ; pas de reprise d'Open Food Facts en v1 (licence ODbL : obligations de partage ; décision dans les règles).
- **Cuisson** : les grammes sont crus (Ciqual donne des valeurs cru et cuit) ; rendement cru / cuit pour l'affichage « à cuire » : facteurs de rendement NON SOURCÉS (règles G) : ne pas coder ni afficher avant sourçage ; en attendant, seuls les grammes crus sont affichés.
- **Fichier de recette** (`knowledge/recettes/<repas>/<id>.md`, front matter + texte) : `id`, `nom`, `repas` (petit-dej / dejeuner-diner / collation / avant-seance / apres-seance), `objectifs[]`, `duree_prep_min`, `duree_cuisson_min`, `materiel[]`, `regimes[]` (étiquettes déclaratives ; halal et casher = préférences déclarées, jamais une certification, avec la mention « vérifie la certification des produits »), `cout` (eco / normal / plus), `source_glucides`, `source_proteines`, `portions_base`, `ingredients[] {code_ciqual, nom, grammes, ajustable, rayon}`, `etapes[]`, `statut` (`brouillon`, `complete_nutri`, `controle_relecteur`). Allergènes et macros **ne sont pas saisis** : calculés au build.
- **Cycle** (règle 10, règle de relecture CLAUDE.md) : `nutritionniste` rédige un lot de 10 à 15 recettes -> contrôle automatique -> **un seul passage `relecteur` par lot, centré sur les allergènes et les valeurs de sécurité** (jamais sur le style) -> publication quand `check:recettes` passe. Les recettes à enjeu (régimes stricts, mode strict renforcé) exigent `controle_relecteur`.
- **Aucune IA** pour générer des recettes dans cette phase (la phase 8 pourrait proposer des variantes, toujours recalculées et filtrées par les mêmes règles).

## 10. Liste de courses

- Entrée : jours choisis (par défaut la semaine) ; agrège les **ingrédients crus** des cases du plan **après mise à l'échelle et substitutions**.
- Regroupement : par code ingrédient (additionner les grammes), puis conversion en unité d'achat selon une table (`unites` dans `aliments.json` : pièce, boîte, sachet, tranche) ; arrondi au conditionnement supérieur de la table (paramètre `ARRONDI_COURSES`, jamais en dessous du besoin).
- Rayons : étiquette `rayon` de l'ingrédient ; ordre fixe.
- Garde-manger : ingrédients « courants » masqués par défaut (sel, poivre, huile, épices).
- Allergènes : la liste n'ajoute jamais d'ingrédient hors du plan, mais affiche un rappel d'étiquettes en tête.
- Données conservées : `ShoppingState` (coché, garde-manger, ajouts libres) ; la liste elle-même est **recalculée** à chaque ouverture (pas de liste figée qui deviendrait fausse).
- Pas de prix ni d'enseigne ni de lien d'achat ; partage = texte copié ou feuille de partage du système.

## 11. Vie privée, partage, export, suppression

- Toutes les nouvelles tables sont **privées par défaut** et classées sensibles. Le seul partage prévu est celui, déjà au modèle, de type `nutrition` (désactivé par défaut) ; on limite en v1 à : « j'ai suivi mon plan cette semaine » (oui / à peu près / non). **Jamais** : poids, objectif, kcal, allergies (donnée de santé), dépistage.
- Phase 6 : RLS propriétaire seul sur `nutritionProfile`, `nutritionGoal`, `weeklyCheckin`, `mealPlan`, `shoppingState`, `recipePref` ; test d'accès automatique (un ami ne lit rien, même avec un partage `nutrition` actif) ajouté à `docs/phase6-checklist.md`.
- Export / import JSON : les nouvelles tables sont dans `TABLES` ; import validé (`validate.ts`) ; suppression du compte et des données : tout nutrition est effacé, y compris les réponses de dépistage.
- Aucun traceur, aucune requête réseau pour la nutrition : les fichiers `aliments.json` et `recettes.json` sont mis en cache hors ligne avec le reste de la PWA.

## 12. Ordre de construction en lots

Chaque lot : plan court, code, **un contrôle automatique avant l'envoi** (règles de CLAUDE.md), un bilan court dans `docs/`. Un lot est livrable seul. L1 à L3 donnent déjà de la valeur sans recettes.

| Lot | Contenu | Dépend de | Experts |
|---|---|---|---|
| **L0** Règles et données | `nutrition-rules.md` validé (A à J) ; `tools/build-aliments.mjs` (Ciqual) ; table des 14 allergènes ; étiquetage des ingrédients ; modèle `SCHEMA_VERSION 5` ; `src/nutrition/config.ts` | — | nutritionniste, relecteur (sécurité : exclusions, plafonds, allergènes), dev |
| **L1** Profil, dépistage, besoins | N1 à N6 ; `screen.ts`, `needs.ts` ; refus pour les exclus ; tests (propriétés : jamais sous le plancher, jamais d'objectif pour un exclu) | L0 | dev, nutritionniste (textes) |
| **L2** Pesée, courbe, objectif | N8, N9, N4 (finalisé), `weight-trend.ts`, alertes §5.6 ; statut de la « carte Accueil » | L1 | dev |
| **L3** Besoins par jour et recalage | N7 ; `day-targets.ts` ; liaison aux programmes et séances ; recalage hebdomadaire §5.5 | L1, L2 | dev, coach (types de jour) |
| **L4** Base de recettes | `knowledge/recettes/` lots de 10 à 15, `check:recettes`, `build-recettes`, couverture par allergène ; au moins 150 recettes avant L5 public | L0 | nutritionniste (rédaction), relecteur par lot (allergènes) |
| **L5** Plan de repas | N10, N11 ; `plan.ts`, `scale.ts`, `substitutions.ts` ; verrouillage, remplacer, favoris | L3, L4 | dev |
| **L6** Liste de courses et export | N12, N15 ; `shopping.ts`, `export-ia.ts` (texte et JSON, jours choisis, pour 2 personnes) ; test : l'export ne contient jamais nom, poids, poids cible, IMC, dépistage, pathologie, objectif ou déficit, mode strict ; la personne 2 : 1200 kcal minimum | L5 | dev |
| **L7** Compléments et journal | N13 ; « J'ai mangé » ; alertes caféine | L1 | dev |
| **L8** Phase 6 et finitions | partage minimal, RLS et tests d'accès, export / suppression, page crédits (Ciqual), captures 375x667 et 430x932, liste iPhone, rapport de bilan | L1 à L7, phase 6 | dev, relecteur (contrôle de sécurité unique du chantier) |

Livraisons conseillées : L0+L1, puis L2, L3, (L4 en parallèle dès L0, car ne touche pas au code de l'app), L5+L6, L7, L8. Avant chaque lot : relecture de ce document ; le chantier **ne touche ni `src/generator`, ni `src/zones`, ni `src/session`** (lecture seule des séances et du programme via les fonctions existantes).

## 13. Tests à prévoir

- **Propriétés** (Vitest, graine fixe, `fast-check` si déjà présent, sinon boucles) : la moyenne hebdomadaire des kcal par jour égale la cible ; aucun jour sous le plancher ; aucune cible pour un profil « Repères seulement » ; jamais de perte visée au-dessus du plafond ; le recalage ne dépasse jamais `AJUSTEMENT_MAX` ; lissage borné.
- **Allergènes (exhaustif)** : pour chacun des 14 allergènes et chacune des paires, aucun plan généré (20 graines) ne contient une recette ou un substitut qui le contient ; une recette avec un ingrédient `inconnu` n'est jamais choisie ; couverture minimale par type de repas.
- **Plan** : variété (même recette ≤ 1 fois par semaine, ≥ 4 protéines principales) ; toutes les cases remplies ou vides avec message ; macros dans la tolérance.
- **Courbe** : cas limites (une seule pesée, semaines manquantes, pesée non représentative, unités).
- **Liste de courses** : somme exacte, arrondi jamais inférieur, substitutions suivies.
- **Écrans** : captures WebKit 375x667 et 430x932 (zones tactiles ≥ 44 px, saisie 16 px, mode sombre) puis liste à vérifier sur l'iPhone (`docs/tests-iphone.md`).
- Le contrôle automatique tourne **une fois** avant l'envoi (règle CLAUDE.md).

## 14. Hors périmètre de la v1 (idées gardées dans `docs/idees-fonctionnalites.md`)

Photos de plats, scan de codes-barres (Open Food Facts), journal de calories détaillé, prix et enseignes, courses en ligne, recettes générées par IA, suivi des micronutriments, mesure du tour de taille / masse grasse, notifications push, partage de recettes entre amis.

## 15. Décisions de préférence d'usage (réponses de l'utilisateur, 13/11/2026)

| # | Décision |
|---|---|
| Q1 | Pas de 6e onglet ; carte sur l'Accueil ; **entrée Nutrition en tête de la Bibliothèque**. |
| Q2 | Variation des protéines : pas tout le temps, de temps en temps (1 à 2 jours par semaine) ; glucides variés chaque jour (§6.3). |
| Q3 | Jour de pesée choisi par la personne, rappel dans l'app, samedi ou dimanche matin par défaut. |
| Q4 | Poids visible sur l'Accueil : **oui** (poids lissé et phrase de tendance, désactivable dans N14 ; réponse « oui » prise à la lettre, à confirmer si l'intention était l'inverse). |
| Q5 | Semaine entière à la demande, « Aujourd'hui » proposé d'abord. |
| Q6 | Journal : coche « J'ai mangé » en v1, saisie libre d'aliments plus tard. |
| Q7 | Cuisiner pour 2 en v1 : oui (N5, N15). |
| Q8 | Sexe et année de naissance facultatifs : oui. |
| Q9 | Plancher de calories **personnalisé** (objectif, poids, âge, sexe), pas un chiffre fixe ; filet de sécurité conservé (règles C). |
| Q10 | Recettes originales (liste assez grande, 150 minimum) ; pas d'Open Food Facts ni de Wikibooks. |
| Nouveau | Export des courses, repas et recettes pour des jours choisis, pour 2 personnes et pour une IA externe (N15, lot L6). |
