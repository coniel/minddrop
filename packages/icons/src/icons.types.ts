import { HTMLProps } from 'react';
import { ContentColor } from '@minddrop/core';
import { ContentIcons } from './content-icons.min';
import { EmojiSkinTone } from './emoji';
import { UiIcons } from './ui-icons.min';

export type UiIconName = keyof typeof UiIcons;
export type ContentIconName = keyof typeof ContentIcons;

export type UiIconSet = Record<
  UiIconName,
  React.ComponentType<HTMLProps<SVGSVGElement>>
>;
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
