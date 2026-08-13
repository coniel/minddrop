/**
 * The border widths, from default hairlines to statement borders
 * and accent bars.
 */
export const BorderWidthTokens = ['thin', 'medium', 'thick'] as const;

export type BorderWidthToken = (typeof BorderWidthTokens)[number];
