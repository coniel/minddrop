import { EmojiSkinTone, MinifiedEmojiData } from './Emoji.types';
import emojiJsonData from './emoji.min.json';
import {
  getAllLabels,
  getSkinToneVariant,
  groupByGroup,
  searchEmoji,
  unminifyEmoji,
} from './utils';

const emojiData = emojiJsonData as unknown as MinifiedEmojiData;

const unminifiedEmoji = emojiData.emoji.map((minifiedEmoji) =>
  unminifyEmoji(minifiedEmoji, emojiData.groups, emojiData.subgroups),
);

const allLabels = getAllLabels(unminifiedEmoji);

const skinTones: { value: EmojiSkinTone; label: string }[] = [
  { value: 0, label: 'none' },
  { value: 1, label: 'light' },
  { value: 2, label: 'mediumLight' },
  { value: 3, label: 'medium' },
  { value: 4, label: 'mediumDark' },
  { value: 5, label: 'dark' },
];

export const Emoji = {
  all: unminifiedEmoji,
  skinTones,
  search: (query: string) => searchEmoji(unminifiedEmoji, allLabels, query),
  getSkinToneVariant,
  group: groupByGroup,
};
