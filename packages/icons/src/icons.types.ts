import { UiIcons } from './ui-icons.min';
import { ContentIcons } from './content-icons.min';
import { HTMLProps } from 'react';
import { EmojiSkinTone } from './emoji';
import { ContentColor } from '@minddrop/core';

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
