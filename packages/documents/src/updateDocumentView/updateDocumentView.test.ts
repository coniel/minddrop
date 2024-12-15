import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentViewNotFoundError } from '../errors';
import { getDocumentView } from '../getDocumentView';
import { cleanup, document1View1, documentViews, setup } from '../test-utils';
import { updateDocumentView } from './updateDocumentView';

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
