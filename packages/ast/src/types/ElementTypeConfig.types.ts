import { Element } from '../types';

/**
 * Whether the element participates in the block flow or sits inside a
 * block's inline content.
 */
export type ElementLevel = 'block' | 'inline';

/**
 * What the element contains, which determines how the editor treats its
 * children.
 *
 * - `inline`: inline elements and text leaves
 * - `literal`: a single text leaf carrying raw content, with no marks and no
 *   inline parsing
 * - `table`: rows and cells, internal to the block
 * - `void`: a single empty text leaf, not editable
 */
export type ElementContent = 'inline' | 'literal' | 'table' | 'void';

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
  level: ElementLevel;

  /**
   * What the element contains.
   */
  content: ElementContent;

  /**
   * Callback used to serialize the element's content to a markdown string.
   *
   * The returned markdown carries no ancestry line prefixes: those are
   * applied by the serializer, which is the only place that knows the
   * surrounding blocks.
   *
   * @param element - The Element to stringify.
   * @returns The markdown text.
   */
  toMarkdown(element: TElement): string;

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
