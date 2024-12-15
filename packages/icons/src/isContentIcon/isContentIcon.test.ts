import { describe, expect, it } from 'vitest';
import { contentIcon, emojiIcon } from '../test-utils';
import { isContentIcon } from './isContentIcon';

describe('isContentIcon', () => {
  it('retuns true if icon is a content icon', () => {
    expect(isContentIcon(contentIcon)).toBeTruthy();
  });

  it('retuns false if icon is not a content icon', () => {
    expect(isContentIcon(emojiIcon)).toBeFalsy();
  });
});
