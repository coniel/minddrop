import { describe, it, expect } from 'vitest';
import { stringifyIcon } from './stringifyIcon';
import {
  contentIcon,
  contentIconString,
  emojiIcon,
  emojiIconString,
} from '../test-utils';

describe('stringifyIcon', () => {
  it('stringifies an emoji icon', () => {
    expect(stringifyIcon(emojiIcon)).toBe(emojiIconString);
  });

  it('stringifies a content icon', () => {
    expect(stringifyIcon(contentIcon)).toBe(contentIconString);
  });
});
