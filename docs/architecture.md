# Architecture et limites vérifiées (21/10/2026, à revérifier)
## Choix
- App : PWA statique sur GitHub Pages (dépôt public ; ~100 Go/mois en limite douce ; site <= 1 Go). Netlify gratuit récent (300 crédits/mois, ~15 par déploiement) déconseillé en développement.
- **Local d'abord** : toutes les données dans le téléphone (IndexedDB) dès la phase 0, avec un modèle prévu pour la synchronisation (identifiants stables, dates de modification, suppression logique). Supabase vient s'y brancher plus tard sans tout refaire.
- Données en ligne : Supabase gratuit (500 Mo, 5 Go de transfert, 50 000 utilisateurs actifs/mois ; pause après ~7 jours de faible activité, restaurable 90 jours ; aucune sauvegarde sur le plan gratuit). Région européenne. Ping de maintien : tâche GitHub Actions (vérifier la désactivation des tâches sur les dépôts inactifs).
- Taille : ~30 Mo/an pour 10 personnes (estimation, à mesurer). Identifiants plutôt que noms.
- Bibliothèque d'exercices et table Ciqual : fichiers statiques de l'app, pas dans la base.

## Emails de connexion (vérifié dans la doc Supabase)
Le service email intégré est limité à **2 messages/heure** et n'envoie **qu'aux adresses membres de l'équipe du projet** ; il est prévu pour les tests. -> Pour inviter des amis : configurer un SMTP externe gratuit (fournisseur à choisir ; vérifier ses quotas gratuits) ; la limite passe alors par défaut à 30 messages/heure. https://supabase.com/docs/guides/auth/auth-smtp

## Limites iPhone (PWA)
- Pas d'exécution en arrière-plan ; pas de notification locale programmée ; l'envoi de notifications push demande un serveur (Supabase Edge Functions : option tardive) et l'app installée sur l'écran d'accueil. => **Pendant une séance, l'écran reste allumé** (Wake Lock, à tester) et le minuteur se recalcule sur l'heure réelle au retour. Le son doit être « débloqué » par un premier appui de l'utilisateur au début de la séance ; vibration non garantie sur iPhone (à tester).
- Stockage purgeable si l'app n'est pas installée : demander l'installation, export JSON, synchronisation.

## Estimations affichées
- **Calories** : MET x poids x durée, avec les valeurs du 2024 Adult Compendium of Physical Activities (J Sport Health Sci, 2024 ; https://pubmed.ncbi.nlm.nih.gov/38242596/ ; texte non ouvert ici : PROVISOIRE). Toujours affichées comme estimation (« ~150 kcal »).
- **Carte des muscles** : dessin SVG libre ; piste : react-body-highlighter (licence MIT, composant React, polygones adaptés de react-native-body-highlighter : vérifier la licence du projet d'origine avant usage) https://github.com/giavinh79/react-body-highlighter : PROVISOIRE. Les % viennent des muscles principaux/secondaires de chaque variante (pondération à définir).

## Données personnelles (RGPD, même entre amis)
Poids, mensurations, blessures = données de santé. Collecter le minimum ; tout est privé par défaut ; partage choisi champ par champ (séances oui/non, poids jamais par défaut) ; bouton « supprimer mon compte et mes données » ; export JSON ; pas de traceur, pas de pub ; clé IA jamais envoyée au serveur.

## IA (optionnelle)
Clé perso dans le navigateur ; vérifier pour chaque fournisseur que l'appel direct depuis le navigateur est autorisé (CORS) et ses conditions d'usage des données ; mode « prompt copier-coller » = le plus privé.
