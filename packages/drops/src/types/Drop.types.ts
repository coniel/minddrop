import { RootContent } from '@minddrop/markdown';

export interface Drop {
  /**
   * A unique ID generated at parse time.
   */
  id: string;

  /**
   * The drop's content type.
   */
  type: 'heading' | 'text' | 'image' | 'file' | 'link' | 'table' | 'blockquote';

  /**
   * The drop's raw markdown content.
   */
  markdown: string;

  /**
   * The drop's markdown content as MD AST nodes.
   */
  children: RootContent[];
}
