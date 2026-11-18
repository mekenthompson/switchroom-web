# AGENTS.md

Instructions for humans and coding agents working in `mekenthompson/switchroom-web`, the switchroom.ai landing page. `CLAUDE.md` only imports this file. Edit `AGENTS.md`, not `CLAUDE.md`.

This is a **public** repo. No secrets, household names, emails, chat IDs or profile names in copy, mockups, screenshots or commits.

## What the site points at

- Product source: `switchroom/switchroom`, the public Switchroom distro of [Hermes Agent](https://github.com/NousResearch/hermes-agent). Runtime fork: `switchroom/hermes-agent`.
- `mekenthompson/hermes-fleet` and `mekenthompson/hermes-agent` moved to the `switchroom` org on 2026-11-18. GitHub redirects them, but link the new names. `switchroom/switchroom-classic` is the archived Claude Code harness; do not link it as the product.
- Outbound product links live in `src/site.ts` (`REPO`). `scripts/test-repo-links.mjs` fails on old repo or image names in `src/`, `public/` and `README.md`.
- Product claims come from the `switchroom/switchroom` README and `reference/` docs. If the source repo does not ship it, it does not go on the page. Hermes is the runtime and Switchroom is the opinionated layer on top.

## Before a PR

```bash
npm ci
npm test         # legal pages, plans copy, repo links
npm run build    # lint:gradients, then astro build -> dist/
```

There is no hosted CI here, so `npm test` plus `npm run build` on the exact head is the merge gate. Brand rules: `docs/BRAND.md`. Wanted screenshots: `SCREENSHOTS.md`. Deploy: `README.md`.

## Pull requests

- Small, one topic. Branch from current `master`.
- Independent cold review by a fresh session that did not write the change, then merge the exact reviewed head.
- After a visible change merges and deploys, check https://switchroom.ai.
