/**
 * Readable line-length limits for text blocks and content widths.
 */
export const MeasureTokens = ['narrow', 'content', 'wide'] as const;

export type MeasureToken = (typeof MeasureTokens)[number];
