# D23 vague 1 : jeu de données hasaneyldrm (30/10/2026)

**Source** : github.com/hasaneyldrm/exercises-dataset, commit `7455efae41b330c265e7cd4b78dfa848e7ce5ebd`. Texte sous licence MIT ; médias (images, GIF) propriété de Gym visual : NON téléchargés, NON utilisés (D22 non décidé).
**Téléchargé** (autorisation de l'utilisateur du 30/10/2026) : 4 fichiers texte seulement (`data/exercises.json`, `data/exercises.schema.json`, `LICENSE`, `NOTICE.md`), rangés avec le fichier COMMIT.txt dans `Documents/Appli muscu/donnees-externes/hasaneyldrm/`, HORS du dépôt. Aucun code n'a été exécuté ; les fichiers ne sont lus que par des scripts écrits par nous.

## Contrôle de sécurité (tools/hasan-controle.mjs)
1324 fiches lues, schéma respecté partout (champs, formats, doublons, énumérations). Aucune adresse web (hors l'attribution Gym visual attendue), aucune commande, aucun texte qui s'adresse à un agent. 2 faux positifs examinés et écartés : l'exercice « curl » (mot de commande) et « Renvoie tes pieds » (burpee, fr). Seul écart : **2 363 espaces de largeur nulle (U+200B)** dans les langues tr (2 249), it (72), hi (22), ru (18), zh (2) ; aucun dans le nom, le muscle ciblé, le matériel ni les textes fr / en / es. Rien n'a été corrigé : ces langues ne sont pas utilisées.

## Table de correspondance (tools/hasan-rapprochement.mjs, knowledge/exercices/CORRESPONDANCE-GYMVISUAL.tsv)
Le script lit seulement name, target, secondary_muscles, equipment, body_part, id, media_id, gif_url. Il normalise les noms (anglais vers français, sans accents, mots vides, pluriels), compare nom, muscle ciblé, matériel et schéma. « Validé » exige le même mouvement mot pour mot, le même muscle, un matériel couvert par une de nos variantes et le même schéma.
Revue du coach (jugement NON SOURCÉ, doute = pas de GIF) dans CORRESPONDANCE-REVUE-coach.tsv, qui l'emporte sur le score. Résultat : **33 validé, 26 à relire, 1 265 sans équivalent** (sur 1 324). 42 de nos 194 fiches ont au moins une correspondance.
Cas incertains laissés « à relire » : 0814 (dips banc ou barres), 0655 / 0656 (pompe sur ballon), 0361 / 0360 (développé un bras), 0292 (rowing un bras), 0042 (front squat, deux prises).
L'import futur (D22) lira les identifiants dans le ZIP de l'utilisateur et appliquera cette table ; un identifiant absent du ZIP laisse l'exercice sans GIF. Aucun rapprochement de noms dans l'app.
Les textes d'instructions français de Hasan n'ont PAS été lus ni copiés (brouillon seulement, plus tard, réécrits selon la fiche modèle D18 et relus).
