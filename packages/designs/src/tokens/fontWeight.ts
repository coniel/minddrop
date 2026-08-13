/**
 * The font weights.
 */
export const FontWeightTokens = [
  'regular',
  'medium',
  'semibold',
  'bold',
] as const;

export type FontWeightToken = (typeof FontWeightTokens)[number];
