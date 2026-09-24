# Codex instructions for cre-ation

Read this file at the start of work in this repository, then read README.md and
`docs/EDITING-AND-DEPLOYMENT.md`. These are repository instructions, not a replacement
for Codex system instructions. Keep these documents current when architecture changes.

## Work with a nontechnical owner

The owner does not know code. They describe desired changes in normal language.
Do the implementation, setup, previews, checks and authorised publishing yourself.
Explain results in plain language, with a preview/live link. Do not require them to
choose libraries, edit files or run terminal commands. Ask only for missing content,
account access or a decision you cannot reasonably infer. Never invent team members,
client results, testimonials or business claims. Keep changes within the request.

## Product decisions that must be preserved

- This is and will remain a fully STATIC website. Astro generates HTML/CSS/JS into
  `dist/`. No backend, database, SSR adapter, React application or CMS is needed.
- Preserve the bold condensed typography, monochrome palette, original artwork,
  restrained motion and existing pages unless the user requests a design change.
- Phone and desktop MUST have different compositions. Desktop must use the width
  of the screen: real text, columns and imagery side by side. Never regress to a
  centred portrait image as the desktop layout.
- Desktop begins at 1000px in `src/styles/desktop.css`. Mobile uses original portrait
  artwork. Short screens may scroll; never clip content to force a fixed height.
- The proposed extra navigation, About and How We Work pages were declined. Do not
  add them unless newly requested.

## Source map

- `src/pages/index.astro`: home mobile panels and their desktop component references.
- `src/pages/work/index.astro`: The Grey overview plus all six work sections.
- `src/pages/work/<slug>/index.astro`: six standalone work pages.
- `src/pages/contact/index.astro`: native contact markup and scoped contact CSS.
- `src/components/DesktopPanel.astro`: desktop home sections, work overview and shared
  case-study renderer. The `id` selects a section. Home copy lives here.
- `src/data/work.ts`: desktop case-study content, slugs, lists and crop coordinates.
- `src/components/ArtworkCrop.astro`: SVG viewport and clip path showing a detail of
  an existing image; coordinates are `[x, y, width, height]` in source image space.
- `src/components/HomeMenu.astro` and `Menu.astro`: current menu link lists.
- `src/layouts/Site.astro`: shared document, title, description, favicon and imports.
- `src/styles/site.css`: original shared styles. `responsive.css`: mobile, snapping,
  menu visibility. `desktop.css`: actual landscape compositions. Check specificity;
  contact scoped styles can override generic selectors.
- `src/scripts/site.js`: both menu trigger types, focus trap, Escape, scroll locking,
  section reveals and reduced-motion handling.
- `public/assets/`: original images. `public/CNAME`: cre-ation.io domain declaration.
- `astro.config.mjs`: static output, canonical site URL and trailing slashes.
- `.github/workflows/pages.yml`: Node 24, npm ci, build, upload dist, deploy to Pages.

## Editing rules

1. Inspect git status and the relevant source before editing; preserve unrelated work.
2. Update BOTH layouts for content changes. Mobile text is baked into images: editing
   desktop text or an image alt attribute does not change the visible mobile copy.
   For mobile copy changes, update the artwork or recreate the affected section as
   responsive HTML/CSS matching the design; tell the owner what changed. Never claim
   both layouts were updated if the mobile image still has the old text.
3. Changes to work content must cover the index section and standalone page. Keep
   IDs, anchor links, hrefs, desktop data and mobile image/alt content consistent.
4. When adding a page, create an Astro route, supply title/description via Site,
   add requested navigation links in both menus, and provide both screen layouts.
5. Keep artwork aspect ratios and crop coordinates accurate; inspect cropped output.
   Original images can contain baked text outside the intended crop. Retain the SVG
   clip path so those parts do not leak into desktop compositions.
6. Never edit or commit generated dist, node_modules or .astro. Commit package-lock
   when dependencies change. No credentials, private keys or machine-specific paths.

## Run and verify

Use Node 24 LTS and npm. First checkout: `npm ci`. Start: `npm run dev` (normally
http://localhost:4321). Production check: `npm run build`, then `npm run preview`.
If telemetry cannot write in a restricted environment, set ASTRO_TELEMETRY_DISABLED=1
for the command. If the dev server caches a newly-created missing import, restart it.

Before reporting completion, build and run `git diff --check`. For visual changes,
inspect browser screenshots at 390x844 and 1440x900, plus 1024x768 and 1280x720 for
layout changes; check a short landscape screen too. Check for horizontal overflow,
clipped text, missing images, working links/anchors, both menus, Escape/focus return,
scroll snapping and reduced motion as relevant. The project has no committed browser
test suite; do not claim automated tests exist or passed unless actually run.

## GitHub, handoff and publishing

Ashley’s handoff repository: https://github.com/cottrellashley/cre-ation.
Original intended production repository: https://github.com/caiohaeminggerlach-ai/cre-ation.
Original site: https://cre-ation.io. Always inspect actual git remotes and authenticated
account; these addresses explain provenance, not permission to push to any account.
The recipient is expected to clone Ashley's copy and push the changes into his own
repository. Follow the handoff instructions in docs/EDITING-AND-DEPLOYMENT.md.

A request to push/publish authorises committing and pushing the requested changes to
the established destination. A local edit alone is not automatically a publishing
request. Do not ask again when publishing is already authorised. Never force-push
or overwrite remote history to bypass a conflict. Fetch and integrate remote changes.
If denied access, explain which account/repo needs access; do not claim publication.

On the production repository, pushing main triggers the Pages workflow, provided
Pages is configured to use GitHub Actions. Verify the workflow and live site before
saying deployed. A successful push alone is not proof of deployment. Ashley's copy
is a handoff source; do not transfer the production domain to it automatically.
