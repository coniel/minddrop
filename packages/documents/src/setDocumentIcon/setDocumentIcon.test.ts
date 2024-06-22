import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { getDocument } from '../getDocument';
import { setup, cleanup, document1 } from '../test-utils';
import { DocumentsStore } from '../DocumentsStore';
import { setDocumentIcon } from './setDocumentIcon';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { deserializeDocumentMetadata } from '../utils';

const icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'blue',
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

  it('updates the document in the store', async () => {
    // Set the icon on a document
    await setDocumentIcon(document1.path, icon);

    // Should update the document in the store
    expect(getDocument(document1.path)?.icon).toEqual(iconString);
  });

  it('writes the changes to the document config file', async () => {
    // Set the icon on a document
    await setDocumentIcon(document1.path, icon);

    // Get document metadata from file
    const metadata = deserializeDocumentMetadata(
      MockFs.readTextFile(document1.path),
    );

    // Metadata should contain the new icon
    expect(metadata.icon).toEqual(iconString);
  });
});
