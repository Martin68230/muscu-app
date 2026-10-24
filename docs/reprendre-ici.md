# Reprendre ici (24/10/2026, 10 h 47)

Arrêt volontaire : quota 5 h à 79 % au début de la conversation (seuil d'arrêt 85 %). Remise à zéro vers 12 h 20.

## Fait
- Tâche de fond : 5 processus `python3 -` orphelins (lancés par d'anciennes commandes bash, du 22/10 au 23/10 20 h 34), qui tournaient à vide et consommaient du processeur. Leur arrêt a été refusé par la sécurité de l'outil : à arrêter à la main (voir plus bas).
- Lot A.1 : « 1 faites » → « 1 faite » (src/session/summary-texts.ts, test dans summary-core.test.ts).
- Constat pour A.3 : le programme se régénère déjà tout seul quand le matériel change (empreinte `inputsHash` dans src/session/program.ts, qui inclut le matériel et les poids). L'ancien programme est désactivé mais gardé (l'historique s'y réfère). Il manque : le message « Ton matériel a changé : ton programme a été mis à jour », la vérification que la séance en cours n'est pas touchée, et les tests.

## À faire, dans l'ordre
1. Lot A.2 : haltères réglables/fixes → boutons rapides + champ « autre poids » + pastilles retirables (src/ui/screens/Equipment.tsx l. 42).
2. Lot A.3 : message, séance en cours protégée, tests ; vérifier que chaque matériel a au moins une variante (sinon QUESTIONS.md pour coach) ; roue abdominale réservée aux niveaux avancés.
3. Commit lot A, bilan 5 lignes, captures.
4. Lot C, puis lot B (donner l'état des objectifs et le coût AVANT), puis F7.
