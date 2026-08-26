import { CSSProperties } from 'react';
import { ContentColor } from '@minddrop/ui-theme';

/**
 * Resolves the fill and text colour a badge takes from its select
 * option's content colour, following the Chip primitive's colour
 * convention. Options without a colour of their own fall back to
 * neutral styling.
 *
 * @param color - The option's content colour.
 * @returns The badge's colour CSS.
 */
export function resolveBadgeColorCss(color?: ContentColor): CSSProperties {
  // No colour, or the default one: the neutral chip
  if (!color || color === 'default') {
    return {
      backgroundColor: 'var(--neutral-300)',
      color: 'var(--text-muted)',
    };
  }

  return {
    backgroundColor: `var(--${color}-400)`,
    color: `var(--${color}-1100)`,
  };
}
