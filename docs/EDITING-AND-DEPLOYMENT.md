# Editing and handing over the website

## For the owner: no coding required

Open this repository as a project in Codex. The root AGENTS.md gives Codex the project
instructions. You can describe changes normally, for example:

> Read AGENTS.md. Change the contact email to [my email], check phone and desktop,
> and show me the local preview.

> Read AGENTS.md. Update The Grey case study with the following content on both
> phone and desktop. Keep the current visual style: [content].

> The preview looks good. Commit the changes, push to the configured production
> repository, and check that GitHub Pages successfully deploys them.

Local preview changes are only on your computer. A commit saves a version in git.
A push sends it to GitHub. A successful Pages deployment makes it live. Codex should
say which of these has actually happened.

AGENTS.md is the standard repository instruction file Codex reads when working in
this project; it is not an absolute system prompt and cannot guarantee every future
session follows it. Start new tasks inside the cloned project and ask Codex to read
it if unsure. Official reference: https://developers.openai.com/codex/guides/agents-md

## Current setup

This is an Astro static site. npm scripts are dev, build and preview. Use Node 24 LTS
(the same version as CI). No environment secrets or backend are required. The lockfile
pins the dependency resolution. `npm ci` installs it; `npm run build` creates dist.
Astro's local preview can be started with `npm run preview` after building.

Routes currently shipped:

| URL | Source |
| --- | --- |
| / | src/pages/index.astro |
| /contact/ | src/pages/contact/index.astro |
| /work/ | src/pages/work/index.astro |
| /work/brand-ambassadors/ | src/pages/work/brand-ambassadors/index.astro |
| /work/talk-to-customers/ | src/pages/work/talk-to-customers/index.astro |
| /work/remove-products/ | src/pages/work/remove-products/index.astro |
| /work/website-ux/ | src/pages/work/website-ux/index.astro |
| /work/the-grey-routine/ | src/pages/work/the-grey-routine/index.astro |
| /work/customer-acquisition/ | src/pages/work/customer-acquisition/index.astro |

### How edits map to files

Home desktop copy and layout: DesktopPanel.astro, selected by section ID. Home phone
copy: text inside the referenced images, not HTML. Work desktop content: work.ts,
rendered by DesktopPanel.astro on both overview and detail pages. Phone work content:
images referenced in both index and detail markup. Contact is real HTML on both sizes.
Page titles, descriptions and image alt text should stay aligned with visible copy.

Shared styles load as site.css, responsive.css and desktop.css. The contact page also
has scoped styles. Desktop starts at 1000px. Keep the mobile `.slide-art` and desktop
`.desktop-panel` visibility rules paired. The menu script listens to `.menu-hit` and
`.desktop-menu`; preserve accessible names, aria state, focus handling and keyboard use.
IDs are shared by page sections and menu anchors; changing one requires updating links.

Images are kept in public/assets and copied unchanged to dist/assets at build time.
Desktop SVG crops reuse them without duplicating files. Check the actual image pixel
size before setting crop coordinates. Use SVG image references for visual details and
real HTML for editable desktop text. Any replacement of an image must also be checked
where that image is reused in a desktop crop.

To add a new work case, Codex should add the data, Astro detail route, overview section,
mobile artwork or equivalent native mobile composition, metadata and relevant links.
Do not simply add a data record: existing pages are explicit routes, not auto-generated
from the data list. The existing work index is all about The Grey, not yet a multi-brand
portfolio. Do not invent a broader portfolio or add pages without an owner request.

## Handoff: Ashley's repository to the recipient's own GitHub

Source to clone: https://github.com/cottrellashley/cre-ation. It was created as a private
handoff copy; the recipient must have read access before cloning. Ashley can grant
access in repository Settings → Collaborators. Do not publish the source publicly
just to bypass access without the owner's instruction.

The recipient can paste this into Codex (replace the bracketed repository URL):

