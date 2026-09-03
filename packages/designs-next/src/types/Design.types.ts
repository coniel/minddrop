import { EntityId } from '@minddrop/utils';
import { DesignElement } from './DesignElement.types';

export type DesignId = EntityId<'design'>;

/**
 * What a design renders as.
 */
export type DesignType = 'card' | 'list' | 'page' | 'space';

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
}
