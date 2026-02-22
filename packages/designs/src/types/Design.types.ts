import { RootElement } from './DesignElement.types';

export type DesignType = 'card' | 'list' | 'page';

export interface Design {
  /**
   * A unique identifier for this design.
   */
  id: string;

  /**
   * Path to the design file.
   */
  path: string;

  /**
   * User specified name for this design.
   */
  name: string;

  /**
   * The type of design.
   */
  type: DesignType;

  /**
   * The design tree. Always a root element with children.
   */
  tree: RootElement;

  /**
   * The date the design was created.
   */
  created: Date;

  /**
   * The date the design was last modified.
   */
  lastModified: Date;
}
