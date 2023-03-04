import { describe, it, expect } from 'vitest';
import { NotFoundError } from '../../errors';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { getConfigValue } from './getConfigValue';

describe('getConfigValue', () => {
  it('throws if the config does not exist', () => {
    expect(() => getConfigValue('missing', 'foo')).toThrowError(NotFoundError);
  });

  it('gets the config value', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: { foo: 'bar' } }]);

    // Get the value of 'foo'
    const value = getConfigValue('test', 'foo');

    // Should return the value
    expect(value).toBe('bar');
  });

  it('gets nested config value', () => {
    // Load a config
    PersistentConfigsStore.load([
      { id: 'test', values: { foo: { bar: { baz: 1 } } } },
    ]);

    // Get the value of 'foo.bar.baz'
    const value = getConfigValue('test', 'foo.bar.baz');

    // Should return the value
    expect(value).toBe(1);
  });

  it('returns default value if value does not exist', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    // Should return default for flat keys
    expect(getConfigValue('test', 'foo', 'bar')).toBe('bar');
    // Should return default for nested keys
    expect(getConfigValue('test', 'foo.bar.baz', 'bar')).toBe('bar');
  });

  it('returns undefined if value does not exist', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    // Should return undefined for flat keys
    expect(getConfigValue('test', 'foo')).toBeUndefined();
    // Should return undefined for nested keys
    expect(getConfigValue('test', 'foo.bar.baz')).toBeUndefined();
  });
});
