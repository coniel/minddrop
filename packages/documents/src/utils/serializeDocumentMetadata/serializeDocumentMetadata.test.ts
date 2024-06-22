import { describe, it, expect } from 'vitest';
import {
  UserIconContentIcon,
  UserIconEmoji,
  UserIconType,
} from '@minddrop/icons';
import { DefaultDocumentIcon } from '../../constants';
import { serializeDocumentMetadata } from './serializeDocumentMetadata';

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

describe('serializeDocumentMetadata', () => {
  it('serializes content-icon', () => {
    // Serialize document metadata contaning a content-icon icon
    expect(serializeDocumentMetadata({ icon: CONTENT_ICON })).toBe(
      frontMatter('icon: content-icon:cat:cyan'),
    );
  });

  it('serializes emoji icon', () => {
    // Serialize document metadata contaning a emoji icon
    expect(serializeDocumentMetadata({ icon: EMOJI_ICON })).toBe(
      frontMatter('icon: emoji:🐈:0'),
    );
  });

  it('does not add default icon to metadata', () => {
    // Serialize document metadata containing a default document icon.
    // Icon should not be added to metadata.
    expect(serializeDocumentMetadata({ icon: DefaultDocumentIcon })).toBe('');
  });
});
