import { describe, it, expect } from 'vitest';
import {
  UserIconContentIcon,
  UserIconEmoji,
  UserIconType,
} from '@minddrop/icons';
import { DefaultPageIcon } from '../../constants';
import { serializePageMetadata } from './serializePageMetadata';

const CONTENT_ICON: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

const EMOJI_ICON: UserIconEmoji = {
  type: UserIconType.Emoji,
  icon: '🐈',
  skinTone: 0,
};

const frontMatter = (metadata: string) => `---\n${metadata}\n---\n\n`;

describe('serializePageMetadata', () => {
  it('serializes content-icon', () => {
    // Serialize page metadata contaning a content-icon icon
    expect(serializePageMetadata({ icon: CONTENT_ICON })).toBe(
      frontMatter('icon: content-icon:cat:cyan'),
    );
  });

  it('serializes emoji icon', () => {
    // Serialize page metadata contaning a emoji icon
    expect(serializePageMetadata({ icon: EMOJI_ICON })).toBe(
      frontMatter('icon: emoji:🐈:0'),
    );
  });

  it('does not add default icon to metadata', () => {
    // Serialize page metadata containing a default page icon.
    // Icon should not be added to metadata.
    expect(serializePageMetadata({ icon: DefaultPageIcon })).toBe('');
  });
});
