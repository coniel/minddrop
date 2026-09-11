import { ElementColor } from '@minddrop/designs-next';
import { resolveColorLevel } from '@minddrop/ui-theme';

/**
 * Resolves the colour an element is drawn in to the palette token
 * holding it.
 *
 * @param color - The element's colour.
 * @returns The CSS colour value, or undefined where the element
 *   carries no colour of its own.
 */
export function resolveElementColor(color?: ElementColor): string | undefined {
  if (!color) {
    return undefined;
  }

  return resolveColorLevel(color.color, color.level);
}
