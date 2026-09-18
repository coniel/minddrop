import { AxisUnits, DesignElement, LayoutRegion } from '../../types';
import { resolveAxisUnits } from '../resolveAxisUnits';
import { resolveScalingRows } from '../resolveScalingRows';
import { resolveVerticalContextElements } from '../resolveVerticalContextElements';

/**
 * Resolves an element's rows within a region as unit counts split by
 * whether they scale with the region's height. Row scaling is
 * classified against the element's own vertical context inside the
 * region: scaling rows share the height left after fixed rows take
 * one unit height each, so a pinned element holds its edge of the
 * region and a fluid-height one stretches with it.
 *
 * @param element - The element to resolve the rows of.
 * @param elements - The elements inside the region.
 * @param region - The region.
 * @returns The element's row units, relative to the region.
 */
export function resolveElementRowUnits(
  element: DesignElement,
  elements: DesignElement[],
  region: LayoutRegion,
): AxisUnits {
  // Classify row scaling against the element's vertical context, up
  // to the region's bottom edge.
  const context = resolveVerticalContextElements(element, elements);
  const scaling = resolveScalingRows(
    [element, ...context],
    region.row + region.rowSpan,
  );

  // Count the units from the region's top edge
  return resolveAxisUnits(
    scaling.slice(region.row),
    element.row - region.row,
    element.rowSpan,
  );
}
