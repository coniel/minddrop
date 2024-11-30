import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, document1View1, documentViews } from '../test-utils';
import { updateDocumentView } from './updateDocumentView';
import { DocumentViewNotFoundError } from '../errors';
import { getDocumentView } from '../getDocumentView';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { Events } from '@minddrop/events';

const updatedView = {
  ...document1View1,
  blocks: ['block-id'],
};

describe('updateDocumentView', () => {
  beforeEach(() => {
    setup();

    DocumentViewsStore.getState().load(documentViews);
  });

  afterEach(cleanup);

  it('throws if the view does not exist', () => {
    expect(() => updateDocumentView('missing', {})).toThrow(
      DocumentViewNotFoundError,
    );
  });

  it('updates the view in the store', () => {
    updateDocumentView(document1View1.id, {
      blocks: updatedView.blocks,
    });

    const view = getDocumentView(document1View1.id);

    expect(view).toEqual(updatedView);
  });

  it('dispatches a view update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:view:update', 'test', (payload) => {
        expect(payload.data).toEqual(updatedView);
        done();
      });

      updateDocumentView(document1View1.id, {
        blocks: updatedView.blocks,
      });
    }));
});
