# cre-ation website

This repository is the source of truth for [cre-ation.io](https://cre-ation.io).

The finished static website lives in `dist/`. Every push to `main` deploys that folder to GitHub Pages through `.github/workflows/pages.yml`.

## Updating the website

Edit the files in `dist/`, commit the changes to `main`, and wait for the **Deploy website to GitHub Pages** workflow to finish. Do not update the old OpenAI Sites copy; it is retained only as a temporary migration fallback.
