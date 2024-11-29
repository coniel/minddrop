import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import {
  cleanup,
  documents,
  grandChildDocument,
  workspaceDir,
  setup,
  wrappedChildDocument,
  wrappedDocument,
} from '../test-utils';
import { updateChildDocumentPaths } from './updateChildDocumentPaths';

const NEW_PARENT_NAME = 'New name';
const NEW_PARENT_PATH = wrappedDocument.path.replace(
  wrappedDocument.title,
  NEW_PARENT_NAME,
);
const NEW_WORKSPACE_NAME = 'New workspace';
const NEW_WORKSPACE_PATH = workspaceDir
  .split('/')
  .slice(0, -1)
  .concat(NEW_PARENT_NAME)
  .join('/');

describe('updateChildDocumentPaths', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load(documents);
  });

  afterEach(cleanup);

  it("recursively updates the child documents' paths", () => {
    // Update the child document paths
    updateChildDocumentPaths(wrappedDocument.path, NEW_PARENT_PATH);

    // Child document path should be updated
    expect(getDocument(wrappedChildDocument.id)?.path).toBe(
      wrappedChildDocument.path.replace(wrappedDocument.title, NEW_PARENT_NAME),
    );
    // Grandchild document path should be updated
    expect(getDocument(grandChildDocument.id)?.path).toBe(
      grandChildDocument.path.replace(wrappedDocument.title, NEW_PARENT_NAME),
    );
  });

  it('supports using directories as paths', () => {
    // Update the child document paths
    updateChildDocumentPaths(workspaceDir, NEW_WORKSPACE_PATH);

    // Child document path should be updated
    expect(getDocument(wrappedDocument.id)?.path).toBe(
      wrappedDocument.path.replace(workspaceDir, NEW_WORKSPACE_PATH),
    );
    // Child document path should be updated
    expect(getDocument(wrappedChildDocument.id)?.path).toBe(
      wrappedChildDocument.path.replace(workspaceDir, NEW_WORKSPACE_PATH),
    );
    // Grandchild document path should be updated
    expect(getDocument(grandChildDocument.id)?.path).toBe(
      grandChildDocument.path.replace(workspaceDir, NEW_WORKSPACE_PATH),
    );
  });
});
