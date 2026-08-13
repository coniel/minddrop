/**
 * The elevation scale plus the semantic aliases (`raised` for
 * cards and panels, `overlay` for floating content).
 */
export const ShadowTokens = [
  'xs',
  'sm',
  'md',
  'lg',
  'raised',
  'overlay',
] as const;

export type ShadowToken = (typeof ShadowTokens)[number];
