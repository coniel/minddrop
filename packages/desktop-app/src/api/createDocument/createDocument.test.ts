import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { initializeMockFileSystem, Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Documents } from '@minddrop/documents';
import { setup, cleanup } from '../../test-utils';
import { createDocument } from './createDocument';

const PARENT_DIR_PATH = 'path/to/Parent';
const UNTITLED = i18n.t('documents.untitled');

const MockFs = initializeMockFileSystem([
  // New document's parent dir
  PARENT_DIR_PATH,
]);

describe('createDocument', () => {
  beforeEach(() => {
    setup();

    // Pretend parent dir exists
    vi.spyOn(Fs, 'exists').mockImplementation(
      async (path) => path === PARENT_DIR_PATH,
    );

    // Create test parent documents
    Documents.create(PARENT_DIR_PATH, 'Document');
    Documents.create(PARENT_DIR_PATH, 'Wrapped', { wrap: true });
  });

  afterEach(() => {
    cleanup();

    // Reset mock file system
    MockFs.reset();
  });

  it('creates a new "Untitled" document', async () => {
    // Create a document
    const document = await createDocument(PARENT_DIR_PATH);

    // Document should be titled 'Untitled'
    expect(document.title).toEqual(UNTITLED);
  });

  it('increments file name and title if it conflicts', async () => {
    // Pretend file 'Untitled.minddrop' already exists
    MockFs.addFiles([Fs.concatPath(PARENT_DIR_PATH, `${UNTITLED}.minddrop`)]);

    // Create a document
    const document = await createDocument(PARENT_DIR_PATH);

    // Document should be titled 'Untitled 1'
    expect(document.title).toEqual(`${UNTITLED} 1`);
    // Document file name should be `Untitled 1.minddrop`
    expect(document.path).toEqual(`${PARENT_DIR_PATH}/${UNTITLED} 1.minddrop`);
  });
});
