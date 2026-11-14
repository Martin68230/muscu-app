// « Mon sport » A1 (knowledge/saisie-sport-v1.md §9 A1 et « Avis kine du 13/11/2026 sur A1 à A3 » : valeurs finales, NON SOURCÉ / PROVISOIRE) :
// mode « jambes légères » d'une séance CORPS ENTIER quand le sport occupe exactement 3 jours. Le reste du corps est normal ; les jambes sont
// bilatérales seulement, sans charge ajoutée, sans saut, sans nordique, sans descente lente de 3 s, 2 séries, réserve >= 3.
// Le mode ne fait que RETIRER ou ALLÉGER : jamais une série de jambes reportée ou ajoutée ailleurs (saisie-sport-v1.md §8.6).
import { isUnilateral, carriesLoad, type Ctx } from './context';
import { buildExercise } from './dose';
import { resolveFiche } from './safety';
import type { DurSession } from './duration';
import { IMPACT_SCHEMAS, MANUAL_ONLY_FICHES, PILLAR_EXCLUDED_FICHES } from './config';
import type { Fiche, GenExercise } from './types';

type Sess = DurSession<GenExercise>;

/** Séries d'un exercice de jambes en mode « jambes légères » (avis kine : 2 séries, comme la séance « adoucie » de « Créer »). */
export const LIGHT_LEGS = { sets: 2, minRir: 3 } as const;
/** Schémas de jambes (mêmes que « Créer une séance », create-session.ts). */
export const LEG_SCHEMAS: readonly string[] = ['squat', 'fente', 'charniere', 'cheville_mollet', 'hanche_laterale'];
/** Jamais en mode jambes légères : nordique, saut, copenhague (A2 point 2 : jamais le jour d'une séance A1). */
const NEVER_LIGHT = ['nordique-ischios', 'copenhague-court'];

/** Zones dont une gêne retire les jambes de la séance A1 (A1 point 4, avis kine : genou, hanche, cheville, dos, cuisse, aine). */
export const A1_LEG_ZONES: readonly string[] = ['genou', 'hanche', 'cheville', 'dos', 'cuisse', 'aine'];

/** La personne peut-elle avoir une séance A1 ? Grossesse / post-partum, reprise, semaine légère, gêne de jambes : jamais. */
export function a1Allowed(ctx: Pick<Ctx, 'pregnant' | 'postPartum' | 'repriseActive' | 'lightWeek' | 'zones' | 'recentPainZones'>): boolean {
  if (ctx.pregnant || ctx.postPartum || ctx.repriseActive || ctx.lightWeek) return false;
  if (ctx.zones.some((z) => !z.isG && z.level >= 1 && A1_LEG_ZONES.includes(z.key))) return false;
  return ![...ctx.recentPainZones].some((z) => A1_LEG_ZONES.includes(z));
}

const isLight = (f: Fiche, variantId: string): boolean => {
  const v = f.variantes.find((x) => x.id === variantId);
  return !!v && !isUnilateral(v) && !carriesLoad(v) && !IMPACT_SCHEMAS.includes(f.schema) && !NEVER_LIGHT.includes(f.id);
};

/**
 * Passe les exercices de jambes de la séance en « jambes légères » (en place). Un exercice de jambes qui n'a pas de variante bilatérale sans charge
 * est REMPLACÉ par la variante la plus facile de la même fiche qui l'est, sinon RETIRÉ ; les séries ne sont jamais reportées. Renvoie le nombre
 * d'exercices de jambes restants.
 */
export function lightenLegs(s: Sess, pool: readonly Fiche[], ctx: Ctx): number {
  const out: GenExercise[] = [];
  for (const e of s.exercises) {
    if (IMPACT_SCHEMAS.includes(e.schema) || NEVER_LIGHT.includes(e.ficheId)) continue;
    if (!LEG_SCHEMAS.includes(e.schema)) { out.push(e); continue; }
    const f = pool.find((x) => x.id === e.ficheId);
    if (!f || NEVER_LIGHT.includes(f.id)) continue;
    const used = new Set([...out, ...s.exercises].map((x) => x.ficheId));
    let ex: GenExercise | null = null;
    if (isLight(f, e.variantId)) ex = { ...e };
    else {
      const cands = resolveFiche(f, ctx).candidates
        .filter((c) => c.fiche.id === f.id && !c.replaces && isLight(f, c.variant.id))
        .sort((a, b) => a.variant.echelon - b.variant.echelon);
      if (cands.length) ex = buildExercise(cands[0], e.slot, e.tier, ctx);
      else {
        // Aucune variante légère de cette fiche : une autre fiche du même schéma, bilatérale et sans charge, la remplace (jamais un exercice nouveau pour un
        // niveau supérieur : `resolveFiche` applique le niveau, les cases de zone et le matériel).
        const alt = pool
          .filter((g) => g.schema === e.schema && g.id !== f.id && !used.has(g.id) && !MANUAL_ONLY_FICHES.includes(g.id) && !PILLAR_EXCLUDED_FICHES.includes(g.id))
          .flatMap((g) => resolveFiche(g, ctx).candidates.filter((c) => c.fiche.id === g.id && !c.replaces && isLight(g, c.variant.id)))
          .sort((a, b) => a.variant.echelon - b.variant.echelon || a.fiche.id.localeCompare(b.fiche.id))[0];
        if (alt) ex = buildExercise(alt, e.slot, e.tier, ctx);
      }
    }
    if (!ex) continue;
    out.push({ ...ex, sets: Math.min(LIGHT_LEGS.sets, ex.sets), rirTarget: Math.max(LIGHT_LEGS.minRir, ex.rirTarget), capped: true, alt: undefined, supersetGroup: null });
  }
  // Un superset dont un membre a changé ou disparu n'est plus garanti : tous les exercices de jambes sont seuls, les autres paires restent entières.
  const groups = new Map<string, number>();
  for (const e of out) if (e.supersetGroup) groups.set(e.supersetGroup, (groups.get(e.supersetGroup) ?? 0) + 1);
  s.exercises = out.map((e) => (e.supersetGroup && (groups.get(e.supersetGroup) ?? 0) < 2 ? { ...e, supersetGroup: null } : e));
  return s.exercises.filter((e) => LEG_SCHEMAS.includes(e.schema)).length;
}
