import { Design, Designs } from '@minddrop/designs-next';

/**
 * Resolves the styles of a design's render root from its own
 * settings.
 *
 * @param design - The design to resolve the styles for.
 * @returns The render root's styles.
 */
export function resolveDesignStyle(design: Design): React.CSSProperties {
  // Resolve the side padding, none when unset
  const padding = design.sidePadding ?? 0;
  // Start the styles from the aspect ratio
  const style: React.CSSProperties = { aspectRatio: design.aspectRatio };

  // Pad both sides when the design has side padding
  if (padding) {
    style.paddingLeft = padding;
    style.paddingRight = padding;
  }

  // Check if the design is capped. If not, the styles are complete.
  if (!design.contentWidth) {
    return style;
  }

  // Resolve the cap from the design's own width
  const cap = design.columns * Designs.constants.UnitPixelSize;

  // Cap the width, with room for the padding on both sides
  return { ...style, maxWidth: cap + padding * 2 };
}
