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
  document1View1,
} from '../test-utils';
import { removeBlocksFromDocument } from './removeBlocksFromDocument';
import { Blocks } from '@minddrop/blocks';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { getDocument } from '../getDocument';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { getDocumentView } from '../getDocumentView';

describe('removeBlocksFromDocument', () => {
  beforeEach(() => {
    setup();

    Blocks.load(documentBlocks);
    DocumentsStore.getState().load(documents);
    DocumentViewsStore.getState().load(documentViews);
    DocumentViewTypeConfigsStore.load(viewTypeConfigs);
  });

  afterEach(cleanup);

  it('removes blocks from the document', () => {
    removeBlocksFromDocument(document1.id, [document1Block1.id]);

    const updatedDocuemnt = getDocument(document1.id);

    expect(updatedDocuemnt?.blocks).not.toContain(document1Block1.id);
  });

  it('removes blocks from the document views', () => {
    removeBlocksFromDocument(document1.id, [document1Block1.id]);

    const updatedView = getDocumentView(document1View1.id);

    expect(updatedView?.blocks).not.toContain(document1Block1.id);
  });
});
