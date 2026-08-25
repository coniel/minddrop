import { EmojiSkinTone } from '../types';
import { getSkinToneVariant, groupByGroup } from './utils';

export type EmojiSkinToneLabel =
  | 'none'
  | 'light'
  | 'mediumLight'
  | 'medium'
  | 'mediumDark'
  | 'dark';

const skinTones: { value: EmojiSkinTone; label: EmojiSkinToneLabel }[] = [
  { value: 0, label: 'none' },
  { value: 1, label: 'light' },
  { value: 2, label: 'mediumLight' },
  { value: 3, label: 'medium' },
  { value: 4, label: 'mediumDark' },
  { value: 5, label: 'dark' },
];

export const Emoji = {
  skinTones,
  getSkinToneVariant,
  group: groupByGroup,
};
