import { TextLineHeight, UnitPixelSize } from '../../constants';

/**
 * Resolves the rows a line of text needs at a font size: its line
 * height rounded up to whole grid units.
 *
 * @param fontSize - The font size in pixels.
 * @returns The row span in grid units.
 */
export function resolveTextLineRowSpan(fontSize: number): number {
  return Math.ceil((fontSize * TextLineHeight) / UnitPixelSize);
}
