import { ContentColor } from '@minddrop/ui-theme';

/**
 * Returns the CSS color value a connection with the given content
 * color is stroked with. The default color uses the theme's
 * default border color.
 *
 * @param color - The connection's content color.
 * @returns The CSS color value.
 */
export function getConnectionColor(color?: ContentColor): string {
  // Unset and default colors use the neutral border color
  if (!color || color === 'default') {
    return 'var(--border-default)';
  }

  return `var(--${color}-600)`;
}
