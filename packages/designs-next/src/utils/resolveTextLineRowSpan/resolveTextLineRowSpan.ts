import { DefaultLineHeight, UnitPixelSize } from '../../constants';

/**
 * Resolves the rows a line of text needs at a font size: its line
 * height rounded up to whole grid units.
 *
 * @param fontSize - The font size in pixels.
 * @param lineHeight - The line height as a multiple of the font
 *   size, the default line height when omitted.
 * @returns The row span in grid units.
 */
export function resolveTextLineRowSpan(
  fontSize: number,
  lineHeight?: number,
): number {
  return Math.ceil(
    (fontSize * (lineHeight ?? DefaultLineHeight)) / UnitPixelSize,
  );
}
