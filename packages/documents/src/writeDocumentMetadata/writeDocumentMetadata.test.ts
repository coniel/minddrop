import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  initializeMockFileSystem,
  FileNotFoundError,
} from '@minddrop/file-system';
import { UserIcon, UserIconType } from '@minddrop/icons';
import { cleanup, document1, setup } from '../test-utils';
import { DocumentsStore } from '../DocumentsStore';
import { writeDocumentMetadata } from './writeDocumentMetadata';
import { serializeDocumentMetadata } from '../utils';
import { DefaultDocumentIcon } from '../constants';
import { DocumentNotFoundError } from '../errors';

const DOCUMENT_PATH = document1.path;
const NEW_DOCUMENT_ICON: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'dog',
  color: 'red',
};
const SERIALIZED_METADATA = serializeDocumentMetadata({ icon: document1.icon });
const SERIALIZED_NEW_METADATA = serializeDocumentMetadata({ icon: NEW_DOCUMENT_ICON });
const DOCUMENT_CONTENT = '# Title\n\nContent';

const MockFs = initializeMockFileSystem([
  // Document file
  { path: DOCUMENT_PATH, textContent: `${SERIALIZED_METADATA}${DOCUMENT_CONTENT}` },
]);

describe('writeDocumentMetadata', () => {
  beforeEach(() => {
    setup();

    // Load a document into the store
    DocumentsStore.getState().add(document1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to write the metadata for a document that does not exist.
    // Should throw a InvalidParameterError.
    expect(() => writeDocumentMetadata('missing')).rejects.toThrowError(
      DocumentNotFoundError,
    );
  });

  it('throws if the document file does not exist', () => {
    // Pretend document file does not exist
    MockFs.clear();

    // Attempt to write the metadata for a document missing its file.
    // Should throw a FileNotFoundError.
    expect(() => writeDocumentMetadata(DOCUMENT_PATH)).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('writes the document metadata from the store state', async () => {
    // Update a document icon
    DocumentsStore.getState().update(DOCUMENT_PATH, {
      icon: NEW_DOCUMENT_ICON,
    });

    // Write the document metadata
    await writeDocumentMetadata(DOCUMENT_PATH);

    // Should write metadata to file
    expect(MockFs.readTextFile(DOCUMENT_PATH)).toBe(
      `${SERIALIZED_NEW_METADATA}${DOCUMENT_CONTENT}`,
    );
  });

  it('supports files with no metadata', async () => {
    // Pretend document file has no metadata
    MockFs.writeTextFile(DOCUMENT_PATH, DOCUMENT_CONTENT);

    // Update a document icon
    DocumentsStore.getState().update(DOCUMENT_PATH, {
      icon: NEW_DOCUMENT_ICON,
    });

    // Write the document metadata
    await writeDocumentMetadata(DOCUMENT_PATH);

    // Should write metadata to file
    expect(MockFs.readTextFile(DOCUMENT_PATH)).toBe(
      `${SERIALIZED_NEW_METADATA}${DOCUMENT_CONTENT}`,
    );
  });

  it('supports clearing metadata', async () => {
    // Update a document icon to the default one.
    // No metadata will be written as a result.
    DocumentsStore.getState().update(DOCUMENT_PATH, {
      icon: DefaultDocumentIcon,
    });

    // Write the document metadata
    await writeDocumentMetadata(DOCUMENT_PATH);

    // Should write file containing on text content
    expect(MockFs.readTextFile(DOCUMENT_PATH)).toBe(DOCUMENT_CONTENT);
  });
});
