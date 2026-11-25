// Convertisseur du jeu hasaneyldrm (texte MIT, hors dépôt) vers des brouillons de fiches au format knowledge/format-fiches.md.
// Décision de l'utilisateur du 14/11/2026 (relayée par le chef de projet). Texte seulement : AUCUNE image ; les GIF viennent de l'import local de l'utilisateur
// (src/images/), reliés par l'identifiant du jeu (ligne « - gymvisual : <id> » de la section Photo et CORRESPONDANCE-FICHES-HASAN.json).
//
//   node tools/hasan-vers-fiches.mjs plan  [--donnees <dossier>]            -> knowledge/exercices/hasan/plan.tsv (une ligne par exercice du jeu : retenu ou écarté + raison, famille)
//   node tools/hasan-vers-fiches.mjs noms                                    -> knowledge/exercices/hasan/familles-a-nommer.tsv (une ligne par famille, noms anglais)
//   node tools/hasan-vers-fiches.mjs generer <lot> [--max N] [--zone Z]      -> écrit knowledge/exercices/vague3/<lot>/*.md (statut brouillon_coach) d'après plan.tsv et noms-fr.tsv
//
// Règles (CLAUDE.md règle 23 et 11) : exercices techniques / dangereux écartés ; niveau minimal prudent (doute = intermédiaire) ; cases de sécurité posées PAR RÈGLES
// à partir des fiches existantes du même schéma et du même muscle (action la plus prudente, jamais plus permissive) puis relues par `kine` ; consignes : traduction française
// du jeu, abrégée (3 à 5 étapes), relue par `coach`. Valeurs NON SOURCÉES. Aucune dose, aucun muscle n'est inventé : tout vient du jeu ou d'une règle écrite ici.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { strip, tokens, translate } from './hasan-lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const mode = args[0];
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const donnees = resolve(opt('--donnees', join(root, '..', '..', '..', '..', 'donnees-externes', 'hasaneyldrm')));
const outDir = join(root, 'knowledge', 'exercices', 'hasan');
const DATE = '2026-11-15';

// ---------------------------------------------------------------- tables
const MUSCLE_TARGET = { abs: 'abdominaux', pectorals: 'pectoraux', biceps: 'biceps', glutes: 'fessiers', triceps: 'triceps', 'upper back': 'rhomboides', lats: 'grand_dorsal', calves: 'mollets', quads: 'quadriceps', forearms: 'avant_bras', hamstrings: 'ischios', spine: 'erecteurs_rachis', traps: 'trapezes', adductors: 'adducteurs', 'serratus anterior': 'dentele_anterieur', abductors: 'moyen_fessier', 'levator scapulae': 'trapezes' };
const MUSCLE_SEC = { 'hip flexors': 'flechisseurs_hanche', 'lower back': 'erecteurs_rachis', obliques: 'obliques', hamstrings: 'ischios', glutes: 'fessiers', biceps: 'biceps', rhomboids: 'rhomboides', forearms: 'avant_bras', triceps: 'triceps', core: 'abdominaux', abdominals: 'abdominaux', 'lower abs': 'abdominaux', back: 'grand_dorsal', quadriceps: 'quadriceps', calves: 'mollets', soleus: 'mollets', chest: 'pectoraux', 'upper chest': 'pectoraux', 'rear deltoids': 'deltoides_posterieurs', traps: 'trapezes', trapezius: 'trapezes', 'upper back': 'rhomboides', brachialis: 'biceps', groin: 'adducteurs', 'inner thighs': 'adducteurs', 'rotator cuff': 'coiffe_des_rotateurs', 'latissimus dorsi': 'grand_dorsal', lats: 'grand_dorsal', shins: 'tibial_anterieur', wrists: 'avant_bras', 'wrist flexors': 'avant_bras', 'wrist extensors': 'avant_bras', 'grip muscles': 'avant_bras', hands: 'avant_bras' };
const EXCLU_NOM = /snatch|clean|jerk|muscle[- ]?up|kipping|behind (the )?(neck|head)|handstand|planche\b|dragon|human flag|front lever|back lever|pistol|jump|hop\b|bound|plyo|burpee|clap|skater|box jump|battle|tire\b|ergometer|skierg|neck|sprint|run\b|running|jog|walk\b|cycle|bike|elliptical|stepmill|treadmill|stair|swim|punch|boxing|kick\b|good morning|jefferson|zercher|deficit|atlas|farmer|yoke|turkish|windmill|iron cross|weighted (sit|crunch|decline)|reverse hyper|slam|throw|toss|swing|hang clean|sumo high pull|upright row|tricep dip between|bridge.*neck|wrestler|nordic|glute[- ]ham|natural glute|stiff[- ]leg(ged)? deadlift|jackknife|dive|spider|archer|one arm push|one arm pull|one[- ]arm (chin|pull)|l[- ]sit|v[- ]sit|flag|inverted|stretch.*(neck)|dislocate|pullover.*(straight arm.*barbell)|sledge hammer|hammer strength|tire|jump rope|battling|rope climb|calf stretch with rope|big toe pose with rope|walking on|walk elliptical|stationary bike walk|farmers walk|lever (deadlift|reverse hyper|back extension|kneeling twist|gripper|seated good morning|hip extension)|sled flip|snatch pull|glute-ham/i;
const RISQUE_NIVEAU2 = /single[- ]leg|one[- ]leg|single[- ]arm|one[- ]arm|one hand|unilateral|decline|deficit|elevated|hanging|weighted|pike|bulgarian|deadlift|pistol|sumo|stiff|romanian|reverse[- ]grip|wide|close[- ]grip|olympic|smith|sissy|hack|lunge|split squat/i;
const TEXTE_RISQUE = /(?:ne regarde|continue|force|à fond)/i;

function equipTags(h) {
  const n = ` ${h.name.toLowerCase()} `;
  const e = h.equipment;
  const t = [];
  const bench = /bench|incline|decline|preacher|lying|seated|flat/.test(n);
  switch (e) {
    case 'body weight': t.push('poids_du_corps'); if (/chair|dip.*bench|bench dip/.test(n)) t.push(/bench/.test(n) ? 'banc' : 'chaise'); if (/wall/.test(n)) t.push('mur'); if (/step|box|stair/.test(n)) t.push('box_ou_step'); if (/towel/.test(n)) t.push('serviette'); if (/pull[- ]?up|chin[- ]?up|hanging|inverted|bar\b/.test(n)) { t.length = 0; t.push('barre_traction'); } break;
    case 'dumbbell': t.push('halteres'); if (/incline/.test(n)) t.push('banc_inclinable'); else if (bench && /bench|preacher|lying|seated|decline|flat|chest|incline/.test(n) && !/standing|bent over|kneeling/.test(n) && /bench|preacher|lying|decline|flat/.test(n)) t.push('banc'); break;
    case 'band': case 'resistance band': t.push('elastique'); if (/pulldown|pushdown|face pull|pull[- ]through|overhead|anchor|door|high/.test(n)) t.push('ancrage_porte'); break;
    case 'barbell': case 'olympic barbell': t.push('barre', 'disques'); if (/squat|bench|overhead|military|shoulder press|rack/.test(n)) t.push('rack'); if (/bench|incline|decline/.test(n)) t.push(/incline/.test(n) ? 'banc_inclinable' : 'banc'); break;
    case 'ez barbell': t.push('barre_ez', 'disques'); if (/lying|incline|preacher|bench/.test(n)) t.push(/incline/.test(n) ? 'banc_inclinable' : 'banc'); break;
    case 'kettlebell': t.push('kettlebell'); break;
    case 'cable': t.push('poulie'); break;
    case 'leverage machine': case 'smith machine': case 'assisted': case 'sled machine': t.push('machine'); break;
    case 'rope': t.push('poulie'); break;
    case 'stability ball': t.push('swiss_ball'); break;
    case 'medicine ball': t.push('medecine_ball'); break;
    case 'bosu ball': t.push('bosu'); break;
    case 'wheel roller': t.push('roue_abdos'); break;
    case 'weighted': t.push('lest'); break;
    case 'roller': t.push('rouleau_massage'); break;
    default: return null;
  }
  return t;
}

