import { Element } from '@minddrop/ast';
import { RenderElementProps } from 'slate-react';

/**
 * Props passed to the component used to render a block
 * element in the editor.
 */
export interface BlockElementProps<TElement extends Element = Element>
  extends Omit<RenderElementProps, 'element'> {
  element: TElement;
}
