import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewNotFoundError } from '../errors';
import { cleanup, setup, view_gallery_1 } from '../test-utils';
import { getView } from './getView';

describe('getView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the view does not exist', () => {
    expect(() => getView('missing-view')).toThrow(ViewNotFoundError);
  });

  it('returns the view if it exists', () => {
    const view = getView(view_gallery_1.id);

    expect(view).toEqual(view_gallery_1);
  });

  it('returns null when throwOnNotFound is false and view does not exist', () => {
    expect(getView('missing-view', false)).toBeNull();
  });

  it('does not throw when throwOnNotFound is false', () => {
    expect(() => getView('missing-view', false)).not.toThrow();
  });
});
