import { describe, expect, it } from 'vitest';
import { stringifyIcon } from '../stringifyIcon';
import { contentIcon, emojiIcon } from '../test-utils';
import { getContentIconColor } from './getContentIconColor';

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
