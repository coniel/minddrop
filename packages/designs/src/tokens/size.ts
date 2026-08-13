/**
 * The coarse box size scale for content areas: cover image heights,
 * embed heights, media frames. Fixed values, deliberately unaffected
 * by spacing density.
 */
export const SizeTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export type SizeToken = (typeof SizeTokens)[number];
