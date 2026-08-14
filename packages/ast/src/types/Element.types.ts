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

  /**
   * The block's own slice of the document it was parsed from, excluding the
   * line prefix its containers contribute to its first line. Written back
   * verbatim, which is what makes an untouched block survive byte for byte.
   *
   * Cleared when the block is edited, after which it no longer describes
   * the block and its markdown is rebuilt from the element's own data.
   */
  source?: string;

  /**
   * The text between this block's content and the next block's line prefix,
   * as it was parsed. Only absent once the block has been edited or
   * inserted.
   */
  spacingAfter?: string;

  /**
   * The text before the block's line prefix, as it was parsed. Only carried
   * by the document's first block, where it holds any leading whitespace.
   */
  spacingBefore?: string;
}

export type ElementCustomData = object;

export type Element<
  TType extends string = string,
  TData extends ElementCustomData = ElementCustomData,
> = BaseElement<TType> & TData;
