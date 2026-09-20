import {
  DesignElement,
  LayoutBox,
  LayoutBoxUnits,
  LayoutRegion,
} from '../../types';
import { isSameRegion } from '../isSameRegion';
import { resolveCutLines } from '../resolveCutLines';
import { resolveRegionSlices } from '../resolveRegionSlices';

/**
 * Cuts a region into bands at the horizontal lines none of its
 * elements cross, or into column boxes at the vertical ones where no
 * horizontal line cuts it, cutting each slice the same way in turn.
 * A region with no element in it is a spacer, a region one element
 * fills is that element, and a region no line cuts is atomic.
 *
 * @param region - The region to cut.
 * @param elements - The elements inside the region.
 * @param units - The region's columns and rows, classified against the box it was cut from.
 * @returns The box the region compiles to.
 */
export function cutRegion(
  region: LayoutRegion,
  elements: DesignElement[],
  units: LayoutBoxUnits,
): LayoutBox {
  // A region holding no element is a spacer
  if (elements.length === 0) {
    return { type: 'spacer', ...region, ...units };
  }

  // A region one element fills is that element
  if (elements.length === 1 && isSameRegion(elements[0], region)) {
    return { type: 'element', ...region, ...units, element: elements[0] };
  }

  // Find the horizontal lines the region can be cut at
  const rowLines = resolveCutLines(elements, region, 'rows');

  // Compile the bands between them into a rows box
  if (rowLines.length > 0) {
    return {
      type: 'rows',
      ...region,
      ...units,
      children: resolveRegionSlices(region, elements, rowLines, 'rows').map(
        (slice) => cutRegion(slice.region, slice.elements, slice.units),
      ),
    };
  }

  // Find the vertical lines the region can be cut at otherwise
  const columnLines = resolveCutLines(elements, region, 'columns');

  // Compile the column regions between them into a columns box
  if (columnLines.length > 0) {
    return {
      type: 'columns',
      ...region,
      ...units,
      children: resolveRegionSlices(
        region,
        elements,
        columnLines,
        'columns',
      ).map((slice) => cutRegion(slice.region, slice.elements, slice.units)),
    };
  }

  // With no cut line, the region is atomic
  return { type: 'atom', ...region, ...units, elements };
}
