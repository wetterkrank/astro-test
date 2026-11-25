import { getCollection, getEntry, type CollectionKey } from 'astro:content';
import { defaultLocale, type Locale } from './locales';

type LocalizedCollection = 'header' | 'footer' | 'snippets' | 'landing';

/** Entry `<locale>.yaml` of a per-locale collection, falling back to the default locale. */
export async function getLocalized<C extends LocalizedCollection>(collection: C, locale: Locale) {
  const entry = (await getEntry(collection, locale)) ?? (await getEntry(collection, defaultLocale));
  if (!entry) throw new Error(`Missing "${collection}" content for "${locale}" and "${defaultLocale}".`);
  return entry;
}

/** Locale and slug of an entry stored as `<locale>/<slug>.md`. */
export function splitLocaleId(id: string): { locale: string; slug: string } {
  const [locale, ...rest] = id.split('/');
  return { locale, slug: rest.join('/') };
}

/** Entries of a `<locale>/<slug>` collection in one locale. */
export async function getEntriesForLocale<C extends CollectionKey>(collection: C, locale: Locale) {
  return getCollection(collection, (entry) => splitLocaleId(entry.id).locale === locale);
}
