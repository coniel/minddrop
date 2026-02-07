import { ElementTree } from './ElementTree.types';

export interface Design {
  /**
   * A unique identifier for this design.
   */
  id: string;

  /**
   * The type of element this design is for.
   */
  type: string;

  /**
   * User specified name for this design.
   */
  name: string;

  /**
   * The elements composing this design.
   */
  elements: ElementTree;
}
