/**
 * The letter spacing steps: `tight` for display sizes, `wide` and
 * `wider` for uppercase labels and overlines.
 */
export const LetterSpacingTokens = [
  'tight',
  'normal',
  'wide',
  'wider',
] as const;

export type LetterSpacingToken = (typeof LetterSpacingTokens)[number];
