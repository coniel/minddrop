import { ItemProperties } from './Item.types';

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
}

export interface DataItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'data';
}

export interface TextItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'text';
}

export interface MarkdownItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'markdown';
}

export interface UrlItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'url';
}

export interface ImageItemTypeConfig extends BaseItemTypeConfig {
  dataType: 'image';

  /**
   * A function that matches URLs to this item type.
   * Returns an object containing properties to set on the item
   * if the URL matches, or null if it doesn't.
   */
  match(url: string): Partial<ItemProperties> | null;
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
