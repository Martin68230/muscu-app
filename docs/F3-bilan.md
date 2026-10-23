# F3 : générateur de programmes v1 (23/10/2026)
- Fait : src/generator/ (fonctions pures et déterministes, `generateProgram(input)`), valeurs non sourcées dans src/generator/config.ts (DÉFAUT-1 à DÉFAUT-5), 52 tests dont T1-T47 et 2 940 cas de propriétés (7 profils de matériel x maison/salle x 2-3 jours x 3 niveaux x 35 cas de santé).
- Contrôles : `npm test` 171 tests OK, `npx tsc --noEmit` propre, `npm run build` OK, `npm run check:fiches` 0 erreur.
- Programmes d'exemple (3 profils) : docs/generateur-demo.txt ; 21 choix prudents et ambiguïtés : docs/generateur-notes-dev.md.
- À trancher par coach : T41 3e cas (3 jours, seuls vendredi, samedi, dimanche libres) : le test attend « aucun programme », la règle §2.4 accepte vendredi + dimanche ; le code suit la règle (2 séances et V-MSG-JOURS).
- Pas d'interface (F4-F7). Quota : limite 5 h 7 % -> 23 %, semaine 30 % -> 33 % (conversation principale + agent Opus).
