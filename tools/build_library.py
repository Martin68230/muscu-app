"""Construit la bibliothèque brouillon structurée : mouvements (familles) + variantes par matériel.
Entrées : free-exercise-db (dist/exercises.json), maxwu/exercises-dataset (data/exercises.json, texte seulement),
wger (wger/exercises/fixtures/*.json). ADAPTER les chemins ci-dessous (/home/claude/...) avant de relancer.
Usage : python3 tools/build_library.py knowledge   -> knowledge/exercise-library-draft.csv + library-stats.json (à déplacer dans knowledge/)."""
import json, re, csv, collections, sys

OUT = sys.argv[1]  # dossier knowledge/

# ---------- Normalisation du matériel ----------
EQ_MAP = {
    # free-exercise-db
    'barbell': 'barre', 'dumbbell': 'halteres', 'body only': 'poids_du_corps', 'cable': 'poulie',
    'machine': 'machine', 'kettlebells': 'kettlebell', 'bands': 'elastique', 'medicine ball': 'medecine_ball',
    'exercise ball': 'swiss_ball', 'foam roll': 'rouleau_massage', 'e-z curl bar': 'barre_ez', 'other': 'autre',
    # maxwu
    'body weight': 'poids_du_corps', 'leverage machine': 'machine', 'band': 'elastique', 'smith machine': 'machine',
    'kettlebell': 'kettlebell', 'weighted': 'lest', 'stability ball': 'swiss_ball', 'ez barbell': 'barre_ez',
    'assisted': 'machine', 'sled machine': 'machine', 'rope': 'corde', 'roller': 'rouleau_massage',
    'resistance band': 'elastique', 'bosu ball': 'bosu', 'olympic barbell': 'barre', 'wheel roller': 'roue_abdos',
    'upper body ergometer': 'machine_cardio', 'skierg machine': 'machine_cardio', 'hammer': 'materiel_specialise',
    'stationary bike': 'machine_cardio', 'tire': 'materiel_specialise',
    # wger
    'sz-bar': 'barre_ez', 'gym mat': 'tapis', 'swiss ball': 'swiss_ball', 'pull-up bar': 'barre_traction',
    'none (bodyweight exercise)': 'poids_du_corps', 'bench': 'banc', 'incline bench': 'banc_inclinable',
    'resistance band': 'elastique', 'cable machine': 'poulie',
}
NAME_TAGS = [  # matériel détecté dans le nom (ajouté aux tags)
    (r"\bchair\b", 'chaise'), (r"\bwall\b", 'mur'), (r"\b(box|step|stair)s?\b", 'marche_ou_box'),
    (r"\bbench\b", 'banc'), (r"\bincline\b|\bdecline\b", 'banc_inclinable'),
    (r"pull-?ups?\b|chin-?ups?\b|\bhanging\b|\bhang\b", 'barre_traction'),
    (r"\btrx\b|suspension|\brings?\b", 'sangles_suspension'), (r"jump rope|skipping rope|rope jump", 'corde_a_sauter'),
    (r"\btowel\b", 'serviette'), (r"\bdoor\b", 'porte'), (r"\bsandbag\b", 'sac_de_sable'),
    (r"\bsled\b|prowler|\btire\b|atlas|\bkeg\b|\blog lift|yoke|rickshaw|conan|circus bell", 'materiel_specialise'),
    (r"\bsmith\b|\blever\b|machine", 'machine'), (r"\bcable\b", 'poulie'), (r"dumbbell", 'halteres'),
    (r"kettlebell", 'kettlebell'), (r"\bbarbell\b", 'barre'), (r"\bband(s|ed)?\b", 'elastique'),
    (r"medicine ball", 'medecine_ball'), (r"stability ball|swiss ball|exercise ball", 'swiss_ball'),
    (r"ab wheel|wheel roll", 'roue_abdos'), (r"\bbosu\b", 'bosu'), (r"foam roll", 'rouleau_massage'),
    (r"battling ropes|battle rope", 'corde_ondulatoire'), (r"treadmill|elliptical|bike|bicycling|ergometer|rowing machine|skierg", 'machine_cardio'),
]
SALLE = {'poulie', 'machine', 'machine_cardio', 'materiel_specialise'}

