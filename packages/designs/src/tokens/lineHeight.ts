/**
 * The line height scale, from single-line labels (`none`) to airy
 * long-form reading (`loose`).
 */
export const LineHeightTokens = [
  'none',
  'tight',
  'snug',
  'normal',
  'relaxed',
  'loose',
] as const;

export type LineHeightToken = (typeof LineHeightTokens)[number];
