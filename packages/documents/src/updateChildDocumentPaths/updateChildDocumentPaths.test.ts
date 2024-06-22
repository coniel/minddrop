import { Fs } from '@minddrop/file-system';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import {
  childDocument,
  cleanup,
  document1,
  documents,
  parentDir,
  setup,
  wrappedDocument,
} from '../test-utils';
import { updateChildDocumentPaths } from './updateChildDocumentPaths';

const OLD_PARENT_PATH = parentDir;
const NEW_PARENT_PATH = 'new-parent';
const CHILD_DOCUMENT = Fs.fileNameFromPath(document1.path);
const WRAPPED_CHILD_DOCUMENT = Fs.pathSlice(wrappedDocument.path, -2);
const GRANDCHILD_DOCUMENT = Fs.concatPath(
  Fs.parentDirPath(WRAPPED_CHILD_DOCUMENT),
  Fs.fileNameFromPath(childDocument.path),
);

describe('updateChildDocumentPaths', () => {
  beforeEach(() => {
    setup();

    // Add test documents to the store
    DocumentsStore.getState().load(documents);
  });

  afterEach(cleanup);

  it("recursively updates the child documents' paths", () => {
    // Update the child document paths
    updateChildDocumentPaths(OLD_PARENT_PATH, NEW_PARENT_PATH);

    // Child document path should be updated
    expect(getDocument(Fs.concatPath(NEW_PARENT_PATH, CHILD_DOCUMENT))).not.toBeNull();
    // Wrapped child document path should be updated
    expect(
      getDocument(Fs.concatPath(NEW_PARENT_PATH, WRAPPED_CHILD_DOCUMENT)),
    ).not.toBeNull();
    // Grandchild document path should be updated
    expect(
      getDocument(Fs.concatPath(NEW_PARENT_PATH, GRANDCHILD_DOCUMENT)),
    ).not.toBeNull();
  });
});