def eq_tags(raw, name):
    tags = set()
    for part in re.split(r"\|", raw or ''):
        p = part.strip().lower()
        if not p or p == 'none':
            continue
        tags.add(EQ_MAP.get(p, 'autre'))
    ln = name.lower()
    for rx, t in NAME_TAGS:
        if re.search(rx, ln):
            tags.add(t)
    if 'corde' in tags:  # 'rope' ambigu : poignée de poulie ou corde à sauter/ondulatoire
        tags.discard('corde')
        if 'poulie' not in tags and not tags & {'corde_a_sauter', 'corde_ondulatoire'}:
            tags.add('corde_a_preciser')
    if len(tags) > 1:
        tags.discard('poids_du_corps')
    if not tags:
        tags.add('poids_du_corps')
    return sorted(tags)

# ---------- Famille de mouvement (nom sans matériel ni modificateurs) ----------
STOP = set('''dumbbell dumbbells barbell barbells kettlebell kettlebells band bands banded with the a an on of to and
cable cables machine lever leverage smith standing seated one arm single alternate alternating v version weighted
bodyweight body weight ez sz bar curl-bar using hold holding in at for from olympic resistance assisted'''.split())

def family_key(name):
    n = name.lower()
    n = re.sub(r"\bv\.?\s*\d+\b", " ", n)
    n = re.sub(r"[^a-z ]", " ", n)
    words = [w[:-1] if w.endswith('s') and len(w) > 3 else w for w in n.split() if w not in STOP]
    return ' '.join(sorted(words))

# ---------- Type et schéma de mouvement (deviné par mots-clés) ----------
TYPES = [
    ('mobilite_recup', r"stretch|mobility|foam|\broll(ing)?\b|release|yoga|child'?s pose|pigeon|\bcat\b|cobra|massage|world'?s greatest|couch|thoracic|circles|smr"),
    ('cardio', r"\brun|jog|sprint|jumping jack|burpee|bike|bicycl|cycling|ergometer|elliptic|treadmill|stair ?master|skier|jump rope|skipping|mountain climber|high knee|butt kick|\bwalk(ing)?\b(?! lunge)|swim|shuttle|cardio|row(ing)? machine"),
    ('fonctionnel', r"carry|farmer|yoke|sled|prowler|\btire\b|sandbag|turkish|get-?up|swing|snatch|\bclean\b|jerk|throw|slam|crawl|wood ?chop|pallof|windmill|battling|thruster|wall ball|\bjump|\bhop|bound|plyo|\bbox jump|balance|bosu|atlas|keg|log lift"),
    ('gainage', r"plank|dead ?bug|bird ?dog|hollow|crunch|sit-?up|leg raise|knee raise|russian twist|v-?up|ab wheel|rollout|flutter kick|scissor"),
]
PATTERNS = [
    ('carry', r"carry|farmer|yoke|suitcase|waiter|rickshaw"),
    ('anti_rotation', r"pallof|anti-?rotation"),
    ('rotation', r"wood ?chop|\bchop\b|windmill|russian twist|twist|rotation"),
    ('throw', r"throw|slam|toss|chest pass"),
    ('jump', r"\bjump|\bhop|bound|\bleap|skip|depth|frog|plyo"),
    ('ballistic', r"swing|snatch|\bclean\b|jerk|thruster"),
    ('locomotion', r"crawl|sled|prowler|drag|sprint|\brun|walk(?!.*lunge)|shuttle|carioca"),
    ('lunge_unilateral', r"lunge|step[- ]?up|split squat|pistol|bulgarian|single[- ]leg (squat|deadlift|romanian)"),
    ('squat', r"squat|leg press|hack|wall sit|sissy"),
    ('hinge', r"deadlift|good ?morning|hip thrust|glute bridge|\bbridge\b|hyperextension|back extension|kettlebell swing|pull[- ]through|romanian|rdl"),
    ('pull_v', r"pull-?ups?|chin-?ups?|pulldown|pull-?down|lat pull|muscle-?up|rope climb"),
    ('pull_h', r"\brow\b|rows\b|face pull|reverse fly|rear delt|inverted row|seal row|pullover"),
    ('push_v', r"overhead press|shoulder press|military|push press|arnold|handstand|pike push|landmine press|\bpress\b.*overhead"),
    ('push_h', r"bench press|push-?ups?|chest press|\bdips?\b|floor press|\bfly\b|flye|crossover|pec deck"),
    ('core', r"plank|dead ?bug|bird ?dog|hollow|crunch|sit-?up|leg raise|knee raise|v-?up|ab wheel|rollout|flutter|scissor|side bend"),
    ('arms', r"curl|triceps|tricep|extension|kickback|skull|wrist"),
    ('shoulders_iso', r"lateral raise|front raise|upright row|shrug|y raise|external rotation|internal rotation"),
    ('legs_iso', r"leg extension|leg curl|calf|adduct|abduct|kickback"),
    ('mobility', r"stretch|mobility|foam|roll|release|yoga|pose|circles"),
    ('conditioning', r"burpee|jack|mountain climber|high knee|butt kick|battling|bike|cycling|elliptic|treadmill|ergometer|skier|jump rope"),
]

