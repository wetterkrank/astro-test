/**
 * Site locales. Add a locale here, then add its files under
 * src/content/{header,footer,snippets,landing}/<code>.yaml.
 */
export const locales = {
  en: { label: 'English', short: 'EN', htmlLang: 'en', dateLocale: 'en-US' },
  de: { label: 'Deutsch', short: 'DE', htmlLang: 'de', dateLocale: 'de-DE' },
  es: { label: 'Español', short: 'ES', htmlLang: 'es', dateLocale: 'es-ES' },
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'en';

export const localeCodes = Object.keys(locales) as Locale[];

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && value in locales;
}
