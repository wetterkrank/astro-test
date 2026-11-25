import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Localized site content. Each per-locale collection holds one file per
 * locale, named by its code (en.yaml, de.yaml, es.yaml), so the entry id is
 * the locale code.
 */

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const image = z.object({
  src: z.string(),
  alt: z.string().default(''),
  width: z.number(),
  height: z.number(),
});

const navItem = z.object({
  icon: z.string(),
  title: z.string(),
  desc: z.string().optional(),
  href: z.string(),
});

const navCard = z.object({
  image,
  title: z.string(),
  desc: z.string(),
  href: z.string(),
  linkLabel: z.string().optional(),
});

const hub = z.object({
  blurb: z.string(),
  label: z.string(),
  href: z.string(),
});

const header = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/header' }),
  schema: z.object({
    skipLinks: z.object({
      label: z.string(),
      main: z.string(),
      navigation: z.string(),
      footer: z.string(),
    }),
    logoLabel: z.string(),
    primaryNavLabel: z.string(),
    mobileNavLabel: z.string(),
    drawer: z.object({
      label: z.string(),
      open: z.string(),
      close: z.string(),
    }),
    languageLabel: z.string(),
    login: link,
    cta: link,
    features: z.object({
      label: z.string(),
      drawerIcon: z.string(),
      hub,
      groups: z.array(z.object({ label: z.string(), items: z.array(navItem) })),
      featured: z.object({ label: z.string(), cards: z.array(navCard) }),
    }),
    integrations: z.object({
      label: z.string(),
      drawerIcon: z.string(),
      hub,
      categories: z.object({
        drawerLabel: z.string(),
        items: z.array(
          z.object({ label: z.string(), icon: z.string(), href: z.string(), image }),
        ),
      }),
      promos: z.object({
        drawerLabel: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            desc: z.string(),
            icon: z.string(),
            href: z.string(),
            badgeImage: image.optional(),
            badgeText: z.string().optional(),
            drawerBadgeText: z.string().optional(),
          }),
        ),
      }),
    }),
    pricing: z.object({
      label: z.string(),
      href: z.string(),
      drawerIcon: z.string(),
    }),
    resources: z.object({
      label: z.string(),
      drawerIcon: z.string(),
      featuredLabel: z.string(),
      bands: z.array(
        z.object({ label: z.string(), items: z.array(navItem), card: navCard }),
      ),
    }),
  }),
});

const footer = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/footer' }),
  schema: z.object({
    madeIn: z.object({ before: z.string(), heart: z.string(), after: z.string() }),
    columns: z.array(
      z.object({
        sections: z.array(
          z.object({
            heading: z.string(),
            /** Static links, or `source: learn` to list the locale's Learn articles. */
            links: z.array(link).default([]),
            source: z.enum(['learn']).optional(),
          }),
        ),
      }),
    ),
    cta: z.object({ label: z.string(), href: z.string(), note: z.string() }),
    appStores: z.object({
      heading: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string(), image })),
    }),
    brandLabel: z.string(),
    social: z.array(z.object({ title: z.string(), href: z.string(), icon: z.string() })),
    languageLabel: z.string(),
    copyright: z.string(),
    legalLinks: z.array(link),
  }),
});

/** Reusable copy blocks (CTA bands, UI strings) shared by several page types. */
const snippets = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/snippets' }),
  schema: z.object({
    tryForFree: z.object({
      heading: z.string(),
      text: z.string(),
      primary: link,
      secondary: link,
    }),
    article: z.object({
      authorLabel: z.string(),
      updatedOn: z.string(),
      faqHeadline: z.string(),
    }),
  }),
});

const landing = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/landing' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    demo: z.string(),
  }),
});

/** Learn articles: src/content/learn/<locale>/<slug>.md */
const learn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.object({ label: z.string(), href: z.string() }),
    author: z.object({ name: z.string(), image }),
    updated: z.coerce.date(),
    intro: z.string(),
    image,
    faq: z
      .object({
        headline: z.string().optional(),
        items: z.array(z.object({ question: z.string(), answer: z.string() })),
      })
      .optional(),
  }),
});

export const collections = { header, footer, snippets, landing, learn };
