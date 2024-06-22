import { describe, it, expect } from 'vitest';
import { isContentIcon } from './isContentIcon';
import { contentIcon, emojiIcon } from '../test-utils';

describe('isContentIcon', () => {
  it('retuns true if icon is a content icon', () => {
    expect(isContentIcon(contentIcon)).toBeTruthy();
  });

  it('retuns false if icon is not a content icon', () => {
    expect(isContentIcon(emojiIcon)).toBeFalsy();
  });
});
