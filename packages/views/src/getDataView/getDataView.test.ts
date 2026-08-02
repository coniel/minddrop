import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewNotFoundError } from '../errors';
import { cleanup, setup, view_gallery_1 } from '../test-utils';
import { getDataView } from './getDataView';

describe('getDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the view does not exist', () => {
    expect(() => getDataView('missing-view')).toThrow(DataViewNotFoundError);
  });

  it('returns the view if it exists', () => {
    const view = getDataView(view_gallery_1.id);

    expect(view).toEqual(view_gallery_1);
  });

  it('returns null when throwOnNotFound is false and view does not exist', () => {
    expect(getDataView('missing-view', false)).toBeNull();
  });

  it('does not throw when throwOnNotFound is false', () => {
    expect(() => getDataView('missing-view', false)).not.toThrow();
  });
});
