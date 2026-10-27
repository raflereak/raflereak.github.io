# Taehun Kim — portfolio

A responsive, bilingual portfolio built with semantic HTML, CSS, vanilla JavaScript, and Vite, published at <https://raflereak.github.io/>.

## Run locally

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:4317>. Run `npm run build` to create the static site in `dist/`, or `npm run preview` to review that build.

## Verify

`npm test` runs browser checks against a fresh production build on port 4318: the four sections and the current role, the Code Weaver map, translations and the saved language, project dialogs, keyboard focus, mobile navigation, the PDF download, email clipboard, and seven responsive widths in both languages. It uses the locally installed Google Chrome. To use Playwright's Chromium instead, run `npx playwright install chromium` then `PLAYWRIGHT_CHANNEL=chromium npm test`.

## Structure

The page reads like a typeset book, a nod to HwaljaLab (활자, movable type): a title page with a table of contents, then four chapters.

1. **Research**: interests, publications, and degrees.
2. **Projects**: Code Weaver, then earlier projects, an archive, and the toolkit.
3. **Teaching**: 2026 corporate AX courses, earlier SW and AI teaching, and the public AX-Data materials.
4. **Activities**: HwaljaLab, startup programs, awards, and community.

A colophon at the end holds contact details.

## Content sources

- The supplied `cv (2).pdf` is the source for degrees, research, publications, skills, community, awards, earlier projects, and earlier teaching. Its original, unchanged copy is available from `public/files/taehun-kim-cv.pdf`.
- The site owner supplied the **HwaljaLab CTO & Lead Developer** role, the 2026 AX courses, U300+, Asan Doers, and POSCO Texcore. Companies P, H, and N are named the way the owner named them. No dates are given where the owner gave none.
- **Code Weaver** is HwaljaLab's agent development platform, built in the NCS repositories. Its descriptions summarize those repositories' READMEs: HwaljaLAB HUB, NCS Interface, SWITCHBOARD, ATELIER, ASSEMBLY, the NCS chat-interface spec, and the NCS agent-architecture research. The repositories are private, so the site does not link to them. SWITCHBOARD and ATELIER are marked "launching soon" at the owner's word.
- WorkMe is attributed to AM, as in the CV. Its start date is retained without claiming its present status or an affiliation with HwaljaLab.
- Fonts are served locally. No analytics, APIs, tracking, or server-side services are used.

## Design

- One spot ink, indigo `#22389a` (쪽빛), on white. The title-page headline is the only large indigo text.
- **Hahmlet** sets headings in both languages. `public/fonts/hahmlet-650.woff2` is a static weight-650 instance, subset to the 2,350 KS X 1001 Hangul syllables plus Latin and common punctuation, so edited copy stays covered. **DM Sans** sets body text, with the system Hangul face for Korean.
- The interface supports English and Korean, keyboard navigation, reduced motion, responsive layouts from 320px, project dialogs, mobile navigation, email copying, and CV downloads. Language preference is stored locally when storage is available.

## Files

- `index.html`: page structure and bilingual content.
- `src/style.css`: design, responsive behavior, and print styles.
- `src/main.js`: translations, project details, navigation, and clipboard.
- `public/`: locally served fonts and their licenses, favicon, and original CV.
- `preview/`: desktop and mobile screenshots of the current design.

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`, which installs the locked dependencies with Node.js 24, builds the portfolio, and publishes `dist/` to GitHub Pages. The workflow also supports manual runs from the Actions tab. GitHub Pages uses **GitHub Actions** as its build source.
