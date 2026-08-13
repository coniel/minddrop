import type { EntityId } from '@minddrop/utils';
import type { RootElement } from '../design-element-configs';

export type LayoutId = EntityId<'layout'>;

/**
 * What a layout renders as. A separate axis from the design type,
 * which says what the design is for.
 */
export type LayoutType = 'card' | 'list' | 'page' | 'space';

/**
 * The position and size of a layout on its design's canvas.
 * Authoring geometry, not style vocabulary.
 */
export interface LayoutFrame {
  /**
   * The horizontal canvas position.
   */
  x: number;

  /**
   * The vertical canvas position.
   */
  y: number;

  /**
   * The layout width.
   */
  width: number;

  /**
   * The layout height. Omitted for content-sized layouts.
   */
  height?: number;
}

export interface Layout {
  /**
   * A unique identifier for the layout.
   */
  id: LayoutId;

  /**
   * The layout's user-facing name.
   */
  name: string;

  /**
   * A short description of the layout's intended use.
   */
  description?: string;

  /**
   * What the layout renders as.
   */
  type: LayoutType;

  /**
   * The layout's element tree.
   */
  tree: RootElement;

  /**
   * The layout's position and size on the design canvas.
   */
  frame: LayoutFrame;

  /**
   * Timestamp at which the layout was created.
   */
  created: Date;

  /**
   * Timestamp at which the layout was last modified.
   */
  lastModified: Date;
}
