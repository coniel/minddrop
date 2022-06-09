import { renderHook, act } from '@minddrop/test-utils';
import { InvalidParameterError } from '@minddrop/utils';
import { LocalStoreResource } from '../LocalStoreResource';
import { setPersistentStoreValue } from '../setPersistentStoreValue';
import { setup, cleanup, coreA1 } from '../test-utils';
import { usePersistentStoreValue } from './usePersistentStoreValue';

describe('usePersistentStoreValue', () => {
  beforeEach(() => {
    act(setup);
  });

  afterEach(() => {
    act(cleanup);
  });

  it('returns the live value', () => {
    // Get the 'foo' value from the global store
    const { result } = renderHook(() =>
      usePersistentStoreValue(coreA1, LocalStoreResource, 'foo'),
    );

    act(() => {
      // Update the value
      setPersistentStoreValue(coreA1, LocalStoreResource, 'foo', 'new-value');
    });

    // Should return the value
    expect(result.current).toBe('new-value');
  });

  it('returns the default value if no value is set', () => {
    // Get the unset 'baz' value from the global store
    const { result } = renderHook(() =>
      usePersistentStoreValue(coreA1, LocalStoreResource, 'baz', 'foo'),
    );

    // Should return the default value
    expect(result.current).toBe('foo');
  });

  it('returns null if no value is set and no default is provided', () => {
    // Get the unset 'baz' value from the global store
    const { result } = renderHook(() =>
      usePersistentStoreValue(coreA1, LocalStoreResource, 'baz'),
    );

    // Should return the default value
    expect(result.current).toBeNull();
  });

  it('throws if the key is invalid', () => {
    // Get an invalid key. Should throw an `InvalidParameterError`
    expect(() =>
      usePersistentStoreValue(coreA1, LocalStoreResource, 'invalid'),
    ).toThrowError(InvalidParameterError);
  });
});
