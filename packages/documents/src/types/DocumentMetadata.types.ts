export type DocumentPropertyPrimitive = string | number | boolean | null;

export type DocumentProperty =
  | DocumentPropertyPrimitive
  | DocumentPropertyPrimitive[];

export interface DocumentProperties extends Record<string, DocumentProperty> {
  /**
   * The document icon.
   */
  icon: string;
}

export interface SerializedDocumentMetadata {
  /**
   * The document icon, serialized into a string of the
   * format: 'type:icon/emojiChar:color/skinTone'.
   */
  icon?: string;
}
