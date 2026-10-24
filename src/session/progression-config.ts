// Réglages de la progression par échelons et du bilan de séance (F6) : knowledge/progression-et-bilan-v1.md.
//
// TOUTES les valeurs chiffrées de ce fichier sont NON SOURCÉ (choix de conception prudent) ou PROVISOIRE : aucune source
// lue ne dit combien de séances sont nécessaires avant de durcir un exercice au poids du corps, ni comment valider un
// record (progression-et-bilan-v1.md §0). Elles sont codées avec les CHOIX PAR DÉFAUT de §5 en attendant la décision de
// l'utilisateur et le contrôle de `relecteur` (CLAUDE.md règle 10). La logique (progression.ts, summary.ts) ne contient
// aucune de ces valeurs en dur : changer un réglage ici change le résultat (testé).

export interface ProgressionConfig {
  echelon: {
    /** Q1 (§5) : séances valables de suite à la fourchette haute avant de PROPOSER l'échelon suivant. NON SOURCÉ. */
    validSessionsToRaise: number;
    /** V-PROG-E11 : séances valables pour remonter vers un échelon déjà quitté par une descente. NON SOURCÉ. */
    validSessionsToRaiseAfterDescent: number;
    /** V-PROG-E2 point 8 : séances valables de plus après un refus avant de reproposer. NON SOURCÉ. */
    validSessionsAfterRefusal: number;
    /** V-PROG-E5 : séances de suite « trop dur » avant de proposer de redescendre. NON SOURCÉ. */
    validSessionsToLower: number;
    /** V-PROG-E5 : part des séries (arrondie vers le haut) en échec pour qu'une séance compte « trop dur ». NON SOURCÉ. */
    lowerShare: number;
    /** V-PROG-E5 : « trop dur ressenti » = réserve <= réserve cible - cette marge. Reprend CALIBRATION.lowerMargin. NON SOURCÉ. */
    lowerRirMargin: number;
    /** Fourchette poids du corps de repli (generateur-v1.md §3.2) quand une série n'a pas gardé sa cible. NON SOURCÉ. */
    defaultRepsMin: number;
    defaultRepsMax: number;
    /** Réserve cible de repli. NON SOURCÉ. */
    defaultRirTarget: number;
    /** Le bouton « 4+ » vaut 4 (generateur-v1.md §5.2). */
    rirButtonMax: number;
    /**
     * V-ETAL-E §2 (e) : première séance d'un exercice, la montée d'étalonnage est-elle permise (d'un seul échelon, jamais au-dessus
     * du plus haut échelon permis) ? La spec est ambiguë : (e) borne au « plafond = échelon de départ », T18 demande une montée.
     * true = T18 (retenu) ; false = lecture littérale de (e) : plafond = échelon de départ. NON SOURCÉ.
     */
    firstSessionRaiseAllowed: boolean;
  };
  /** V-PROG-E6 / E7 : passage de niveau (débutant vers intermédiaire seulement). Q3. NON SOURCÉ. */
  level: {
    minFiches: number;
    minWeeksFollowed: number;
    /** Aucune douleur ni symptôme sur cette période (semaines). */
    quietWeeks: number;
    /** Une proposition par bloc de cette durée (semaines), pour tout le profil. */
    blockWeeks: number;
  };
  /** V-PROG-T (§1.6) : paliers de maintien. NON SOURCÉ en entier ; Q4 : FIGÉS en v1 tant que `coach`/`kine` et `relecteur` n'ont pas validé. */
  hold: {
    enabled: boolean;
    perSchema: Record<string, { startBeginnerSec: number; startOtherSec: number; stepSec: number; capSec: number }>;
    validSessionsToRaise: number;
    /** Plafond au-dessus duquel un maintien ne donne jamais de record (le plus bas des plafonds, par prudence). */
    recordCapSec: number;
  };
  bilan: {
    /** Q8 : au-delà, durée « non fiable » (séance reprise) et exclue des comparaisons. NON SOURCÉ. */
    maxReliableDurationMin: number;
    /** Un repos pris plus long que cela n'est pas un repos (pause) : exclu de la moyenne. Reprend REST_MAX_MS. NON SOURCÉ. */
    maxRestTakenSec: number;
    /** Il faut au moins ce nombre de repos pris pour afficher une moyenne. NON SOURCÉ. */
    minRestsForAverage: number;
    /** Q7 : seuil « similaire » pour les répétitions et le tonnage (en %). NON SOURCÉ. */
    similarPercent: number;
    /** Q7 : « similaire » si l'écart de séries est de cette valeur ou moins. NON SOURCÉ. */
    similarSets: number;
    /** Q7 : séances de référence examinées au plus (on remonte si la référence est abandonnée, interrompue ou douloureuse). NON SOURCÉ. */
    maxReferenceBack: number;
    /** kine 23/10 : pas de record si la réserve est sous max(réserve cible - cette marge, plancher). NON SOURCÉ. */
    recordRirMargin: number;
    recordRirFloor: number;
  };
}

export const PROGRESSION: ProgressionConfig = {
  echelon: {
    validSessionsToRaise: 2, // Q1, NON SOURCÉ
    validSessionsToRaiseAfterDescent: 3, // V-PROG-E11, NON SOURCÉ
    validSessionsAfterRefusal: 2, // NON SOURCÉ
    validSessionsToLower: 2, // NON SOURCÉ
    lowerShare: 0.5, // NON SOURCÉ (asymétrie assumée avec la montée : plus facile de redescendre)
    lowerRirMargin: 2, // NON SOURCÉ
    defaultRepsMin: 10, // generateur-v1.md §3.2 (repsBodyweight), NON SOURCÉ
    defaultRepsMax: 15,
    defaultRirTarget: 3,
    rirButtonMax: 4,
    firstSessionRaiseAllowed: true, // ambiguïté (e) / T18, voir docs/f6-notes-dev.md
  },
  level: { minFiches: 3, minWeeksFollowed: 8, quietWeeks: 4, blockWeeks: 4 }, // Q3, NON SOURCÉ
  hold: {
    enabled: false, // Q4 : durées figées en v1
    perSchema: {
      gainage: { startBeginnerSec: 20, startOtherSec: 30, stepSec: 5, capSec: 45 }, // NON SOURCÉ
      porte: { startBeginnerSec: 30, startOtherSec: 40, stepSec: 5, capSec: 60 }, // NON SOURCÉ
    },
    validSessionsToRaise: 2, // NON SOURCÉ
    recordCapSec: 45, // NON SOURCÉ
  },
  bilan: {
    maxReliableDurationMin: 180, // Q8, NON SOURCÉ
    maxRestTakenSec: 600, // NON SOURCÉ
    minRestsForAverage: 2, // §3.1 point 2
    similarPercent: 5, // Q7, NON SOURCÉ
    similarSets: 1, // Q7, NON SOURCÉ
    maxReferenceBack: 3, // Q7, NON SOURCÉ
    recordRirMargin: 1, // kine 23/10, NON SOURCÉ
    recordRirFloor: 1, // kine 23/10, NON SOURCÉ
  },
};

/** Copie modifiable pour les tests (valeurs imbriquées incluses). */
export function withProgression(patch: { [K in keyof ProgressionConfig]?: Partial<ProgressionConfig[K]> }): ProgressionConfig {
  const out = JSON.parse(JSON.stringify(PROGRESSION)) as ProgressionConfig;
  for (const k of Object.keys(patch) as (keyof ProgressionConfig)[]) Object.assign(out[k], patch[k]);
  return out;
}
