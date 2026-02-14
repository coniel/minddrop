import { ElementTree } from './ElementTree.types';

export type DesignType = 'page' | 'card' | 'list';

export interface Design {
  /**
   * A unique identifier for this design.
   */
  id: string;

  /**
   * The type of element this design is for.
   */
  type: DesignType;

  /**
   * User specified name for this design.
   */
  name: string;

  /**
   * The elements composing this design.
   */
  elements: ElementTree;
}
