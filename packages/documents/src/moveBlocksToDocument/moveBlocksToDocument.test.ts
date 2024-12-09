import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  documentBlocks,
  documents,
  documentViews,
  document1,
  document1Block1,
  viewTypeConfigs,
  document2,
} from '../test-utils';
import { Blocks } from '@minddrop/blocks';
import { BlockDocumentMap, DocumentsStore } from '../DocumentsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { getDocument } from '../getDocument';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { moveBlocksToDocument } from './moveBlocksToDocument';
import { DocumentNotFoundError, ParentDocumentNotFoundError } from '../errors';

describe('moveBlocksToDocument', () => {
  beforeEach(() => {
    setup();

    Blocks.load(documentBlocks);
    DocumentsStore.getState().load(documents);
    DocumentViewsStore.getState().load(documentViews);
    DocumentViewTypeConfigsStore.load(viewTypeConfigs);
  });

  afterEach(cleanup);

  it('throws if no parent document could be found', () => {
    expect(() =>
      moveBlocksToDocument(document2.id, ['not-child-block-id']),
    ).toThrow(ParentDocumentNotFoundError);
  });

  it('throws if the source document does not exist', () => {
    DocumentsStore.getState().remove(document1.id);
    // Removing a document from the store also removes it from
    // the BlockDocumentMap, so we need to add it back.
    BlockDocumentMap.set(document1Block1.id, document1.id);

    expect(() =>
      moveBlocksToDocument(document2.id, [document1Block1.id]),
    ).toThrow(DocumentNotFoundError);
  });

  it('throws if the target document does not exist', () => {
    expect(() => moveBlocksToDocument('missing', [document1Block1.id])).toThrow(
      DocumentNotFoundError,
    );
  });

  it('removes blocks from the source document', () => {
    moveBlocksToDocument(document2.id, [document1Block1.id]);

    const sourceDocument = getDocument(document1.id);

    expect(sourceDocument?.blocks).not.toContain(document1Block1.id);
  });

  it('adds blocks to the target document', () => {
    moveBlocksToDocument(document2.id, [document1Block1.id]);

    const targetDocument = getDocument(document2.id);

    expect(targetDocument?.blocks).toContain(document1Block1.id);
  });
});
