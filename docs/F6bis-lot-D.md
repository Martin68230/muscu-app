# Lot D (matériel sans fiche), état au 24/10/2026 19 h 40
1. lot-07-barre (barre, disques, rack, barre EZ) : 18 fiches utilisables, 1 en attente (rowing-barre-ez, libellé à confirmer), 3 écartées (tirage menton, fentes marchées, fente barre) ; 5 vidéos à filmer (images-a-trouver/, Q19).
2. lot-08-ballons-roue (roue abdominale, ballon de gym, ballon lesté) : 15 fiches utilisables, 4 lancers en attente (classés piliers par le générateur : décision de coach), 1 écartée (développé haltères sur ballon).
3. Générateur : dosage fixe NON SOURCÉ pour lancers et gainage dynamique (FIXED_DOSE, Q23), rotation qui ne monte pas de niveau sous plafond.
4. Il reste : corde à sauter, lest, sac de sable, bosu, vélo/rameur/machine_cardio (lot-09, attention Q5-Q11) ; Q12-Q25 à décider par l'utilisateur.
5. Quota 5 h : 46 % -> 89 % pour ces deux lots (avec le déploiement réparé et B4 avant).

## Mise à jour 25/10/2026 (lot-09)
- lot-09-lest-sac-bosu : 15 fiches utilisables (gilet lesté x7, sac de sable x4, bosu x4), 2 écartées (pose du sac sur l'épaule : règle 23, Q29). Gilet = charge fixe non chargeable (FIXED_LOAD_TAGS) ; equilibre-unipodal-bosu exclue du générateur (GENERATOR_EXCLUDED_FICHES).
- Écartés volontairement : corde à sauter (Q5), vélo/rameur/tapis (Q10), lancers de sac. Il reste donc 4 lancers au ballon lesté (lot-08, `complete_kine`) et les fiches de cardio machine/corde (décisions utilisateur).
- Reste à faire côté code (hors fiches) : écran de séance propose encore la saisie de charge pour `lest`/`sac_de_sable` (N4 du recontrôle) ; `sac_de_sable` hors CHARGEABLE_TAGS (Q26).
