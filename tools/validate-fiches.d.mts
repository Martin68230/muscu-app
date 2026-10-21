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
export function validateLot(files: { name: string; text: string }[], options?: { tags?: TagList; photosDir?: string }): LotResult;
export function loadTags(path: string): TagList;
