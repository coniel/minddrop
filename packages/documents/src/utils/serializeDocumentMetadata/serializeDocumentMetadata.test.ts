import { describe, it, expect } from 'vitest';
import { Icons, UserIconType } from '@minddrop/icons';
import { DefaultDocumentIconString } from '../../constants';
import { serializeDocumentMetadata } from './serializeDocumentMetadata';

const USER_ICON = Icons.stringify({
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
});

const frontMatter = (metadata: string) => `---\n${metadata}\n---\n\n`;

describe('serializeDocumentMetadata', () => {
  it('serializes user selected icon', () => {
    // Serialize document metadata contaning a content-icon icon
    expect(serializeDocumentMetadata({ icon: USER_ICON })).toBe(
      frontMatter(`icon: ${USER_ICON}`),
    );
  });

  it('does not add default icon to metadata', () => {
    // Serialize document metadata containing a default document icon.
    // Icon should not be added to metadata.
    expect(serializeDocumentMetadata({ icon: DefaultDocumentIconString })).toBe(
      '',
    );
  });
});
