import { EntityId } from '@minddrop/utils';
import { DesignElement } from './DesignElement.types';

export type DesignId = EntityId<'design'>;

/**
 * What a design renders as.
 */
export type DesignType = 'card' | 'list' | 'page' | 'space';

/**
 * An aspect ratio as width/height (e.g. '3/2').
 */
export type AspectRatioToken =
  | '2/3'
  | '3/4'
  | '4/5'
  | '1/1'
  | '4/3'
  | '3/2'
  | '16/9';

export interface Design {
  /**
   * A unique identifier for the design.
   */
  id: DesignId;

  /**
   * The design's user-facing name.
   */
  name: string;

  /**
   * What the design renders as.
   */
  type: DesignType;

  /**
   * The design's width in grid units.
   */
  columns: number;

  /**
   * The design's height in grid units.
   */
  rows: number;

  /**
   * The design's aspect ratio. When set, the design renders at
   * height = width / ratio at every width, element height modes
   * apply, and the design-time rows derive from the ratio. Absent
   * for natural-height designs.
   */
  aspectRatio?: AspectRatioToken;

  /**
   * The design's elements. Array order is paint order, later
   * elements layer on top.
   */
  elements: DesignElement[];

  /**
   * Timestamp at which the design was created.
   */
  created: Date;

  /**
   * Timestamp at which the design was last modified.
   */
  lastModified: Date;

  /**
   * The ID of the entity which owns the design. Owned designs have
   * no design file of their own.
   */
  owner?: EntityId;
}
