import { Design, DesignElement, LayoutBox, LayoutRegion } from '../../types';
import { resolveChildElements } from '../resolveChildElements';
import { resolveCutLines } from '../resolveCutLines';
import { rowsOverlap } from '../rowsOverlap';
import { sliceRegion } from '../sliceRegion';

/**
 * Compiles a design into the tree of boxes it renders as, cutting it
 * into bands at every horizontal line no element crosses. A band
 * holding no element is a spacer, a band one element fills is that
 * element, and a band no line cuts is atomic, holding its elements
 * at their unit rects.
 *
 * @param design - The design to compile.
 * @returns The root box of the tree.
 */
export function resolveLayoutTree(design: Design): LayoutBox {
  // The design's own elements, which it lays out. An element held
  // by another is placed by it.
  const elements = resolveChildElements(design.elements);

  // Cut the whole design
  return cutRegion(
    { column: 0, row: 0, columnSpan: design.columns, rowSpan: design.rows },
    elements,
  );
}

/**
 * Cuts a region into bands at the horizontal lines none of its
 * elements cross, cutting each band in turn.
 *
 * @param region - The region to cut.
 * @param elements - The elements inside the region.
 * @returns The box the region compiles to.
 */
function cutRegion(region: LayoutRegion, elements: DesignElement[]): LayoutBox {
  // A region holding no element is a spacer
  if (elements.length === 0) {
    return { type: 'spacer', ...region };
  }

  // A region one element fills is that element
  if (elements.length === 1 && fillsRegion(elements[0], region)) {
    return { type: 'element', ...region, element: elements[0] };
  }

  // Find the horizontal lines the region can be cut at
  const lines = resolveCutLines(elements, region, 'rows');

  // With no cut line, the region is atomic
  if (lines.length === 0) {
    return { type: 'atom', ...region, elements };
  }

  // Cut the region into bands at every cut line, each holding the
  // elements inside it.
  const children = sliceRegion(region, lines, 'rows').map((band) =>
    cutRegion(
      band,
      elements.filter((element) => rowsOverlap(element, band)),
    ),
  );

  return { type: 'rows', ...region, children };
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
