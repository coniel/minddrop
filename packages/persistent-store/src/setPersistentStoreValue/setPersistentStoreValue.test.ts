import { InvalidParameterError } from '@minddrop/utils';
import { getPersistentStoreDocument } from '../getPersistentStoreDocument';
import { LocalStoreResource } from '../LocalStoreResource';
import { setup, cleanup, coreA1, StoreData } from '../test-utils';
import { LocalPersistentStoreDocument } from '../types';
import { setPersistentStoreValue } from './setPersistentStoreValue';

describe('setPersistentStoreValue', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets a value in the store', () => {
    // Set a value in a persistent store
    setPersistentStoreValue(coreA1, LocalStoreResource, 'foo', 'bar');

    // Get the persistent store document
    const document = getPersistentStoreDocument(
      coreA1,
      LocalStoreResource,
    ) as LocalPersistentStoreDocument<StoreData>;

    // Value should be set
    expect(document.foo).toEqual('bar');
  });

  it('throws a if the key is not a valid key', () => {
    // Attempt to set a value for an invalid key.
    // Should throw a `InvalidParameterError`.
    expect(() =>
      setPersistentStoreValue(coreA1, LocalStoreResource, 'invalid', 'foo'),
    ).toThrowError(InvalidParameterError);
  });
});
