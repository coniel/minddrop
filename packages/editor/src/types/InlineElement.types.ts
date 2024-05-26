import { Fragment } from './Fragment.types';
import { RenderElementProps } from 'slate-react';

export type InlineElementType = 'text' | 'link' | 'math-inline';

export interface BaseInlineElement {
  /**
   * The element level.
   */
  level: 'inline';

  /**
   * The type of element.
   */
  type: InlineElementType;

  /**
   * A Fragment consisting of Text nodes and InlineElement nodes.
   */
  children: Fragment;
}

/**
 * Type specific data cannot use same keys as base data.
 */
export type InlineElementTypeData = Object & {
  [K in keyof BaseInlineElement]?: never;
};

export type InlineElement<TTypeData extends InlineElementTypeData = {}> =
  BaseInlineElement & TTypeData;

/**
 * Props passed to the component used to render a InlineElement
 *  in the editor.
 */
export interface InlineElementProps<
  TElement extends InlineElement = InlineElement,
> extends Omit<RenderElementProps, 'element'> {
  element: TElement;
}
