import { RichTextFragment } from './RichTextFragment.types';
import { RenderElementProps } from 'slate-react';

export type RichTextInlineElementType = 'text' | 'link' | 'math-inline';

export interface BaseRichTextInlineElement {
  /**
   * The element level.
   */
  level: 'inline';

  /**
   * The type of element.
   */
  type: RichTextInlineElementType;

  /**
   * A rich text fragment consisting of rich text nodes and
   * inline rich text elements.
   */
  children: RichTextFragment;
}

/**
 * Type specific data cannot use same keys as base data.
 */
export type RichTextInlineElementTypeData = Object & {
  [K in keyof BaseRichTextInlineElement]?: never;
};

export type RichTextInlineElement<
  TTypeData extends RichTextInlineElementTypeData = {},
> = BaseRichTextInlineElement & TTypeData;

/**
 * Props passed to the component used to render an inline
 * rich text element in the editor.
 */
export interface RichTextInlineElementProps<
  TElement extends RichTextInlineElement = RichTextInlineElement,
> extends Omit<RenderElementProps, 'element'> {
  element: TElement;
}
