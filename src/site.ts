// Single source for outbound product links.
//
// The Hermes-based Switchroom currently lives at mekenthompson/hermes-fleet.
// When that repo is transferred to switchroom/switchroom, GitHub redirects
// these URLs; flip REPO here in the same window as the repo swap.
export const REPO = 'https://github.com/mekenthompson/hermes-fleet';
export const DOCS = `${REPO}/tree/main/docs`;
export const OVERLAY_EXAMPLE = `${REPO}/tree/main/examples/overlay-repo`;
export const LICENSE = `${REPO}/blob/main/LICENSE`;
// Path links into the repo's main branch: tree() for directories, blob() for files.
export const tree = (path: string) => `${REPO}/tree/main/${path}`;
export const blob = (path: string) => `${REPO}/blob/main/${path}`;
export const HERMES = 'https://github.com/NousResearch/hermes-agent';
