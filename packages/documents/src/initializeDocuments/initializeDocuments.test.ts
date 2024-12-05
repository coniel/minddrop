import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import {
  cleanup,
  document1,
  document1Block1,
  document1View1,
  documentFiles,
  documentsObject,
  setup,
  viewTypeConfigs,
  workspaceDir,
} from '../test-utils';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { initializeDocuments } from './initializeDocuments';
import { updateDocumentView } from '../updateDocumentView';
import { deleteDocumentView } from '../deleteDocumentView';
import { registerDocumentViewTypeConfig } from '../DocumentViewTypeConfigsStore';
import { updateDocument } from '../updateDocument';

const MockFs = initializeMockFileSystem(documentFiles);

describe('initializeDocuments', () => {
  beforeEach(() => {
    setup();

    viewTypeConfigs.forEach((view) => {
      registerDocumentViewTypeConfig(view);
    });
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

  it('should listen for block updates and write the updated document content to the file', () =>
    new Promise<void>(async (done) => {
      await initializeDocuments([workspaceDir]);

      // Update a document block
      Blocks.update(document1Block1.id, { text: 'Updated content' });

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get the document file
      const document = JSON.parse(MockFs.readTextFile(document1.path));

      // The document content should be updated
      expect(document.blocks[0].text).toEqual('Updated content');

      done();
    }));

  it('should listen for document view updates and write the updated document content to the file', async () =>
    new Promise<void>(async (done) => {
      await initializeDocuments([workspaceDir]);

      // Update a document view
      updateDocumentView(document1View1.id, { blocks: ['new-block-id'] });

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get the document file
      const document = JSON.parse(MockFs.readTextFile(document1.path));

      // The document content should be updated
      expect(document.views[0].blocks).toEqual(['new-block-id']);

      done();
    }));

  it('should litsen for block deletes and write the updated document content to the file', async () =>
    new Promise<void>(async (done) => {
      await initializeDocuments([workspaceDir]);

      // Delete a block
      Blocks.delete(document1Block1.id);

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get the document file
      const document = JSON.parse(MockFs.readTextFile(document1.path));

      // The block should be removed from the document
      expect(document.blocks).toHaveLength(document1.blocks.length - 1);

      done();
    }));

  it('should listen for document view deletes and write the updated document content to the file', async () =>
    new Promise<void>(async (done) => {
      await initializeDocuments([workspaceDir]);

      // Delete a document view
      deleteDocumentView(document1View1.id);

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get the document file
      const document = JSON.parse(MockFs.readTextFile(document1.path));

      // The view should be removed from the document
      expect(document.views).toHaveLength(document1.views.length - 1);

      done();
    }));

  it('should listen for document updates and write the updated document content to the file', async () =>
    new Promise<void>(async (done) => {
      await initializeDocuments([workspaceDir]);

      // Update a document
      updateDocument(document1.id, { title: 'Updated title' });

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get the document file
      const document = JSON.parse(MockFs.readTextFile(document1.path));

      // The document content should be updated
      expect(document.title).toEqual('Updated title');

      done();
    }));
});
