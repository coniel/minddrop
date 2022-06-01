import { RenderElementProps } from 'slate-react';
import { RTElement, RTBlockElement, RTInlineElement } from './RTElement.types';

export type RTElementAttributes = RenderElementProps['attributes'] & {
  /**
   * The element ID.
   */
  id: string;
};

export interface RTElementProps<TElement extends RTElement = RTElement>
  extends Omit<RenderElementProps, 'element'> {
  attributes: RTElementAttributes;
  element: TElement;
}

/**
 * Inline rich text element component props.
 */
export type RTInlineElementProps<
  TElement extends RTInlineElement = RTInlineElement,
> = RTElementProps<TElement>;

/**
 * Block rich text element component props.
 */
export type RTBlockElementProps<
  TElement extends RTBlockElement = RTBlockElement,
> = RTElementProps<TElement>;
