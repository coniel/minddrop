import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  documentViews,
  documents,
  document1View1,
} from '../test-utils';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentsStore } from '../DocumentsStore';
import { deleteDocumentView } from './deleteDocumentView';
import { DocumentViewNotFoundError } from '../errors';
import { getDocumentView } from '../getDocumentView';
import { Events } from '@minddrop/events';

describe('deleteDocumentView', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load(documents);
    DocumentViewsStore.getState().load(documentViews);
  });

  afterEach(cleanup);

  it('throws if the view does not exist', () => {
    expect(() => deleteDocumentView('non-existent-id')).toThrowError(
      DocumentViewNotFoundError,
    );
  });

  it('deletes the view', () => {
    deleteDocumentView(document1View1.id);

    expect(() => getDocumentView(document1View1.id)).toThrowError(
      DocumentViewNotFoundError,
    );
  });

  it('dispatches a view delete event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:view:delete', 'test', (payload) => {
        expect(payload.data).toEqual(document1View1);
        done();
      });

      deleteDocumentView(document1View1.id);
    }));
});
