// @vitest-environment jsdom
// F4 : chargement, recherche, variante selon le matériel, fiche d'exercice (aucun identifiant brut), vidéo, signalement.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import {
  FICHES_ERROR,
  chooseVariant,
  cleanText,
  injuryLines,
  loadFiches,
  nameOfId,
  normalize,
  parenGroups,
  SAFETY_WORD,
  searchFiches,
  setFichesForTests,
  type Fiche,
} from '../../src/data/fiches';
import { availableTags } from '../../src/generator/context';
import { FicheView, displayImages } from '../../src/ui/screens/Fiche';
import { IFRAME_SANDBOX } from '../../src/ui/VideoButton';
import { listReports } from '../../src/data/reports';
import type { EquipmentProfile, Injury, InjuryZone } from '../../src/data/model';

const RAW: string = readFileSync('public/data/fiches.json', 'utf8');
const ALL: Fiche[] = JSON.parse(RAW).fiches;
const ALL_FICHES = ALL;
const byId = (id: string) => ALL.find((f) => f.id === id)!;

function eq(tags: string[], preset: EquipmentProfile['preset'] = 'perso', disabledImplicit: string[] = []) {
  return { preset, tags, disabledImplicit, dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
}
const owned = (tags: string[], preset: EquipmentProfile['preset'] = 'perso') => availableTags(eq(tags, preset));

function injury(zone: InjuryZone, level: 1 | 2 | 3): Injury {
  return { zone, level, active: true, side: null, note: '', id: `i-${zone}`, deletedAt: null } as unknown as Injury;
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => value });
}

function view(f: Fiche, o: { equipment?: ReturnType<typeof eq> | null; injuries?: Injury[]; pregnancy?: 'enceinte' | 'non' | null } = {}) {
  return render(
    <FicheView
      fiche={f}
      all={ALL}
      equipment={(o.equipment ?? null) as EquipmentProfile | null}
      injuries={o.injuries ?? []}
      pregnancy={o.pregnancy ?? null}
    />,
  );
}

beforeEach(() => {
  setOnline(true);
  setFichesForTests(null);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('chargement', () => {
  it('charge fiches.json une seule fois et le garde en mémoire', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => JSON.parse(RAW) }));
    vi.stubGlobal('fetch', fetchMock);
    const a = await loadFiches();
    const b = await loadFiches();
    expect(a.length).toBe(ALL.length);
    expect(b).toBe(a);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('donne une erreur lisible si le fichier est absent', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })));
    await expect(loadFiches()).rejects.toThrow(FICHES_ERROR);
  });

  it('refuse un fichier qui n’a pas le bon format', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ autre: 1 }) })));
    await expect(loadFiches()).rejects.toThrow(FICHES_ERROR);
  });
});

describe('recherche', () => {
  it('ignore accents, majuscules, apostrophes et tirets', () => {
    expect(normalize("Élastique d’Épaule-Test")).toBe('elastique d epaule test');
    const a = searchFiches(ALL, 'ÉLASTIQUE');
    const b = searchFiches(ALL, 'elastique');
    expect(a.length).toBeGreaterThan(0);
    expect(a.map((f) => f.id)).toEqual(b.map((f) => f.id));
  });

  it('trouve par alias (nom d’usage) et par muscle', () => {
    expect(searchFiches(ALL, 'pallof').map((f) => f.id)).toContain('pallof-elastique');
    const fess = searchFiches(ALL, 'fessiers');
    expect(fess.length).toBeGreaterThan(5);
    expect(fess.every((f) => [...f.musclesPrincipaux, ...f.musclesSecondaires].some((m) => m.includes('fess')))).toBe(true);
  });

  it('plusieurs mots : tous doivent correspondre ; rien trouvé -> liste vide', () => {
    expect(searchFiches(ALL, 'zzzxxx')).toEqual([]);
    expect(searchFiches(ALL, '').length).toBe(ALL.length);
    expect(searchFiches(ALL, 'pallof fessiers').length).toBeLessThan(searchFiches(ALL, 'pallof').length + 1);
  });
});

