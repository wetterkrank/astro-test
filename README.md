# Cobot site (Astro)

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Structure

| Path | What lives there |
| --- | --- |
| `src/components/` | `Header`, `Footer`, `LanguageSelect`, `CobotLogo`, `CtaBand`. Markup and class names are ported 1:1 from the [www_templates](https://github.com/upstream/www_templates) `chrome.html` / `learn-article.html` templates. |
| `src/layouts/` | `BaseLayout` (document shell + header + footer), `MainLandingLayout`, `LearnArticleLayout`. |
| `src/pages/` | `[...locale]/index.astro` → `/`, `/de/`, `/es/`; `learn/[slug].astro` → `/learn/<slug>/` (EN only for now). |
| `src/content/` | All copy. `header/`, `footer/`, `snippets/`, `landing/` hold one `<locale>.yaml` each; `learn/<locale>/<slug>.md` holds articles. Schemas are in `src/content.config.ts`. |
| `src/i18n/` | Locale list (`locales.ts`) and helpers. |
| `public/css/`, `public/assets/` | CSS, fonts and images copied unchanged from www_templates (minus the sandbox/styleguide CSS). |

## Adding a locale

1. Add it to `src/i18n/locales.ts`.
2. Add `<code>.yaml` to `src/content/header`, `footer`, `snippets` and `landing`.

Missing content falls back to English. The language switcher links each locale to the
same page when it exists there, otherwise to that locale's home page.
