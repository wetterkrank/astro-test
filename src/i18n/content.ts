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

/**
 * One entry per slug of a `<locale>/<slug>` collection, as seen from `locale`:
 * the translation when it exists, otherwise the default-locale version.
 * Slugs with neither are left out, so their URLs 404.
 */
export async function getEntriesWithFallback<C extends CollectionKey>(collection: C, locale: Locale) {
  const [own, fallback] = await Promise.all([
    getEntriesForLocale(collection, locale),
    locale === defaultLocale ? Promise.resolve([]) : getEntriesForLocale(collection, defaultLocale),
  ]);
  const bySlug = new Map<string, { slug: string; entry: (typeof own)[number]; contentLocale: Locale }>();
  for (const entry of fallback) {
    const { slug } = splitLocaleId(entry.id);
    bySlug.set(slug, { slug, entry, contentLocale: defaultLocale });
  }
  for (const entry of own) {
    const { slug } = splitLocaleId(entry.id);
    bySlug.set(slug, { slug, entry, contentLocale: locale });
  }
  return [...bySlug.values()].sort((a, b) => {
    const orderA = (a.entry.data as { order?: number }).order ?? Infinity;
    const orderB = (b.entry.data as { order?: number }).order ?? Infinity;
    return orderA === orderB ? a.slug.localeCompare(b.slug) : orderA - orderB;
  });
}
