/**
 * The font size scale. Steps up to `base` serve dense interface
 * text; `md` and above serve content.
 */
export const FontSizeTokens = [
  '2xs',
  'xs',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
] as const;

export type FontSizeToken = (typeof FontSizeTokens)[number];
