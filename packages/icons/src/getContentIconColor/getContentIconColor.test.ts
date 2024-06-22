import { describe, it, expect } from 'vitest';
import { getContentIconColor } from './getContentIconColor';
import { stringifyIcon } from '../stringifyIcon';
import { contentIcon, emojiIcon } from '../test-utils';

describe('getContentIconColor', () => {
  it('returns the color if the icon is a content icon', () => {
    expect(getContentIconColor(contentIcon)).toBe(contentIcon.color);
  });

  it('returns the color if the icon is a content icon string', () => {
    expect(getContentIconColor(stringifyIcon(contentIcon))).toBe(
      contentIcon.color,
    );
  });

  it('returns undefined if the icon is an emoji icon', () => {
    expect(getContentIconColor(emojiIcon)).toBeUndefined();
  });

  it('returns undefined if the icon is an emoji icon string', () => {
    expect(getContentIconColor(stringifyIcon(emojiIcon))).toBeUndefined();
  });
});
