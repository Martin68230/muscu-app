export const USABLE_STATUTS: string[];
export function structCase(raw: string): Record<string, unknown> & { action: 'garder' | 'adapter' | 'retirer' };
export function buildFiche(text: string, file: string, opts?: { publicDir?: string }): { fiche: any; missing: string[] };
export function buildAll(dir: string, publicDir?: string): { fiches: any[]; warnings: string[] };
