/**
 * The surface colour roles a background emphasis resolves onto:
 * the schemable surfaces, which take on the entry's colour inside a
 * scheme and stay grey outside one, plus the app surface a
 * transparent layout root paints. The solid fill pairs with the
 * `on-solid` text role. Pinned neutral, brand and intent surfaces
 * are not design vocabulary.
 */
export const SurfaceColorTokens = [
  'app',
  'subtle',
  'accent',
  'solid-accent',
] as const;

export type SurfaceColorToken = (typeof SurfaceColorTokens)[number];
