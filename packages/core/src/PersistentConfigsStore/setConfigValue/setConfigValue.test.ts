import { describe, it, expect, vi } from 'vitest';
import { NotFoundError } from '../../errors';
import { persistConfigs } from '../persistConfigs';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { setConfigValue } from './setConfigValue';

vi.mock('../persistConfigs', () => ({
  persistConfigs: vi.fn(),
}));

describe('setConfigValue', () => {
  it('throws if the config does not exist', () => {
    expect(() => setConfigValue('missing', 'foo', 'bar')).toThrowError(
      NotFoundError,
    );
  });

  it('sets the config value', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    // Set the value of 'foo' to 'bar'
    setConfigValue('test', 'foo', 'bar');

    // Should set the value
    expect(PersistentConfigsStore.get('test').values).toEqual({ foo: 'bar' });
  });

  it('sets nested config value', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: { foo: { bar: {} } } }]);

    // Set the value of 'foo.bar.baz'
    setConfigValue('test', 'foo.bar.baz', 1);

    // Should set the value
    expect(PersistentConfigsStore.get('test').values).toEqual({
      foo: { bar: { baz: 1 } },
    });
  });

  it('creates nested objects if they do not exist', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    // Set the value of 'foo.bar.baz'
    setConfigValue('test', 'foo.bar.baz', 1);

    // Should set the value
    expect(PersistentConfigsStore.get('test').values).toEqual({
      foo: { bar: { baz: 1 } },
    });
  });

  it('persists changes', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    // Clear the value of 'foo'
    setConfigValue('test', 'foo', 'bar');

    // Should call `peristsConfigs`
    expect(persistConfigs).toHaveBeenCalled();
  });
});
