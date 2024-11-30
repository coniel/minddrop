import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  documentViews,
  document1View1,
  document1View2,
} from '../test-utils';
import { getDocumentViews } from './getDocumentViews';
import { DocumentViewsStore } from '../DocumentViewsStore';

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
