import { PropertyMap } from '@minddrop/properties';

interface BaseItemTypeConfigCommon {
  /**
   * The base data type of the item.
   */
  dataType:
    | 'markdown'
    | 'url'
    | 'text'
    | 'image'
    | 'video'
    | 'audio'
    | 'pdf'
    | 'file';

  /**
   * A unique identifier for this item type.
   */
  id: string;

  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * Short description displayed in the UI.
   */
  description: string;
}

export interface MarkdownBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'markdown';
}

export interface UrlBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'url';

  /**
   * A function that matches URLs to this item type.
   * Returns an object containing properties to set on the item
   * if the URL matches, or null if it doesn't.
   */
  match?(url: string): PropertyMap | null;
}

export interface TextBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'text';

  /**
   * A function that matches text data to this item type.
   * Returns an object containing properties to set on the item
   * if the data matches, or null if it doesn't.
   *
   * Can also accept File objects for text files.
   *
   * @param data - The text data or File object to match.
   * @return An object containing properties to set on the item, or null if no match.
   */
  match?(data: string | File): PropertyMap | null;
}

export interface ImageBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'image';
}

export interface VideoBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'video';
}

export interface AudioBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'audio';
}

export interface PdfBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'pdf';
}

export interface FileBaseItemTypeConfig extends BaseItemTypeConfigCommon {
  dataType: 'file';

  /**
   * The file extensions supported by this item type.
   *
   * If omitted, the item type will accept all file extensions.
   */
  fileExtensions?: string[];
}

export type BaseItemTypeConfig =
  | MarkdownBaseItemTypeConfig
  | TextBaseItemTypeConfig
  | UrlBaseItemTypeConfig
  | ImageBaseItemTypeConfig
  | VideoBaseItemTypeConfig
  | AudioBaseItemTypeConfig
  | PdfBaseItemTypeConfig
  | FileBaseItemTypeConfig;