def first_match(rules, name, default):
    ln = name.lower()
    for tag, rx in rules:
        if re.search(rx, ln):
            return tag
    return default

def suspect(name):
    flags = []
    if re.match(r"^\d{3,}", name):
        flags.append('nom_avec_numero')
    if re.search(r"[áéíóúñãõç]|\b(en|con|del|para|de la|com|na)\b", name.lower()):
        flags.append('langue_a_verifier')
    if re.search(r"\bHD\b|\b\d$|\btest\b", name):
        flags.append('nom_suspect')
    return '|'.join(flags)

# ---------- Chargement des 3 sources ----------
rows = []
fdb = json.load(open('/home/claude/data/exercises.json', encoding='utf-8'))
for x in fdb:
    rows.append(dict(name=x['name'], src='free-exercise-db', lic='Unlicense (domaine public)', eq=x.get('equipment') or '',
                     group=x['category'], level=x.get('level') or '', photo='oui (domaine public)',
                     muscles='|'.join(x.get('primaryMuscles') or [])))
mx = json.load(open('/home/claude/maxwu/exercises-dataset/data/exercises.json', encoding='utf-8'))
for x in mx:
    rows.append(dict(name=x['name'].title(), src='maxwu-dataset', lic='MIT déclaré, provenance douteuse (texte seulement)',
                     eq=x.get('equipment') or '', group=x.get('body_part') or '', level='', photo='non (droits Gym visual)',
                     muscles=x.get('target') or ''))
base = '/home/claude/wgerclone/wger/wger/exercises/fixtures/'
lic_names = {1: 'CC-BY-SA 3.0', 2: 'CC-BY-SA 4.0', 3: 'CC0', 4: 'CC-BY 4.0', 5: 'ODbL'}
ex = {x['pk']: x['fields'] for x in json.load(open(base + 'exercise-base-data.json', encoding='utf-8'))}
cats = {x['pk']: x['fields']['name'] for x in json.load(open(base + 'categories.json', encoding='utf-8'))}
eqs = {x['pk']: x['fields']['name'] for x in json.load(open(base + 'equipment.json', encoding='utf-8'))}
for x in json.load(open(base + 'translations.json', encoding='utf-8')):
    f = x['fields']
    if f.get('language') != 2 or not f.get('name'):
        continue
    e = ex.get(f.get('exercise'), {})
    rows.append(dict(name=f['name'].strip(), src='wger', lic=lic_names.get(f.get('license') or e.get('license'), 'à vérifier') + ' (attribution : ' + (f.get('license_author') or 'wger.de') + ')',
                     eq='|'.join(eqs.get(i, '') for i in e.get('equipment', [])), group=cats.get(e.get('category'), ''),
                     level='', photo='à vérifier (licence par image)', muscles=''))