describe('variante selon le matériel', () => {
  const pallof = byId('pallof-elastique');

  it('sans matériel : aucune variante, et on dit ce qu’il manque', () => {
    const ch = chooseVariant(pallof, owned([]));
    expect(ch.best).toBeNull();
    expect(ch.closest?.missing).toEqual(['elastique']);
    const { container } = view(pallof, { equipment: eq([]) });
    expect(container.textContent).toContain('Il te manque du matériel');
    expect(container.textContent).toContain('un élastique');
      });

  it('avec un élastique : la variante la plus facile compatible', () => {
    const ch = chooseVariant(pallof, owned(['elastique']));
    expect(ch.best?.id).toBe('pallof-elastique-genoux');
    const { container } = view(pallof, { equipment: eq(['elastique']) });
    expect(container.textContent).toMatch(/Pour toi.*À genoux — Élastique ancré/);
    expect(container.textContent).not.toContain('Pour toi : ');
  });

  it('sans la porte (implicite décochée) : la variante n’est plus compatible', () => {
    const ch = chooseVariant(pallof, availableTags(eq(['elastique'], 'perso', ['porte'])));
    expect(ch.best).toBeNull();
    expect(ch.closest?.missing).toEqual(['porte']);
  });

  it('haltères : choisit l’échelon le plus bas dont tout le matériel est possédé', () => {
    const f = byId('developpe-epaules-halteres');
    expect(chooseVariant(f, owned([])).best).toBeNull();
    const ch = chooseVariant(f, owned(['halteres']));
    expect(ch.best?.echelon).toBe(Math.min(...ch.rows.filter((r) => r.missing.length === 0).map((r) => r.variante.echelon)));
    expect(ch.best?.tags.every((t) => owned(['halteres']).has(t))).toBe(true);
  });

  it('poids du corps seulement : une fiche sans matériel a une variante', () => {
    expect(chooseVariant(byId('fente-avant'), owned([])).best).not.toBeNull();
  });

  it('salle (preset F) : tout le matériel est disponible', () => {
    const f = byId('abduction-hanche-machine');
    expect(chooseVariant(f, owned([])).best).toBeNull();
    expect(chooseVariant(f, owned([], 'F')).best).not.toBeNull();
  });

  it('liste des variantes : « il te manque » sur celles qui ne sont pas compatibles', () => {
    const { container } = view(byId('fente-avant'), { equipment: eq([]) });
    const lis = [...container.querySelectorAll('.fiche-variantes li')];
    expect(lis.length).toBe(byId('fente-avant').variantes.length);
    const manque = lis.filter((li) => li.textContent?.includes('Il te manque'));
    expect(manque.length).toBeGreaterThan(0);
    expect(manque.some((li) => li.textContent?.includes('des haltères'))).toBe(true);
  });
});

