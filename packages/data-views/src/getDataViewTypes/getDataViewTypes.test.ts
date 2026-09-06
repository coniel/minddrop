import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, dataViewTypes, setup } from '../test-utils';
import { getDataViewTypes } from './getDataViewTypes';

describe('getDataViewTypes', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all registered view types', () => {
    expect(getDataViewTypes()).toEqual(dataViewTypes);
  });

  it('returns an empty array when no view types are registered', async () => {
    // Reset the store to remove the fixture view types
    await cleanup();

    expect(getDataViewTypes()).toEqual([]);
  });
});
