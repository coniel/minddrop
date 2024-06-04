import { BlockElement, BlockElementProps } from '../../types';

export interface BookmarkElementData {
  /**
   * The bookmark URL.
   */
  url: string;

  /**
   * The bookmark title.
   */
  title: string;

  /**
   * The bookmark description.
   */
  description?: string;
}

export type BookmarkElement = BlockElement<BookmarkElementData>;

export type BookmarkElementProps = BlockElementProps<BookmarkElement>;
