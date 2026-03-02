import { describe, expect, it } from 'vitest';
import {
  contentIcon,
  contentIconString,
  emojiIcon,
  emojiIconString,
} from '../test-utils';
import { stringifyIcon } from './stringifyIcon';

describe('stringifyIcon', () => {
  it('stringifies an emoji icon', () => {
    expect(stringifyIcon(emojiIcon)).toBe(emojiIconString);
  });

  it('stringifies a content icon', () => {
    expect(stringifyIcon(contentIcon)).toBe(contentIconString);
  });
});
