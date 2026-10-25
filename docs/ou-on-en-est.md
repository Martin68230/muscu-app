# Où on en est par rapport au cahier des charges (25/10/2026)

Coûts estimés en % d'une fenêtre de 5 h (Sonnet, avec experts coach / kine / relecteur ; Opus pour les règles de sécurité). Estimations à partir des lots déjà faits ; un lot de ~15 fiches coûte 30 à 45 %.

| Morceau | État | Reste à faire | Coût estimé |
|---|---|---|---|
| Profil, matériel, objectifs multiples | Fait (poids en boutons, cardio, prise de muscle) | Rien | 0 |
| Générateur (corps entier 2-3 jours, cardio, charges fixes) | Fait pour 2-3 jours ; 4 à 6 jours non gérés (message clair) | Répartitions 4 (haut/bas) et 5-6 (push/pull/legs), objectifs combinés complets | 60 à 80 % (Opus) |
| Lecteur de séance, minuteurs, bilan, progression | Fait | Brancher le plan cardio de 4 semaines sur l'historique | 10 % |
| Historique, calendrier, régularité | Fait (F7) | Statut « reportée » jamais produit ; « prévues » est une estimation | voir séances manquées |
| Bibliothèque d'exercices | 192 fiches publiées (barre, ballons, gilet, sac, bosu faits) | Fiches corde, vélo, rameur, tapis (attend Q5, Q10) ; 5 vidéos à filmer (toi) | 30 % + 10 % (tags machine) |
| Réajustement des séances manquées + « reportée » | Règles écrites (schedule-adaptation.md, PROVISOIRE) ; rien dans le code | Valider les règles (coach, relecteur), moteur de replanification, écran de choix, tests | 30 à 40 % |
| Repas et compléments | Règles écrites (nutrition-rules.md, à valider par nutritionniste) ; rien dans le code | Valider les règles, base Ciqual, générateur de repas, préférences et allergies, compléments enregistrés avec alertes, sécurité (grossesse, mineur, troubles alimentaires) | 120 à 160 % (2 fenêtres) |
| Sports par familles + prévention | Règles écrites (sports.md) ; fiches de sport et de prévention faites (lot 02) ; objectif « sport » encore ramené vers « santé » | Programmes de sport dans le générateur (foot, danse, volley, raquettes), prévention FIFA 11+ / nordique / épaule | 45 à 60 % |
| IA facultative avec interrupteur global | Rien (case « IA » dans le profil prévue, désactivée) | Interrupteur, prompt à copier-coller, import JSON validé par schéma, clé personnelle stockée sur l'appareil, tests « IA coupée = rien de visible » | 35 à 45 % |
| Comptes et partage entre amis (phase 6) | Rien (tout est local) | Supabase UE, comptes sur invitation, demandes d'amis, partage par type de donnée, règles d'accès (RLS) sur toutes les tables, tests d'accès, synchronisation | 120 à 180 % (Opus pour RLS) |
| Audit de sécurité complet | Contrôles automatiques (secrets, XSS, dépendances) à chaque déploiement | Audit complet avant d'inviter des amis (obligatoire, D14) | 40 à 60 % (Opus) |
| Bouton « Signaler un problème » | Fait en local : enregistré sur le téléphone, export dans Profil, message « rien n'est envoyé » | Envoi vers un serveur seulement avec les comptes | 5 à 10 % après la phase 6 |
| Sauvegarde / export / import | Fait | Rien | 0 |
| Page crédits, vidéos, images | Faits | Vidéos à filmer (toi) | 0 |
| Déploiement | Vert depuis le #61 | Node 20 déprécié, ubuntu-latest vers Ubuntu 26 (docs/deploiement-notes.md) | 3 % |
