# Plan des fichiers (une ligne par dossier ou fichier clé) — 30/10/2026

À lire avant de chercher : évite d'explorer à chaque conversation. Chercher d'abord (Grep / Glob), lire seulement le passage utile.

## Pilotage
- `CLAUDE.md` : règles du projet (non négociables, façon de travailler). `docs/reprendre-ici.md` : état et prochaine action ; `docs/ou-on-en-est.md` : vue d'ensemble ; `docs/QUESTIONS*.md` : décisions en attente.
- `docs/plan-de-construction.md`, `cahier-des-charges.md`, `architecture.md`, `securite.md`, `deploiement-notes.md` : références. `docs/F*-bilan.md`, `D*-bilan.md`, `R2-retablissement.md` : bilans par fonctionnalité.
- `.github/workflows/deploy.yml` : tests, contrôles, build, déploiement GitHub Pages (docs/ n'y déclenche rien). `.claude/agents/` : coach, dev, kine, nutritionniste, relecteur.

## Contenu sport / santé (`knowledge/`, tout est sourcé ou marqué PROVISOIRE / NON SOURCÉ)
- `knowledge/README.md` : index. Règles : `program-logic.md`, `generateur-v1.md`, `core-et-supersets.md` (+ `famille-core-inventaire.md`), `cardio-regles.md`, `load-calibration.md`, `goal-resolver.md`, `schedule-adaptation.md` + `seance-manquee-v1.md`, `progression-et-bilan-v1.md`, `rest-and-volume-rules.md`, `sports.md`, `nutrition-rules.md`, `regles-securite-communes.md`.
- Matériel et schémas : `equipment-taxonomy.md`, `materiel-tags.json`, `taxonomie-schemas.md` (familles de schémas, règle des liens de progression). Format des fiches : `format-fiches.md`. Sources : `sources.md`. Contrôles indépendants : `CONTROLE-*.md`, `RECONTROLE-*.md`.
- `knowledge/exercices/` : fiches d'exercices (`pilote/`, `vague1/lot-XX/`, `ecartees/` ignoré), `CAMPAGNE.md`, `CHAINES-A-CORRIGER.json` (vide), `CORRESPONDANCE-GYMVISUAL.tsv` + `CORRESPONDANCE-REVUE-coach.tsv` (table D22, texte seulement). Brouillon : `exercise-library-draft.csv`.

## Code de l'app (`src/`, PWA React + TypeScript + IndexedDB)
- `src/generator/` : générateur de programme (index.ts, slots.ts, days.ts, config.ts = valeurs et statuts, duration.ts = supersets / durée, core.ts, cardio.ts, dose.ts, safety.ts, messages.ts).
- `src/session/` : lecteur de séance et historique (engine.ts, timer.ts, store.ts, progression*.ts, calendar.ts, missed*.ts = séance manquée, reprise-plan.ts, summary*.ts).
- `src/data/` : modèle, base locale, import / export, validation, profil, blessures (model.ts, db.ts, repo.ts, backup.ts, validate.ts, injury-rules.ts, fiches.ts). `src/ui/` : écrans et composants (screens/, session/, TabBar, MissedCard…). `src/app.tsx`, `main.tsx`, `styles.css`.

## Outils, tests, sorties
- `tools/` : `validate-fiches.mjs` (npm run check:fiches), `build-fiches.mjs` (npm run fiches → public/data/fiches.json, NON versionné), `check-securite.mjs`, `public-text.mjs`, `r2-retablir.mjs`, `hasan-controle.mjs` / `hasan-rapprochement.mjs` (jeu hasaneyldrm hors dépôt), `demo-generateur.mjs`, illustrations / photos / crédits.
- `tests/unit/` : Vitest (un fichier par sujet) ; `tests/screens/` : captures Playwright WebKit (iPhone SE 375x667, grand iPhone 430x932) ; `tests/fixtures/`.
- `public/` : icônes, illustrations, photos, données générées. `dist/` : build (ignoré). `screenshots/`, `test-results/` : sorties de tests.
- Données externes (HORS dépôt) : `../donnees-externes/hasaneyldrm/` (4 fichiers texte + COMMIT.txt).

## Commandes utiles
`npm run fiches` · `npx vitest run <fichier>` · `npm run check:fiches` · `npm run check:securite` · `npm test` · `npm run build`. Avant un push : rejeu dans un clone propre (CLAUDE.md, section C).
