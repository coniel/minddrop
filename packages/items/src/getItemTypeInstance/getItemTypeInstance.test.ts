import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemTypeInstancesStore } from '../ItemTypeInstancesStore';
import { ItemTypeInstanceNotFoundError } from '../errors';
import { cleanup, dataItemTypeInstance, setup } from '../test-utils';
import { getItemTypeInstance } from './getItemTypeInstance';

describe('getItemTypeInstance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested item type instance if it exists', () => {
    // Add a item type instance to the store
    ItemTypeInstancesStore.add(dataItemTypeInstance);

    // Should return item type instance from the store
    expect(getItemTypeInstance(dataItemTypeInstance.id)).toEqual(
      dataItemTypeInstance,
    );
  });

  it('returns null if the item type instance does not exist', () => {
    // Get a missing item type instance, should return null
    expect(getItemTypeInstance('foo')).toBeNull();
  });

  it('throws if the item type instance does not exist and throwOnNotFound is true', () => {
    // Get a missing item type instance, should throw
    expect(() => getItemTypeInstance('foo', true)).toThrow(
      ItemTypeInstanceNotFoundError,
    );
  });
});
