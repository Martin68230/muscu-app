import { useEffect, useState } from 'preact/hooks';
import type { Injury, InjuryLevel, InjuryZone } from '../../data/model';
import { create, list, softDelete, update } from '../../data/repo';
import { effectiveLevel, NECK_SHOCK_LABEL, NECK_SHOCK_MESSAGE } from '../../data/injury-rules';

const ZONES: [InjuryZone, string][] = [
  ['cou', 'Cou'],
  ['epaule', 'Épaule'],
  ['coude', 'Coude'],
  ['poignet', 'Poignet'],
  ['dos', 'Dos'],
  ['hanche', 'Hanche'],
  ['genou', 'Genou'],
  ['cheville', 'Cheville'],
  ['cuisse', 'Cuisse (arrière)'],
  ['aine', 'Aine'],
];

const LEVELS: [InjuryLevel, string][] = [
  [1, 'Gêne légère'],
  [2, 'Gêne nette'],
  [3, 'Douleur'],
];

/** Profil blessures : zone + niveau, facultatif, privé (jamais partagé par défaut). */
export function Injuries() {
  const [rows, setRows] = useState<Injury[]>([]);
  const [open, setOpen] = useState<InjuryZone | null>(null);

  const reload = async () => setRows((await list('injuries')).filter((r) => r.active));
  useEffect(() => {
    reload();
  }, []);

  const rowOf = (z: InjuryZone) => rows.find((r) => r.zone === z);

  const toggleZone = async (z: InjuryZone) => {
    const row = rowOf(z);
    if (!row) {
      await create('injuries', { zone: z, side: null, level: 1, note: '', active: true });
      setOpen(z);
    } else setOpen(open === z ? null : z);
    await reload();
  };
  const setLevel = async (row: Injury, level: InjuryLevel) => {
    await update('injuries', row.id, { level });
    await reload();
  };
  const setShock = async (row: Injury, afterShock: boolean) => {
    await update('injuries', row.id, { afterShock });
    await reload();
  };
  const remove = async (row: Injury) => {
    await softDelete('injuries', row.id);
    setOpen(null);
    await reload();
  };

  const current = open ? rowOf(open) : undefined;
  const level = current ? effectiveLevel(current) : null;
  const shock = !!current && current.zone === 'cou' && !!current.afterShock;

  return (
    <section aria-labelledby="inj-title">
      <h2 id="inj-title">Gênes et blessures</h2>
      <p class="dim small">Facultatif. Reste sur ce téléphone, jamais partagé. Touche une zone qui te gêne : l'appli adapte ou retire les exercices concernés. « Cuisse » = face arrière (ischio-jambiers) ; « Aine » = intérieur de la cuisse. L'appli ne pose aucun diagnostic.</p>
      <div class="zones" role="group" aria-label="Zones du corps">
        {ZONES.map(([z, label]) => (
          <button key={z} class="zone-btn" aria-pressed={!!rowOf(z)} onClick={() => toggleZone(z)}>
            {label}
            {rowOf(z) && <span class="zone-lvl"> · {effectiveLevel(rowOf(z)!)}</span>}
          </button>
        ))}
      </div>

      {current && level && (
        <div class="card" role="group" aria-label={`Réglage : ${ZONES.find(([z]) => z === current.zone)?.[1]}`}>
          <div class="segmented" role="group" aria-label="Niveau de la gêne">
            {LEVELS.map(([v, label]) => (
              <button key={v} aria-pressed={level === v} disabled={shock && v !== 3} onClick={() => setLevel(current, v)}>
                {label}
              </button>
            ))}
          </div>
          {current.zone === 'cou' && (
            <label class="check">
              <input type="checkbox" checked={shock} onChange={(e) => setShock(current, e.currentTarget.checked)} />
              <span>{NECK_SHOCK_LABEL}.</span>
            </label>
          )}
          {shock && <div class="notice" role="status"><p>{NECK_SHOCK_MESSAGE}</p></div>}
          {level === 3 && !shock && (
            <div class="notice" role="status"><p>Douleur signalée : demande l'avis d'un professionnel de santé avant de reprendre les exercices de cette zone. L'appli n'en propose aucun pour cette zone.</p></div>
          )}
          {level >= 2 && (
            <p class="dim small">Consulte si tu as aussi : un gonflement, une perte de force, un engourdissement ou des fourmillements, une douleur après une chute ou un choc, une douleur la nuit ou au repos, ou une douleur qui dure plus de 2 semaines. Pendant un exercice, une douleur vive dans l'articulation : arrête l'exercice.</p>
          )}
          <button class="btn" onClick={() => remove(current)}>Enlever cette zone</button>
        </div>
      )}
    </section>
  );
}
