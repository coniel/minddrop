/**
 * The content font families. The app chrome family (`ui`) is
 * deliberately excluded: it is not part of the design vocabulary.
 */
export const FontFamilyTokens = ['sans', 'serif', 'mono'] as const;

export type FontFamilyToken = (typeof FontFamilyTokens)[number];
