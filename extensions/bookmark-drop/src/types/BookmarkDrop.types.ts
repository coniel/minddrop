import { Drop } from '@minddrop/drops';

export interface BookmarkDropData {
  /**
   * The URL of the bookmark.
   */
  url: string;

  /**
   * Whether the metadata has been fetched.
   */
  hasPreview: boolean;

  /**
   * The webpage title.
   */
  title?: string;

  /**
   * The webpage description.
   */
  description?: string;

  /**
   * The ID of the downloaded webpage image file.
   */
  image?: string;
}

export type BookmarkDrop = Drop<BookmarkDropData>;

export interface CreateBookmarkDropData {
  /**
   * The drop type.
   */
  type: 'bookmark';

  /**
   * The URL of the bookmark.
   */
  url?: string;

  /**
   * Whether the metadata has been fetched.
   */
  hasPreview?: boolean;

  /**
   * The webpage title.
   */
  title?: string;

  /**
   * The webpage description.
   */
  description?: string;

  /**
   * The ID of the downloaded webpage image file.
   */
  image?: string;
}

export interface UpdateBookmarkDropData {
  /**
   * The URL of the bookmark.
   */
  url?: string;

  /**
   * Whether the metadata has been fetched.
   */
  hasPreview?: boolean;

  /**
   * The webpage title.
   */
  title?: string;

  /**
   * The webpage description.
   */
  description?: string;

  /**
   * The ID of the downloaded webpage image file.
   */
  image?: string;
}