describe('fiche : aucun identifiant brut dans le texte affiché', () => {
  const ids = new Set<string>();
  for (const f of ALL) {
    ids.add(f.id);
    f.variantes.forEach((v) => ids.add(v.id));
  }
  const FIVE = ['pallof-elastique', 'developpe-epaules-halteres', 'curl-ischios-serviette', 'abduction-hanche-machine', 'fente-avant'];
  const zones: InjuryZone[] = ['cou', 'epaule', 'coude', 'poignet', 'dos', 'hanche', 'genou', 'cheville', 'cuisse', 'aine'];

  function expectClean(text: string) {
    expect(text).not.toMatch(/\w_\w/); // snake_case
    expect(text).not.toMatch(/\b[A-Z]\d{1,2}\b/); // codes de règle (R8, G4...)
    const bad = text.match(/.{0,50}(undefined|\[object|NaN|NON SOURC|PROVISOIRE).{0,30}/);
    expect(bad ? bad[0].slice(0, 120) : '').toBe('');
    const tokens = text.match(/[a-z0-9]+(?:-[a-z0-9]+)+/g) ?? [];
    expect(tokens.filter((t) => ids.has(t))).toEqual([]); // identifiants de fiches ou de variantes
  }

  it.each(FIVE)('fiche %s (toutes les zones de gêne et grossesse)', (id) => {
    const f = byId(id);
    for (const lvl of [1, 2, 3] as const) {
      const { container } = view(f, {
        equipment: eq(['elastique', 'halteres']),
        injuries: zones.map((z) => injury(z, lvl)),
        pregnancy: 'enceinte',
      });
      expectClean(container.textContent ?? '');
      cleanup();
    }
  });

  it('nettoyage de tous les textes des 140 fiches', () => {
    for (const f of ALL) {
      const texts = [
        f.nom,
        ...f.consignes,
        ...f.pointsAttention,
        ...f.securite.signesArret,
        ...f.securite.objetsQuotidien,
        ...Object.values(f.securite.notes),
        ...f.variantes.map((v) => v.installation),
      ];
      for (const t of texts) expectClean(cleanText(t, ALL));
    }
  });
});

describe('lignes blessure et grossesse', () => {
  it('ligne « À cause de ta gêne au genou (niveau 2) » avec le texte lisible de la case', () => {
    const f = byId('pallof-elastique');
    const { container } = view(f, { equipment: eq(['elastique']), injuries: [injury('genou', 2)] });
    const t = container.querySelector('.fiche-securite')?.textContent ?? '';
    expect(t).toContain('À cause de ta gêne au genou (niveau 2) : adapter :');
    expect(t).toContain('debout, genoux souples');
    expect(t).not.toContain('Pendant ta grossesse');
  });

  it('case « retirer » au niveau 3', () => {
    const lines = injuryLines(byId('pallof-elastique'), [injury('epaule', 3)], ALL);
    expect(lines[0].text).toContain('(niveau 3) : retirer :');
  });

  it('pas de ligne pour une zone absente de la fiche, une blessure inactive ou supprimée', () => {
    const f = byId('pallof-elastique');
    expect(injuryLines(f, [injury('cou', 2)], ALL)).toEqual([]);
    expect(injuryLines(f, [{ ...injury('genou', 2), active: false }], ALL)).toEqual([]);
    expect(injuryLines(f, [{ ...injury('genou', 2), deletedAt: '2026-01-01' }], ALL)).toEqual([]);
    const { container } = view(f, { injuries: [] });
    expect(container.querySelector('.fiche-securite')).toBeNull();
  });

  it('ligne grossesse seulement si grossesse cochée', () => {
    const f = byId('pallof-elastique');
    const a = view(f, { pregnancy: 'enceinte' });
    expect(a.container.querySelector('.fiche-securite')?.textContent).toContain('Pendant ta grossesse : adapter :');
    expect(a.container.textContent).toContain('maintien court');
    cleanup();
    const b = view(f, { pregnancy: 'non' });
    expect(b.container.textContent).not.toContain('grossesse');
  });
});

describe('vidéo, signalement, images', () => {
  it('bouton vidéo : présent avec une vidéo et en ligne, jamais sans vidéo, caché hors ligne', async () => {
    const withVideo = byId('pallof-elastique');
    const noVideo = ALL.find((f) => !f.video)!;
    const a = view(withVideo);
    expect(screen.getByRole('button', { name: /Voir une vidéo/ })).toBeTruthy();
    expect(a.container.querySelector('iframe')).toBeNull();
    cleanup();
    view(noVideo);
    expect(screen.queryByRole('button', { name: /Voir une vidéo/ })).toBeNull();
    cleanup();
    setOnline(false);
    view(withVideo);
    expect(screen.queryByRole('button', { name: /Voir une vidéo/ })).toBeNull();
    await act(async () => {
      setOnline(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(screen.getByRole('button', { name: /Voir une vidéo/ })).toBeTruthy();
  });

  it('le lecteur YouTube est dans un iframe sandbox, chargé après l’appui', () => {
    const { container } = view(byId('pallof-elastique'));
    fireEvent.click(screen.getByRole('button', { name: /Voir une vidéo/ }));
    const frame = container.querySelector('iframe')!;
    expect(frame.getAttribute('sandbox')).toBe(IFRAME_SANDBOX);
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin allow-presentation allow-popups');
  });

  it('vidéo personnelle (fichier) : lecteur muet, sur appui', () => {
    const f: Fiche = { ...byId('fente-avant'), video: { kind: 'fichier', ref: 'fente-avant.mp4' } };
    const { container } = view(f);
    expect(container.querySelector('video')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Voir une vidéo/ }));
    const v = container.querySelector('video')!;
    expect(v.getAttribute('src')).toBe('videos/fente-avant.mp4');
    expect((v as HTMLVideoElement).muted).toBe(true);
  });

  it('ReportButton présent, et enregistre le signalement avec le bon ficheId', async () => {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) { this.removeAttribute('open'); };
    view(byId('pallof-elastique'), { equipment: eq(['elastique']) });
    const btn = screen.getByRole('button', { name: /signaler un problème/i });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole('button', { name: 'Consigne pas claire' }));
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(async () => {
      const r = await listReports();
      expect(r.length).toBe(1);
      expect(r[0].ficheId).toBe('pallof-elastique');
      expect(r[0].variantId).toBe('pallof-elastique-genoux');
    });
  });

  it('images : photos de départ et d’arrivée, légende, texte alternatif', () => {
    const f = byId('pallof-elastique');
    expect(displayImages(f).map((i) => i.type)).toEqual(['photo', 'photo']);
    const { container } = view(f);
    const imgs = [...container.querySelectorAll('img')];
    expect(imgs.length).toBe(2);
    expect(imgs.every((i) => i.getAttribute('loading') === 'lazy')).toBe(true);
    expect(imgs[0].getAttribute('alt')).toContain('position de départ');
    expect(imgs[1].getAttribute('alt')).toContain('position d’arrivée');
    expect(container.querySelector('figcaption')?.textContent).toBe("À la poulie ou à l'élastique : même placement.");
  });

  it('illustration seule : une image, sans légende si la fiche n’en a pas', () => {
    const f = byId('abduction-couchee-cote');
    expect(f.images.every((i) => i.type === 'illustration')).toBe(true);
    const { container } = view(f);
    expect(container.querySelectorAll('img').length).toBe(1);
    expect(container.querySelector('img')?.getAttribute('alt')).toContain('Dessin de l’exercice');
  });

  it('aucune image affichable : aucune balise image ; image qui ne charge pas : retirée', () => {
    const none: Fiche = { ...byId('fente-avant'), images: [] };
    expect(view(none).container.querySelector('img, figure')).toBeNull();
    cleanup();
    const { container } = view(byId('abduction-couchee-cote'));
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('figure')).toBeNull();
  });
});

