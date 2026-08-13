/**
 * The icon size steps, from caption-inline (`2xs`) to feature
 * icons (`xl`).
 */
export const IconSizeTokens = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

export type IconSizeToken = (typeof IconSizeTokens)[number];
