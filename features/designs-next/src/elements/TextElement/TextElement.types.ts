import { DesignElement } from '@minddrop/designs-next';

export interface TextElement extends DesignElement {
  /**
   * The element's static text content, rendered when no property is
   * selected to fill the element.
   */
  text?: string;
}
