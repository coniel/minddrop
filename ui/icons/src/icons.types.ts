import { IconName } from 'lucide-react/dynamic';
import { HTMLProps } from 'react';
import { ContentColor } from '@minddrop/theme';
import { ContentIcons } from './content-icons.min';
import { EmojiSkinTone } from './emoji';

export type UiIconName = IconName;
export type ContentIconName = keyof typeof ContentIcons;
export type ContentIconSet = Record<
  ContentIconName,
  React.ComponentType<HTMLProps<SVGSVGElement>>
>;

export enum UserIconType {
  Default = 'default',
  Emoji = 'emoji',
  ContentIcon = 'content-icon',
}

export type UserIconDefault = { type: UserIconType.Default };

export type UserIconEmoji = {
  type: UserIconType.Emoji;
  icon: string;
  skinTone: EmojiSkinTone;
};

export type UserIconContentIcon = {
  type: UserIconType.ContentIcon;
  icon: ContentIconName;
  color: ContentColor;
};

export type UserIcon = UserIconEmoji | UserIconContentIcon;
