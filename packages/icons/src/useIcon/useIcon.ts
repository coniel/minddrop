import { ContentColor } from '@minddrop/core';
import { UserIcon, UserIconType } from '../icons.types';
import { EmojiSkinTone } from '../emoji';
import { parseIcon } from '../parseIcon';
import { getContentIconColor } from '../getContentIconColor';
import { getEmojiIconSkinTone } from '../getEmojiIconSkinTone';
import { useMemo } from 'react';

interface IconData {
  // The parsed icon
  icon: UserIcon;

  // The icon color if it is a content icon
  color?: ContentColor;

  // The emoji skin tone if it is an emoji icon
  skinTone?: EmojiSkinTone;
}

/**
 * Parses an icon string and returns its the icon, as well as its
 * color and skin tone (or undefined if not applicable).
 *
 * @param iconString - The string representation of the icon.
 * @param defaultIcon - The default icon to use if the icon string is invalid.
 * @returns The icon data.
 */
export function useIcon(iconString: string, defaultIcon?: UserIcon): IconData {
  const icon: UserIcon = useMemo(
    () =>
      parseIcon(iconString) ||
      defaultIcon || {
        type: UserIconType.ContentIcon,
        icon: 'file',
        color: 'default',
      },
    [iconString, defaultIcon],
  );
  const color = useMemo(() => getContentIconColor(icon), [icon]);
  const skinTone = useMemo(() => getEmojiIconSkinTone(icon), [icon]);

  return { icon, color, skinTone };
}
