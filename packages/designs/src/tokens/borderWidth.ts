/**
 * The border widths, from default hairlines to statement borders
 * and decorative single-side accent bars.
 */
export const BorderWidthTokens = ['thin', 'medium', 'thick', 'accent'] as const;

export type BorderWidthToken = (typeof BorderWidthTokens)[number];