const musc = (h) => {
  const t = (h.target ?? '').toLowerCase();
  let main;
  if (t === 'delts') {
    const n = h.name.toLowerCase();
    main = /rear|reverse fly|reverse flye|face pull|bent over (lateral|raise)|rear delt/.test(n) ? 'deltoides_posterieurs' : /lateral|side raise|upright/.test(n) ? 'deltoides_lateraux' : /front/.test(n) ? 'deltoides_anterieurs' : 'deltoides_anterieurs';
  } else if (t === 'upper back') {
    main = /row|pull|face/.test(h.name.toLowerCase()) ? 'rhomboides' : 'rhomboides';
  } else main = MUSCLE_TARGET[t];
  if (!main) return null;
  const mains = [main];
  if (t === 'upper back' && /row/i.test(h.name)) mains.unshift('grand_dorsal');
  const sec = [];
  for (const s of h.secondary_muscles ?? []) {
    let m = MUSCLE_SEC[s.toLowerCase()];
    if (s.toLowerCase() === 'shoulders' || s.toLowerCase() === 'deltoids') m = /raise|lateral|upright/.test(h.name.toLowerCase()) ? 'deltoides_lateraux' : /rear|row|pull|face/.test(h.name.toLowerCase()) ? 'deltoides_posterieurs' : 'deltoides_anterieurs';
    if (m && !mains.includes(m) && !sec.includes(m)) sec.push(m);
  }
  return { main: mains, sec };
};

