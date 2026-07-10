# switchroom-web

Landing page for [Switchroom](https://github.com/switchroom/switchroom) — *a switchboard for your Pro or Max.*

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

Copy is lifted from the canonical copy kit (`switchroom` repo, `messaging/copy-kit.md`) and `reference/product-spec.md`. Don't invent product claims here — if it isn't in those two docs, it doesn't go on the page.
