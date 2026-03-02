import {
  UserIconContentIcon,
  UserIconEmoji,
  UserIconType,
} from '../icons.types';

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
  icon: 'cat',
  color: 'cyan',
};

export const emojiIconString = 'emoji:👍🏽:4';
export const emojiIcon0SkinToneString = 'emoji:🐈:0';
export const contentIconString = 'content-icon:cat:cyan';
