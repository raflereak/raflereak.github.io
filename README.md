# Taehun Kim — portfolio

A responsive, bilingual portfolio built with semantic HTML, CSS, vanilla JavaScript, and Vite, published at <https://raflereak.github.io/>.

## Run locally

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:4317>. Run `npm run build` to create the static site in `dist/`, or `npm run preview` to review that build.

## Verify

`npm test` runs browser checks against a fresh production build on port 4318: the current role and links, translations and saved preference, project dialogs, keyboard focus, mobile navigation, the PDF download, email clipboard, and seven responsive widths in both languages. It uses the locally installed Google Chrome. To use Playwright's Chromium instead, run `npx playwright install chromium` then `PLAYWRIGHT_CHANNEL=chromium npm test`.

## Content and design

- The supplied `cv (2).pdf` is the source for education, research, publications, skills, community, and project descriptions. Its original, unchanged copy is available from `public/files/taehun-kim-cv.pdf`.
- The current **HwaljaLab CTO & Lead Developer** role is specified by the site owner. No employment start date is assumed. HwaljaLab links to `https://hwaljalab.com`.
- WorkMe is attributed to AM, as in the CV. Its start date is retained without claiming its present status or an affiliation with HwaljaLab.
- The project's visuals are original CSS/SVG conceptual illustrations, not screenshots of the products. Descriptions and project details avoid invented implementation details or performance claims.
- The interface supports English and Korean, keyboard navigation, reduced motion, responsive layouts, project dialogs, mobile navigation, email copying, and CV downloads. Language preference is stored locally when storage is available.
- Fonts are served locally. No analytics, APIs, tracking, or server-side services are used.

## Files

- `index.html`: page structure and bilingual content.
- `src/style.css`: design, responsive behavior, and print styles.
- `src/main.js`: translations, project details, navigation, clipboard, and the vector illustration.
- `public/`: locally served fonts, favicon, and original CV.
- `preview/`: desktop and mobile screenshots of the mockup.

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`, which installs the locked dependencies with Node.js 24, builds the portfolio, and publishes `dist/` to GitHub Pages. The workflow also supports manual runs from the Actions tab. GitHub Pages uses **GitHub Actions** as its build source.
