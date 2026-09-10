import { DesignElement } from './DesignElement.types';

export interface DesignElementContentControlsProps<
  TElement extends DesignElement = DesignElement,
> {
  /**
   * The selected element the content belongs to.
   */
  element: TElement;

  /**
   * Callback fired with the element's serialized content, or
   * undefined once it is cleared.
   */
  onContentChange: (content: string | undefined) => void;
}
