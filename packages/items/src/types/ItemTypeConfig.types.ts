import { PropertyMap } from '@minddrop/properties';

interface BaseItemTypeConfig {
  /**
   * The base data type of the item.
   */
  dataType:
    | 'data'
    | 'text'
    | 'markdown'
    | 'url'
    | 'image'
    | 'video'
    | 'audio'
    | 'pdf'
    | 'file';

  /**
   * A unique identifier for this item type.
   */
  type: string;

  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * Short description displayed in the UI.
   */
  description: string;
}

export interface DataItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'data';
}

export interface TextItemTypeConfig extends BaseItemTypeConfig {
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

export interface MarkdownItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'markdown';
}

export interface UrlItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'url';

  /**
   * A function that matches URLs to this item type.
   * Returns an object containing properties to set on the item
   * if the URL matches, or null if it doesn't.
   */
  match?(url: string): PropertyMap | null;
}

export interface ImageItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'image';
}

export interface VideoItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'video';
}

export interface AudioItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'audio';
}

export interface PdfItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'pdf';
}

export interface FileItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'file';

  /**
   * The file extensions supported by this item type.
   *
   * If omitted, the item type will accept all file extensions.
   */
  fileExtensions?: string[];
}

export type ItemTypeConfig =
  | DataItemTypeConfig
  | TextItemTypeConfig
  | MarkdownItemTypeConfig
  | UrlItemTypeConfig
  | ImageItemTypeConfig
  | VideoItemTypeConfig
  | AudioItemTypeConfig
  | PdfItemTypeConfig
  | FileItemTypeConfig;
