import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { deleteDocumentView } from '../deleteDocumentView';
import { getDocument } from '../getDocument';
import {
  cleanup,
  document1,
  document1Block1,
  document1View1,
  documentFiles,
  documentsObject,
  setup,
  workspaceDir,
  wrappedDocumentFileBlock,
  wrappedDocumentFileBlockPath,
} from '../test-utils';
import { updateDocument } from '../updateDocument';
import { updateDocumentView } from '../updateDocumentView';
import { isWrapped } from '../utils';
import { initializeDocuments } from './initializeDocuments';

const BLOCK_1_FILE_NAME = 'block-1-file.txt';
const BLOCK_1_FILE_PATH = `${Fs.parentDirPath(document1.path)}/${BLOCK_1_FILE_NAME}`;
const BLOCK_1_WRAPPED_FILE_PATH = `${Fs.parentDirPath(document1.path)}/${document1.title}/${BLOCK_1_FILE_NAME}`;

const MockFs = initializeMockFileSystem([...documentFiles, BLOCK_1_FILE_PATH]);

describe('initializeDocuments', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('should load documents from provided source paths', async () => {
    await initializeDocuments([workspaceDir]);

    // Documents should be loaded into the store from files
    expect(DocumentsStore.getState().documents).toEqual(documentsObject);
  });

  it('should listen for block updates and write the updated document content to the file', async () => {
    await initializeDocuments([workspaceDir]);

    // Update a document block
    Blocks.update(document1Block1.id, { text: 'Updated content' });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the document file
    const document = JSON.parse(MockFs.readTextFile(document1.path));

    // The document content should be updated
    expect(document.blocks[0].text).toEqual('Updated content');
  });

  it('should listen for document view updates and write the updated document content to the file', async () => {
    await initializeDocuments([workspaceDir]);

    // Update a document view
    updateDocumentView(document1View1.id, { blocks: ['new-block-id'] });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the document file
    const document = JSON.parse(MockFs.readTextFile(document1.path));

    // The document content should be updated
    expect(document.views[0].blocks).toEqual(['new-block-id']);
  });

  it('should litsen for block deletes and write the updated document content to the file', async () => {
    await initializeDocuments([workspaceDir]);

    // Delete a block
    Blocks.delete(document1Block1.id);

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get the document file
    const document = JSON.parse(MockFs.readTextFile(document1.path));

    // The block should be removed from the document
    expect(document.blocks).toHaveLength(document1.blocks.length - 1);
  });

  it('should listen for document view deletes and write the updated document content to the file', async () => {
    await initializeDocuments([workspaceDir]);

    // Delete a document view
    deleteDocumentView(document1View1.id);

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the document file
    const document = JSON.parse(MockFs.readTextFile(document1.path));

    // The view should be removed from the document
    expect(document.views).toHaveLength(document1.views.length - 1);
  });

  it('should listen for document updates and write the updated document content to the file', async () => {
    await initializeDocuments([workspaceDir]);

    // Update a document
    updateDocument(document1.id, { title: 'Updated title' });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the document file
    const document = JSON.parse(MockFs.readTextFile(document1.path));

    // The document content should be updated
    expect(document.title).toEqual('Updated title');
  });

  it('should wrap the document if an update adds a file block', async () => {
    await initializeDocuments([workspaceDir]);

    // Update a document block with a file
    Blocks.update(document1Block1.id, { file: BLOCK_1_FILE_NAME });
    await new Promise((resolve) => setTimeout(resolve, 200));

    const updatedDocument = getDocument(document1.id)!;

    // The document should be wrapped
    expect(isWrapped(updatedDocument.path)).toBe(true);
  });

  it('should move associated files when wrapping a document', async () => {
    await initializeDocuments([workspaceDir]);

    // Update a document block with a file
    Blocks.update(document1Block1.id, { file: BLOCK_1_FILE_NAME });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // The associated file should be moved to the wrapper dir
    expect(MockFs.exists(BLOCK_1_FILE_PATH)).toBe(false);
    expect(MockFs.exists(BLOCK_1_WRAPPED_FILE_PATH)).toBe(true);
  });

  it('moves block file to system trash when deleteing a file block', async () => {
    await initializeDocuments([workspaceDir]);

    // Delete the block
    Blocks.delete(wrappedDocumentFileBlock.id);

    // Wait for the event listener to process the delete block event
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Block file should be moved to system trash
    expect(MockFs.exists(wrappedDocumentFileBlockPath)).toBe(false);
    expect(MockFs.existsInTrash(wrappedDocumentFileBlockPath)).toBe(true);
  });
});
