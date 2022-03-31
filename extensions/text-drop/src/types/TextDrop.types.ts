import { Drop } from '@minddrop/drops';

export interface TextDrop extends Drop {
  /**
   * The ID of the drop's rich text document.
   */
  richTextDocument: string;
}

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
