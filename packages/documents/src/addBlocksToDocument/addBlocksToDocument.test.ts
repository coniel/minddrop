import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  documents,
  document1,
  documentFiles,
  document1View1,
  documentViews,
  boardViewTypeConfig,
  pageViewTypeConfig,
} from '../test-utils';
import { BLOCKS_TEST_DATA } from '@minddrop/blocks';
import { DocumentNotFoundError } from '../errors';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { getDocumentView } from '../getDocumentView';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { registerDocumentViewTypeConfig } from '../DocumentViewTypeConfigsStore';
import { addBlocksToDocument } from './addBlocksToDocument';

const MockFs = initializeMockFileSystem(documentFiles);

const { textBlock } = BLOCKS_TEST_DATA;
const newBlock = { ...textBlock, id: 'new-block' };

describe('addBlocksToDocument', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load(documents);
    DocumentViewsStore.getState().load(documentViews);
    registerDocumentViewTypeConfig(boardViewTypeConfig);
    registerDocumentViewTypeConfig(pageViewTypeConfig);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the document does not exist', () => {
    expect(() => addBlocksToDocument('foo', [newBlock])).toThrow(
      DocumentNotFoundError,
    );
  });

  it('adds the blocks to the document', async () => {
    addBlocksToDocument(document1.id, [newBlock]);

    const document = getDocument(document1.id)!;

    expect(document.blocks).toContain(newBlock.id);
  });

  it('adds the blocks to the views', async () => {
    addBlocksToDocument(document1.id, [newBlock]);

    const view = getDocumentView(document1View1.id);

    expect(view.blocks).toContain(newBlock.id);
  });

  it('does not add the blocks to the specified view', async () => {
    addBlocksToDocument(document1.id, [newBlock], document1View1.id);

    const view = getDocumentView(document1View1.id);
    expect(view.blocks).not.toContain(newBlock.id);
  });
});
