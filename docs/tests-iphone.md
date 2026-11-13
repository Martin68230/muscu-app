# Tests à faire sur l'iPhone (liste unique, 13/11/2026)

Avant de commencer : fermer l'app complètement (la glisser hors du sélecteur), la rouvrir, attendre 10 secondes, la fermer et la rouvrir une seconde fois. Profil, ligne « Version » en bas : elle doit afficher le dernier commit (voir `git log --oneline -1` ou l'onglet Actions de GitHub). Avant tout test qui écrit des données : Profil, exporter le JSON.

Une case = un test. « Source » = le document où la fonctionnalité est décrite.

## A. Programme et séances (le plus important)
| Test | Source |
|---|---|
| Un programme 4 à 6 jours (haut / bas ou push / pull / legs) se régénère au lancement (version du générateur v1.9) ; PULL a bien un curl, PUSH 5 exercices avec une pompe facile au mur | docs/D24-kaggle-muscles.md, knowledge/calibrage-kaggle.md (CAL-11) |
| Le cou n'apparaît plus qu'en séances BAS et LEGS, jamais avec des exercices lourds d'épaules / trapèzes | knowledge/calibrage-kaggle.md (CAL-12), docs/reprendre-ici.md (« COU DÉBUTANT ACTIVÉ ») |
| Cou : question de dépistage dans Profil lisible (375 et 430 px) ; message d'arrêt sous la série dans le lecteur ; après un malaise ou une douleur sur le cou, il n'apparaît plus au programme suivant | docs/reprendre-ici.md (cou) |
| Fiches nouvelles : extension de genou et curl d'ischios élastiques, chaise murale (« Maintien dos au mur »), écarté au sol (« Écarté des pectoraux »), haussement d'épaules, adduction, extension de hanche, montée rapide chaise, good morning élastique, balancés de jambe, extension triceps au sol : illustration lisible, consigne claire | knowledge/exercices/vague2/lot-01 et lot-02 |
| Un débutant ne reçoit plus les dips sur banc ni le développé d'épaules debout | docs/decisions-prises.md (12/11/2026) |

## B. Aperçu et séance manquée
| Test | Source |
|---|---|
| « Voir la séance » : « À savoir (n) », « Reprise », « Repos » fermés, s'ouvrent d'un appui, lisibles en mode sombre | docs/decisions-prises.md (volets) |
| Fiche : « Adaptations pour toi (n) » replié | idem |
| Séance manquée avec un jour libre à 48 h : bouton « Décaler » à l'Accueil et dans l'aperçu ; sans jour libre : message « aucun jour libre » | knowledge/seance-manquee-v1.md (SM-5, SM-6) |
| Rattrapage : ligne « Cette séance : X remplace Y… » dans l'aperçu, fiche échangée en étalonnage dans le lecteur | docs/reprendre-ici.md (« ÉCHANGE D'EXERCICE ») |

## C. Créer une séance (D28)
| Test | Source |
|---|---|
| Accueil : bouton « Créer une séance » | knowledge/creer-seance-v1.md |
| Cas de référence : jambes, volley, élastique + chaise, 30 min, modérée. Répondre « non » à la question sur la chaise : aucun exercice sur chaise (échauffement et retour au calme compris) ; avec « oui » : montée rapide 2 x 6 par jambe | idem §6 |
| Faire maintenant : lecteur, question « jambes lourdes ? », consigne d'arrêt des sauts ; la séance se retrouve dans l'historique | idem |
| Ajouter au calendrier : le jour apparaît « Prévue », « Préparer cette séance » le jour venu | idem |
| Après une séance de jambes faite, un nouveau « jambes » est refusé (< 24 h) puis adouci | idem §3 |
| Grossesse déclarée : jambes et corps entier refusés avec un message ; haut du corps possible | idem §4 |
| Le programme et sa rotation ne bougent pas après une séance créée ; pas de proposition de charge au bilan | idem |

## D. Import et données
| Test | Source |
|---|---|
| Profil, « Importer depuis Hevy ou Strong » : choisir un vrai CSV (Fichiers) ; aperçu ; import ; dates au bon jour ; noms anglais pour la plupart non reconnus (normal) | docs/reprendre-ici.md (D19) |
| Les séances importées sont dans l'historique et le calendrier mais ne changent ni les charges proposées ni le planning | idem |
| « Supprimer les séances importées » puis réimport du même fichier : elles reviennent ; vos vraies séances sont intactes | idem |
| Export JSON puis import du même fichier : refus propre si le fichier est trop gros (> 20 Mo) ou abîmé ; un export récent s'importe | docs/decisions-prises.md (audit) |

## E. Déjà en ligne, jamais testés
| Test | Source |
|---|---|
| Carte des muscles : accueil (semaine, cycle), toucher d'une zone (nom + points), carte dans bilan et historique | docs/reprendre-ici.md (niveau 3) |
| Lecteur : chrono de durée, côtés gauche / droite, RIR obligatoire, reprise après fermeture | docs/reprendre-ici.md (niveaux 1-2) |
| Historique : filtres, détail, comparaison, courbe ; boutons Accepter / Plus tard du bilan | idem |
| Illustrations du lot 13, traction à un bras, message de substitut du profil 5 (poussée au mur) | idem |
| « Gagner du temps » : supersets visibles si le profil le permet (pas pour les débutants ni la grossesse) | knowledge/core-et-supersets.md |

## F. Mon sport et rattrapage (ajouté le 13/11/2026)
| Test | Source |
|---|---|
| Profil, « Mon sport » : déclarer un sport (volley, foot…), la fréquence, les jours habituels, le jour de match ; case « Mes séances sont souvent très dures » | knowledge/saisie-sport-v1.md §1, §8 |
| « Noter une séance de sport » (Accueil, Calendrier) : clavier numérique de la durée, sélecteur de date, 3 intensités, cases gêne / malaise ; le bouton « Enregistrer » ne masque pas la fin du formulaire | idem |
| Après un match noté : « Créer une séance » jambes refusée (< 24 h), sauts refusés sous 48 h ; la veille d'un match : jambes adoucies | idem §7 |
| 4 jours de sport habituels par semaine : le programme n'a plus de séance de jambes | idem §8 |
| Rattrapage : aucune série ajoutée après une séance manquée ; message « zone basse » après 2 semaines ; aucun rattrapage 7 jours après avoir levé une douleur | knowledge/zones-musculaires.md §7 |
| Grossesse : on peut noter une séance de sport, le texte dit « enregistrée, pas recommandée » | knowledge/saisie-sport-v1.md §7 |
| 11 nouvelles fiches (lot 3) : illustrations lisibles à 375 px, claires et sombres (nage au sol : 3 images) | knowledge/exercices/vague2/lot-03 |
