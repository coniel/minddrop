import { RichText } from './RichText.types';

export interface RichTextElement {
  /**
   * The element ID.
   */
  id: string;

  /**
   * The element type identifier, e.g. 'paragraph'.
   */
  type: string;

  /**
   * The content of the element.
   */
  children?: RichText[] | RichTextElement[];
}
