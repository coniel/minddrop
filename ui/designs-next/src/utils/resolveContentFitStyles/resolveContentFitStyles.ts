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
  // Read the fit, fixed when unset
  const contentFit = element.contentFit ?? 'fixed';
  // The block's unit height
  const blockHeight = element.rowSpan * Designs.constants.UnitPixelSize;

  // Take the block height as a minimum
  if (contentFit === 'grow') {
    return { minHeight: blockHeight };
  }

  // Take the block height as a maximum
  if (contentFit === 'shrink') {
    return { maxHeight: blockHeight };
  }

  // Leave the height to the content
  if (contentFit === 'natural') {
    return {};
  }

  // Hold the block height
  return { height: blockHeight };
}
