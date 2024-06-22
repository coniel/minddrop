import { UserIcon } from '@minddrop/icons';

export interface Document<TContent = unknown> {
  /**
   * Absolute path to the document markdown file.
   */
  path: string;

  /**
   * The document title, also serves as the file/directory name.
   */
  title: string;

  /**
   * The document icon.
   */
  icon: string;

  /**
   * Whether or not the document is wrapped in a directory of the
   * same name.
   */
  wrapped: boolean;

  /**
   * The raw text content as read from the file.
   */
  fileTextContent: string;

  /**
   * The parsed document content.
   */
  content: TContent;
}
