import { Frame } from './Frame.types';
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
   * Block elements contain inline elements and text elements. No block
   * element contains another block element: containment is expressed by
   * `ancestry` instead.
   *
   * Inline elements can only have text elements as children.
   *
   * Void elements must have a single empty text child.
   */
  children: (Element | TextElement)[];

  /**
   * The containers the block sits inside, outermost first. Rendered as
   * indentation and serialized as line prefixes.
   *
   * Only block elements carry an ancestry.
   */
  ancestry?: Frame[];
}

export type ElementCustomData = object;

export type Element<
  TType extends string = string,
  TData extends ElementCustomData = ElementCustomData,
> = BaseElement<TType> & TData;
