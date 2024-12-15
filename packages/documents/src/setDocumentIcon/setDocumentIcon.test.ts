import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import { cleanup, document1, documentFiles, setup } from '../test-utils';
import { setDocumentIcon } from './setDocumentIcon';

const icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'dog',
  color: 'green',
};

const iconString = Icons.stringify(icon);

const MockFs = initializeMockFileSystem(documentFiles);

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
    await setDocumentIcon(document1.id, icon);

    // Should update the document
    expect(getDocument(document1.id)?.icon).toEqual(iconString);
  });
});
