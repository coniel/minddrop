import { UserIcon } from '@minddrop/icons';

export interface DocumentMetadata {
  /**
   * The document icon.
   */
  icon: UserIcon;
}

export interface SerializedDocumentMetadata {
  /**
   * The document icon, serialized into a string of the
   * format: 'type:icon/emojiChar:color/skinTone'.
   */
  icon?: string;
}
