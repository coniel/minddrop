import { DesignElement } from './DesignElement.types';

/**
 * A direction a region is cut along. Rows cut it at horizontal
 * lines into bands, columns cut it at vertical lines into column
 * boxes.
 */
export type LayoutAxis = 'rows' | 'columns';

/**
 * A count of grid units split into those keeping their unit size
 * and those scaling with the region.
 */
export interface UnitShare {
  /**
   * The units keeping their unit size.
   */
  fixed: number;

  /**
   * The units scaling with the region.
   */
  scaling: number;
}

/**
 * An extent along one axis of a region, as unit counts split by
 * whether they scale with the region.
 */
export interface AxisUnits {
  /**
   * The units between the region's start and the extent's start.
   */
  before: UnitShare;

  /**
   * The units the extent spans.
   */
  span: UnitShare;

  /**
   * The units the region spans.
   */
  total: UnitShare;
}

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
 * How a box's size relates to the box holding it.
 */
export interface LayoutBoxUnits {
  /**
   * The box's columns split into those keeping their unit width and
   * those scaling with the width of the box holding it, classified
   * against the elements of the box it was cut from.
   */
  columnUnits: UnitShare;

  /**
   * The box's rows split into those keeping their unit height and
   * those scaling with the height of the box holding it, classified
   * against the elements of the box it was cut from. Applies where
   * the design's height is fixed by its aspect ratio.
   */
  rowUnits: UnitShare;
}

/**
 * What every box of the tree carries: its region, and how its size
 * relates to the box holding it.
 */
export interface LayoutBoxBase extends LayoutRegion, LayoutBoxUnits {}

/**
 * A region cut into bands at the horizontal lines no element
 * crosses, stacked top to bottom.
 */
export interface LayoutRowsBox extends LayoutBoxBase {
  type: 'rows';

  /**
   * The bands, top to bottom.
   */
  children: LayoutBox[];
}

/**
 * A region cut into column boxes at the vertical lines no element
 * crosses, laid out left to right.
 */
export interface LayoutColumnsBox extends LayoutBoxBase {
  type: 'columns';

  /**
   * The column boxes, left to right.
   */
  children: LayoutBox[];
}

/**
 * A region with no element in it. It keeps its unit size.
 */
export interface LayoutSpacerBox extends LayoutBoxBase {
  type: 'spacer';
}

/**
 * A region a single element fills. The element sizes it.
 */
export interface LayoutElementBox extends LayoutBoxBase {
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
export interface LayoutAtomBox extends LayoutBoxBase {
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
  | LayoutColumnsBox
  | LayoutSpacerBox
  | LayoutElementBox
  | LayoutAtomBox;
