import { RootElement } from './DesignElement.types';

export type DesignType = 'card' | 'list' | 'page';

export interface Design {
  /**
   * A unique identifier for this design.
   */
  id: string;

  /**
   * User specified name for this design.
   */
  name: string;

  /**
   * The type of design.
   */
  type: DesignType;

  /**
   * The root design element.
   */
  rootElement: RootElement;
}
