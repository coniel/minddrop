import { Designs, ElementPadding } from '@minddrop/designs-next';

/**
 * Scales an element's padding to the size a grid unit is drawn at,
 * which the block editor draws designs at.
 *
 * @param padding - The element's padding.
 * @param unitSize - The rendered pixel size of a grid unit.
 * @returns The scaled padding sides.
 */
export function resolveScaledPadding(
  padding: ElementPadding | undefined,
  unitSize: number,
): Required<ElementPadding> {
  const scale = unitSize / Designs.constants.UnitPixelSize;

  return {
    top: (padding?.top ?? 0) * scale,
    right: (padding?.right ?? 0) * scale,
    bottom: (padding?.bottom ?? 0) * scale,
    left: (padding?.left ?? 0) * scale,
  };
}
