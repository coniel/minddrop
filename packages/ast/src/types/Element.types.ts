import { TextElement } from './TextElement.types';

export interface BaseElement<TType extends string = string> {
  /**
   * The type of the element. Used to determine which component is used to
   * render the element.
   */
  type: TType;

  /**
   * The element's children.
   *
   * Block elements can have either other elements or inline elements
   * as their children, but not a mix of both.
   *
   * Inline elements can only have text elements as children.
   *
   * All void elements must have a single empty text child.
   */
  children: (Element | TextElement)[];
}

export type ElementCustomData = object;

export type Element<
  TType extends string = string,
  TData extends ElementCustomData = ElementCustomData,
> = BaseElement<TType> & TData;
