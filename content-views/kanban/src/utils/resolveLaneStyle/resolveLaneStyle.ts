import { ContentColor } from '@minddrop/ui-theme';

/**
 * Resolves the styles carrying a lane's surface, taken from the
 * colour of the option its column groups entries by.
 *
 * @param color - The option's colour, if it has one.
 * @returns The lane styles, empty when the option has no colour of its own.
 */
export function resolveLaneStyle(color?: ContentColor): React.CSSProperties {
  // Check that the option carries a colour to tint the lane with
  if (!color || color === 'default') {
    return {};
  }

  return {
    '--kanban-lane-surface': `var(--${color}-200)`,
  } as React.CSSProperties;
}
