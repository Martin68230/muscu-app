export interface Issue {
  file: string;
  line: number;
  categorie: string;
  message: string;
  severite: 'erreur' | 'avertissement';
}
export interface TagList {
  ids: Set<string>;
  remplaces?: Record<string, string>;
}
export interface LotResult {
  issues: Issue[];
  errors: Issue[];
  warnings: Issue[];
}
export const AMPLITUDES: string[];
export const APPUIS: string[];
export const ZONES: string[];
export function parseCase(cell: string): { rank: number | null; refs: { type: string; id: string }[]; error: string | null; retirer?: boolean; sansZone?: boolean };
export function parseFrontmatter(lines: string[]): { data: Record<string, string | string[]>; lineOf: Record<string, number>; end: number; problems: { line: number; message: string }[] };
export function validateLot(files: { name: string; text: string }[], options?: { tags?: TagList; photosDir?: string; illustrationsDir?: string; videosDir?: string; chainExemptions?: Set<string> }): LotResult;
export function loadTags(path: string): TagList;
export function readFrontmatter(path: string): Record<string, string | string[]>;
export function norm(s: string): string;
export function cells(line: string): string[];
export function isSeparator(line: string): boolean;
export function splitSections(lines: string[], from: number): { title: string; start: number; lines: { n: number; text: string }[] }[];
export function parseFiche(text: string, file: string): { fiche: any; issues: Issue[] };
export function listFiches(dir: string): string[];
