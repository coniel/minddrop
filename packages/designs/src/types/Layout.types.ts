import { RootElement } from './DesignElement.types';

export type LayoutType = 'card' | 'list' | 'page';

export interface LayoutFrame {
  /**
   * The horizontal position of the layout's top-left corner on the canvas,
   * in canvas (un-zoomed) pixels.
   */
  x: number;

  /**
   * The vertical position of the layout's top-left corner on the canvas,
   * in canvas (un-zoomed) pixels.
   */
  y: number;

  /**
   * The width of the layout's frame on the canvas, in canvas (un-zoomed)
   * pixels.
   */
  width: number;

  /**
   * The height of the layout's frame on the canvas, in canvas (un-zoomed)
   * pixels. Omitted for layouts whose height is determined by their
   * content (card, list).
   */
  height?: number;
}

export interface Layout {
  /**
   * A unique identifier for this layout.
   */
  id: string;

  /**
   * User specified name for this layout.
   */
  name: string;

  /**
   * User specified description of this layout.
   */
  description?: string;

  /**
   * The type of layout.
   */
  type: LayoutType;

  /**
   * The layout's element tree. Always a root element with children.
   */
  tree: RootElement;

  /**
   * The position and size of the layout on its parent design's canvas.
   */
  frame: LayoutFrame;

  /**
   * The date the layout was created.
   */
  created: Date;

  /**
   * The date the layout was last modified.
   */
  lastModified: Date;
}
