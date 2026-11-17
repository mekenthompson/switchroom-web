// Single source for outbound product links.
//
// The Hermes-based Switchroom lives at switchroom/switchroom (moved from
// mekenthompson/hermes-fleet on 2026-11-18; the old URL redirects).
export const REPO = 'https://github.com/switchroom/switchroom';
export const DOCS = `${REPO}/tree/main/docs`;
export const OVERLAY_EXAMPLE = `${REPO}/tree/main/examples/overlay-repo`;
export const LICENSE = `${REPO}/blob/main/LICENSE`;
// Path links into the repo's main branch: tree() for directories, blob() for files.
export const tree = (path: string) => `${REPO}/tree/main/${path}`;
export const blob = (path: string) => `${REPO}/blob/main/${path}`;
export const HERMES = 'https://github.com/NousResearch/hermes-agent';
