import { getContentColorCss } from './getContentColorCss';

/**
 * Returns the CSS background-color value for a given content color.
 *
 * @param color - The content color name.
 * @returns A CSS color value string.
 */
export function getBackgroundColorStyle(color: string): string {
  return getContentColorCss(color, 100, 'var(--surface-paper)');
}
