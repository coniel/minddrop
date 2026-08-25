import { ContentColor } from '@minddrop/ui-theme';
import { ContentIconName } from './ContentIcon.types';
import { EmojiSkinTone } from './Emoji.types';

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
  set: string;
  icon: ContentIconName;
  color: ContentColor;
};

export type UserIcon = UserIconEmoji | UserIconContentIcon;
