import { RenderElementProps } from 'slate-react';

export type RTElementAttributes = RenderElementProps['attributes'] & {
  /**
   * The element ID.
   */
  id: string;
};

export interface RTElementProps extends RenderElementProps {
  attributes: RTElementAttributes;
}
