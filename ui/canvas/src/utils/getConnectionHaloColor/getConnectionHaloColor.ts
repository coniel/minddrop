import { ContentColor } from '@minddrop/ui-theme';

/**
 * Returns the CSS color value a connection's hover/selection halo
 * is stroked with: a lighter shade of the connection's stroke
 * color.
 *
 * @param color - The connection's content color.
 * @returns The CSS color value.
 */
export function getConnectionHaloColor(color?: ContentColor): string {
  // Unset and default colors use a light neutral shade
  if (!color || color === 'default') {
    return 'var(--neutral-500)';
  }

  return `var(--${color}-500)`;
}
