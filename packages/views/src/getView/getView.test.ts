import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewNotFoundError } from '../errors';
import { cleanup, queriesView1, setup } from '../test-utils';
import { getView } from './getView';

describe('get', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a view by name', () => {
    const result = getView(queriesView1.id);

    expect(result).toBe(queriesView1);
  });

  it('throws an error if the view does not exist', () => {
    expect(() => getView('missing')).toThrow(ViewNotFoundError);
  });

  it('does not throw if the view does not exist and throwOnNotFound is false', () => {
    expect(() => getView('missing', false)).not.toThrow(ViewNotFoundError);
  });
});
