import { UserIcon } from '@minddrop/icons';

export interface PageMetadata {
  /**
   * The page icon.
   */
  icon: UserIcon;
}

export interface SerializedPageMetadata {
  /**
   * The page icon, serialized into a string of the
   * format: 'type:icon/emojiChar:color/skinTone'.
   */
  icon?: string;
}
