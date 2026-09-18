import {
  Design,
  DesignElement,
  LayoutAxis,
  LayoutBox,
  LayoutBoxUnits,
  LayoutRegion,
} from '../../types';
import { columnsOverlap } from '../columnsOverlap';
import { isSameRegion } from '../isSameRegion';
import { resolveAxisUnits } from '../resolveAxisUnits';
import { resolveChildElements } from '../resolveChildElements';
import { resolveCutLines } from '../resolveCutLines';
import { resolveRegionScalingColumns } from '../resolveRegionScalingColumns';
import { resolveRegionScalingRows } from '../resolveRegionScalingRows';
import { rowsOverlap } from '../rowsOverlap';
import { sliceRegion } from '../sliceRegion';

/**
 * Compiles a design into the tree of boxes it renders as. The design
 * is cut into bands at every horizontal line no element crosses.
 * Where there is none, it is cut into column boxes at every vertical
 * one. A region with no element in it is a spacer, a region one
 * element fills is that element, and a region no line cuts is
 * atomic, holding its elements at their unit rects.
 *
 * @param design - The design to compile.
 * @returns The root box of the tree.
 */
export function resolveLayoutTree(design: Design): LayoutBox {
  // The design's own elements, which it lays out. An element held
  // by another is placed by it.
  const elements = resolveChildElements(design.elements);
  // The whole design
  const region: LayoutRegion = {
    column: 0,
    row: 0,
    columnSpan: design.columns,
    rowSpan: design.rows,
  };

  // Classify the design's columns and rows against its own elements
  const units = resolveSliceUnits(
    region,
    resolveRegionScalingColumns(elements, region),
    resolveRegionScalingRows(elements, region),
    region,
  );

  // Cut the whole design
  return cutRegion(region, elements, units);
}

/**
 * Cuts a region into bands at the horizontal lines none of its
 * elements cross, or into column boxes at the vertical ones where no
 * horizontal line cuts it.
 *
 * @param region - The region to cut.
 * @param elements - The elements inside the region.
 * @param units - The region's columns and rows, classified against the box it was cut from.
 * @returns The box the region compiles to.
 */
function cutRegion(
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
      children: cutSlices(region, elements, rowLines, 'rows'),
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
      children: cutSlices(region, elements, columnLines, 'columns'),
    };
  }

  // With no cut line, the region is atomic
  return { type: 'atom', ...region, ...units, elements };
}

/**
 * Slices a region at cut lines along an axis and cuts each slice
 * with the elements inside it.
 *
 * @param region - The region to slice.
 * @param elements - The elements inside the region.
 * @param lines - The lines to slice at.
 * @param axis - The axis the lines cut across.
 * @returns The boxes the slices compile to, in order.
 */
function cutSlices(
  region: LayoutRegion,
  elements: DesignElement[],
  lines: number[],
  axis: LayoutAxis,
): LayoutBox[] {
  // Classify the region's columns and rows against its elements.
  // The slices' sizes are read from them.
  const columnScaling = resolveRegionScalingColumns(elements, region);
  const rowScaling = resolveRegionScalingRows(elements, region);

  // Cut each slice with the elements inside it
  return sliceRegion(region, lines, axis).map((slice) => {
    // Collect the elements inside the slice
    const sliceElements = elements.filter((element) =>
      axis === 'rows'
        ? rowsOverlap(element, slice)
        : columnsOverlap(element, slice),
    );

    // Read the slice's size from the classification
    const sliceUnits = resolveSliceUnits(
      slice,
      columnScaling,
      rowScaling,
      region,
    );

    // Cut the slice
    return cutRegion(slice, sliceElements, sliceUnits);
  });
}

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
function resolveSliceUnits(
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
