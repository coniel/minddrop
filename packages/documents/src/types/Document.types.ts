import {
  DocumentProperties,
  DocumentPropertiesMap,
} from './DocumentMetadata.types';

export interface Document<
  TContent = unknown,
  TProperties extends DocumentPropertiesMap = {},
> {
  /**
   * Absolute path to the document markdown file.
   */
  path: string;

  /**
   * The document file type.
   */
  fileType: string;

  /**
   * The document title, also serves as the file/directory name.
   */
  title: string;

  /**
   * Document properties, including the document icon and any
   * custom properties defined by the document type.
   */
  properties: DocumentProperties<TProperties>;

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
   * Null if the document has not been opened.
   */
  content: TContent | null;
}
