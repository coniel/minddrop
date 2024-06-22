import { UserIcon } from '@minddrop/icons';
import { BlockElement } from '@minddrop/ast';

export interface Document {
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
  icon: UserIcon;

  /**
   * Whether or not the document is wrapped in a directory of the
   * same name.
   */
  wrapped: boolean;

  /**
   * The raw document content as read from the file.
   */
  contentRaw: string;

  /**
   * The parsed document content.
   */
  contentParsed: BlockElement[] | null;
}
