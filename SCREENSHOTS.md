# Real-screenshot manifest

> **Status (2026-07):** all 12 shots below now render from the upgraded HTML/CSS
> mockups using the operator-approved staged scripts (fictional content, real
> agent names). `/shots` (`src/pages/shots.astro`, noindex) is the capture
> gallery; `scripts/capture.mjs` exports the 3x-DPR finals and regenerates
> `public/assets/og.png`. Real phone captures can still replace any entry later
> per the notes below.

> **Hero note (feat/storyline-hero):** the hero now plays `StorylineHero.astro`
> — a ~76s pure-CSS animated "ship day" arc (fleet list → progress card →
> approval tap → rich reply → `/usage` quota card → marko hop → loop). It is
> not replaceable by a single capture; entry #1 (`HeroPhone.astro`) lives on
> as the static money shot used by `/shots` and the OG image.

The page currently ships hand-built Telegram-style HTML/CSS mockups (in `src/components/`). Each entry below is a real capture that can replace one, with the content, crop, and theme wanted. Capture on a phone (Telegram iOS or Android, default dark theme unless noted), full quality, no compression apps. Redact anything personal before committing.

| # | Replaces | Content wanted | Crop | Theme |
|---|----------|----------------|------|-------|
| 1 | `HeroPhone.astro` (hero money shot) | A chat with a real specialist (e.g. `clerk`): one user ask, one rich reply (bold key fact + short list), followed by a live approval card with visible ✅ Approve / 🚫 Deny buttons | Full phone screen incl. status bar and chat header | Dark (primary) + light variant |
| 2 | `FleetList.astro` (how-it-works beat 1) | Telegram chat list showing 4–6 named agent bots with last-message previews and at least one unread badge | Chat list only, from "Chats" header down | Dark |
| 3 | `MarkoChat.astro` (beat 2) | A non-coding specialist doing real work: ask + reply with a short list and one bolded recommendation | Chat header + 2 messages | Dark |
| 4 | `ProgressCard.astro` (beat 3 + always-available pillar) | A pinned live progress card mid-task: title, 3–4 checklist rows (mix of done/running), "updated Ns ago" | Chat header + pinned bar + the card message | Dark |
| 5 | `ApprovalCard.astro` (hold-the-leash pillar) | A real vault-access approval card: key name in code span, scope/TTL/reason lines, Approve/Deny buttons untapped | The card message only, header optional | Dark |
| 6 | `RichReply.astro` (standing-team pillar) | A reply that visibly uses remembered context (references something from a previous session) | Chat header + ask + reply | Dark |
| 7 | `QuotaCard.astro` (subscription-honest pillar) | A live plan-quota status reply (5h window %, reset time, weekly state) | Ask ("quota?") + reply | Dark |
| 8 | `RichShowcase.astro` (Telegram-done-properly) | One reply containing a real GFM table, a syntax-highlighted code block, and an expandable blockquote (collapsed state showing the ▼ expander) | Chat header + ask + the full reply | Dark |
| 9 | `LeashSequence.astro` frame 1 | User asks for a consequential action; agent replies it will ask first | Header + 2 messages | Dark |
| 10 | `LeashSequence.astro` frame 2 | The resulting approval card, untapped | Card message | Dark |
| 11 | `LeashSequence.astro` frame 3 | The same card after Approve (state shows who/when) + the completion message | 2 messages | Dark |
| 12 | OG image chat inset (`public/assets/og.png`) | Same as #1 but cropped to header + 2 messages | Tight crop | Dark |

Capture notes:

- Prefer 3× DPR screenshots (modern iPhone/Pixel); the frames on the page render at ~320 CSS px wide, so anything ≥ 900 px wide is enough.
- Keep timestamps plausible and consistent within a sequence (#9–11 must read as one flow).
- Real agent names are fine; the page currently uses `clerk`, `marko`, `coach`, `quill`, `klanker`.
- When a real capture lands, export it as AVIF + WebP with explicit width/height and drop it into the matching component; the device frame CSS can stay.
