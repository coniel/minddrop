import { InvalidParameterError } from '@minddrop/utils';
import { LocalStoreResource } from '../LocalStoreResource';
import { setup, cleanup, coreA1 } from '../test-utils';
import { validatePersistentStoreKey } from './validatePersistentStoreKey';

describe('validatePersistentStoreKey', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws a `InvalidParameterError` if the key is not a valid key', () => {
    // Validate a key which does not exist in the persistent
    // store's schema. Should throw a `InvalidParameterError`.
    expect(() =>
      validatePersistentStoreKey(coreA1, LocalStoreResource, 'invalid'),
    ).toThrowError(InvalidParameterError);
  });

  it('passes if the key is valid', () => {
    // Validate a key which exists in the persistent store's
    // schema. Should not throw an error.
    expect(() =>
      validatePersistentStoreKey(coreA1, LocalStoreResource, 'foo'),
    ).not.toThrow();
  });
});
