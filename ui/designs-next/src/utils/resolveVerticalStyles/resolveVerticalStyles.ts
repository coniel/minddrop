import {
  Design,
  DesignElement,
  Designs,
  RowLayout,
} from '@minddrop/designs-next';

/**
 * Resolves an element wrapper's vertical styles: engine-resolved in
 * aspect-locked designs, row-layout based with the element's content
 * fit bounding its height otherwise.
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
    const rect = Designs.resolveVerticalElementRect(
      element,
      design.elements,
      design.rows,
      aspectHeight,
    );

    return { top: rect.top, height: rect.height };
  }

  return {
    top: rowLayout?.tops[element.row],
    ...resolveContentFitStyles(element),
  };
}

/**
 * Resolves the bounds an element's content fit sets on its wrapper's
 * height: fixed holds the block height, grow takes it as a minimum,
 * shrink as a maximum, and natural leaves the height to the content.
 *
 * @param element - The element to resolve bounds for.
 * @returns The wrapper's height bounds.
 */
function resolveContentFitStyles(element: DesignElement): React.CSSProperties {
  const contentFit = element.contentFit ?? 'fixed';
  const blockHeight = element.rowSpan * Designs.constants.UnitPixelSize;

  if (contentFit === 'grow') {
    return { minHeight: blockHeight };
  }

  if (contentFit === 'shrink') {
    return { maxHeight: blockHeight };
  }

  if (contentFit === 'natural') {
    return {};
  }

  return { height: blockHeight };
}
