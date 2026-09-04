import { EntityId } from '@minddrop/utils';

export type DesignElementId = EntityId<'element'>;

export type ElementWidthMode =
  | 'fluid'
  | 'fixed-left'
  | 'fixed-right'
  | 'fixed-center';

export type ElementHeightMode =
  | 'fluid'
  | 'fixed-top'
  | 'fixed-bottom'
  | 'fixed-center';

export interface DesignElement {
  /**
   * A unique identifier for the element.
   */
  id: DesignElementId;

  /**
   * The element type, keying the renderer's element registry.
   */
  type: string;

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
   * rows it spans and pushing rows below it down. Ignored in
   * aspect-locked designs.
   */
  naturalHeight: boolean;

  /**
   * How the element's height behaves in an aspect-locked design:
   * fluid elements scale with the card's height, fixed elements keep
   * their unit height and stay pinned to the given card edge (or
   * centered). Absent means fluid. Ignored outside aspect-locked
   * designs.
   */
  heightMode?: ElementHeightMode;
}
