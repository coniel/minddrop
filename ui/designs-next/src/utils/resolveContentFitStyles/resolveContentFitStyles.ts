import { DesignElement, Designs } from '@minddrop/designs-next';

/**
 * Resolves the bounds an element's content fit sets on its wrapper's
 * height: fixed holds the block height, grow takes it as a minimum,
 * shrink as a maximum, and natural leaves the height to the content.
 *
 * @param element - The element to resolve bounds for.
 * @returns The wrapper's height bounds.
 */
export function resolveContentFitStyles(
  element: DesignElement,
): React.CSSProperties {
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
