import { BuiltInContentIconSetId } from '../constants';
import { UserIconContentIcon, UserIconEmoji, UserIconType } from '../types';

export const emojiIcon: UserIconEmoji = {
  type: UserIconType.Emoji,
  icon: '👍🏽',
  skinTone: 4,
};

export const emojiIcon0SkinTone: UserIconEmoji = {
  type: UserIconType.Emoji,
  icon: '🐈',
  skinTone: 0,
};

export const contentIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  set: BuiltInContentIconSetId,
  icon: 'cat',
  color: 'cyan',
};

export const setContentIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  set: 'my-icons',
  icon: 'cat',
  color: 'green',
};

export const emojiIconString = 'emoji:👍🏽:4';
export const emojiIcon0SkinToneString = 'emoji:🐈:0';
export const contentIconString = 'content-icon:cat:cyan';
export const setContentIconString = 'content-icon:my-icons:cat:green';
