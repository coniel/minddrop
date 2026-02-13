import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewTypeNotRegisteredError } from '../errors';
import { cleanup, setup, viewType1 } from '../test-utils';
import { getViewType } from './getViewType';

describe('getViewType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws an error if the view type is not registered', () => {
    expect(() => getViewType('unknown-view-type')).toThrow(
      ViewTypeNotRegisteredError,
    );
  });

  it('does not throw an error if the view type is not registered and throwOnNotFound is false', () => {
    expect(() => getViewType('unknown-view-type', false)).not.toThrow();
  });

  it('returns the view type', () => {
    const viewType = getViewType(viewType1.type);
    expect(viewType).toEqual(viewType1);
  });
});
