import { create, listAll, softDelete } from './repo';
import type { Report, ReportChoice } from './model';

export const REPORT_CHOICES: { value: ReportChoice; label: string }[] = [
  { value: 'consigne', label: 'Consigne pas claire' },
  { value: 'image', label: 'Image fausse ou manquante' },
  { value: 'douleur', label: 'Exercice gênant ou douloureux' },
  { value: 'materiel', label: 'Matériel incorrect' },
  { value: 'autre', label: 'Autre' },
];

const MAX_TEXT = 1000;

/** Enregistre un signalement sur l'appareil (fonctionne hors-ligne). */
export async function addReport(input: {
  ficheId: string;
  variantId?: string | null;
  choice: ReportChoice;
  text?: string;
}): Promise<Report> {
  return create('signalements', {
    ficheId: input.ficheId,
    variantId: input.variantId ?? null,
    choice: input.choice,
    text: (input.text ?? '').trim().slice(0, MAX_TEXT),
  });
}

export async function listReports(): Promise<Report[]> {
  const rows = (await listAll('signalements')).filter((r) => !r.deletedAt);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function clearReports(): Promise<void> {
  for (const r of await listReports()) await softDelete('signalements', r.id);
}

/** Texte copiable à donner à Claude Code pour corriger les fiches. */
export function reportsToText(reports: Report[]): string {
  if (!reports.length) return 'Aucun signalement.';
  const label = (c: ReportChoice) => REPORT_CHOICES.find((x) => x.value === c)?.label ?? c;
  return reports
    .map((r) => {
      const where = r.variantId ? `${r.ficheId} / ${r.variantId}` : r.ficheId;
      return `- ${r.createdAt.slice(0, 10)} | ${where} | ${label(r.choice)}${r.text ? ` | ${r.text.replace(/\s+/g, ' ')}` : ''}`;
    })
    .join('\n');
}

/** Export JSON compact (id de fiche, variante, date, choix, texte). */
export function reportsToJson(reports: Report[]): string {
  return JSON.stringify(
    reports.map((r) => ({ ficheId: r.ficheId, variantId: r.variantId, date: r.createdAt, choice: r.choice, text: r.text })),
    null,
    2,
  );
}
