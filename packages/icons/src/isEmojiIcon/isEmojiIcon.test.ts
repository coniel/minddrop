import { describe, expect, it } from 'vitest';
import { contentIcon, emojiIcon } from '../test-utils';
import { isEmojiIcon } from './isEmojiIcon';

describe('isEmojiIcon', () => {
  it('retuns true if icon is an emoji icon', () => {
    expect(isEmojiIcon(emojiIcon)).toBeTruthy();
  });

  it('retuns false if icon is not an emoji icon', () => {
    expect(isEmojiIcon(contentIcon)).toBeFalsy();
  });
});
