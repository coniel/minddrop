import { DesignElement } from './DesignElement.types';

/**
 * A direction a region is cut along: rows cut it at horizontal
 * lines into bands, columns cut it at vertical lines into column
 * boxes.
 */
export type LayoutAxis = 'rows' | 'columns';

/**
 * A rectangle of a design's unit grid.
 */
export interface LayoutRegion {
  /**
   * Zero-based column of the region's left edge, in grid units.
   */
  column: number;

  /**
   * Zero-based row of the region's top edge, in grid units.
   */
  row: number;

  /**
   * Number of columns the region spans.
   */
  columnSpan: number;

  /**
   * Number of rows the region spans.
   */
  rowSpan: number;
}

/**
 * A region cut into bands at the horizontal lines no element
 * crosses, stacked top to bottom.
 */
export interface LayoutRowsBox extends LayoutRegion {
  type: 'rows';

  /**
   * The bands, top to bottom.
   */
  children: LayoutBox[];
}

/**
 * A region holding no element, which keeps its unit size.
 */
export interface LayoutSpacerBox extends LayoutRegion {
  type: 'spacer';
}

/**
 * A region a single element fills, which sizes it.
 */
export interface LayoutElementBox extends LayoutRegion {
  type: 'element';

  /**
   * The element filling the region.
   */
  element: DesignElement;
}

/**
 * A region no line cuts, its elements positioned inside it at their
 * unit rects.
 */
export interface LayoutAtomBox extends LayoutRegion {
  type: 'atom';

  /**
   * The elements inside the region, in paint order.
   */
  elements: DesignElement[];
}

/**
 * A node of the box tree a design compiles to.
 */
export type LayoutBox =
  | LayoutRowsBox
  | LayoutSpacerBox
  | LayoutElementBox
  | LayoutAtomBox;
