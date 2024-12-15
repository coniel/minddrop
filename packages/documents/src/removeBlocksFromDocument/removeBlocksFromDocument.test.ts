import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import { DocumentViewTypeConfigsStore } from '../DocumentViewTypeConfigsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import { getDocumentView } from '../getDocumentView';
import {
  cleanup,
  document1,
  document1Block1,
  document1View1,
  documentBlocks,
  documentViews,
  documents,
  setup,
  viewTypeConfigs,
} from '../test-utils';
import { removeBlocksFromDocument } from './removeBlocksFromDocument';

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
