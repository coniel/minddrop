import { AxisUnits, DesignElement, LayoutRegion } from '../../types';
import { resolveAxisUnits } from '../resolveAxisUnits';
import { resolveContextElements } from '../resolveContextElements';
import { resolveRegionScalingColumns } from '../resolveRegionScalingColumns';

/**
 * Resolves an element's columns within a region as unit counts split
 * by whether they scale with the region's width. The columns are
 * classified against the element's own context inside the region.
 *
 * @param element - The element to resolve the columns of.
 * @param elements - The elements inside the region.
 * @param region - The region.
 * @returns The element's column units, relative to the region.
 */
export function resolveElementColumnUnits(
  element: DesignElement,
  elements: DesignElement[],
  region: LayoutRegion,
): AxisUnits {
  // Classify the region's columns against the element's context
  const context = resolveContextElements(element, elements);
  const scaling = resolveRegionScalingColumns([element, ...context], region);

  // Count the units from the region's left edge
  return resolveAxisUnits(
    scaling,
    element.column - region.column,
    element.columnSpan,
  );
}
