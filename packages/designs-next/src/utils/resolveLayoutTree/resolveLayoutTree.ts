import {
  Design,
  DesignElement,
  LayoutAxis,
  LayoutBox,
  LayoutRegion,
  UnitShare,
} from '../../types';
import { columnsOverlap } from '../columnsOverlap';
import { resolveAxisUnits } from '../resolveAxisUnits';
import { resolveChildElements } from '../resolveChildElements';
import { resolveCutLines } from '../resolveCutLines';
import { resolveScalingColumns } from '../resolveScalingColumns';
import { rowsOverlap } from '../rowsOverlap';
import { sliceRegion } from '../sliceRegion';

/**
 * Compiles a design into the tree of boxes it renders as, cutting it
 * into bands at every horizontal line no element crosses and, where
 * there is none, into column boxes at every vertical one. A region
 * holding no element is a spacer, a region one element fills is that
 * element, and a region no line cuts is atomic, holding its elements
 * at their unit rects.
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

  // Classify the design's columns against its own elements
  const columnUnits = resolveAxisUnits(
    resolveScalingColumns(elements, design.columns),
    0,
    design.columns,
  ).span;

  // Cut the whole design
  return cutRegion(region, elements, columnUnits);
}

/**
 * Cuts a region into bands at the horizontal lines none of its
 * elements cross, or into column boxes at the vertical ones where
 * no horizontal line cuts it.
 *
 * @param region - The region to cut.
 * @param elements - The elements inside the region.
 * @param columnUnits - The region's columns, classified against the box it was cut from.
 * @returns The box the region compiles to.
 */
function cutRegion(
  region: LayoutRegion,
  elements: DesignElement[],
  columnUnits: UnitShare,
): LayoutBox {
  // A region holding no element is a spacer
  if (elements.length === 0) {
    return { type: 'spacer', ...region, columnUnits };
  }

  // A region one element fills is that element
  if (elements.length === 1 && fillsRegion(elements[0], region)) {
    return { type: 'element', ...region, columnUnits, element: elements[0] };
  }

  // Cut into bands at the horizontal lines the region can be cut at
  const rowLines = resolveCutLines(elements, region, 'rows');

  if (rowLines.length > 0) {
    return {
      type: 'rows',
      ...region,
      columnUnits,
      children: cutSlices(region, elements, rowLines, 'rows'),
    };
  }

  // Cut into column boxes at the vertical lines otherwise
  const columnLines = resolveCutLines(elements, region, 'columns');

  if (columnLines.length > 0) {
    return {
      type: 'columns',
      ...region,
      columnUnits,
      children: cutSlices(region, elements, columnLines, 'columns'),
    };
  }

  // With no cut line, the region is atomic
  return { type: 'atom', ...region, columnUnits, elements };
}

/**
 * Slices a region at cut lines along an axis and compiles each slice
 * with the elements inside it. Bands are cut further, column boxes
 * are leaves.
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
  // Classify the region's columns against its elements, which the
  // slices' widths are read from.
  const scaling = resolveScalingColumns(
    elements,
    region.column + region.columnSpan,
  ).slice(region.column);

  // Compile each slice with the elements inside it
  return sliceRegion(region, lines, axis).map((slice) => {
    const sliceElements = elements.filter((element) =>
      axis === 'rows'
        ? rowsOverlap(element, slice)
        : columnsOverlap(element, slice),
    );
    const sliceUnits = resolveAxisUnits(
      scaling,
      slice.column - region.column,
      slice.columnSpan,
    ).span;

    if (axis === 'rows') {
      return cutRegion(slice, sliceElements, sliceUnits);
    }

    return resolveLeaf(slice, sliceElements, sliceUnits);
  });
}

/**
 * Compiles a region without cutting it: a spacer when it holds no
 * element, the element when one fills it, an atomic box otherwise.
 *
 * @param region - The region.
 * @param elements - The elements inside the region.
 * @param columnUnits - The region's columns, classified against the box it was cut from.
 * @returns The leaf box.
 */
function resolveLeaf(
  region: LayoutRegion,
  elements: DesignElement[],
  columnUnits: UnitShare,
): LayoutBox {
  if (elements.length === 0) {
    return { type: 'spacer', ...region, columnUnits };
  }

  if (elements.length === 1 && fillsRegion(elements[0], region)) {
    return { type: 'element', ...region, columnUnits, element: elements[0] };
  }

  return { type: 'atom', ...region, columnUnits, elements };
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
