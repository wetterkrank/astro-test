// @ts-check
import { defineConfig } from 'astro/config';
import { defaultLocale, localeCodes } from './src/i18n/locales.ts';

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: localeCodes,
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
