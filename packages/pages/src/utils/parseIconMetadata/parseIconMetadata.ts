import { ContentColor } from '@minddrop/core';
import {
  ContentIconName,
  EmojiSkinTone,
  UserIcon,
  UserIconType,
} from '@minddrop/icons';
import { DefaultPageIcon } from '../../constants';

/**
 * Parses page icon from frontmatter metadata.
 *
 * @param iconMetadata - The icon metadata from the page frontmatter.
 * @returns A UserIcon.
 */
export function parseIconMetadata(iconMetadata?: string): UserIcon {
  if (!iconMetadata) {
    return DefaultPageIcon;
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

  return DefaultPageIcon;
}
