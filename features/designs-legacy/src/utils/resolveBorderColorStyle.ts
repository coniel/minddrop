import { resolveContentColorCss } from './resolveContentColorCss';

/**
 * Returns the CSS border-color value for a given content color.
 * Uses darker shade (600) for borders.
 *
 * @param color - The content color name.
 * @returns A CSS color value string.
 */
export function resolveBorderColorStyle(color: string): string {
  return resolveContentColorCss(color, 600, 'var(--surface-overlay)');
}
