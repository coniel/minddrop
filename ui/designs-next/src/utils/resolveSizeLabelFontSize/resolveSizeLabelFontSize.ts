// The share of the box's height the label may take, leaving space
// above and below it.
const HeightShare = 0.5;

// The share of the box's width the label may take, leaving space to
// either side of it.
const WidthShare = 0.8;

// The width of a character as a share of the font size, averaged
// over the digits and separators a size label is made of.
const CharacterWidthRatio = 0.62;

/**
 * Resolves the largest font size at which a size label fits inside
 * a box, in the box's own coordinate space.
 *
 * @param label - The label to fit.
 * @param width - The box's width in pixels.
 * @param height - The box's height in pixels.
 * @returns The font size in pixels.
 */
export function resolveSizeLabelFontSize(
  label: string,
  width: number,
  height: number,
): number {
  // The size at which the label spans the width it may take
  const widthLimit =
    (width * WidthShare) / (label.length * CharacterWidthRatio);

  return Math.min(widthLimit, height * HeightShare);
}
