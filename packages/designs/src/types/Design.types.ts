import { RootDesignElement, RootElementType } from './DesignElement.types';

export type DesignType = RootElementType;

export interface Design {
  /**
   * A unique identifier for this design.
   */
  id: string;

  /**
   * The type of the design's root element. Determines the type of design.
   */
  type: DesignType;

  /**
   * User specified name for this design.
   */
  name: string;

  /**
   * The elements composing this design.
   */
  tree: RootDesignElement;
}
