import { RenderElementProps } from 'slate-react';
import { RichTextBlockElement } from './RichTextBlockElement.types';
import { RichTextInlineElement } from './RichTextInlineElement.types';

export type RichTextElementAttributes = RenderElementProps['attributes'] & {
  /**
   * The element ID.
   */
  id: string;
};

export interface RichTextElementProps<TElement>
  extends Omit<RenderElementProps, 'element'> {
  attributes: RichTextElementAttributes;
  element: TElement;
}

/**
 * Inline rich text element component props.
 */
export type RichTextInlineElementProps<
  TElement extends RichTextInlineElement = RichTextInlineElement,
> = RichTextElementProps<TElement>;

/**
 * Block rich text element component props.
 */
export type RichTextBlockElementProps<
  TElement extends RichTextBlockElement = RichTextBlockElement,
> = RichTextElementProps<TElement>;
