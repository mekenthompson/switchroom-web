# switchroom-web

Landing page for Switchroom: *a team of AI agents you text, each in its own box.* Switchroom is an opinionated distribution of [Hermes Agent](https://github.com/NousResearch/hermes-agent); source lives in [`switchroom/switchroom`](https://github.com/switchroom/switchroom).

## Stack

[Astro](https://astro.build) static output — zero client JS, all CSS inlined into a single `index.html`. The Telegram "screenshots" on the page are hand-built HTML/CSS mockups inside device frames (see `src/components/`); swap them for real captures as they become available (`SCREENSHOTS.md` lists the wanted shots).

```bash
npm install
npm run dev      # local dev server
npm run build    # → dist/
npm run preview  # serve dist/ locally
```

## Deploy

Static files behind nginx. Deployed via Coolify → Cloudflare Tunnel → Pixsoul server. The `Dockerfile` is multi-stage: `node:22-alpine` builds `dist/`, `nginx:1.27-alpine` serves it (config in `nginx.conf`). Coolify just builds the Dockerfile — no pipeline change needed.

- **Primary:** https://switchroom.ai
- **Alias:** https://switchroom.io

## Copy

Product claims come from the Switchroom source README and `reference/` docs (`switchroom/switchroom`). Don't invent product claims here: if the source repo doesn't ship it, it doesn't go on the page. Chat mockups use synthetic data only; never paste real chats, household names or chat IDs.

Outbound product links live in `src/site.ts`; `REPO` is the single place to change them.
