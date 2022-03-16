import { Drop } from '@minddrop/drops';

export interface TextDrop extends Drop {
  /**
   * The drop's content consisting of a stringified EditorContent.
   */
  content: string;

  /**
   * A unique identifier set each time the content is changed.
   * Used to keep track of revisions made to the content.
   */
  contentRevision: string;
}

export type TextDropUpdateData = Pick<TextDrop, 'content' | 'contentRevision'>;

export interface CreateTextDropData {
  type: 'text';
  content: string;
  contentRevision: string;
}
