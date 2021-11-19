import { FileReference } from './FileReference.types';
import { ContentColor } from './Color.types';

export interface Drop {
  /**
   * A universally unique ID.
   */
  id: string;

  /**
   * The format in which the drop data is stored.
   */
  format: 'markdown' | 'json';

  /**
   * The drop type. Determines which component will be used to render it.
   */
  type: string;

  /**
   * The IDs of the topics containing this drop.
   */
  topics: string[];

  /**
   * Timestamp at which the drop was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the drop was last updated. Equal to the `createdAt`
   * value if the drop has not been updated.
   */
  updatedAt: Date;

  /**
   * IDs of the tags applied to the drop.
   */
  tags?: string[];

  /**
   * The drop's files. All files attached to the drop must be listed here.
   */
  files?: FileReference[];

  /**
   * The drop's highlight color.
   */
  color?: ContentColor;

  /**
   * `true` if the drop is archived.
   */
  archived?: boolean;

  /**
   * Timestamp at which the drop was archived.
   * Only set if `archived` is `true`.
   */
  archivedAt?: Date;

  /**
   * `true` if the drop is  in the trash.
   */
  trashed?: boolean;

  /**
   * Timestamp at which the drop was trashed.
   * Only set if `trashed` is `true`.
   */
  trashedAt?: boolean;
}

export interface MarkdownDrop extends Drop {
  /**
   * The format in which the drop is stored.
   */
  format: 'markdown';

  /**
   * The drop's markdown content.
   */
  content: string;
}

export interface JsonDrop extends Drop {
  /**
   * The format in which the drop is stored.
   */
  format: 'json';
}
