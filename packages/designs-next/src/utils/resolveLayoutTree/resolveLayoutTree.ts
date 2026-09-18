import {
  Design,
  DesignElement,
  LayoutAxis,
  LayoutBox,
  LayoutBoxBase,
  LayoutRegion,
} from '../../types';
import { columnsOverlap } from '../columnsOverlap';
import { resolveAxisUnits } from '../resolveAxisUnits';
import { resolveChildElements } from '../resolveChildElements';
import { resolveCutLines } from '../resolveCutLines';
import { resolveScalingColumns } from '../resolveScalingColumns';
import { resolveScalingRows } from '../resolveScalingRows';
import { rowsOverlap } from '../rowsOverlap';
import { sliceRegion } from '../sliceRegion';

// How a box's size relates to the box holding it
type LayoutBoxUnits = Pick<LayoutBoxBase, 'columnUnits' | 'rowUnits'>;

/**
 * Compiles a design into the tree of boxes it renders as, cutting it
 * into bands at every horizontal line no element crosses and, where
 * there is none, into column boxes at every vertical one, each band
 * and column box cut the same way in turn. A region holding no
 * element is a spacer, a region one element fills is that element,
 * and a region no line cuts is atomic, holding its elements at their
 * unit rects.
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
  const units: LayoutBoxUnits = {
    columnUnits: resolveAxisUnits(
      resolveScalingColumns(elements, design.columns),
      0,
      design.columns,
    ).span,
    rowUnits: resolveAxisUnits(
      resolveScalingRows(elements, design.rows),
      0,
      design.rows,
    ).span,
  };

  // Cut the whole design
  return cutRegion(region, elements, units);
}

/**
 * Cuts a region into bands at the horizontal lines none of its
 * elements cross, or into column boxes at the vertical ones where
 * no horizontal line cuts it, cutting each slice in turn.
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
  if (elements.length === 1 && fillsRegion(elements[0], region)) {
    return { type: 'element', ...region, ...units, element: elements[0] };
  }

  // Cut into bands at the horizontal lines the region can be cut at
  const rowLines = resolveCutLines(elements, region, 'rows');

  if (rowLines.length > 0) {
    return {
      type: 'rows',
      ...region,
      ...units,
      children: cutSlices(region, elements, rowLines, 'rows'),
    };
  }

  // Cut into column boxes at the vertical lines otherwise
  const columnLines = resolveCutLines(elements, region, 'columns');

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
  // Classify the region's columns and rows against its elements,
  // which the slices' sizes are read from.
  const columnScaling = resolveScalingColumns(
    elements,
    region.column + region.columnSpan,
  ).slice(region.column);
  const rowScaling = resolveScalingRows(
    elements,
    region.row + region.rowSpan,
  ).slice(region.row);

  // Cut each slice with the elements inside it
  return sliceRegion(region, lines, axis).map((slice) => {
    const sliceElements = elements.filter((element) =>
      axis === 'rows'
        ? rowsOverlap(element, slice)
        : columnsOverlap(element, slice),
    );
    const sliceUnits: LayoutBoxUnits = {
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

    return cutRegion(slice, sliceElements, sliceUnits);
  });
}

/**
 * Checks whether an element covers a region exactly.
 *
 * @param element - The element.
 * @param region - The region.
 * @returns True when the element's rect is the region.
 */
function fillsRegion(element: DesignElement, region: LayoutRegion): boolean {
  return (
    element.column === region.column &&
    element.row === region.row &&
    element.columnSpan === region.columnSpan &&
    element.rowSpan === region.rowSpan
  );
}