> Clone https://github.com/cottrellashley/cre-ation and read AGENTS.md and
> docs/EDITING-AND-DEPLOYMENT.md. This is my website, and I don't know code.
> Run it locally. My destination repository is [my GitHub repository URL].
> Push this version into my repository without overwriting other changes.
> Configure GitHub Pages using GitHub Actions, preserve cre-ation.io if this is
> its existing production repository, and verify the deployment. Tell me if
> you need account access. Do not change the design or add navigation/pages.

For Codex performing the handoff:

1. Verify authentication, source read access, destination write access and clean
   working state. Clone the source normally, preserving history.
2. Preserve the source as a named remote (e.g. `handoff`) and set the recipient's
   repository as origin. Verify `git remote -v` before any push. Do not hard-code
   Ashley's account as the destination in future sessions.
3. Fetch destination branches. The original repository shares history with this
   copy. If its main has advanced, merge/rebase carefully and resolve conflicts;
   do not force-push. For an unrelated existing repository, stop and explain the
   conflict rather than replacing it. An empty destination accepts main directly.
4. Install/build, verify both layouts, then push main and set upstream tracking.
5. Set up Pages below, check the workflow result and test the live URLs.

## GitHub Pages deployment

The checked-in workflow `.github/workflows/pages.yml` runs on pushes to main and
manual dispatch. It checks out source, sets up Node 24, runs npm ci and npm run build,
uploads dist, then deploys it to GitHub Pages. GitHub supplies the workflow token;
no personal access token belongs in the source. The workflow requests contents read,
pages write and id-token write permissions and uses the github-pages environment.

On the intended production repository, set Settings → Pages → Source to GitHub
Actions. Ensure Actions is enabled and any environment deployment restrictions allow
main. Check that the account/plan supports Pages for the repository visibility. If it
does not, explain options; do not silently change a private repository to public.

### Domain and paths matter

The current configuration is for a root custom domain: astro.config.mjs has
`site: 'https://cre-ation.io'`, public/CNAME contains `cre-ation.io`, and links/assets
use root paths such as `/work/` and `/assets/`. Returning this code to the original
production repository can retain these settings when that repository owns the domain.
Do not automatically attach cre-ation.io to Ashley's handoff repository or change DNS.

If deploying to a DIFFERENT custom domain, update site, CNAME and GitHub Pages domain
settings together, and verify the owner's DNS configuration before calling it live.

If deploying to `https://OWNER.github.io/REPOSITORY/` instead, the current root paths
will break. Remove the copied custom-domain CNAME, set Astro site to the owner's
GitHub Pages origin and base to `/REPOSITORY`, AND make every internal link, image src,
SVG image href, navigation href and asset reference base-aware. Use a shared URL
helper based on import.meta.env.BASE_URL and preserve external/mailto/hash-only links.
Setting base alone does not rewrite hard-coded public-asset URLs. Check direct entry
to every nested route and image under the repository prefix before deploying.

For an `OWNER.github.io` repository at the domain root, a repository base prefix is
not needed; still remove/update the custom domain settings appropriately.

### Verify and recover

Check the latest 'Deploy website to GitHub Pages' run in Actions against the pushed
commit. Inspect failed logs and fix the cause. With GitHub CLI, `gh run list` and
`gh run view` help inspect runs. Test the resulting Pages URL, homepage, contact,
work index and a direct nested case-study URL. Confirm desktop/mobile rendering and
assets. Report the actual live URL and whether deployment succeeded or remains blocked.
If a bad change is published, normally revert the specific commit and push the revert
so the normal build deploys the prior version; do not reset/force-push shared history.

## Maintenance checklist for Codex

- Keep static output and existing visual identity unless the owner asks otherwise.
- Keep desktop/mobile content aligned, including baked image text.
- Build, check whitespace and review the actual changes before committing.
- Visually check representative desktop/phone sizes and all changed routes.
- Never commit dist, node_modules, .astro, credentials or local QA screenshots.
- Update these instructions when changing architecture, commands or deployment.
- Explain any remaining limitation clearly to the nontechnical owner.
