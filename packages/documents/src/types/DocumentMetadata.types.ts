export type DocumentPropertyPrimitive = string | number | boolean | null;

export type DocumentProperty =
  | DocumentPropertyPrimitive
  | DocumentPropertyPrimitive[];

export type DocumentPropertiesMap = Record<string, DocumentProperty>;

export interface BaseDocumentProperties extends DocumentPropertiesMap {
  /**
   * The document icon.
   */
  icon: string;
}

export type DocumentProperties<TProperties extends DocumentPropertiesMap = {}> =
  BaseDocumentProperties & TProperties;

export interface SerializedDocumentMetadata {
  /**
   * The document icon, serialized into a string of the
   * format: 'type:icon/emojiChar:color/skinTone'.
   */
  icon?: string;
}
