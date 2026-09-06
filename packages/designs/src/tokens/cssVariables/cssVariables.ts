/**
 * The CSS custom property prefix for each token group. This is the
 * single place group-to-prefix irregularities live (font families
 * are `--font-sans`, not `--font-family-sans`; color roles drop
 * the word "color" entirely).
 */
const TokenCssVariablePrefixes = {
  fontFamily: 'font',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  measure: 'measure',
  space: 'space',
  size: 'size',
  radius: 'radius',
  borderWidth: 'border-width',
  iconSize: 'icon-size',
  shadow: 'shadow',
  textColor: 'text',
  surfaceColor: 'surface',
  borderColor: 'border',
} as const;

export type TokenGroup = keyof typeof TokenCssVariablePrefixes;

/**
 * Resolves a token to its CSS custom property reference, e.g.
 * `tokenCssVariable('fontSize', 'md')` returns `'var(--font-size-md)'`.
 */
export function tokenCssVariable(group: TokenGroup, token: string): string {
  return `var(--${TokenCssVariablePrefixes[group]}-${token})`;
}
