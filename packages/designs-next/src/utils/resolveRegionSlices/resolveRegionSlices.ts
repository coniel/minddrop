import {
  DesignElement,
  LayoutAxis,
  LayoutBoxUnits,
  LayoutRegion,
} from '../../types';
import { columnsOverlap } from '../columnsOverlap';
import { resolveRegionScalingColumns } from '../resolveRegionScalingColumns';
import { resolveRegionScalingRows } from '../resolveRegionScalingRows';
import { resolveSliceUnits } from '../resolveSliceUnits';
import { rowsOverlap } from '../rowsOverlap';
import { sliceRegion } from '../sliceRegion';

/**
 * A slice of a region, with the elements inside it and its size
 * relative to the region.
 */
export interface RegionSlice {
  /**
   * The slice's rectangle.
   */
  region: LayoutRegion;

  /**
   * The elements inside the slice.
   */
  elements: DesignElement[];

  /**
   * The slice's columns and rows, classified against the region's
   * elements.
   */
  units: LayoutBoxUnits;
}

/**
 * Slices a region at cut lines along an axis, giving each slice the
 * elements inside it and its size relative to the region.
 *
 * @param region - The region to slice.
 * @param elements - The elements inside the region.
 * @param lines - The lines to slice at.
 * @param axis - The axis the lines cut across.
 * @returns The slices, in order.
 */
export function resolveRegionSlices(
  region: LayoutRegion,
  elements: DesignElement[],
  lines: number[],
  axis: LayoutAxis,
): RegionSlice[] {
  // Classify the region's columns and rows against its elements.
  // The slices' sizes are read from them.
  const columnScaling = resolveRegionScalingColumns(elements, region);
  const rowScaling = resolveRegionScalingRows(elements, region);

  // Give each slice the elements inside it and its size
  return sliceRegion(region, lines, axis).map((slice) => ({
    region: slice,
    elements: elements.filter((element) =>
      axis === 'rows'
        ? rowsOverlap(element, slice)
        : columnsOverlap(element, slice),
    ),
    units: resolveSliceUnits(slice, columnScaling, rowScaling, region),
  }));
}
