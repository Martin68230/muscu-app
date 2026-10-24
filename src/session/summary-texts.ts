// Textes du bilan de séance (F6) : français simple, sans reproche, sans note ni score (progression-et-bilan-v1.md §3.5).
// Aucun identifiant brut : les noms viennent des fiches (callback `names`). Statut des textes : NON SOURCÉ (conception).
import type { PregnancyStatus } from '../data/model';
import type { Summary } from './summary';

export interface SummaryNames {
  fiche(movementId: string): string;
  variant(variantId: string): string;
}
export interface SummaryTextOptions {
  names: SummaryNames;
  pregnancy?: PregnancyStatus | null;
  /** Une version plus douce existe-t-elle pour cette fiche (gentlerAlternative non nul) ? */
  hasGentler?: (movementId: string) => boolean;
}
export interface SummaryText {
  title: string;
  paragraphs: string[];
  /** 3 ou 4 chiffres lisibles. */
  stats: { label: string; value: string }[];
  comparison: string[];
  records: string[];
  /** Détails (tonnage), jamais en gros titre. */
  details: string[];
  /** Vrai : l'écran de sécurité (U1, R5, G6) passe avant tout (affiché par l'interface). */
  safetyFirst: boolean;
}

const nbsp = ' ';
export const fmtInt = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, nbsp);
export function fmtMin(min: number): string {
  return min >= 60 ? `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}` : `${min} min`;
}
export function fmtRest(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} min ${String(s).padStart(2, '0')}` : `${s} s`;
}
const plural = (n: number, one: string, many: string): string => `${fmtInt(n)} ${n > 1 ? many : one}`;
const signed = (n: number): string => `${n > 0 ? '+' : '−'}${fmtInt(Math.abs(n))}`;
const list = (a: string[]): string => (a.length <= 1 ? (a[0] ?? '') : `${a.slice(0, -1).join(', ')} et ${a[a.length - 1]}`);

export function summaryText(s: Summary, o: SummaryTextOptions): SummaryText {
  const out: SummaryText = { title: 'Séance terminée', paragraphs: [], stats: [], comparison: [], records: [], details: [], safetyFirst: false };
  const dur = s.durationMin !== null ? [{ label: 'Durée', value: s.durationReliable ? fmtMin(s.durationMin) : 'Durée non fiable' }] : [];

  switch (s.status) {
    case 'symptome':
      out.title = 'Séance arrêtée';
      out.safetyFirst = true;
      out.paragraphs = ['Tu as bien fait de t’arrêter.', 'Ne reprends pas avant d’avoir l’avis d’un professionnel de santé.'];
      return out;
    case 'abandon':
      out.title = 'Séance arrêtée';
      out.paragraphs = ['Aucun souci : on reprendra quand tu veux.'];
      return out;
    case 'grossesse':
      out.stats = [...dur, { label: 'Séries faites', value: fmtInt(s.setsDone) }];
      out.paragraphs = ['Tu as fait attention à toi, c’est l’essentiel.'];
      if (o.pregnancy === 'post_partum') out.paragraphs.push('Reprendre progressivement, à ton rythme.');
      return out;
    default:
  }

  out.stats = [...dur, { label: 'Séries', value: s.status === 'douleur' ? `${fmtInt(s.setsDone)} ${s.setsDone >= 2 ? 'faites' : 'faite'}` : `${fmtInt(s.setsDone)} sur ${fmtInt(s.setsPlanned)}` }];
  if (s.repsDone !== null && s.status !== 'douleur') out.stats.push({ label: 'Répétitions', value: s.repsPlanned ? `${fmtInt(s.repsDone)} sur ${fmtInt(s.repsPlanned)}` : fmtInt(s.repsDone) });
  if (s.holdDoneSec !== null && s.status !== 'douleur') out.stats.push({ label: 'Maintiens', value: s.holdPlannedSec ? `${fmtInt(s.holdDoneSec)} s sur ${fmtInt(s.holdPlannedSec)} s` : `${fmtInt(s.holdDoneSec)} s` });
  if (s.restAvgSec !== null) out.stats.push({ label: s.restKind === 'repos' ? 'Repos moyen' : 'Temps entre deux séries', value: fmtRest(s.restAvgSec) });
  if (s.restKind === 'repos' && s.restAvgSec !== null && s.restPlannedAvgSec !== null) out.details.push(`Repos prévu en moyenne : ${fmtRest(s.restPlannedAvgSec)}.`);
  if (s.tonnageKg !== null) out.details.push(`Charge totale soulevée : ${fmtInt(s.tonnageKg)}${nbsp}kg`);

  if (s.status === 'premiere') {
    out.title = 'Première séance faite';
    out.paragraphs = ['Bravo d’avoir commencé.', 'La prochaine fois, on pourra comparer.'];
  } else if (s.status === 'ecourtee') {
    out.title = 'Séance écourtée';
    out.paragraphs = ['C’est très bien d’avoir fait ce que tu pouvais.', 'Le reste n’est pas à rattraper.'];
  } else if (s.status === 'douleur') {
    const names = s.painful.map((p) => o.names.fiche(p.movementId));
    const soft = s.painful.filter((p) => o.hasGentler?.(p.movementId)).map((p) => o.names.fiche(p.movementId));
    const hard = s.painful.filter((p) => !o.hasGentler?.(p.movementId)).map((p) => o.names.fiche(p.movementId));
    out.paragraphs = [`Tu as signalé une douleur sur : ${list(names)}. Tu as bien fait d’arrêter.`, names.length > 1 ? 'On ne fait pas monter ces exercices.' : 'On ne fait pas monter cet exercice.'];
    if (soft.length) out.paragraphs.push(names.length > 1 ? `On te proposera une version plus douce pour : ${list(soft)}.` : 'On te proposera une version plus douce.');
    if (hard.length) out.paragraphs.push(names.length > 1 ? `On garde ces versions, sans chercher à monter : ${list(hard)}.` : 'On garde cette version, sans chercher à monter.');
    out.paragraphs.push('Si ça revient, parles-en à un professionnel de santé.');
  }

  const c = s.comparison;
  if (c && s.status !== 'premiere') {
    if (c.verdict === 'similaire') out.comparison.push('À peu près comme la dernière fois.');
    else if (c.verdict === 'plus') out.comparison.push(`Un peu plus que la dernière fois${c.repsPct !== null ? ` (${signed(c.repsDelta)} répétitions, environ ${signed(Math.round(c.repsPct))}${nbsp}%)` : ''}.`);
    else out.comparison.push('Un peu moins que la dernière fois : c’est normal selon la fatigue et le sommeil.');
    if (c.setsVerdict !== 'similaire') out.comparison.push(c.setsDelta > 0 ? `${plural(c.setsDelta, 'série', 'séries')} de plus.` : `${plural(-c.setsDelta, 'série', 'séries')} de moins : ça arrive, ce n’est pas grave.`);
    if (c.tonnageVerdict && c.tonnageVerdict !== 'similaire' && c.tonnagePct !== null) out.details.push(`Charge totale : ${signed(Math.round(c.tonnagePct))}${nbsp}% par rapport à la dernière fois.`);
  }
  for (const r of s.records) {
    const nom = r.kind === 'echelon' ? o.names.variant(r.variantId) : o.names.fiche(r.movementId);
    if (r.kind === 'charge') out.records.push(`Nouveau meilleur : ${nom}, ${r.loadKg} kg${r.reps ? `, ${plural(r.reps, 'répétition', 'répétitions')}` : ''}`.replace('.', ','));
    else if (r.kind === 'duree') out.records.push(`Nouveau meilleur : ${nom}, ${fmtInt(r.holdSec ?? 0)} s`);
    else out.records.push(`Nouveau meilleur : ${nom}, ${plural(r.reps ?? 0, 'répétition', 'répétitions')}`);
  }
  return out;
}