// ---- famille kettlebell (24/11/2026) : seuls ces identifiants du jeu sont repris ; les autres exercices kettlebell restent écartés.
// tech: true = exercice TECHNIQUE (règle 23 : jamais débutant ni à la maison sans avis) : niveau intermédiaire ou avancé, jamais proposé par le générateur (liste GENERATOR_EXCLUDED_FICHES).
const KB = {
  '0519': { famille: 'kb-developpe-sol', schema: 'poussee_h', type: 'force', niveau: 'intermediaire' }, '1298': { famille: 'kb-developpe-sol', schema: 'poussee_h', type: 'force', niveau: 'intermediaire' }, '0531': { famille: 'kb-developpe-sol', schema: 'poussee_h', type: 'force', niveau: 'intermediaire' },
  '0546': { famille: 'kb-developpe-assis', schema: 'poussee_v', type: 'force', niveau: 'intermediaire' }, '1438': { famille: 'kb-developpe-assis', schema: 'poussee_v', type: 'force', niveau: 'intermediaire' },
  '0533': { famille: 'kb-squat-avant', schema: 'squat', type: 'force', niveau: 'intermediaire' },
  '0536': { famille: 'kb-fente-passage', schema: 'fente', type: 'force', niveau: 'intermediaire' },
  '1345': { famille: 'kb-rowing', schema: 'tirage_h', type: 'force', niveau: 'debutant' }, '0522': { famille: 'kb-rowing', schema: 'tirage_h', type: 'force', niveau: 'debutant' },
  '0549': { famille: 'kb-swing', schema: 'charniere', type: 'fonctionnel', niveau: 'intermediaire', tech: true },
  '0535': { famille: 'kb-epaule', schema: 'charniere', type: 'fonctionnel', niveau: 'avance', tech: true },
  '0542': { famille: 'kb-arrache', schema: 'charniere', type: 'fonctionnel', niveau: 'avance', tech: true },
  '0551': { famille: 'kb-releve-turc', schema: 'gainage', type: 'fonctionnel', niveau: 'avance', tech: true },
  '0554': { famille: 'kb-moulin', schema: 'rotation', type: 'fonctionnel', niveau: 'avance', tech: true },
  '0525': { famille: 'kb-bottoms-up', schema: 'charniere', type: 'fonctionnel', niveau: 'avance', tech: true },
  '0548': { famille: 'kb-tirage-sumo', schema: 'tirage_v', type: 'fonctionnel', niveau: 'avance', tech: true },
  '0528': { famille: 'kb-push-press', schema: 'poussee_v', type: 'force', niveau: 'avance', tech: true },
  '0553': { famille: 'kb-developpe-debout', schema: 'poussee_v', type: 'force', niveau: 'intermediaire', tech: true }, '0520': { famille: 'kb-developpe-debout', schema: 'poussee_v', type: 'force', niveau: 'intermediaire', tech: true },
  '0521': { famille: 'kb-renegade', schema: 'tirage_h', type: 'force', niveau: 'avance', tech: true },
};
const TECH_AVERT = 'Exercice TECHNIQUE (règle 23) : niveau intermédiaire ou avancé seulement, jamais pour un débutant ni à la maison sans avis d’un coach ; jamais proposé par les programmes automatiques de l’appli (consultation de la fiche seulement).';
const KB_TEXTE = {
  'kb-swing': { att: [TECH_AVERT, 'Mouvement balistique de charnière : la puissance vient des hanches, les bras ne tirent pas ; la kettlebell monte à hauteur d’épaule au plus, pas plus haut.', 'Dos neutre du début à la fin, jamais arrondi ; pas de squat : les genoux restent peu fléchis.', 'Poids : commence avec la kettlebell la plus légère que tu possèdes ; ne l’augmente que si 10 répétitions restent propres. Aucune valeur sourcée.', 'Séries courtes, jamais de grosse série à la fatigue : arrête dès que le dos ou la cadence se dégradent.'], dose: '3 à 5 séries de 5 à 10 répétitions (jamais plus), réserve >= 3, repos 60 à 90 secondes' },
  'kb-epaule': { att: [TECH_AVERT, 'La kettlebell monte près du corps jusqu’à la position « rack » (poing près de l’épaule, coude contre les côtes) ; le poignet reste droit, la kettlebell ne claque pas sur l’avant-bras.', 'Apprends d’abord le swing et le squat avec la kettlebell, avec un coach ou une vidéo de qualité ; poids le plus léger pour commencer.', 'Séries courtes, un côté puis l’autre ; arrête dès que la technique se dégrade.'], dose: '3 à 4 séries de 3 à 6 répétitions par côté, réserve >= 3, repos 60 à 90 secondes' },
  'kb-arrache': { att: [TECH_AVERT, 'Mouvement le plus technique de la famille : réservé aux personnes déjà à l’aise avec le swing et l’épaulé, de préférence sous le regard d’un coach.', 'Bras tendu au-dessus de la tête, épaule basse, poignet droit ; la kettlebell passe autour de la main sans claquer.', 'Poids le plus léger pour commencer ; séries courtes, arrêt dès que la technique se dégrade.'], dose: '3 à 4 séries de 3 à 5 répétitions par côté, réserve >= 3, repos 90 secondes' },
  'kb-releve-turc': { att: [TECH_AVERT, 'Mouvement lent en plusieurs étapes : le regard reste sur la kettlebell, le bras qui porte reste vertical et tendu.', 'Apprends d’abord SANS charge, puis avec un objet léger, puis avec une kettlebell légère ; chaque étape est maîtrisée avant la suivante.', 'Sol dégagé, sans obstacle ; en cas de doute sur la stabilité de l’épaule, ne pas faire.'], dose: '2 à 3 séries de 1 à 3 répétitions par côté, réserve >= 3, repos 60 à 90 secondes' },
  'kb-moulin': { att: [TECH_AVERT, 'Bras tendu au-dessus de la tête, regard sur la kettlebell ; le mouvement vient de la charnière de la hanche, pas du dos.', 'Apprends d’abord sans charge ou avec une charge très légère, puis augmente prudemment.', 'Amplitude progressive : ne descends que jusqu’où le dos reste neutre et la hanche libre.'], dose: '2 à 3 séries de 3 à 6 répétitions par côté, réserve >= 3, repos 60 secondes' },
  'kb-bottoms-up': { att: [TECH_AVERT, 'La kettlebell est tenue à l’envers, fond vers le haut : poignet droit et fort, avant-bras vertical, épaule basse ; si elle penche, repose-la.', 'Poids très léger pour commencer, loin de la tête et des autres personnes ; sol dégagé.', 'Séries courtes, un côté puis l’autre ; arrête dès que le poignet fatigue.'], dose: '2 à 3 séries de 3 à 5 répétitions par côté, réserve >= 3, repos 60 à 90 secondes' },
  'kb-tirage-sumo': { att: [TECH_AVERT, 'Pieds écartés, dos neutre ; la kettlebell monte près du corps, coudes hauts et vers l’extérieur, sans monter plus haut que la poitrine.', 'Les épaules restent loin des oreilles ; si l’épaule pince, arrête.', 'Poids le plus léger pour commencer ; séries courtes.'], dose: '3 à 4 séries de 6 à 10 répétitions, réserve >= 3, repos 60 à 90 secondes' },
  'kb-push-press': { att: [TECH_AVERT, 'L’élan vient d’une courte flexion puis extension des jambes, puis les bras finissent le mouvement ; la kettlebell ne dépasse pas l’alignement des épaules au-dessus de la tête.', 'Ventre serré, sans cambrer le bas du dos ; descente lente jusqu’à la position de départ.', 'Poids le plus léger pour commencer ; séries courtes, arrêt dès que le dos se cambre.'], dose: '3 à 4 séries de 4 à 8 répétitions, réserve >= 3, repos 90 secondes' },
  'kb-developpe-debout': { att: [TECH_AVERT, 'Mouvement au-dessus de la tête : ventre et fessiers serrés, sans cambrer le bas du dos ; poignet droit, coude sous la kettlebell.', 'Poids le plus léger pour commencer ; monte et descends lentement, sans élan.', 'Si l’épaule pince ou si le dos se cambre, passe à la version assise ou arrête.'], dose: '2 à 4 séries de 5 à 10 répétitions par côté, réserve >= 2, repos 60 à 90 secondes' },
  'kb-renegade': { att: [TECH_AVERT, 'Position de planche sur deux kettlebells : bassin stable, jambes écartées pour limiter la rotation ; les poignets restent droits sur les poignées.', 'Les kettlebells sont stables et posées sur sol plat ; sinon ne pas faire.', 'Tire le coude vers la hanche sans faire pivoter le bassin ; séries courtes, arrêt dès que le bassin tourne.'], dose: '2 à 3 séries de 4 à 8 répétitions par côté, réserve >= 3, repos 60 à 90 secondes' },
  'kb-developpe-sol': { att: ['Allongé sur le dos, genoux fléchis, pieds au sol ; le coude descend jusqu’à toucher le sol sans rebond.', 'Poignet droit, kettlebell contre l’avant-bras ; pas d’élan.', 'Choisis une kettlebell (parmi tes poids) qui permet de finir toutes les répétitions proprement.'], dose: '2 à 3 séries de 6 à 12 répétitions, réserve >= 2, repos 60 à 90 secondes' },
  'kb-developpe-assis': { att: ['Assis, dos droit et ventre serré, sans cambrer ; la kettlebell est tenue contre l’épaule, poignet droit.', 'Mouvement lent, sans élan ; ne bloque pas les coudes brutalement en haut.', 'Choisis une kettlebell (parmi tes poids) qui permet de finir toutes les répétitions proprement ; si l’épaule pince, arrête.'], dose: '2 à 3 séries de 6 à 12 répétitions, réserve >= 2, repos 60 à 90 secondes' },
  'kb-squat-avant': { att: ['Kettlebell tenue contre la poitrine (en « rack » ou à deux mains) ; coudes serrés, dos droit.', 'Les genoux restent dans l’axe des pieds ; descends en contrôlant, remonte en poussant dans les talons.', 'Choisis une kettlebell (parmi tes poids) qui permet de garder le dos droit à chaque répétition.'], dose: '2 à 3 séries de 6 à 12 répétitions, réserve >= 2, repos 60 à 90 secondes' },
  'kb-fente-passage': { att: ['Pas contrôlé, buste droit, genou avant dans l’axe du pied ; la kettlebell passe lentement d’une main à l’autre sous la jambe, sans se pencher en avant.', 'Équilibre avant tout : commence très léger, sol non glissant.', 'Choisis une kettlebell (parmi tes poids) que tu peux passer sans perdre l’équilibre.'], dose: '2 à 3 séries de 6 à 10 répétitions par jambe, réserve >= 2, repos 60 à 90 secondes' },
  'kb-rowing': { att: ['Buste penché, dos neutre, ventre serré ; tire le coude vers la hanche, épaule basse.', 'Mouvement lent, sans élan ni balancement du buste ; une main peut s’appuyer sur un banc ou une chaise.', 'Choisis une kettlebell (parmi tes poids) qui permet de finir toutes les répétitions proprement.'], dose: '2 à 3 séries de 8 à 12 répétitions par côté, réserve >= 2, repos 60 à 90 secondes' },
};
// ---- famille poussée (25/11/2026, session A) : exercices dont le schéma n'est pas déduit du nom ; seul cet identifiant est repris.
const PUSH = {
  '0152': { famille: 'poussee_h|triceps|cable concentration', schema: 'poussee_h', type: 'force', niveau: 'intermediaire' },
};
const KB_TECH = new Set(Object.values(KB).filter((x) => x.tech).map((x) => x.famille));
function schemaOf(h) {
  const n = ` ${h.name.toLowerCase()} `;
  const t = (h.target ?? '').toLowerCase();
  if (/stretch|mobility|foam|roller|circle|rotation stretch|yoga|pose/.test(n) || h.category === 'stretching') return { s: 'mobilite', type: 'mobilite_recup' };
  if (/pallof|anti[- ]rotation|woodchop|wood chop/.test(n)) return { s: 'anti_rotation', type: 'gainage', fam: 'anti_rotation' };
  if (/twist|rotation|russian|bicycle/.test(n) && t === 'abs') return { s: 'rotation', type: 'gainage', fam: 'rotation' };
  if (/plank|hold|hollow|bird dog|dead bug|dead bug|bear|mountain climber|body saw|wall sit/.test(n) && t === 'abs') return { s: 'gainage', type: 'gainage', fam: 'gainage' };
  if (t === 'abs') return { s: 'gainage', type: 'gainage', fam: /raise|knee|tuck|crunch|sit-?up|v-?up|leg lift|flutter/.test(n) ? 'flexion' : 'gainage' };
  if (/hyperextension|back extension|superman|reverse hyperextension/.test(n)) return { s: 'charniere', type: 'force', fam: 'extension' };
  if (/deadlift|hip thrust|glute bridge|bridge|pull[- ]through|leg curl|hamstring curl|kickback|donkey|fire hydrant|hip extension|good morning/.test(n)) return /abduct|fire hydrant|clam|side/.test(n) ? { s: 'hanche_laterale', type: 'force' } : { s: 'charniere', type: 'force' };
  if (/abduction|adduction|clam|side lying leg|lateral (leg|band)|monster|lateral walk|side leg/.test(n)) return { s: 'hanche_laterale', type: 'force' };
  if (/calf|toe raise|heel raise|tibialis|ankle/.test(n) || t === 'calves') return { s: 'cheville_mollet', type: 'force' };
  if (/lunge|split squat|step[- ]?up|step up/.test(n)) return { s: 'fente', type: 'force' };
  if (/squat|leg press|hack|leg extension|sit[- ]?up squat|wall sit|sissy/.test(n)) return { s: 'squat', type: 'force' };
  if (/carry|suitcase/.test(n)) return { s: 'porte', type: 'fonctionnel' };
  if (/pull[- ]?up|chin[- ]?up|pulldown|pull down|pullover|lat pull/.test(n)) return { s: 'tirage_v', type: 'force' };
  if (/curl|row\b|rows\b|face pull|reverse fly|reverse flye|rear (delt|lateral)|shrug|bent[- ]over|pull[- ]apart|\by raise|\bt raise|external rotation|internal rotation/.test(n)) return { s: 'tirage_h', type: 'force' };
  if (/overhead press|shoulder press|military|arnold|push press|lateral raise|front raise|side raise|raise|handstand|pike/.test(n)) return { s: 'poussee_v', type: 'force' };
  if (/bench|press|push[- ]?up|fly\b|flye|dip|pushdown|push down|triceps extension|tricep extension|skull|kickback|crossover|pec deck|chest/.test(n)) return { s: 'poussee_h', type: 'force' };
  return null;
}

