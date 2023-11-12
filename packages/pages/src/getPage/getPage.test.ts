import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, page1 } from '../test-utils';
import { PagesStore } from '../PagesStore';
import { getPage } from './getPage';

describe('getPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested page if it exists', () => {
    // Add a page to the store
    PagesStore.getState().add(page1);

    // Should return page from the store
    expect(getPage(page1.path)).toEqual(page1);
  });

  it('returns null if the page does not exist', () => {
    // Get a missing page, should return null
    expect(getPage('foo')).toBeNull();
  });
});
