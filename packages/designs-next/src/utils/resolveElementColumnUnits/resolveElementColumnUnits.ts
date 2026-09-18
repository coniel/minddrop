import { AxisUnits, DesignElement, LayoutRegion } from '../../types';
import { resolveAxisUnits } from '../resolveAxisUnits';
import { resolveContextElements } from '../resolveContextElements';
import { resolveScalingColumns } from '../resolveScalingColumns';

/**
 * Resolves an element's columns within a region as unit counts split
 * by whether they scale with the region's width. Column scaling is
 * classified against the element's own context inside the region:
 * scaling columns share the width left after fixed columns take one
 * unit width each.
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
  // Classify column scaling against the element's context, up to
  // the region's right edge.
  const context = resolveContextElements(element, elements);
  const scaling = resolveScalingColumns(
    [element, ...context],
    region.column + region.columnSpan,
  );

  // Count the units from the region's left edge
  return resolveAxisUnits(
    scaling.slice(region.column),
    element.column - region.column,
    element.columnSpan,
  );
}
