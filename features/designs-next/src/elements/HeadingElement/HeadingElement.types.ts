import { DesignElement } from '@minddrop/designs-next';

export interface HeadingElement extends DesignElement {
  /**
   * The heading's static text content, rendered when no property is
   * selected to fill the element.
   */
  text?: string;
}
