# Audit de cohérence des fiches (13/11/2026)
Retours iPhone du 13/11. Méthode : script sur `public/data/fiches.json` (nom de variante / installation / consignes / tags / illustration) pour les 61 fiches à élastique ou haltères ; relu à la main. Rien d'inventé.

## 1. Élastique « devant » au lieu de « dans le dos » (illustrations)
- `ecarte-sol-elastique` : l'élastique était tendu entre les deux mains, devant le torse. Corrigé (tools/illustrations-poses.mjs) : élastique dessiné derrière le dos (couche arrière), visible des mains aux côtés du corps.
- `developpe-sol-elastique` : l'élastique passait devant le bras et le torse. Corrigé : couche arrière, il sort de sous le haut du dos.
- Autres fiches de poussée horizontale à l'élastique : aucune (pas de pompe ni de presse à l'élastique).

## 2. Nom / consigne incohérents
- `ecarte-sol-elastique` (cause du retour « option debout, explication au sol ») : la fiche est nommée « sol », les options sont « Élastique dans le dos, debout », « Couché au sol, haltères » et « ancré en haut d'une porte », mais les consignes 1 et 3 mélangeaient « au sol » et « debout » sans dire laquelle va avec quoi. Consignes réécrites (debout : élastique ; couché au sol : haltères). Id inchangé (interne).
- Autres cas cherchés par script (position du nom de variante, de l'installation et des consignes ; mot matériel du nom sans tag) : aucune autre contradiction de texte ; les écarts restants sont des consignes communes à plusieurs positions, déjà formulées « debout ou assis ».

## 3. À voir par le coach (variantes qui manquent ou illustration d'une seule variante)
- Illustration d'une seule variante pour toute la fiche : `ecarte-sol-elastique` (debout, mais une variante au sol avec haltères), `developpe-epaules-elastique` et `curl-elastique` (debout, variantes assis), `tirage-vertical-un-bras-elastique` (debout, variante assis). Pas d'erreur de texte ; image seulement.
- Variante manquante à décider (non inventée) : écarté pectoraux aux haltères SUR BANC (la fiche n'a que « au sol » et « élastique ») ; développé poitrine à l'élastique sur banc ; développé épaules haltères sur banc avec dossier (seule `developpe-epaules-assis-dossier-incline` le fait).
- Mini-bande listée « élastique » dans les tags de matériel (abduction, extension de hanche) : voulu (tag `mini_bande`), à garder distinct de `elastique`.

## 4. Séries par côté
- Cause : 52 variantes dont la consigne dit « toutes les répétitions d'un côté, puis de l'autre » (abduction, adduction, montées sur marche, rotation externe, pallof, curl ischios élastique, extension genou / hanche…) n'étaient pas reconnues comme « un côté à la fois » (détection par mots du nom de variante). Liste `PER_SIDE_VARIANT_IDS` (src/generator/config.ts) : elles se jouent maintenant par côté (gauche puis droite). Elles ne deviennent PAS « unilatérales » pour le générateur : doses, choix des variantes (débutant), réserve et plancher inchangés ; empreinte de non-régression inchangée.
- Affichage : aperçu « 3 séries × 12 répétitions de chaque côté (gauche puis droite) · repos 1 min » ; lecteur « Série 1 sur 3 · côté gauche », règle « Une série = les deux côtés : gauche, puis droite. », cible « 12 répétitions de chaque côté ».
- Limite connue : les durées estimées d'une séance ne comptent pas le doublement pour ces 52 variantes (pas de changement du générateur) ; à trancher par le coach (voir docs/decisions-prises.md).
- Hors liste volontairement : alternés dans la série (bird-dog, dead-bug, planche touche-épaule, rotation russe), marche latérale, étirements, mobilité, cou (directions).