const engWords = /\b(dumbbell|barbell|cable|band|resistance|lever|leverage|machine|smith|ez|olympic|weighted|kettlebell|stability|medicine|ball|bosu|assisted|body ?weight|bodyweight|wheel|roller|one|single|two|alternate|alternating|seated|standing|lying|male|female|version|v\d)\b/g;
const famKey = (name, schema, main) => `${schema}|${main.slice(0, 2).join('+')}|${strip(name).replace(engWords, ' ').replace(/[^a-z]+/g, ' ').trim().split(' ').filter(Boolean).sort().join(' ')}`;

// ------------------------------------------------------------- fiches existantes
function loadExisting(sansVague3 = false) {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/ecartees/.test(p) && !(sansVague3 && e.name === 'vague3')) walk(p); continue; }
      if (!e.name.endsWith('.md') || /README|CONTROLE|BILAN|CAMPAGNE/.test(e.name)) continue;
      const t = readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
      const fm = /^---\n([\s\S]*?)\n---/.exec(t)?.[1];
      if (!fm) continue;
      const g = (k) => (new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(fm)?.[1] ?? '').split('#')[0].trim();
      const list = (k) => g(k).replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean);
      const variants = [];
      for (const l of t.split('\n')) { const c = l.split('|').map((x) => x.trim()); if (c.length >= 7 && /^[a-z0-9-]+$/.test(c[1]) && /^[0-9]+$/.test(c[3])) variants.push({ id: c[1], nom: c[2] }); }
      out.push({ id: g('id'), nom: g('nom'), alias: list('alias'), schema: g('schema'), main: list('muscles_principaux'), statut: g('statut'), variants, text: t, path: p });
    }
  })(join(root, 'knowledge', 'exercices'));
  return out;
}
const dice = (a, b) => { if (!a.length || !b.length) return 0; const B = new Set(b); return (2 * a.filter((x) => B.has(x)).length) / (a.length + b.length); };
const gvIds = () => new Set([...readFileSync(join(root, 'src/images/gv-table.ts'), 'utf8').matchAll(/id: '(\d+)'/g)].map((m) => m[1]));

