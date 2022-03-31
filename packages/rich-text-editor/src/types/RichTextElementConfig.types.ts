import { RichTextElementProps } from './RichTextElementProps.types';

export interface RichTextElementConfig {
  /**
   * The element type identifier, e.g. 'paragraph'.
   */
  type: string;

  /**
   * The component used to render the element.
   */
  component: React.ElementType<RichTextElementProps>;

  /**
   * In a not "void" element, Slate handles the rendering of
   * its children (e.g. in a paragraph where the Text and
   * Inline children are rendered by Slate). In a "void"
   * element, the children are rendered by the Element's
   * render code.
   */
  isVoid?: boolean;

  /**
   * If `true`, the element will be rendered inline.
   * A "block" element can only be siblings with other
   * "block" elements. An "inline" node can be siblings
   * with Text nodes or other "inline" elements.
   */
  isInline?: boolean;
}
