import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, documentViews, document1View1 } from '../test-utils';
import { getDocumentView } from './getDocumentView';
import { DocumentViewNotFoundError } from '../errors';
import { DocumentViewsStore } from '../DocumentViewsStore';

describe('getDocumentView', () => {
  beforeEach(() => {
    setup();

    DocumentViewsStore.getState().load(documentViews);
  });

  afterEach(cleanup);

  it('throws if the view does not exist', () => {
    expect(() => getDocumentView('invalid')).toThrow(DocumentViewNotFoundError);
  });

  it('returns the view', () => {
    const view = getDocumentView(document1View1.id);

    expect(view).toEqual(document1View1);
  });
});
