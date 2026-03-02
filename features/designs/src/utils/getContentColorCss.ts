const colorNames = [
  'blue',
  'cyan',
  'red',
  'pink',
  'purple',
  'green',
  'orange',
  'yellow',
  'brown',
  'gray',
];

/**
 * Returns the CSS value for a content color at a given shade level.
 * Returns the fallback for 'default' or unknown colors.
 *
 * @param color - The content color name.
 * @param shade - The shade level (100-900).
 * @param fallback - The fallback value for 'default' or unknown colors.
 * @returns A CSS color value string.
 */
export function getContentColorCss(
  color: string,
  shade: number,
  fallback: string,
): string {
  if (color === 'default' || !colorNames.includes(color)) {
    return fallback;
  }

  return `var(--${color}-${shade})`;
}
