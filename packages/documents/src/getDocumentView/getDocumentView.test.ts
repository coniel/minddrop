import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentViewNotFoundError } from '../errors';
import { cleanup, document1View1, documentViews, setup } from '../test-utils';
import { getDocumentView } from './getDocumentView';

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