describe('bibliothèque', () => {
  it('liste triée, compteur, filtre par type, recherche sans accent, mention de bas de page', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => JSON.parse(RAW) })));
    const { Library, isMachineFiche } = await import('../../src/ui/screens/Library');
    // D30 (machines-etiquettes.md §2) : sans profil « salle » ni accès à une salle, les fiches de machines sont masquées.
    const ALL = ALL_FICHES.filter((f) => !isMachineFiche(f));
    expect(ALL.length).toBeLessThan(ALL_FICHES.length);
    const { container } = render(<Library />);
    await waitFor(() => expect(container.querySelectorAll('.lib-row').length).toBe(ALL.length));
    const names = [...container.querySelectorAll('.lib-name')].map((n) => n.textContent ?? '');
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'fr')));
    expect(container.textContent).toContain(`${ALL.length} exercices`);
    expect(container.textContent).toContain('Les autres exercices (brouillons, non vérifiés) arrivent plus tard.');
    expect(container.querySelector('a.lib-row')?.getAttribute('href')).toMatch(/^#\/fiche\/[a-z0-9-]+$/);
    // aucun identifiant brut dans la liste
    expect(container.textContent).not.toMatch(/\w_\w/);

    fireEvent.click(screen.getByRole('button', { name: 'Pousser' }));
    const pousser = container.querySelectorAll('.lib-row').length;
    expect(pousser).toBe(ALL.filter((f) => ['poussee_h', 'poussee_v'].includes(f.schema)).length);

    fireEvent.click(screen.getByRole('button', { name: 'Tout' }));
    fireEvent.input(screen.getByLabelText('Chercher un exercice'), { target: { value: 'ÉLASTIQUE' } });
    await waitFor(() => expect(container.querySelectorAll('.lib-row').length).toBe(searchFiches(ALL, 'elastique').length));
    fireEvent.input(screen.getByLabelText('Chercher un exercice'), { target: { value: 'zzzxxx' } });
    await waitFor(() => expect(container.textContent).toContain('Aucun exercice trouvé'));
    fireEvent.input(screen.getByLabelText('Chercher un exercice'), { target: { value: '' } });
  });
});