// ------------------------------------------------------------------ plan
function plan() {
  const data = JSON.parse(readFileSync(join(donnees, 'exercises.json'), 'utf8'));
  const existing = loadExisting(true); // la planification ne tient pas compte des fiches déjà générées (familles stables)
  const covered = gvIds();
  const exTok = existing.flatMap((f) => [f.nom, ...f.alias, ...f.variants.map((v) => v.nom)].map((n) => ({ f, tok: tokens(n) })));
  const rows = [];
  for (const h of data) {
    const base = { id: h.id, name: h.name, equipment: h.equipment, target: h.target };
    const why = (r) => rows.push({ ...base, statut: 'ecarte', raison: r });
    const ov = KB[h.id] ?? PUSH[h.id];
    if (!ov && EXCLU_NOM.test(h.name)) { why('technique-ou-dangereux-ou-hors-sujet'); continue; }
    if (h.body_part === 'neck' || h.body_part === 'cardio' || h.target === 'cardiovascular system') { why('cou-ou-cardio'); continue; }
    const tags = equipTags(h);
    if (!tags) { why('materiel-hors-taxonomie'); continue; }
    const m = musc(h);
    if (!m) { why('muscle-non-mappe'); continue; }
    const sc = ov ? { s: ov.schema, type: ov.type } : schemaOf(h);
    if (!sc) { why('schema-non-deduit'); continue; }
    if (covered.has(h.id)) { why('deja-couvert-gif'); continue; }
    const tk = tokens(translate(h.name));
    const sub = (a, b) => { const [s, l] = a.length <= b.length ? [a, b] : [b, a]; return s.length >= 2 && l.length - s.length <= 1 && s.every((x) => l.includes(x)); };
    const hit = ov ? null : exTok.find((x) => x.f.schema === sc.s && (dice(tk, x.tok) >= 0.85 || (x.f.main.some((mm) => m.main.includes(mm)) && (dice(tk, x.tok) >= 0.7 || sub(tk, x.tok)))));
    if (hit) { why(`doublon:${hit.f.id}`); continue; }
    const fr = h.instruction_steps?.fr ?? [];
    if (fr.length < 2) { why('consigne-absente'); continue; }
    const technique = ov ? ov.niveau : RISQUE_NIVEAU2.test(h.name) || ['barre', 'barre_ez', 'lest', 'kettlebell'].some((x) => tags.includes(x)) || tags.includes('machine') ? 'intermediaire' : 'debutant';
    rows.push({ ...base, statut: 'retenu', raison: '', tags: tags.join(','), main: m.main.join(','), sec: m.sec.join(','), schema: sc.s, type: sc.type, fam: sc.fam ?? '', niveau: technique, famille: ov ? ov.famille : famKey(h.name, sc.s, m.main) });
  }
  mkdirSync(outDir, { recursive: true });
  const cols = ['id', 'statut', 'raison', 'famille', 'schema', 'type', 'fam', 'niveau', 'main', 'sec', 'tags', 'equipment', 'target', 'name'];
  writeFileSync(join(outDir, 'plan.tsv'), [cols.join('\t'), ...rows.map((r) => cols.map((c) => r[c] ?? '').join('\t'))].join('\n') + '\n');
  const ret = rows.filter((r) => r.statut === 'retenu');
  const raisons = {};
  for (const r of rows.filter((x) => x.statut !== 'retenu')) { const k = r.raison.split(':')[0]; raisons[k] = (raisons[k] ?? 0) + 1; }
  const fams = new Set(ret.map((r) => r.famille));
  console.log(`${rows.length} exercices ; retenus ${ret.length} en ${fams.size} familles ; écartés`, JSON.stringify(raisons));
  const bySchema = {}; for (const r of ret) bySchema[r.schema] = (bySchema[r.schema] ?? 0) + 1;
  console.log('retenus par schéma', JSON.stringify(bySchema));
}


