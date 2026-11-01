# Revue des cases de sécurité « variante » hors fiche (1er novembre 2026)

Rédigé par un agent de rédaction à partir du contrôle `variante-securite` de `tools/validate-fiches.mjs` : 67 cases (26 couples « fiche>variante ») visaient, avec `adapter: variante:<id>`, un id qui n'est pas une variante de la même fiche. **Précision (relecteur, 1er novembre 2026)** : ces cases n'étaient pas ignorées : `applyAdapters` les traitait comme un remplacement (`tryReplacement`) et la fiche était retirée si la cible était refusée. Les corrections rendent donc la donnée **valide et honnête** (cible déclarée `remplacant:`, ou `retirer` seul quand la cible est refusée) ; le comportement réel est **quasi inchangé** (seul le niveau 1 se resserre : adapter vers retirer). Contrôle du `relecteur` fait (valide sous réserve : `docs/revue-cases-variante-securite-relecteur.md`) ; kiné : confirmé.

## Méthode et règles appliquées
- Types : **a** = variante plus douce propre à la fiche (aucune trouvée : aucune des fiches n'avait de variante propre plus douce que celle visée) ; **b** = `retirer: remplacant:<id>` vers une fiche ou variante existante, utilisable, de même famille de schéma, non adaptée ni retirée pour la même zone au même niveau (§0) ; **c** = adaptation propre (`amplitude:`, `charge:`, `appui:`) : aucune retenue, car une seule action par case aurait été moins protectrice que l'intention ; **d** = `retirer` sans remplaçant (cible adaptée pour la même zone au même niveau, ou doute).
- Aucune case n'est devenue moins protectrice : toutes les anciennes cases `adapter` sont devenues `retirer` (avec ou sans remplaçant). Les 32 cases dont le remplaçant était refusé par le générateur (cible adaptée pour la zone et le niveau actifs, y compris sa propre variante de destination) sont écrites en `retirer` seul : le comportement réel ne change pas, la donnée ne promet plus un remplaçant jamais proposé.
- Une cible dont la ligne pour la zone et le niveau actifs n'est pas `garder` est refusée par `tryReplacement` (hors cas Grossesse) : la case est alors écrite en `retirer` seul. Les cases `retirer: remplacant:` restantes visent des cibles dont la ligne est `garder` ou absente pour la zone et le niveau.
- Cohérence « niveau 2 pas plus permissif que niveau 1 » vérifiée par le validateur.
- Notes affichées `<zone>-n<niveau>` réécrites pour décrire la vraie adaptation (sans id interne, sans « mi-course » ni « avant-bras » dans les textes ajoutés). Les nouvelles valeurs sont toutes **NON SOURCÉ** (règles R1 à R3, choix prudent de `kine` à valider).
- `VARIANTES-SECURITE-A-CORRIGER.json` : liste vidée (`ecarts: []`).

### fente-arriere

Fichier : `pilote/fente-arriere.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n2 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Hanche | n2 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cheville | n2 | `adapter: variante:squat-fendu-mur` | `retirer: remplacant:squat-assis-debout` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-assis-debout existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |

### planche-touche-epaule

Fichier : `pilote/planche-touche-epaule.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n2 | `adapter: variante:planche-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |

### pompe-archer

Fichier : `pilote/pompe-archer.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n1 | `adapter: variante:pompe-ecartee-sol` | `retirer: remplacant:pompe-ecartee` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible pompe-ecartee existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Dos | n2 | `retirer: remplacant:pompe-chaise` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | non (case déjà `retirer: remplacant:` dans la version précédente ; réécrite en `retirer` seul, aucune protection modifiée) |

### pompe-diamant

Fichier : `pilote/pompe-diamant.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n2 | `adapter: variante:pompe-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |

### pompe-ecartee

Fichier : `pilote/pompe-ecartee.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Coude | n2 | `adapter: variante:pompe-chaise` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Poignet | n2 | `adapter: variante:pompe-chaise` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Dos | n2 | `adapter: variante:pompe-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Grossesse | - | `adapter: variante:pompe-chaise` | `retirer: remplacant:pompe-chaise` | b | Grossesse : adapter vers retirer avec remplaçant `pompe-chaise` (même résultat pratique, case valide) ; cible conforme à la règle du remplaçant adapté en grossesse (§0). | NON SOURCÉ | CONFIRMÉ : cible live (ligne Grossesse de la cible garder ou adapter), même résultat que l'ancienne case. |

### pompe-piquee-pieds-sureleves

Fichier : `pilote/pompe-piquee-pieds-sureleves.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Épaule | n1 | `adapter: variante:pompe-piquee` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Épaule | n2 | `retirer: remplacant:pompe-chaise` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | non (case déjà `retirer: remplacant:` dans la version précédente ; réécrite en `retirer` seul, aucune protection modifiée) |
| Coude | n2 | `adapter: variante:pompe-piquee` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Poignet | n1 | `adapter: variante:pompe-piquee` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cou | n1 | `adapter: variante:pompe-piquee` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |

### porte-valise

Fichier : `pilote/porte-valise.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n2 | `adapter: variante:marche-du-fermier` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |

### rowing-buste-penche-halteres

Fichier : `pilote/rowing-buste-penche-halteres.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n1 | `adapter: variante:rowing-unilateral-haltere` | `retirer: remplacant:rowing-unilateral-haltere` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible rowing-unilateral-haltere existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Dos | n2 | `adapter: variante:rowing-unilateral-haltere` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Hanche | n2 | `adapter: variante:rowing-unilateral-haltere` | `retirer: remplacant:rowing-unilateral-haltere` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible rowing-unilateral-haltere existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Grossesse | - | `adapter: variante:rowing-unilateral-haltere` | `retirer: remplacant:rowing-unilateral-haltere` | b | Grossesse : adapter vers retirer avec remplaçant `rowing-unilateral-haltere` (même résultat pratique, case valide) ; cible conforme à la règle du remplaçant adapté en grossesse (§0). | NON SOURCÉ | CONFIRMÉ : cible live (ligne Grossesse de la cible garder ou adapter), même résultat que l'ancienne case. |

### souleve-de-terre-roumain-halteres

Fichier : `pilote/souleve-de-terre-roumain-halteres.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n2 | `adapter: variante:pont-fessier-sol` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Coude | n2 | `adapter: variante:pont-fessier-sol` | `retirer: remplacant:pont-fessier-sol` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible pont-fessier-sol existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Poignet | n2 | `adapter: variante:pont-fessier-sol` | `retirer: remplacant:pont-fessier-sol` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible pont-fessier-sol existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |

### souleve-de-terre-roumain-unijambiste

Fichier : `pilote/souleve-de-terre-roumain-unijambiste.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Hanche | n2 | `adapter: variante:souleve-de-terre-roumain-halteres` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Genou | n2 | `adapter: variante:souleve-de-terre-roumain-halteres` | `retirer: remplacant:souleve-de-terre-roumain-halteres` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible souleve-de-terre-roumain-halteres existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Cheville | n2 | `adapter: variante:souleve-de-terre-roumain-halteres` | `retirer: remplacant:souleve-de-terre-roumain-halteres` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible souleve-de-terre-roumain-halteres existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |

### squat-bulgare

Fichier : `pilote/squat-bulgare.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n2 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Hanche | n2 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cheville | n2 | `adapter: variante:squat-fendu-mur` | `retirer: remplacant:squat-assis-debout` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-assis-debout existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |

### squat-fendu

Fichier : `pilote/squat-fendu.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Cheville | n2 | `adapter: variante:squat-assis-debout` | `retirer: remplacant:squat-assis-debout` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-assis-debout existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |

### squat-gobelet

Fichier : `pilote/squat-gobelet.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n2 | `adapter: variante:squat-poids-du-corps` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Hanche | n2 | `adapter: variante:squat-poids-du-corps` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Dos | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Coude | n2 | `adapter: variante:squat-poids-du-corps` | `retirer: remplacant:squat-poids-du-corps` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-poids-du-corps existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Poignet | n2 | `adapter: variante:squat-poids-du-corps` | `retirer: remplacant:squat-poids-du-corps` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-poids-du-corps existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |

### squat-poids-du-corps

Fichier : `pilote/squat-poids-du-corps.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Hanche | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Dos | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Cheville | n2 | `adapter: variante:squat-assis-debout` | `retirer: remplacant:squat-assis-debout` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-assis-debout existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |

### bird-dog-pause

Fichier : `vague1/lot-01/bird-dog-pause.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n1 | `adapter: variante:bird-dog` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Dos | n2 | `adapter: variante:bird-dog-jambe-seule` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Hanche | n2 | `adapter: variante:bird-dog` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |

### planche-bras-jambe-leves

Fichier : `vague1/lot-01/planche-bras-jambe-leves.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Coude | n2 | `adapter: variante:planche-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cou | n2 | `adapter: variante:planche-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |

### planche-laterale-jambe-levee

Fichier : `vague1/lot-01/planche-laterale-jambe-levee.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Épaule | n1 | `adapter: variante:planche-laterale-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Hanche | n2 | `adapter: variante:planche-laterale-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Coude | n2 | `adapter: variante:planche-laterale-genoux` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |

### fente-avant

Fichier : `vague1/lot-02/fente-avant.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n1 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Genou | n2 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Hanche | n2 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cheville | n1 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cheville | n2 | `adapter: variante:squat-assis-debout` | `retirer: remplacant:squat-assis-debout` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-assis-debout existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Dos | n2 | `adapter: variante:squat-fendu-mur` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Grossesse | - | `adapter: variante:squat-fendu-mur` | `retirer: remplacant:squat-fendu-mur` | b | Grossesse : adapter vers retirer avec remplaçant `squat-fendu-mur` (même résultat pratique, case valide) ; cible conforme à la règle du remplaçant adapté en grossesse (§0). | NON SOURCÉ | CONFIRMÉ : cible live (ligne Grossesse de la cible garder ou adapter), même résultat que l'ancienne case. |

### fente-laterale

Fichier : `vague1/lot-02/fente-laterale.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Cheville | n2 | `adapter: variante:squat-assis-debout` | `retirer: remplacant:squat-assis-debout` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-assis-debout existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Dos | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Cuisse | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |

### squat-sumo

Fichier : `vague1/lot-02/squat-sumo.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Hanche | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Dos | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |
| Cheville | n2 | `adapter: variante:squat-assis-debout` | `retirer: remplacant:squat-assis-debout` | b | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible squat-assis-debout existe, est utilisable, de même famille de schéma et passe le filtre de la zone : remplaçant vivant. Case au moins aussi protectrice (adapter vers retirer avec remplaçant). | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant actif. |
| Aine | n2 | `adapter: variante:squat-assis-debout` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ : retrait sans remplaçant (§0 : un remplaçant adapté par la même zone et le même niveau n'est jamais proposé) ; la famille reste servie par les autres fiches du même schéma. |

### montee-sur-banc

Fichier : `vague1/lot-05-banc/montee-sur-banc.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Genou | n1 | `adapter: variante:montee-sur-marche-poids-du-corps` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Hanche | n1 | `adapter: variante:montee-sur-marche-poids-du-corps` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Hanche | n2 | `adapter: variante:montee-sur-marche-poids-du-corps` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cheville | n1 | `adapter: variante:montee-sur-marche-poids-du-corps` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Cheville | n2 | `adapter: appui:main-sur-support` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. Case du niveau 2 aussi durcie (appui:main-sur-support vers retirer) pour garder la règle « niveau 2 pas plus permissif que niveau 1 », le niveau 1 devenant retirer. | NON SOURCÉ | CONFIRMÉ : n2 retirer plus protecteur que l'ancien appui, cohérent avec n1. |

### souleve-de-terre-sumo-barre

Fichier : `vague1/lot-07-barre/souleve-de-terre-sumo-barre.md`

| zone | niveau | case avant | case après | type | raison | statut | à confirmer par le kiné |
|---|---|---|---|---|---|---|---|
| Dos | n1 | `adapter: variante:souleve-de-terre-barre-rack` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | CONFIRMÉ (survol) ; remplaçant mort : la cible est adaptée pour cette zone et ce niveau, effet réel = retrait (voir rapport). |
| Dos | n2 | `retirer: remplacant:souleve-de-terre-roumain-halteres` | `retirer` | d | Ancienne case traitée comme remplacement ; retrait si la cible est refusée. La cible visée est refusée par le générateur pour cette zone et ce niveau (ou la fiche n'a pas de remplaçant valable) : case réécrite en `retirer` seul, donnée honnête, comportement réel quasi inchangé. | NON SOURCÉ | non (case déjà `retirer: remplacant:` dans la version précédente ; réécrite en `retirer` seul, aucune protection modifiée) |

## Bilan

Cases modifiées : 71 lignes de tableau (type a : 0, type b : 19, type c : 0, type d : 52). Validateur : 207 fiches, 0 erreur, 0 avertissement.
