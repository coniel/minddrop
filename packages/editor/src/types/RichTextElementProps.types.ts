import { RenderElementProps } from 'slate-react';

export type RichTextElementAttributes = RenderElementProps['attributes'] & {
  /**
   * The element ID.
   */
  id: string;
};

export interface RichTextElementProps extends RenderElementProps {
  attributes: RichTextElementAttributes;
}
