import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../../test-utils';
import { parseIconMetadata } from './parseIconMetadata';
import {
  UserIconContentIcon,
  UserIconDefault,
  UserIconEmoji,
  UserIconType,
} from '@minddrop/icons';

describe('parseIconMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('parses content icons', () => {
    expect(
      parseIconMetadata('content-icon:cat:cyan'),
    ).toEqual<UserIconContentIcon>({
      type: UserIconType.ContentIcon,
      icon: 'cat',
      color: 'cyan',
    });
  });

  it('parses emoji icons', () => {
    expect(parseIconMetadata('emoji:🐈:0')).toEqual<UserIconEmoji>({
      type: UserIconType.Emoji,
      icon: '🐈',
      skinTone: 0,
    });
  });

  it('returns default icon for invalid values', () => {
    expect(parseIconMetadata('foo')).toEqual<UserIconDefault>({
      type: UserIconType.Default,
    });
  });
});
