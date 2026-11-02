/** Languages of the site. EN is the default and lives at the root, ES under /es/ (same URLs as the old site). */
export const LANGS = [
  { code: 'en', locale: 'en-GB', og: 'en_GB', name: 'English', short: 'EN' },
  { code: 'es', locale: 'es-ES', og: 'es_ES', name: 'Español', short: 'ES' },
] as const;

export type Lang = (typeof LANGS)[number]['code'];

/** Texts of one dictionary file ({ en: {...}, es: {...} }) for one language; missing keys fall back to EN. */
export function dict<T extends Record<string, unknown>>(data: { en: T; es?: Partial<T> }, lang: Lang): T {
  return { ...data.en, ...(data[lang] ?? {}) } as T;
}

export const langInfo = (lang: Lang) => LANGS.find((l) => l.code === lang)!;

/** Localised URL of a path written the English way, e.g. url('es', '/about-us/') = '/es/about-us/'. */
export const url = (lang: Lang, path: string) => (lang === 'en' ? path : `/${lang}${path}`);
