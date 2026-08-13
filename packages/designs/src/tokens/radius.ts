/**
 * The border radius scale. `full` renders pills and circles and
 * squares off when the theme's radius unit is zeroed.
 */
export const RadiusTokens = ['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;

export type RadiusToken = (typeof RadiusTokens)[number];
