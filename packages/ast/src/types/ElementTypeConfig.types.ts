import { Element } from '../types';

export interface ElementTypeConfig<TElement extends Element = Element> {
  /**
   * The type of the element. Used to determine which component is used to
   * render the element.
   */
  type: string;

  /**
   * Designates the element as a block or inline element.
   *
   * The level of an element determines its "flow" in the editor
   * similar to how block and inline elements work in HTML.
   */
  display: 'block' | 'inline';

  /**
   * Elements default to being non-void, meaning that their children are
   * fully editable as text. But in some cases, like for images, you want
   * to ensure that the editor doesn't treat their content as editable
   * text, but instead as a black box.
   *
   * Note that void elements must contain a single empty text child.
   */
  isVoid?: boolean;

  /**
   * Callback used to serialize the element's content to a markdown string.
   *
   * @param element - The Element to stringify.
   * @returns The markdown text.
   */
  toMarkdown(element: TElement): string;

  /**
   * Callback used to serialize an array of consecutive elements to a
   * markdown string.
   *
   * Useful when you need to serialize a series of elements of the same
   * type into a single block of markdown, like when serializing a list.
   *
   * @param elements - The elements to stringify.
   * @returns The markdown text.
   */
  stringifyBatchToMarkdown?(element: TElement[]): string;

  /**
   * Callback used to stringify an element into plain text.
   * If not provided, the element's children are stringified
   * automatically.
   *
   * @param element - The element to stringify.
   * @returns The plain text content.
   */
  toPlainText?(element: TElement): string;
}
