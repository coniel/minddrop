import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { DOCUMENTS_TEST_DATA, Documents } from '@minddrop/documents';
import { Icons, UserIconType } from '@minddrop/icons';
import { cleanup } from '../../test-utils';
import { setDocumentContentIconColor } from './setDocumentContentIconColor';

const { document1, document1Icon } = DOCUMENTS_TEST_DATA;

describe('setDocumentContentIconColor', () => {
  beforeAll(() => {
    vi.spyOn(Documents, 'setIcon').mockResolvedValue(document1);
  });

  afterEach(cleanup);

  it('sets the icon color if the document has a content-icon', async () => {
    // Set the icon color on a document with a content-icon
    // as its icon.
    await setDocumentContentIconColor(document1, 'cyan');

    // Should set the new icon color
    expect(Documents.setIcon).toHaveBeenCalledWith(document1.id, {
      type: document1Icon.type,
      icon: document1Icon.icon,
      color: 'cyan',
    });
  });

  it('does nothing if the document does not have a content-icon', async () => {
    // Set the icon color on a document with a default icon
    // as its icon.
    await setDocumentContentIconColor(
      {
        ...document1,
        icon: Icons.stringify({
          type: UserIconType.Emoji,
          icon: '',
          skinTone: 0,
        }),
      },
      'cyan',
    );

    // Should do nothing
    expect(Documents.setIcon).not.toHaveBeenCalled();
  });
});
