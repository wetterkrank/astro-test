import { getRelativeLocaleUrl } from 'astro:i18n';
import { localeCodes, type Locale } from './locales';

/** URL of `path` in `locale`, e.g. ('de', 'learn/x') -> '/de/learn/x/'. */
export function localizedUrl(locale: Locale, path = ''): string {
  return getRelativeLocaleUrl(locale, path);
}

/** Map of locale -> URL, for the language switcher. Missing locales fall back to that locale's home page. */
export type Alternates = Partial<Record<Locale, string>>;

export function resolveAlternates(alternates: Alternates = {}): Record<Locale, string> {
  return Object.fromEntries(
    localeCodes.map((code) => [code, alternates[code] ?? localizedUrl(code)]),
  ) as Record<Locale, string>;
}
