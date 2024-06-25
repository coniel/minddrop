import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, document1 } from '../test-utils';
import { setDocumentProperties } from './setDocumentProperties';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';

const MockFs = initializeMockFileSystem([
  // Add test document to the mock file system
  { path: document1.path, textContent: document1.fileTextContent },
]);

const properties = {
  icon: 'content-icon:dog:green',
};

describe('setDocumentProperties', () => {
  beforeEach(() => {
    setup();

    // Add test document to the store
    DocumentsStore.getState().load([document1]);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('merges updated properties into existing ones', async () => {
    const document = await setDocumentProperties(document1.path, properties);

    expect(document.properties).toEqual({
      ...document1.properties,
      ...properties,
    });
  });
});
