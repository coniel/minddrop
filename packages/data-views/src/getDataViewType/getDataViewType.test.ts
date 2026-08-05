import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewTypeNotRegisteredError } from '../errors';
import { cleanup, dataViewType_gallery, setup } from '../test-utils';
import { getDataViewType } from './getDataViewType';

describe('getDataViewType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws an error if the view type is not registered', () => {
    expect(() => getDataViewType('unknown-view-type')).toThrow(
      DataViewTypeNotRegisteredError,
    );
  });

  it('does not throw an error if the view type is not registered and throwOnNotFound is false', () => {
    expect(() => getDataViewType('unknown-view-type', false)).not.toThrow();
  });

  it('returns the view type', () => {
    const viewType = getDataViewType(dataViewType_gallery.type);
    expect(viewType).toEqual(dataViewType_gallery);
  });
});
