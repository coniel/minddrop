import {
  Design,
  DesignElement,
  RowLayout,
  UnitPixelSize,
  resolveVerticalElementRect,
} from '@minddrop/designs-next';

/**
 * Resolves an element wrapper's vertical styles: engine-resolved in
 * aspect-locked designs, row-layout based with natural growth
 * otherwise.
 *
 * @param element - The element to resolve styles for.
 * @param design - The design being rendered.
 * @param aspectHeight - The card's pixel height when aspect-locked.
 * @param rowLayout - The row layout when not aspect-locked.
 * @returns The wrapper's vertical styles.
 */
export function resolveVerticalStyles(
  element: DesignElement,
  design: Design,
  aspectHeight: number | null,
  rowLayout: RowLayout | null,
): React.CSSProperties {
  // Resolve the element against the fixed card height
  if (aspectHeight !== null) {
    const rect = resolveVerticalElementRect(
      element,
      design.elements,
      design.rows,
      aspectHeight,
    );

    return { top: rect.top, height: rect.height };
  }

  return {
    top: rowLayout?.tops[element.row],
    // Natural elements size to their content, with their block span
    // as the minimum.
    height: element.naturalHeight ? undefined : element.rowSpan * UnitPixelSize,
    minHeight: element.naturalHeight
      ? element.rowSpan * UnitPixelSize
      : undefined,
  };
}
