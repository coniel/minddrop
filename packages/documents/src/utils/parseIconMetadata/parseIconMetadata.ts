import { ContentColor } from '@minddrop/core';
import {
  ContentIconName,
  EmojiSkinTone,
  UserIcon,
  UserIconType,
} from '@minddrop/icons';
import { DefaultDocumentIcon } from '../../constants';

/**
 * Parses document icon from frontmatter metadata.
 *
 * @param iconMetadata - The icon metadata from the document frontmatter.
 * @returns A UserIcon.
 */
export function parseIconMetadata(iconMetadata?: string): UserIcon {
  if (!iconMetadata) {
    return DefaultDocumentIcon;
  }

  // Icon metadata is in the format 'icon-type:icon:color'
  const [type, icon, color] = iconMetadata.split(':');

  if (type === UserIconType.ContentIcon) {
    return {
      type,
      icon: icon as ContentIconName,
      color: color as ContentColor,
    };
  }

  if (type === UserIconType.Emoji) {
    return { type, icon, skinTone: parseInt(color) as EmojiSkinTone };
  }

  return DefaultDocumentIcon;
}
