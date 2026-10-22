import { useEffect, useState } from 'preact/hooks';
import type { EquipmentProfile } from '../../data/model';
import { list, update } from '../../data/repo';
import {
  EQUIPMENT_GROUPS, formatWeights, normalizeEquipment, type NormalizedEquipment, parseWeights, toggleTag, type EquipmentOption,
} from '../../data/equipment-options';

const WEIGHT_LABEL = {
  dumbbell: ['Poids des haltères (kg)', 'dumbbellWeightsKg'],
  kettlebell: ['Poids des kettlebells (kg)', 'kettlebellWeightsKg'],
  plates: ['Poids des disques (kg)', 'platesKg'],
} as const;

/** Matériel : tout est une case à cocher, privé, stocké dans le profil matériel (décision D7). */
export function Equipment() {
  const [eq, setEq] = useState<NormalizedEquipment | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    list('equipment').then((rows) => rows[0] && setEq(normalizeEquipment(rows[0])));
  }, []);
  if (!eq) return null;

  const save = async (patch: Partial<EquipmentProfile>) => setEq(normalizeEquipment(await update('equipment', eq.id, patch)));
  const checked = (o: EquipmentOption) => (o.implicit ? !eq.disabledImplicit.includes(o.tag) : eq.tags.includes(o.tag));

  const weightField = (o: EquipmentOption) => {
    if (!o.weights || !checked(o)) return null;
    const [label, key] = WEIGHT_LABEL[o.weights];
    const id = `w-${key}`;
    return (
      <div class="eq-extra">
        {o.weights === 'dumbbell' && (
          <div class="segmented" role="group" aria-label="Type d'haltères">
            {([['fixes', 'Fixes'], ['reglables', 'Réglables']] as const).map(([v, t]) => (
              <button key={v} aria-pressed={eq.dumbbellKind === v} onClick={() => save({ dumbbellKind: eq.dumbbellKind === v ? null : v })}>
                {t}
              </button>
            ))}
          </div>
        )}
        <label for={id} class="small dim">{label}, séparés par des points-virgules</label>
        <input
          id={id}
          class="field"
          type="text"
          inputmode="decimal"
          placeholder="ex. 4; 6; 8; 12,5"
          value={draft[key] ?? formatWeights(eq[key])}
          onInput={(e) => setDraft({ ...draft, [key]: e.currentTarget.value })}
          onBlur={() => {
            const w = parseWeights(draft[key] ?? formatWeights(eq[key]));
            setDraft({ ...draft, [key]: formatWeights(w) });
            save({ [key]: w });
          }}
        />
      </div>
    );
  };

  return (
    <section aria-labelledby="eq-title">
      <h2 id="eq-title">Mon matériel</h2>
      <p class="dim small">Coche ce que tu as. L'appli ne te propose que des exercices faisables avec. Reste sur ce téléphone.</p>
      {EQUIPMENT_GROUPS.map((g) => (
        <div class="card" key={g.id} role="group" aria-label={g.title}>
          <h3 class="eq-title">{g.title}</h3>
          {g.hint && <p class="dim small">{g.hint}</p>}
          {g.options.map((o) => (
            <div key={o.tag}>
              <label class="check">
                <input type="checkbox" checked={checked(o)} onChange={(e) => save(toggleTag(eq, o.tag, e.currentTarget.checked))} />
                <span>{o.label}</span>
              </label>
              {weightField(o)}
            </div>
          ))}
        </div>
      ))}
      <div class="card">
        <label for="eq-other" class="small dim">Autre matériel (texte libre, pour toi)</label>
        <input
          id="eq-other"
          class="field"
          type="text"
          maxLength={200}
          enterkeyhint="done"
          value={eq.other}
          onInput={(e) => setEq({ ...eq, other: e.currentTarget.value })}
          onBlur={() => save({ other: eq.other.trim() })}
        />
      </div>
    </section>
  );
}
