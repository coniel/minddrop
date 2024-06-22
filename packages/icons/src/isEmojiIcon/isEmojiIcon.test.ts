import { describe, it, expect } from 'vitest';
import { isEmojiIcon } from './isEmojiIcon';
import { contentIcon, emojiIcon } from '../test-utils';

describe('isEmojiIcon', () => {
  it('retuns true if icon is an emoji icon', () => {
    expect(isEmojiIcon(emojiIcon)).toBeTruthy();
  });

  it('retuns false if icon is not an emoji icon', () => {
    expect(isEmojiIcon(contentIcon)).toBeFalsy();
  });
});
