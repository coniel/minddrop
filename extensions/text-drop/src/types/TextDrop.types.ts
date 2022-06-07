import { Drop } from '@minddrop/drops';

export interface TextDropData {
  /**
   * The ID of the drop's rich text document.
   */
  richTextDocument: string;
}

export type TextDrop = Drop<TextDropData>;

export interface CreateTextDropData {
  /**
   * The drop type.
   */
  type: 'text';

  /**
   * The ID of the drop's rich text document.
   */
  richTextDocument: string;
}
