import { Fragment } from './Fragment.types';
import { RenderElementProps } from 'slate-react';

export type BlockElementType =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'paragraph'
  | 'to-do'
  | 'ordered-list'
  | 'unordered-list'
  | 'math-block';

export interface BaseBlockElement {
  /**
   * The element level.
   */
  level: 'block';

  /**
   * The element type.
   */
  type: string;

  /**
   * A fragment consisting of text nodes and inline elements.
   *
   * Void nodes should have a single empty text node as their
   * children: `[{ text: ''}]`
   */
  children: Fragment;
}

/**
 * Type specific data cannot use same keys as base data.
 */
export type BlockElementTypeData = Object & {
  [K in keyof BaseBlockElement]?: never;
};

export type BlockElement<TTypeData extends BlockElementTypeData = {}> =
  BaseBlockElement & TTypeData;

/**
 * Props passed to the component used to render a block
 * element in the editor.
 */
export interface BlockElementProps<TElement extends BlockElement = BlockElement>
  extends Omit<RenderElementProps, 'element'> {
  element: TElement;
}
