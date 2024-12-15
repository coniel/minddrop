import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentViewsStore } from '../DocumentViewsStore';
import {
  cleanup,
  document1View1,
  document1View2,
  documentViews,
  setup,
} from '../test-utils';
import { getDocumentViews } from './getDocumentViews';

describe('getDocumentViews', () => {
  beforeEach(() => {
    setup();

    DocumentViewsStore.getState().load(documentViews);
  });

  afterEach(cleanup);

  it('returns the requested views', () => {
    const views = getDocumentViews([document1View1.id, document1View2.id]);

    expect(views).toEqual([document1View1, document1View2]);
  });

  it('filters out missing views', () => {
    const views = getDocumentViews([document1View1.id, 'missing']);

    expect(views).toEqual([document1View1]);
  });
});
