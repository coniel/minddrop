import { EntityId } from '@minddrop/utils';

export type DesignElementId = EntityId<'element'>;

export type ElementWidthMode =
  | 'fluid'
  | 'fixed-left'
  | 'fixed-right'
  | 'fixed-proportional';

export type ElementHeightMode =
  | 'fluid'
  | 'fixed-top'
  | 'fixed-bottom'
  | 'fixed-proportional';

/**
 * How an element's height fits its content: fixed holds the block's
 * height, grow takes it as a minimum, shrink as a maximum, and
 * natural follows the content either way.
 */
export type ElementContentFit = 'fixed' | 'grow' | 'shrink' | 'natural';

/**
 * A step of the padding scale, from the smallest to the largest.
 */
export type PaddingSize =
  | 'xs'
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

/**
 * The space between an element's block edges and its content, in
 * pixels. Sides with no padding are left out.
 */
export interface ElementPadding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

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
   * The element's own content, serialized as text. Its element type
   * decides what the text holds and reads it back. Absent when the
   * element has none.
   */
  content?: string;

  /**
   * Name of the property the element takes its content from.
   * Referenced by name since properties carry no stable ID. Absent
   * when the element is unmapped.
   */
  property?: string;

  /**
   * The ID of the element holding this one. Absent for an element
   * sitting on the design's own grid.
   */
  parent?: DesignElementId;

  /**
   * The name of the slot the element fills in its parent, which
   * decides where the parent places it. Absent for an element its
   * parent lays out rather than places.
   */
  slot?: string;

  /**
   * How the element's width behaves when the card resizes: fluid
   * elements scale with the card, fixed elements keep their unit
   * width and stay pinned to the given card edge, or hold their place
   * proportionally between both, while the gaps on their unpinned
   * sides absorb the extra space.
   */
  widthMode: ElementWidthMode;

  /**
   * How the element's height fits its content, stretching or
   * shrinking the rows it spans so rows below move with it. Absent
   * means fixed. Ignored in aspect-locked designs.
   */
  contentFit?: ElementContentFit;

  /**
   * The space between the element's block edges and its content.
   * Absent means none. Only paddable element types have it.
   */
  padding?: ElementPadding;

  /**
   * How the element's height behaves when the region holding it is
   * taller than its rows. Fluid elements scale with the region's
   * height, fixed elements keep their unit height and stay pinned to
   * the given region edge, or hold their place proportionally
   * between both. Absent means fixed to the top edge.
   */
  heightMode?: ElementHeightMode;
}
