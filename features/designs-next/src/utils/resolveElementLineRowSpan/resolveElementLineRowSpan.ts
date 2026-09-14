import { DesignElement, Designs, TextSettings } from '@minddrop/designs-next';

/**
 * Resolves the rows one line of an element's text needs at its
 * size and line height, the block's floor.
 *
 * @param element - The element carrying the text settings.
 * @returns The row span in grid units.
 */
export function resolveElementLineRowSpan(
  element: DesignElement & TextSettings,
): number {
  return Designs.resolveTextLineRowSpan(
    element.fontSize ?? Designs.constants.DefaultFontSize,
    element.lineHeight,
  );
}
