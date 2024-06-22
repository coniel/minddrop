import { describe, afterEach, it, expect, vi, beforeAll } from 'vitest';
import { setDocumentContentIconColor } from './setDocumentContentIconColor';
import { DOCUMENTS_TEST_DATA, Documents } from '@minddrop/documents';
import { UserIconType } from '@minddrop/icons';
import { cleanup } from '../../test-utils';

const { document1 } = DOCUMENTS_TEST_DATA;

describe('setDocumentContentIconColor', () => {
  beforeAll(() => {
    vi.spyOn(Documents, 'setIcon').mockResolvedValue();
  });

  afterEach(cleanup);

  it('sets the icon color if the document has a content-icon', async () => {
    // Set the icon color on a document with a content-icon
    // as its icon.
    await setDocumentContentIconColor(document1, 'cyan');

    // Should set the new icon color
    expect(Documents.setIcon).toHaveBeenCalledWith(document1.path, {
      ...document1.icon,
      color: 'cyan',
    });
  });

  it('does nothing if the document does not have a content-icon', async () => {
    // Set the icon color on a document with a default icon
    // as its icon.
    await setDocumentContentIconColor(
      { ...document1, icon: { type: UserIconType.Default } },
      'cyan',
    );

    // Should do nothing
    expect(Documents.setIcon).not.toHaveBeenCalled();
  });
});
