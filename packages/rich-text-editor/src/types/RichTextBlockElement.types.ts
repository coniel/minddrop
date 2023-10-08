import { RichTextFragment } from './RichTextFragment.types';
import { RenderElementProps } from 'slate-react';

export type RichTextBlockElementType =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'paragraph'
  | 'to-do'
  | 'ordered-list'
  | 'unordered-list'
  | 'math-block';

export interface BaseRichTextBlockElement {
  /**
   * The element level.
   */
  level: 'block';

  /**
   * The element type.
   */
  type: string;

  /**
   * A rich text fragment consisting of rich text nodes and
   * inline rich text elements.
   *
   * Void nodes should have a single empty text node as their
   * children: `[{ text: ''}]`
   */
  children: RichTextFragment;
}

/**
 * Type specific data cannot use same keys as base data.
 */
export type RichTextBlockElementTypeData = Object & {
  [K in keyof BaseRichTextBlockElement]?: never;
};

export type RichTextBlockElement<
  TTypeData extends RichTextBlockElementTypeData = {},
> = BaseRichTextBlockElement & TTypeData;

/**
 * Props passed to the component used to render a block
 * rich text element in the editor.
 */
export interface RichTextBlockElementProps<
  TElement extends RichTextBlockElement = RichTextBlockElement,
> extends Omit<RenderElementProps, 'element'> {
  element: TElement;
}
