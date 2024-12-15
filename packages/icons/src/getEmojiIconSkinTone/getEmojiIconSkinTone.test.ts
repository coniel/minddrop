import { describe, expect, it } from 'vitest';
import { stringifyIcon } from '../stringifyIcon';
import { contentIcon, emojiIcon, emojiIcon0SkinTone } from '../test-utils';
import { getEmojiIconSkinTone } from './getEmojiIconSkinTone';

describe('getEmojiIconSkinTone', () => {
  it('returns the skin tone of an emoji icon', () => {
    expect(getEmojiIconSkinTone(emojiIcon)).toBe(emojiIcon.skinTone);
  });

  it('returns the skin tone of an emoji icon string', () => {
    expect(getEmojiIconSkinTone(stringifyIcon(emojiIcon))).toBe(
      emojiIcon.skinTone,
    );
  });

  it('returns the skin tone of an emoji icon with skin tone 0', () => {
    expect(getEmojiIconSkinTone(emojiIcon0SkinTone)).toBe(
      emojiIcon0SkinTone.skinTone,
    );
  });

  it('returns the skin tone of an emoji icon string with skin tone 0', () => {
    expect(getEmojiIconSkinTone(stringifyIcon(emojiIcon0SkinTone))).toBe(
      emojiIcon0SkinTone.skinTone,
    );
  });

  it('returns undefined if the icon is not an emoji icon', () => {
    expect(getEmojiIconSkinTone(contentIcon)).toBeUndefined();
  });

  it('returns undefined if the icon is not an emoji icon string', () => {
    expect(getEmojiIconSkinTone(stringifyIcon(contentIcon))).toBeUndefined();
  });
});
