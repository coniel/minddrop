import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { getDocument } from '../getDocument';
import { setup, cleanup, document1 } from '../test-utils';
import { DocumentsStore } from '../DocumentsStore';
import { setDocumentIcon } from './setDocumentIcon';
import { initializeMockFileSystem } from '@minddrop/file-system';

const icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'dog',
  color: 'green',
};

const iconString = Icons.stringify(icon);

const MockFs = initializeMockFileSystem([
  // Document file
  document1.path,
]);

describe('setWorkpaceIcon', () => {
  beforeEach(() => {
    setup();

    // Load a test document into the store
    DocumentsStore.getState().add(document1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('updates the document icon', async () => {
    // Set the icon on a document
    await setDocumentIcon(document1.path, icon);

    // Should update the document
    expect(getDocument(document1.path)?.properties.icon).toEqual(iconString);
  });
});
