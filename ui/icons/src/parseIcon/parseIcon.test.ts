import { describe, expect, it } from 'vitest';
import {
  contentIcon,
  contentIconString,
  emojiIcon,
  emojiIconString,
  setContentIcon,
  setContentIconString,
} from '../test-utils';
import { UserIconContentIcon, UserIconEmoji } from '../types';
import { parseIcon } from './parseIcon';

describe('parseIcon', () => {
  it('parses content icons', () => {
    expect(parseIcon(contentIconString)).toEqual<UserIconContentIcon>(
      contentIcon,
    );
  });

  it('parses content icons with an explicit set', () => {
    expect(parseIcon(setContentIconString)).toEqual<UserIconContentIcon>(
      setContentIcon,
    );
  });

  it('parses emoji icons', () => {
    expect(parseIcon(emojiIconString)).toEqual<UserIconEmoji>(emojiIcon);
  });

  it('returns null for missing icon set', () => {
    expect(parseIcon('my-icons:burger:green')).toBeNull();
  });

  it('returns null for undefined values', () => {
    expect(parseIcon()).toBeNull();
  });

  it('returns null for invalid values', () => {
    expect(parseIcon('foo')).toBeNull();
  });
});
