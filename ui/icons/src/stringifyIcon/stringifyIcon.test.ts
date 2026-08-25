import { describe, expect, it } from 'vitest';
import {
  contentIcon,
  contentIconString,
  emojiIcon,
  emojiIconString,
  setContentIcon,
  setContentIconString,
} from '../test-utils';
import { stringifyIcon } from './stringifyIcon';

describe('stringifyIcon', () => {
  it('stringifies an emoji icon', () => {
    expect(stringifyIcon(emojiIcon)).toBe(emojiIconString);
  });

  it('stringifies a content icon', () => {
    expect(stringifyIcon(contentIcon)).toBe(contentIconString);
  });

  it('stringifies a content icon from another set', () => {
    expect(stringifyIcon(setContentIcon)).toBe(setContentIconString);
  });
});
