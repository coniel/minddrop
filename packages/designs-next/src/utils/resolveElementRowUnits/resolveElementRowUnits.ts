import { AxisUnits, DesignElement, LayoutRegion } from '../../types';
import { resolveAxisUnits } from '../resolveAxisUnits';
import { resolveRegionScalingRows } from '../resolveRegionScalingRows';
import { resolveVerticalContextElements } from '../resolveVerticalContextElements';

/**
 * Resolves an element's rows within a region as unit counts split by
 * whether they scale with the region's height. The rows are
 * classified against the element's own vertical context inside the
 * region, so a pinned element holds its edge of the region and a
 * fluid-height one stretches with it.
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
  // Classify the region's rows against the element's vertical
  // context.
  const context = resolveVerticalContextElements(element, elements);
  const scaling = resolveRegionScalingRows([element, ...context], region);

  // Count the units from the region's top edge
  return resolveAxisUnits(scaling, element.row - region.row, element.rowSpan);
}