// ------------------------------------------------------------ outils communs
const HOME = new Set(['poids_du_corps', 'halteres', 'banc', 'banc_inclinable', 'elastique', 'chaise', 'mur', 'serviette', 'box_ou_step', 'swiss_ball', 'ancrage_porte', 'medecine_ball', 'barre_traction', 'bosu', 'roue_abdos', 'mini_bande']);
const LEVELS = ['debutant', 'intermediaire', 'avance'];
const readPlan = () => {
  const [h, ...r] = readFileSync(join(outDir, 'plan.tsv'), 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t'));
  return r.map((c) => Object.fromEntries(h.map((k, i) => [k, c[i] ?? '']))).filter((x) => x.statut === 'retenu');
};
const families = (rows) => { const m = new Map(); for (const r of rows) (m.get(r.famille) ?? m.set(r.famille, []).get(r.famille)).push(r); return m; };
const lotsFile = join(outDir, 'lots.json');
const lots = () => (existsSync(lotsFile) ? JSON.parse(readFileSync(lotsFile, 'utf8')) : {});

function noms() {
  const lot = opt('--lot', '1');
  const taille = Number(opt('--taille', '60'));
  const zone = opt('--zone', '');
  const used = new Set(Object.values(lots()).flat());
  const fams = [...families(readPlan())].filter(([k]) => !used.has(k));
  const tout = args.includes('--tout');
  const sel = fams.filter(([, rs]) => (tout || rs.some((r) => r.tags.split(',').every((t) => HOME.has(t)))) && (!zone || zone.split(',').includes(rs[0].schema)));
  // tourniquet par muscle principal : les familles à plusieurs variantes d'abord, débutant avant intermédiaire
  const by = new Map();
  for (const [k, rs] of sel.sort((a, b) => b[1].length - a[1].length || a[1][0].niveau.localeCompare(b[1][0].niveau))) {
    const m = rs[0].main.split(',')[0];
    if (!by.has(m)) by.set(m, []);
    by.get(m).push([k, rs]);
  }
  const pick = [];
  while (pick.length < taille && [...by.values()].some((v) => v.length)) for (const v of by.values()) if (v.length && pick.length < taille) pick.push(v.shift());
  const lines = ['famille\tschema\tmuscles\tnoms_anglais\tids'];
  for (const [k, rs] of pick) lines.push([k, rs[0].schema, rs[0].main, rs.map((r) => r.name).join(' / '), rs.map((r) => r.id).join(',')].join('\t'));
  writeFileSync(join(outDir, 'familles-a-nommer-lot' + lot + '.tsv'), lines.join('\n') + '\n');
  console.log('lot ' + lot + ' : ' + pick.length + ' familles à nommer (' + pick.reduce((a, [, rs]) => a + rs.length, 0) + ' exercices du jeu)');
}

// ---- sécurité : cases par règles d'après les fiches existantes du même schéma et du même muscle
const RANK = (a) => (a.startsWith('retirer') ? 2 : a.startsWith('adapter') ? 1 : 0);
const generique = (a) => (/^adapter: (variante|charge|sans-charge)/.test(a) && !/charge:legere|sans-charge/.test(a) ? 'adapter: amplitude:reduite' : /^retirer/.test(a) ? 'retirer' : a);
function zonesOf(text) {
  const i = text.indexOf('| Zone | Niveau 1');
  if (i < 0) return null;
  const rows = {};
  for (const l of text.slice(i).split('\n').slice(2)) { if (!l.startsWith('|')) break; const c = l.split('|').map((x) => x.trim()); rows[strip(c[1])] = [c[2], c[3], c[4]]; }
  const g = /\*\*Grossesse\*\*\s*:\s*(.+)/.exec(text)?.[1]?.trim();
  return { rows, g };
}
let exCache;
function deriveSafety(schema, mains, tags, nameEn, famille) {
  if (KB_TECH.has(famille)) {
    const dur = ['adapter: charge:legere', 'retirer', 'retirer'];
    const hanche = ['adapter: amplitude:reduite', 'retirer', 'retirer'];
    return { zones: { cou: ['retirer', 'retirer', 'retirer'], dos: dur, epaule: dur, coude: dur, poignet: dur, hanche, genou: hanche, cuisse: hanche, cheville: ['garder', 'adapter: amplitude:reduite', 'retirer'] }, grossesse: 'retirer' };
  }
  exCache ??= loadExisting().filter((f) => ['utilisable', 'verifie'].includes(f.statut));
  let grp = exCache.filter((f) => f.schema === schema && f.main.some((m) => mains.includes(m)));
  if (grp.length < 2) grp = exCache.filter((f) => f.schema === schema);
  const parsed = grp.map((f) => zonesOf(f.text)).filter(Boolean);
  const count = {};
  for (const p of parsed) for (const z of Object.keys(p.rows)) count[z] = (count[z] ?? 0) + 1;
  const zones = Object.keys(count).filter((z) => count[z] >= Math.max(1, parsed.length * 0.5));
  const out = {};
  for (const z of zones) {
    const cells = [0, 1, 2].map((n) => parsed.map((p) => p.rows[z]?.[n] ?? 'garder').map(generique));
    let prev = 0; const row = [];
    for (let n = 0; n < 3; n++) {
      const c = cells[n]; const cat = [0, 1, 2].map((r) => c.filter((a) => RANK(a) === r).length);
      let r = cat.indexOf(Math.max(...cat)); if (cat[2] && cat[2] >= cat[r]) r = 2; // égalité : le plus prudent
      r = Math.max(r, prev); if (n === 2) r = 2; prev = r;
      const adapt = (() => { const m = {}; for (const a of c.filter((x) => RANK(x) === 1)) m[a] = (m[a] ?? 0) + 1; return Object.entries(m).sort((x, y) => y[1] - x[1])[0]?.[0] ?? 'adapter: amplitude:reduite'; })();
      row.push(r === 0 ? 'garder' : r === 1 ? adapt : 'retirer');
    }
    out[z] = row;
  }
  if (mains.includes('ischios') && !out.cuisse) out.cuisse = ['garder', 'adapter: amplitude:reduite', 'retirer'];
  if (mains.includes('adducteurs') && !out.aine) out.aine = ['garder', 'adapter: amplitude:reduite', 'retirer'];
  const lourd = tags.some((t) => ['barre', 'barre_ez', 'lest', 'kettlebell'].includes(t));
  const up = (z, n, a) => { out[z] ??= ['garder', 'adapter: amplitude:reduite', 'retirer']; if (RANK(out[z][n]) < RANK(a)) out[z][n] = a; for (let k = n + 1; k < 3; k++) if (RANK(out[z][k]) < RANK(out[z][k - 1])) out[z][k] = out[z][k - 1]; };
  if (lourd) { up('dos', 0, 'adapter: charge:legere'); up('dos', 1, 'retirer'); if (/poussee|tirage/.test(schema)) { up('epaule', 0, 'adapter: charge:legere'); up('epaule', 1, 'retirer'); } }
  const n = nameEn.toLowerCase();
  if (/overhead|press|raise|fly|flye|pullover|dip|push/.test(n) && /poussee|tirage/.test(schema)) up('epaule', 1, 'adapter: amplitude:reduite');
  if (/wrist|curl|extension|skull|press|push|dip|plank|crawl/.test(n)) out.coude ??= ['garder', 'adapter: amplitude:reduite', 'retirer'];
  if (/push|plank|dip|crawl|wrist|bear/.test(n)) out.poignet ??= ['garder', 'adapter: amplitude:reduite', 'retirer'];
  const gm = {}; for (const p of parsed) if (p.g) gm[generique(p.g)] = (gm[generique(p.g)] ?? 0) + 1;
  let g = Object.entries(gm).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'retirer';
  if (lourd || ['gainage', 'rotation', 'anti_rotation'].includes(schema) || /lying|supine|prone|crunch|sit-?up|v-?up|bench|decline|twist|hanging|flat|incline|dip/.test(n)) g = 'retirer';
  return { zones: out, grossesse: g };
}

const SCHEMA_TEXTE = {
  squat: ['Descends en contrôlant, les genoux restent dans l’axe des pieds.', 'Garde le dos droit et le ventre serré.', 'Pousse dans les talons pour remonter.'],
  fente: ['Garde le buste droit et le genou avant dans l’axe du pied.', 'Pas assez long pour que le talon avant reste posé.', 'Mouvement lent, équilibre avant tout.'],
  charniere: ['Le mouvement vient des hanches, pas du bas du dos.', 'Garde le dos neutre, sans le creuser ni l’arrondir.', 'Serre les fessiers en haut sans cambrer.'],
  poussee_h: ['Garde les épaules basses, loin des oreilles.', 'Mouvement lent et contrôlé, sans élan.', 'Les poignets restent alignés avec les avant-bras.'],
  poussee_v: ['Garde le ventre serré, sans cambrer le dos.', 'Mouvement lent, sans élan ni à-coups.', 'Les épaules restent basses, ne les hausse pas vers les oreilles.'],
  tirage_h: ['Tire avec le dos plutôt qu’avec les bras, épaules basses.', 'Mouvement lent, sans élan ni balancement du buste.', 'Garde le dos neutre.'],
  tirage_v: ['Tire avec le dos, épaules basses, sans balancer le corps.', 'Mouvement lent et contrôlé.', 'Ne cambre pas le bas du dos.'],
  gainage: ['Ventre serré, dos neutre, respiration continue.', 'Ne creuse pas le bas du dos.', 'Arrête quand la position se dégrade.'],
  anti_rotation: ['Le bassin et les épaules restent face à l’avant.', 'Mouvement lent, ventre serré.', 'Respire sans bloquer.'],
  rotation: ['La rotation vient du tronc, mouvement lent et contrôlé.', 'Pas d’élan ni de torsion brutale du dos.', 'Respire normalement.'],
  cheville_mollet: ['Monte et descends lentement, sans rebond.', 'Appuie-toi au besoin pour l’équilibre.', 'Descends jusqu’à étirer le mollet sans douleur.'],
  hanche_laterale: ['Le bassin reste stable, sans pivoter.', 'Mouvement lent et contrôlé.', 'Amplitude sans douleur, sans élan.'],
  mobilite: ['Mouvement doux, jamais de douleur.', 'Respire lentement pendant la position.', 'Ne force pas l’amplitude.'],
};
const BRAS_TEXTE = ['Garde les coudes près du corps, sans balancer le buste.', 'Mouvement lent, sans élan, poignets alignés.', 'Choisis une charge qui permet de finir toutes les répétitions proprement.'];
const ERREURS = ['Aller trop vite, avec de l’élan.', 'Charge ou difficulté trop grande qui fait perdre la bonne position.', 'Retenir sa respiration.', 'Continuer malgré une douleur.'];
const DOSE = (s) => (s === 'gainage' || s === 'anti_rotation' ? '2 à 3 séries de 20 à 40 secondes, réserve >= 2, repos 45 à 60 secondes' : s === 'mobilite' ? '1 à 2 passages de 20 à 40 secondes, jamais de douleur' : s === 'cheville_mollet' ? '2 à 3 séries de 10 à 15 répétitions, réserve >= 3, repos 45 à 60 secondes' : '2 à 3 séries de 8 à 15 répétitions, réserve >= 2, repos 60 à 90 secondes');
const EQ_NOM = { poids_du_corps: 'Poids du corps', halteres: 'Aux haltères', elastique: 'Avec un élastique', poulie: 'À la poulie', machine: 'Sur machine', barre: 'À la barre', barre_ez: 'À la barre EZ', kettlebell: 'Avec une kettlebell', swiss_ball: 'Sur un gros ballon', medecine_ball: 'Avec un ballon lesté', bosu: 'Sur un bosu', roue_abdos: 'Avec la roue', lest: 'Avec un lest', barre_traction: 'À la barre de traction', rouleau_massage: 'Avec un rouleau' };
const EQ_ORDER = ['poids_du_corps', 'mur', 'chaise', 'elastique', 'swiss_ball', 'poulie', 'machine', 'halteres', 'kettlebell', 'medecine_ball', 'barre_ez', 'barre', 'lest', 'barre_traction'];
const diffRank = (tags) => Math.max(...tags.map((t) => { const i = EQ_ORDER.indexOf(t); return i < 0 ? 0 : i; }));
const slug = (s) => strip(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function steps(h) {
  let s = (h.instruction_steps?.fr ?? []).map((x) => x.replace(/[​‌‍﻿]/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const drop = (x) => /nombre (souhait|de répétitions)|répétitions souhaitées|répète|recommence|selon le nombre/i.test(x);
  if (s.length > 4) s = s.filter((x) => !drop(x));
  while (s.length > 5) { const last = s.pop(); s[s.length - 1] += ' ' + last; }
  const pad = ['Garde le contrôle du mouvement du début à la fin.', 'Respire normalement, sans bloquer ta respiration.', 'Arrête si tu ressens une douleur.'];
  let i = 0;
  while (s.length < 4) s.push(pad[i++ % pad.length]);
  return s;
}

const ZN = { cou: 'Cou', epaule: 'Épaule', coude: 'Coude', poignet: 'Poignet', dos: 'Dos', hanche: 'Hanche', genou: 'Genou', cheville: 'Cheville', cuisse: 'Cuisse', aine: 'Aine' };
function ficheMd({ id, nom, alias, schema, type, fam, mains, secs, variantes, h, safety, hasanIds, lotName, famille }) {
  const kbx = KB_TEXTE[famille];
  const niv0 = variantes[0].niveau;
  const L = ['---', 'id: ' + id, 'nom: ' + nom, ...(alias.length ? ['alias: [' + alias.join(', ') + ']'] : []), 'schema: ' + schema, 'type: ' + type, 'niveau_min: ' + niv0, 'muscles_principaux: [' + mains.join(', ') + ']', 'muscles_secondaires: [' + secs.join(', ') + ']', ...(fam ? ['famille_core: ' + fam] : []), 'source_brouillon: []', 'statut: brouillon_coach', '---'];
  L.push('## Variantes (installation + matériel, avec échelon de difficulté)', '`echelon` : 1 = plus facile. Échelons et niveaux : règles du convertisseur (hasan-vers-fiches.mjs), NON SOURCÉ, relus par `coach`.', '', '| id variante | nom | echelon | niveau | materiel_tags | installation |', '|---|---|---|---|---|---|');
  for (const v of variantes) L.push('| ' + [v.id, v.nom, v.echelon, v.niveau, v.tags.join(', '), v.install].join(' | ') + ' |');
  L.push('', '## Consignes', ...steps(h).map((s, i) => (i + 1) + '. ' + s), '', "## Points d'attention", ...(kbx?.att ?? (['biceps', 'triceps', 'avant_bras'].includes(mains[0]) ? BRAS_TEXTE : null) ?? SCHEMA_TEXTE[schema] ?? SCHEMA_TEXTE.mobilite).map((x) => '- ' + x), '- Aucune valeur sourcée ; avis kine nécessaire avant toute douleur ou gêne.', '', '## Erreurs fréquentes', ...ERREURS.map((x) => '- ' + x), '', '## Progression / régression', '- plus-facile : aucun', '- plus-dur : aucun', '', '## Repères de dosage', 'Aucune valeur sourcée. Proposition du convertisseur, NON SOURCÉ, à valider par `kine` : ' + (kbx?.dose ?? DOSE(schema)) + '.', '');
  L.push('## Sécurité et contre-indications', 'Cases posées PAR RÈGLES (action la plus prudente des fiches existantes du même schéma et du même muscle, ' + DATE + ') ; `kine` relit les cas à risque. Prudence maximale en cas de doute. Les tableaux par zone sont NON SOURCÉS (choix prudents). Rien ici n’est un diagnostic.', '', '**Contre-indications par zone** (1 = gêne légère, 2 = gêne nette, 3 = douleur). Une case = une seule action ; format dans knowledge/format-fiches.md §4. Zone non listée = garder.', '', '| Zone | Niveau 1 | Niveau 2 | Niveau 3 |', '|---|---|---|---|');
  for (const [z, row] of Object.entries(safety.zones)) if (ZN[z]) L.push('| ' + ZN[z] + ' | ' + row.join(' | ') + ' |');
  L.push('', '**Notes**', '- grossesse : ' + (safety.grossesse.startsWith('retirer') ? 'retiré (choix prudent).' : 'adapté (choix prudent).') + ' post-partum : mêmes règles que la grossesse ; reprise des charges, des exercices abdominaux et des appuis prolongés seulement après l’avis de la sage-femme ou du médecin (G7).', '- general : douleur pendant l’exercice : arrête, pas de progression (R4).', '', '**Grossesse** : ' + safety.grossesse, '**Version plus douce** : aucune', '', '**Signes qui doivent faire arrêter**', '- Douleur (pas la simple brûlure du muscle qui travaille) : arrête (R4).', '- Position qui ne se tient plus, perte d’équilibre ou de contrôle : arrête.', '- Douleur qui dure, gonflement, perte de force, engourdissement ou fourmillements : consulte un professionnel de santé (S1, S2).', '- Signes généraux (R5) : douleur ou serrement dans la poitrine, malaise, vertige, essoufflement anormal : arrête la séance.', '', '**Objets du quotidien**', '- Appui ou support éventuel : stable, qui ne bouge pas ; sol sec et non glissant, chaussures aux pieds (R8).', '');
  L.push('## Photo', ...hasanIds.map((i) => '- gymvisual : ' + i + ' : affichable : oui (image du jeu Gym visual importée localement par l’utilisateur ; aucun fichier dans le dépôt)'), '', '## Sources', '| Affirmation | Source | Niveau de preuve | Lu le | Statut |', '|---|---|---|---|---|', '| Nom, muscles, matériel, consignes (traduction abrégée) | jeu hasaneyldrm/exercises-dataset, texte sous licence MIT (page crédits) ; ' + lotName + ' | description de l’exercice, sans étude | ' + DATE + ' | NON SOURCÉ |', '| Niveau, échelons, dosage, tableau par zone, grossesse, signes d’arrêt | règles du convertisseur d’après les fiches existantes ; choix prudents ; aucune étude ne teste ces adaptations | avis d’expert (extrapolation) | ' + DATE + ' | NON SOURCÉ |', '| Règles communes R1 à R10 et règles G, S, U | knowledge/regles-securite-communes.md | voir ce fichier | ' + DATE + ' | R1, R2, R3, R7, R8, R9 : NON SOURCÉ ; R4, R5, R6, R10 : PROVISOIRE |', '');
  return L.join('\n');
}

function generer() {
  const lot = args[1];
  const nomsFile = join(outDir, 'noms-fr-lot' + lot + '.tsv');
  if (!lot || !existsSync(nomsFile)) { console.error('fichier absent : ' + nomsFile); process.exit(2); }
  const data = new Map(JSON.parse(readFileSync(join(donnees, 'exercises.json'), 'utf8')).map((h) => [h.id, h]));
  const fams = families(readPlan());
  const existing = loadExisting();
  const taken = new Set(existing.flatMap((f) => [f.id, ...f.variants.map((v) => v.id)]));
  const dir = join(root, 'knowledge', 'exercices', 'vague3', 'lot-' + lot.padStart(2, '0'));
  mkdirSync(dir, { recursive: true });
  const corrFile = join(root, 'knowledge', 'exercices', 'CORRESPONDANCE-FICHES-HASAN.json');
  const corr = JSON.parse(readFileSync(corrFile, 'utf8'));
  const lignes = readFileSync(nomsFile, 'utf8').split('\n').filter(Boolean).slice(1).map((l) => l.split('\t'));
  const done = []; const skipped = [];
  for (const [famille, nomFr, aliasStr = ''] of lignes) {
    const rs = fams.get(famille);
    if (!rs || !nomFr || /^ECARTER/i.test(nomFr)) { skipped.push(famille + ' ' + (nomFr ?? '')); continue; }
    let id = slug(nomFr); let k = 2; while (taken.has(id)) id = slug(nomFr) + '-' + k++;
    taken.add(id);
    // variantes : une par jeu de tags, du plus facile au plus difficile
    const seen = new Set(); const vs = [];
    for (const r of [...rs].sort((a, b) => diffRank(a.tags.split(',')) - diffRank(b.tags.split(',')))) { if (seen.has(r.tags) || vs.length >= 4) continue; seen.add(r.tags); vs.push(r); }
    let cur = 0;
    const rows = vs.map((r) => { cur = Math.max(cur, LEVELS.indexOf(r.niveau)); return { r, tags: r.tags.split(','), niveau: LEVELS[cur] }; });
    let ech = 0; let prev = '';
    const variantes = rows.map(({ r, tags, niveau }) => {
      if (niveau !== prev) { ech++; prev = niveau; }
      const lab = EQ_NOM[tags.find((t) => EQ_NOM[t] && t !== 'poids_du_corps') ?? 'poids_du_corps'] ?? 'Variante';
      let vid = id + '-' + slug(tags.join('-')); while (taken.has(vid)) vid += '-b';
      taken.add(vid);
      const nom = tags.includes('banc_inclinable') ? lab + ', banc incliné' : tags.includes('banc') ? lab + ', sur un banc' : lab;
      return { id: vid, nom, echelon: ech, niveau, tags, install: 'Matériel : ' + tags.map((t) => t.replace(/_/g, ' ')).join(', ') + ' ; position de départ : voir les consignes.', hasan: r.id };
    });
    const PREF = ['poids_du_corps', 'elastique', 'halteres', 'swiss_ball', 'kettlebell', 'poulie', 'machine'];
    const rep = [...vs].sort((a, b) => { const f = (r) => { const i = PREF.findIndex((p) => r.tags.split(',').every((t) => t === p || HOME.has(t) || t === p)); return PREF.findIndex((p) => r.tags.split(',').includes(p)) < 0 ? 99 : PREF.findIndex((p) => r.tags.split(',').includes(p)); }; return f(a) - f(b); })[0];
    const h = data.get(rep.id);
    const safety = deriveSafety(rep.schema, rep.main.split(','), variantes.flatMap((v) => v.tags), rs.map((r) => r.name).join(' '), famille);
    const md = ficheMd({ famille, id, nom: nomFr, alias: aliasStr.split(',').map((s) => s.trim()).filter(Boolean), schema: rep.schema, type: rep.type, fam: rep.fam, mains: rep.main.split(','), secs: rep.sec.split(',').filter(Boolean), variantes, h, safety, hasanIds: vs.map((r) => r.id), lotName: 'lot ' + lot });
    writeFileSync(join(dir, id + '.md'), md);
    for (const v of variantes) corr.push({ hasan_id: v.hasan, fiche: id, variante: v.id, niveau: 'sûr' });
    for (const r of rs) { const j = vs.findIndex((v) => v.tags === r.tags); if (!vs.includes(r) && j >= 0) corr.push({ hasan_id: r.id, fiche: id, variante: variantes[j].id, niveau: 'proche' }); }
    done.push(id);
  }
  const key = (c) => c.hasan_id + '|' + c.fiche + '|' + c.variante;
  writeFileSync(corrFile, JSON.stringify([...new Map(corr.map((c) => [key(c), c])).values()]) + '\n');
  const l = lots(); l[lot] = lignes.map((x) => x[0]); writeFileSync(lotsFile, JSON.stringify(l));
  console.log(done.length + ' fiches écrites dans ' + dir + ' ; écartées par le coach : ' + skipped.length);
}

// Après les relectures (coach / kiné peuvent supprimer ou renommer fiches et variantes) : la correspondance ne garde que des couples (fiche, variante) existants ;
// une variante disparue renvoie à la première variante de la fiche (niveau « proche »), une fiche disparue retire la ligne ; les lignes de fiches du lot 7 ou plus anciennes ne sont pas touchées.
function nettoyer() {
  const ex = new Map(loadExisting().map((f) => [f.id, f]));
  const corrFile = join(root, 'knowledge', 'exercices', 'CORRESPONDANCE-FICHES-HASAN.json');
  const corr = JSON.parse(readFileSync(corrFile, 'utf8'));
  let retire = 0; let remap = 0;
  const out = [];
  for (const c of corr) {
    const f = ex.get(c.fiche);
    if (!f) { retire++; continue; }
    if (!f.variants.some((v) => v.id === c.variante)) { if (!f.variants.length) { retire++; continue; } c.variante = f.variants[0].id; c.niveau = 'proche'; remap++; }
    out.push(c);
  }
  const key = (c) => c.hasan_id + '|' + c.fiche + '|' + c.variante;
  const uniq = [...new Map(out.map((c) => [key(c), c])).values()];
  writeFileSync(corrFile, JSON.stringify(uniq) + '\n');
  console.log(corr.length + ' lignes -> ' + uniq.length + ' (retirées ' + retire + ', variante remplacée ' + remap + ')');
}

if (mode === 'nettoyer') nettoyer();
else if (mode === 'plan') plan();
else if (mode === 'noms') noms();
else if (mode === 'generer') generer();
else { console.error('Usage : plan | noms --lot N [--taille 60] [--zone s1,s2] | generer <lot>'); process.exit(2); }
