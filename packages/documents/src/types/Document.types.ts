import { Block, DeserializedBlockData } from '@minddrop/blocks';
import { DocumentView } from './DocumentView.types';

export interface Document {
  /**
   * A unique identifier for the document.
   */
  id: string;

  /**
   * The absolute path to the document file.
   */
  path: string;

  /**
   * Date and time the document was created.
   */
  created: Date;

  /**
   * Date and time the document was last modified.
   */
  lastModified: Date;

  /**
   * The document title, also serves as the file/directory name.
   */
  title: string;

  /**
   * Whether or not the document is wrapped in a directory of the
   * same name.
   */
  wrapped: boolean;

  /**
   * The IDs of the views contained in the document.
   */
  views: string[];

  /**
   * IDs of the blocks contained in the document.
   */
  blocks: string[];

  /**
   * The document icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;
}

/**
 * Data for a document file.
 *
 * Certain fields are omitted because they are not stored in
 * the document file. Instead, they are derived at runtime.
 */
export interface SerializableDocumentData
  extends Omit<Document, 'path' | 'wrapped' | 'blocks' | 'views'> {
  /**
   * The document views.
   */
  views: DocumentView[];

  /**
   * The document blocks.
   */
  blocks: Block[];
}

/**
 * Data for a document file that has been parsed from JSON.
 *
 * Date and time properties are stored as strings in the JSON file.
 */
export interface DeserializedDocumentData
  extends Omit<
    SerializableDocumentData,
    'created' | 'lastModified' | 'blocks'
  > {
  created: string;
  lastModified: string;
  blocks: DeserializedBlockData[];
}
