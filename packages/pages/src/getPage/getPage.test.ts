import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PageNotFoundError } from '../errors';
import { cleanup, page_1, setup } from '../test-utils';
import { getPage } from './getPage';

describe('getPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a page by ID', () => {
    const result = getPage(page_1.id);

    expect(result).toBe(page_1);
  });

  it('throws an error if the page does not exist', () => {
    expect(() => getPage('missing')).toThrow(PageNotFoundError);
  });

  it('does not throw if the page does not exist and throwOnNotFound is false', () => {
    expect(() => getPage('missing', false)).not.toThrow(PageNotFoundError);
  });
});
