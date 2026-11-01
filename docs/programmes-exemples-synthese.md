# Les 6 programmes d'exemple : synthèse (générateur v1.8, 01/11/2026)

Détail complet : docs/programmes-exemples.md. Rédigée par `coach`, contrôlée par `relecteur` (valide sous réserve ; écarts corrigés ; rapport : docs/programmes-exemples-relecteur.md). Le profil 6 reste « non valide » côté relecteur tant que la correction complète du point bloquant n'est pas faite (une mesure provisoire est en place).

## À corriger avant tout

**Point bloquant pour le profil 6** (confirmé par le relecteur). Deux exercices avancés recevaient la dose standard alors que leur fiche dit qu'aucune dose n'est sourcée :
- **Nordique des ischios** (« remontée sans les mains ») : générée en 3 x 10-15 à 1 répétition de l'échec ; la fiche demande « volume faible au départ ». Risque de claquage et de grosses courbatures.
- **Pompe en équilibre contre un mur** (presque à la verticale, tête en bas) : générée en 3 x 10-15 à 1 répétition de l'échec, sans pouvoir vérifier que la personne maîtrise la pompe piquée.

État : une mesure PROVISOIRE est en place (2 séries maximum et au moins 2 répétitions en réserve, `DOSE_LIMITS`) ; le programme régénéré montre bien 2 x 10-15 à RIR 2 pour ces deux exercices. Elle ne limite pas les répétitions (10-15 restent irréalistes) et ne bloque pas l'échelon « presque vertical » de la pompe : il faut un plafond de répétitions, du code, et les valeurs du coach et du kiné. Coût : faible à moyen. À arbitrer aussi par le kiné : trois autres exercices à 1 répétition en réserve dans le profil 6 (montée sur box haute, poussée de hanches une jambe en LEGS-B, incohérence entre deux fiches de hip thrust).

## Les 6 profils

**1. Débutant, muscle, 3 jours, maison (haltères + élastique).** Lundi / mercredi / vendredi, corps entier, 40-45 min, 8 exercices en 2 séries. Fait : un programme simple, complet, très prudent (2 x 10-12, 3 répétitions en réserve). Fort : les 3 séances sont différentes (1 exercice en commun sur 7). Faible : peu de poussée verticale et de tirage vertical, le même développé d'épaules assis revient dans B et C.

**2. Intermédiaire, force, 4 jours, salle (haut / bas).** Lundi / mardi / jeudi / vendredi, 35-40 min au lieu des 60 demandées. Fort : 1 seul exercice en commun entre séances du même type, un exercice lourd (3 x 4-6, repos 3 min) en tête de 3 séances sur 4, mollets travaillés (montée sur pointes assis avec un haltère), presque tous les élastiques de la maison retirés par le filtre salle. Faible : le reste est en 2 x 8-15 (le soulevé de terre est en 2 x 8-12), et le tirage vertical à un bras à l'élastique « (à la maison) » revient en HAUT-A et HAUT-B (seul élastique restant) : c'est la fiche du lot 11 réadmise par l'exception de pénurie de la règle salle, faute de tirage vertical sans élastique.

**3. Intermédiaire, perte de gras + cardio, 3 jours, maison.** Lundi / mercredi / vendredi 45 min + 30 min de marche le dimanche, ajoutée par défaut (message affiché, tu peux la retirer). Fort : séances variées (0 exercice en commun), volumes solides (3 x 8-12). Faible : c'est le programme de prise de muscle, un seul cardio de 30 min contre 150 min visées par l'OMS (le message le dit), et le texte dit encore « cardio retiré » alors qu'il est là.

**4. Intermédiaire, volley, 3 jours, maison (élastique + chaise).** Lundi / mercredi / vendredi 35-40 min + « cardio sport » le dimanche. Fort : seul profil avec des supersets (2 paires dans la séance B). Faible : la séance de sport est une simple marche de 30 min, aucun saut, du travail d'épaules classique (développés à l'élastique, tirage au visage) mais rien de propre au volley (stabilité d'épaule, chevilles, réception) ; doses de débutant (2 x 10-15) ; tirage au visage et tirage vertical répétés.

**5. Débutant, sans matériel, 3 jours.** Lundi / mercredi / vendredi 40 min. Fort : sûr et honnête (messages sur ce qui manque, conseil d'achat : un élastique avec ancrage de porte). Faible : pompe au mur 3 fois par semaine, sans progression, et le dos n'est travaillé que par des mouvements très légers (serviette, serrage des omoplates).

**6. Avancé, 5 jours, salle.** Haut / bas / push / pull / legs, 30 à 50 min au lieu des 75 demandées. Fort : volume cohérent, élastiques retirés. Faible : PUSH et PULL à 4 exercices, aucun biceps, triceps, épaules latérales (pourtant annoncés dans le texte), la même fiche de traction deux fois dans PULL-B (gilet lesté puis barre), et semaine 2 presque identique à la semaine 1 (1 accessoire change).

## Ce que tu as demandé et qui n'est pas encore là

Isolation (biceps, triceps, épaules latérales ; les mollets sont travaillés au profil 2) : seule existe une liste fermée pour certaines séances ; `isoEligible` n'est pas étendu aux séances haut / push / pull / legs des intermédiaires et avancés, donc le profil 6 n'en reçoit aucune (D33-bilan §6) : ce n'est pas « codé », contrairement à ce qu'on a pu croire. Temps gagné réinvesti, sauts pour le volley et programme par sport : décidés le 31/10 (D33), pas encore codés. L'échauffement et le retour au calme sont identiques partout.

## Ce que je te recommande de trancher

1. **Valider la correction de sécurité complète** (plafond de répétitions, échelon de la pompe, RIR 1 de LEGS-B) en plus de la mesure provisoire déjà en place. Coût : faible à moyen (un nouveau champ de plafond et du code, pas seulement de la configuration).
2. **Étendre l'isolation (`isoEligible`) et réinvestir le temps gagné** : c'est ce qui rend les profils 2 et 6 plus complets et remplit les séances trop courtes. Coût : faible à moyen. Déjà décidé, il reste à lancer.
3. **Sauts et volet « sport » pour le volley** : aujourd'hui le volleyeur marche 30 min le dimanche. Coût : moyen à élevé (contenu sourcé, coach + kiné + relecteur). Déjà décidé, à planifier.
4. **Salle : déduire « j'ai accès à une salle » du lieu « salle » dans l'appli** (la case est cochée mais le filtre exige le réglage). Les exemples l'ont maintenant activé. Coût : faible, ta décision. Les sangles de suspension restent proposées en salle.
5. **Perte de gras : un vrai programme dédié, avec 2 séances de cardio quand le niveau le permet** et un texte corrigé. Coût : moyen, ta décision.
