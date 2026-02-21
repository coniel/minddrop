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
   * The root design element.
   */
  rootElement: RootElement;
}
