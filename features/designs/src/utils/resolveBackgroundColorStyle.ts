import { resolveContentColorCss } from './resolveContentColorCss';

/**
 * Returns the CSS background-color value for a given content color.
 *
 * @param color - The content color name.
 * @returns A CSS color value string.
 */
export function resolveBackgroundColorStyle(color: string): string {
  return resolveContentColorCss(color, 100, 'var(--surface-overlay)');
}