# ---------- Dédoublonnage exact (même nom normalisé + même matériel) ----------
def exact_key(r):
    return re.sub(r"[^a-z0-9]", "", r['name'].lower()) + '#' + ','.join(eq_tags(r['eq'], r['name']))
merged = {}
for r in rows:
    k = exact_key(r)
    if k in merged:
        merged[k]['src'] += '+' + r['src'] if r['src'] not in merged[k]['src'] else ''
        if merged[k]['photo'].startswith('non') and r['photo'].startswith('oui'):
            merged[k]['photo'] = r['photo']
        if not merged[k]['level'] and r['level']:
            merged[k]['level'] = r['level']
        continue
    merged[k] = dict(r)
variants = list(merged.values())

# ---------- Familles ----------
fam = collections.defaultdict(list)
for v in variants:
    fam[family_key(v['name'])].append(v)
fam_ids = {}
out = []
for i, (k, vs) in enumerate(sorted(fam.items()), 1):
    fid = f"M{i:04d}"
    fname = min((v['name'] for v in vs), key=len)
    for v in sorted(vs, key=lambda v: v['name'].lower()):
        tags = eq_tags(v['eq'], v['name'])
        out.append({
            'mouvement_id': fid, 'mouvement': fname, 'variante': v['name'],
            'type': first_match(TYPES, v['name'], 'force'),
            'schema_mouvement': first_match(PATTERNS, v['name'], 'a_classer'),
            'materiel_tags': '|'.join(tags),
            'salle_uniquement': 'oui' if set(tags) & SALLE else 'non',
            'niveau_source': v['level'], 'groupe_source': v['group'], 'muscles_source': v['muscles'],
            'source': v['src'], 'licence': v['lic'], 'photo_reutilisable': v['photo'],
            'alerte_nom': suspect(v['name']), 'statut': 'brouillon_a_relire',
        })

cols = list(out[0].keys())
with open(OUT + '/exercise-library-draft.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(out)

# ---------- Couverture selon des profils de matériel ----------
IMPLICITE = {'poids_du_corps', 'tapis', 'chaise', 'mur', 'marche_ou_box', 'serviette', 'porte'}
PROFILS = {
    'A. poids du corps seul (+ chaise, mur, marche)': IMPLICITE,
    'B. A + élastiques': IMPLICITE | {'elastique'},
    'C. A + haltères': IMPLICITE | {'halteres'},
    'D. A + haltères + élastiques + barre de traction': IMPLICITE | {'halteres', 'elastique', 'barre_traction'},
    'E. D + banc + kettlebell + roue abdos + swiss ball': IMPLICITE | {'halteres', 'elastique', 'barre_traction', 'banc', 'banc_inclinable', 'kettlebell', 'roue_abdos', 'swiss_ball'},
    'F. salle complète': None,
}
MAIN = ['squat', 'hinge', 'lunge_unilateral', 'push_h', 'push_v', 'pull_h', 'pull_v', 'core', 'carry', 'rotation', 'anti_rotation', 'jump', 'mobility', 'conditioning']
stats = {'variantes': len(out), 'mouvements': len(fam), 'lignes_brutes': len(rows),
         'types': collections.Counter(r['type'] for r in out), 'schemas': collections.Counter(r['schema_mouvement'] for r in out),
         'alertes': collections.Counter(a for r in out for a in r['alerte_nom'].split('|') if a),
         'sources': collections.Counter(r['source'] for r in out), 'couverture': {}}
for pname, allowed in PROFILS.items():
    ok = [r for r in out if allowed is None or set(r['materiel_tags'].split('|')) <= allowed]
    mv = collections.defaultdict(set)
    for r in ok:
        mv[r['schema_mouvement']].add(r['mouvement_id'])
    stats['couverture'][pname] = {'variantes': len(ok), 'mouvements': len({r['mouvement_id'] for r in ok}),
                                  'par_schema': {p: len(mv.get(p, ())) for p in MAIN}}
json.dump(stats, open(OUT + '/../library-stats.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(stats, ensure_ascii=False, indent=1))
