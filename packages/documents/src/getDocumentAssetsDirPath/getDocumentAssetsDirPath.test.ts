import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import {
  childDocument,
  cleanup,
  document1,
  documentFiles,
  documents,
  setup,
  workspaceDir,
  wrappedDocument,
} from '../test-utils';
import { getDocumentAssetsDirPath } from './getDocumentAssetsDirPath';

const MockFs = initializeMockFileSystem(documentFiles);

describe('getDocumentAssetDirPath', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load(documents);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the document does not exist', () => {
    expect(() => getDocumentAssetsDirPath('nonexistent')).toThrow(
      DocumentNotFoundError,
    );
  });

  it('returns the assets dir of parent document for unwrapped documents', () => {
    expect(getDocumentAssetsDirPath(childDocument.id)).toBe(
      Fs.concatPath(
        Fs.parentDirPath(wrappedDocument.path),
        '.minddrop',
        'assets',
      ),
    );
  });

  it('returns document assets dir for wrapped documents', () => {
    expect(getDocumentAssetsDirPath(wrappedDocument.id)).toBe(
      Fs.concatPath(
        Fs.parentDirPath(wrappedDocument.path),
        '.minddrop',
        'assets',
      ),
    );
  });

  it('returns the workspace assets dir for root level documents', () => {
    expect(getDocumentAssetsDirPath(document1.id)).toBe(
      Fs.concatPath(workspaceDir, '.minddrop', 'assets'),
    );
  });
});
