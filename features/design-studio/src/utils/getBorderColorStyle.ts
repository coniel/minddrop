import { getContentColorCss } from './getContentColorCss';

/**
 * Returns the CSS border-color value for a given content color.
 * Uses darker shade (600) for borders.
 *
 * @param color - The content color name.
 * @returns A CSS color value string.
 */
export function getBorderColorStyle(color: string): string {
  return getContentColorCss(color, 600, 'var(--surface-paper)');
}
