import { describe, it, expect, vi } from 'vitest';
import { NotFoundError } from '../../errors';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { persistConfigs } from '../persistConfigs';
import { clearConfigValue } from './clearConfigValue';

vi.mock('../persistConfigs', () => ({
  persistConfigs: vi.fn(),
}));

describe('clearConfigValue', () => {
  it('throws if the config does not exist', () => {
    expect(() => clearConfigValue('missing', 'foo')).toThrowError(
      NotFoundError,
    );
  });

  it('clears the config value', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: { foo: 'bar' } }]);

    // Clear the value of 'foo'
    clearConfigValue('test', 'foo');

    // Should clear the value
    expect(PersistentConfigsStore.get('test').values).toEqual({});
  });

  it('clears nested config value', () => {
    // Load a config
    PersistentConfigsStore.load([
      { id: 'test', values: { foo: { bar: { baz: 1 } } } },
    ]);

    // Clear the value of 'foo.bar.baz'
    clearConfigValue('test', 'foo.bar.baz');

    // Should clear the value
    expect(PersistentConfigsStore.get('test').values).toEqual({
      foo: { bar: {} },
    });
  });

  it('does nothing if value does not exist', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    expect(() => clearConfigValue('test', 'foo')).not.toThrow();
    expect(() => clearConfigValue('test', 'foo.bar.baz')).not.toThrow();
  });

  it('persists changes', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: { foo: 'bar' } }]);

    // Clear the value of 'foo'
    clearConfigValue('test', 'foo');

    // Should call `peristsConfigs`
    expect(persistConfigs).toHaveBeenCalled();
  });
});
