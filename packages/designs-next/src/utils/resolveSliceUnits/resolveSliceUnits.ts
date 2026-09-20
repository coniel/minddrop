import { LayoutBoxUnits, LayoutRegion } from '../../types';
import { resolveAxisUnits } from '../resolveAxisUnits';

/**
 * Resolves how a slice's size relates to the region it was cut
 * from, from the region's scaling classifications.
 *
 * @param slice - The slice.
 * @param columnScaling - A flag per column of the region, true when the column scales.
 * @param rowScaling - A flag per row of the region, true when the row scales.
 * @param region - The region the slice was cut from.
 * @returns The slice's units.
 */
export function resolveSliceUnits(
  slice: LayoutRegion,
  columnScaling: boolean[],
  rowScaling: boolean[],
  region: LayoutRegion,
): LayoutBoxUnits {
  // Count the slice's columns and rows from the region's origin
  return {
    columnUnits: resolveAxisUnits(
      columnScaling,
      slice.column - region.column,
      slice.columnSpan,
    ).span,
    rowUnits: resolveAxisUnits(
      rowScaling,
      slice.row - region.row,
      slice.rowSpan,
    ).span,
  };
}
