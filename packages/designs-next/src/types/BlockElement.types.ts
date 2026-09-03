export type ElementWidthMode =
  | 'fluid'
  | 'fixed-left'
  | 'fixed-right'
  | 'fixed-center';

export interface BlockElement {
  /**
   * A unique identifier for the element.
   */
  id: string;

  /**
   * Zero-based column of the element's left edge, in grid units.
   */
  column: number;

  /**
   * Zero-based row of the element's top edge, in grid units.
   */
  row: number;

  /**
   * Number of columns the element spans.
   */
  columnSpan: number;

  /**
   * Number of rows the element spans.
   */
  rowSpan: number;

  /**
   * How the element's width behaves when the card resizes: fluid
   * elements scale with the card, fixed elements keep their unit
   * width and stay pinned to the given card edge (or centered) while
   * the gaps on their unpinned sides absorb the extra space.
   */
  widthMode: ElementWidthMode;

  /**
   * Whether the element grows to its content's height, stretching the
   * rows it spans and pushing rows below it down.
   */
  naturalHeight: boolean;
}
