/**
 * The spacing scale. Step names are scale indices resolving through
 * the theme's density unit; `px` is a fixed hairline gap.
 */
export const SpaceTokens = [
  'px',
  '0-5',
  '0-75',
  '1',
  '1-5',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
] as const;

export type SpaceToken = (typeof SpaceTokens)[number];
