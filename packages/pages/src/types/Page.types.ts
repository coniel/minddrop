import { UserIcon } from '@minddrop/icons';
import { RootContent } from '@minddrop/markdown';

export interface Page {
  /**
   * Absolute path to the page markdown file.
   */
  path: string;

  /**
   * The page title, also serves as the file/directory name.
   */
  title: string;

  /**
   * The page icon.
   */
  icon: UserIcon;

  /**
   * Whether or not the page is wrapped in a directory of the
   * same name.
   */
  wrapped: boolean;

  /**
   * The raw page content as read from the file.
   */
  contentRaw: string;

  /**
   * The parsed page content.
   */
  contentParsed: RootContent[] | null;
}
