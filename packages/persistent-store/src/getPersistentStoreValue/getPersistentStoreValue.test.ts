import { InvalidParameterError } from '@minddrop/utils';
import { LocalStoreResource } from '../LocalStoreResource';
import { setup, cleanup, coreA1, storeDefaultData } from '../test-utils';
import { getPersistentStoreValue } from './getPersistentStoreValue';

describe('getPersistentStoreValue', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the value if set', () => {
    // Get a value from a persistent store
    const value = getPersistentStoreValue(coreA1, LocalStoreResource, 'foo');

    // Should return the value
    expect(value).toEqual(storeDefaultData.foo);
  });

  it('returns the default value if the value is not set', () => {
    // Get a value from a persistent store
    const value = getPersistentStoreValue(
      coreA1,
      LocalStoreResource,
      'baz',
      'baz',
    );

    // Should return the value
    expect(value).toEqual('baz');
  });

  it('throws a if the key is not a valid key', () => {
    // Attempt to retrieve a value which does not exist
    // is the persistent store's defiend values. Should
    // throw a `InvalidParameterError`.
    expect(() =>
      getPersistentStoreValue(coreA1, LocalStoreResource, 'invalid'),
    ).toThrowError(InvalidParameterError);
  });
});