describe('nettoyage : jamais de phrase de sécurité perdue', () => {
  const SAFE = new RegExp(SAFETY_WORD.source, 'i');

  /** Toutes les phrases d'origine (hors parenthèses de sources) qui portent un mot de sécurité. */
  function safetySentences(t: string): string[] {
    let core = '';
    let pos = 0;
    for (const [a, b, inner] of parenGroups(t)) {
      core += t.slice(pos, a);
      // une parenthèse de source (code, HAS, extrapolation...) n'est pas une phrase de sécurité
      if (!/\b[A-Z]\d{1,2}\b|\bHAS\b|extrapolation|PROVISOIRE|IFOMPT|README|sourc|§|\bOK\b/i.test(inner)) core += `(${inner})`;
      pos = b;
    }
    core += t.slice(pos);
    return core.split(/(?<=[.!?])\s+/).filter((s) => SAFE.test(s));
  }

  const allTexts = (f: Fiche) => [
    ...f.consignes,
    ...f.pointsAttention,
    ...(f.erreursFrequentes ?? []),
    ...f.securite.signesArret,
    ...f.securite.objetsQuotidien,
    ...Object.values(f.securite.notes),
    ...f.variantes.map((v) => v.installation),
  ];

  it('(a) chaque signe d’arrêt reste non vide et garde ses mots de sécurité', () => {
    for (const f of ALL) {
      for (const t of f.securite.signesArret) {
        const c = cleanText(t, ALL);
        expect(c.length, `${f.id} : « ${t.slice(0, 60)} »`).toBeGreaterThan(10);
        if (SAFE.test(t)) expect(SAFE.test(c), `${f.id} : « ${t.slice(0, 60)} »`).toBe(true);
      }
    }
  });

  it('(c) aucune phrase contenant un mot de sécurité ne disparaît (0 supprimée sur toutes les fiches)', () => {
    const lost: string[] = [];
    let checked = 0;
    for (const f of ALL) {
      for (const t of allTexts(f)) {
        for (const s of safetySentences(t)) {
          checked++;
          const c = cleanText(s, ALL);
          if (c.length === 0 || !SAFE.test(c)) lost.push(`${f.id} : ${s.slice(0, 90)}`);
        }
      }
    }
    expect(checked).toBeGreaterThan(500);
    expect(lost).toEqual([]);
  });

  it('(b) fiches du cou : la phrase d’urgence « 15 » et « 112 » est affichée', () => {
    for (const id of ['face-pull-elastique', 'inclinaison-douce-cou', 'isometrique-cou', 'ecartement-serviette']) {
      const { container } = view(byId(id), { equipment: eq(['elastique', 'serviette']) });
      const t = container.textContent ?? '';
      expect(t, id).toMatch(/Urgence, appelle le 15 ou le 112/);
      expect(t, id).toContain('ne refais pas ces exercices');
      cleanup();
    }
  });

  it('(d) texte affiché de TOUTES les fiches : aucun code, « NON SOURCÉ », « PROVISOIRE », identifiant brut', () => {
    const ids = new Set<string>();
    for (const f of ALL) {
      ids.add(f.id);
      f.variantes.forEach((v) => ids.add(v.id));
    }
    for (const f of ALL) {
      const shown = [f.nom, ...allTexts(f)].map((t) => cleanText(t, ALL)).join(' | ');
      expect(shown, f.id).not.toMatch(/\b[A-Z]\d{1,2}\b|NON SOURC|PROVISOIRE|§|README|\w_\w|\(\s*\)/);
      expect((shown.match(/[a-z0-9]+(?:-[a-z0-9]+)+/g) ?? []).filter((x) => ids.has(x)), f.id).toEqual([]);
    }
  });

  it('aucun texte affiché des 140 fiches ne contient « sourc » (notes de méthode retirées)', () => {
    const left: string[] = [];
    for (const f of ALL) {
      for (const t of [f.nom, ...allTexts(f)]) {
        const c = cleanText(t, ALL);
        if (/sourc/i.test(c)) left.push(`${f.id} : ${c.slice(0, 80)}`);
      }
      const { container } = view(f);
      if (/sourc/i.test(container.textContent ?? '')) left.push(`${f.id} : écran`);
      cleanup();
    }
    expect(left).toEqual([]);
    expect(cleanText('Aucune valeur sourcée pour les séries et répétitions.', ALL)).toBe('');
    expect(cleanText("La durée du maintien n'est pas fixée ici (aucune valeur sourcée).", ALL)).toBe('');
    expect(cleanText('Garde le dos droit (lien de pratique, non sourcé).', ALL)).toBe('Garde le dos droit.');
    expect(cleanText('Arrête si douleur, valeur non sourcée.', ALL)).toContain('Arrête si douleur');
  }, 60_000); // 140 fiches rendues une à une : lent quand la machine est chargée

  it('cas précis : code retiré, phrase gardée, parenthèse non refermée fermée proprement', () => {
    expect(cleanText('Arrête et consulte (C4).', ALL)).toBe('Arrête et consulte.');
    expect(cleanText('Ne force jamais, même règle que R5.', ALL)).toBe('Ne force jamais, même règle que.');
    expect(cleanText('Arrête tout (G4, extrapolation ; suite non refermée', ALL)).toBe('Arrête tout');
    expect(cleanText('Douleur : arrête (RN, R5 : ne jamais lâcher la charge).'.replace('RN', 'R8'), ALL)).toBe(
      'Douleur : arrête (ne jamais lâcher la charge).',
    );
    expect(cleanText('Note pour le dev et le coach.', ALL)).toBe('');
    expect(cleanText('Note du kine : arrête si douleur.', ALL)).toContain('arrête si douleur');
  });
});

