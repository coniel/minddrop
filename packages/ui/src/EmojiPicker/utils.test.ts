import { describe, it, expect } from 'vitest';
import {
  getAllLabels,
  getSkinToneVariant,
  groupByGroup,
  searchEmoji,
  unminifyEmoji,
} from './utils';
import { Emoji, MinifiedEmoji, SkinTone } from './EmojiPicker.types';

const groups = ['group 0', 'group 1', 'group 2'];
const subgroups = ['subgroup 0', 'subgroup 1', 'subgroup 2', 'subgroup 3'];
const minifiedEmoji: MinifiedEmoji = ['😾', 'pouting cat', [0, 2]];
const minifiedEmojiSkinTone: MinifiedEmoji = [
  '🖖',
  'vulcan salute',
  [1, 2],
  ['🖖🏻', '🖖🏼', '🖖🏽', '🖖🏾', '🖖🏿'],
];

const emoji: Emoji = {
  char: minifiedEmoji[0],
  name: minifiedEmoji[1],
  group: groups[minifiedEmoji[2][0]],
  labels: [
    minifiedEmoji[1],
    groups[minifiedEmoji[2][0]],
    subgroups[minifiedEmoji[2][1]],
  ],
};

const emojiSkinTone: Emoji = {
  char: minifiedEmojiSkinTone[0],
  name: minifiedEmojiSkinTone[1],
  group: groups[minifiedEmojiSkinTone[2][0]],
  labels: [
    minifiedEmojiSkinTone[1],
    groups[minifiedEmojiSkinTone[2][0]],
    subgroups[minifiedEmojiSkinTone[2][1]],
  ],
  skinToneVariants: minifiedEmojiSkinTone[3],
};

const allLabels = [
  ...emoji.labels,
  minifiedEmojiSkinTone[1],
  groups[minifiedEmojiSkinTone[2][0]],
];

describe('<EmojiPicker /> utils', () => {
  describe('unminifyEmoji', () => {
    it('unminifies a minified emoji', () => {
      expect(unminifyEmoji(minifiedEmoji, groups, subgroups)).toEqual(emoji);
      expect(unminifyEmoji(minifiedEmojiSkinTone, groups, subgroups)).toEqual(
        emojiSkinTone,
      );
    });
  });

  describe('groupByGroup', () => {
    it('groups the emoji by group', () => {
      expect(groupByGroup([emoji, emojiSkinTone])).toEqual([
        ['group 0', [emoji]],
        ['group 1', [emojiSkinTone]],
      ]);
    });
  });

  describe('getSkinToneVariant', () => {
    it('returns the specified skin tone variant emoji char', () => {
      expect(getSkinToneVariant(emojiSkinTone, 3)).toBe(
        (emojiSkinTone.skinToneVariants as string[])[2],
      );
    });

    it('returns emoji char if skin tone map does not contain requested tone', () => {
      expect(
        getSkinToneVariant({ ...emojiSkinTone, char: 'A' }, 6 as SkinTone),
      ).toBe('A');
    });

    it('returns emoji char if it does not support skin tones', () => {
      expect(getSkinToneVariant(emoji, 3)).toBe(emoji.char);
    });
  });

  describe('getAllLabels', () => {
    it('merges all labels into a single array without duplicates', () => {
      expect(getAllLabels([emoji, emojiSkinTone])).toEqual(allLabels);
    });
  });

  describe('searchContentIcons', () => {
    it('performs a search', () => {
      expect(
        searchEmoji([emoji, emojiSkinTone], allLabels, minifiedEmoji[1]),
      ).toEqual([emoji]);
    });

    it('dedupes results', () => {
      expect(searchEmoji([emoji, emojiSkinTone], allLabels, 'group')).toEqual([
        emoji,
        emojiSkinTone,
      ]);
    });
  });
});