describe('grossesse et post-partum, erreurs fréquentes, progression', () => {
  it('la ligne s’affiche pour enceinte ET post-partum, avec la note post-partum', () => {
    const f = ALL.find((x) => /Post-partum/.test(x.securite.notes.grossesse ?? ''))!;
    const a = view(f, { pregnancy: 'enceinte' });
    expect(a.container.querySelector('.fiche-securite')?.textContent).toContain('Pendant ta grossesse');
    cleanup();
    const b = view(f, { pregnancy: 'post_partum' as never });
    const t = b.container.querySelector('.fiche-securite')?.textContent ?? '';
    expect(t).toContain('Après l’accouchement');
    expect(t).toContain('sage-femme');
    expect(t).not.toMatch(/\b[A-Z]\d{1,2}\b/);
  });

  it('erreurs fréquentes et progression exportées par le build et affichées', () => {
    expect(ALL.filter((f) => (f.erreursFrequentes ?? []).length > 0).length).toBeGreaterThan(100);
    const f = ALL.find((x) => (x.progression?.plusFacile ?? []).length > 0)!;
    const { container } = view(f);
    expect(container.textContent).toContain('Erreurs fréquentes');
    expect(container.textContent).toContain('Plus facile');
    const link = [...container.querySelectorAll('a.fiche-link')].find((a) => a.getAttribute('href')?.startsWith('#/fiche/'));
    expect(link).toBeTruthy();
    // aucun identifiant de progression qui ne mène nulle part
    for (const g of ALL) for (const id of [...(g.progression?.plusFacile ?? []), ...(g.progression?.plusDur ?? [])]) expect(nameOfId(ALL, id), id).not.toBeNull();
  });
});
