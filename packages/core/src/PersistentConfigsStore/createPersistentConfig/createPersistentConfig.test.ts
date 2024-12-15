import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { NotFoundError } from '../../errors';
import { Config } from '../../types/Config.types';
import { PersistentConfigsStore } from '../PersistentConfigsStore';
import { persistConfigs } from '../persistConfigs';
import { createPersistentConfig } from './createPersistentConfig';

vi.mock('../persistConfigs', () => ({
  persistConfigs: vi.fn(),
}));

interface ConfigValues {
  foo: string;
  bar?: string;
}

initializeMockFileSystem();

describe('createPersistentConfig', () => {
  let config: Config<ConfigValues>;

  afterEach(() => {
    PersistentConfigsStore.clear();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    config = createPersistentConfig('test', { foo: 'foo' });
  });

  it('loads the default config if config does not exist', () => {
    // Should load default value into the persistent
    // configs store.
    expect(PersistentConfigsStore.get('test')).toEqual({
      id: 'test',
      values: { foo: 'foo' },
    });
  });

  it('does not load default config if config already exists', () => {
    // Create a config with the same ID as the loaded one
    createPersistentConfig('test', { foo: 'new' });

    // Should not load default values into store
    expect(PersistentConfigsStore.get('test')).toEqual({
      id: 'test',
      values: { foo: 'foo' },
    });
  });

  describe('config.set', () => {
    it('throws if the config does not exist', () => {
      // Clear configs store to remove the config
      PersistentConfigsStore.clear();

      expect(() => config.set('foo', 'baz')).toThrow(NotFoundError);
    });

    it('sets the config value', () => {
      // Load a config
      PersistentConfigsStore.load([{ id: 'test', values: {} }]);

      // Set the value of 'foo' to 'baz'
      config.set('foo', 'baz');

      // Should set the value
      expect(PersistentConfigsStore.get('test').values).toEqual({ foo: 'baz' });
    });

    it('persists changes', () => {
      // Clear the value of 'foo'
      config.set('foo', 'baz');

      // Should call `peristsConfigs`
      expect(persistConfigs).toHaveBeenCalled();
    });
  });

  describe('config.get', () => {
    it('throws if the config does not exist', () => {
      // Clear configs store to remove the config
      PersistentConfigsStore.clear();

      expect(() => config.get('foo')).toThrow(NotFoundError);
    });

    it('gets the config value', () => {
      // Get the value of 'foo'
      const value = config.get('foo');

      // Should return the value
      expect(value).toBe('foo');
    });

    it('returns default value if value does not exist', () => {
      // Should return default
      expect(config.get('bar', 'default-value')).toBe('default-value');
    });

    it('returns undefined if value does not exist', () => {
      // Should return undefined
      expect(config.get('bar')).toBeUndefined();
    });
  });

  describe('config.useValue', () => {
    it('throws if the config does not exist', () => {
      // Clear configs store to remove the config
      PersistentConfigsStore.clear();

      expect(() => renderHook(() => config.useValue('foo'))).toThrow(
        NotFoundError,
      );
    });

    it('gets the config value', () => {
      // Get the value of 'foo'
      const { result } = renderHook(() => config.useValue('foo'));

      // Should return the value
      expect(result.current).toBe('foo');
    });

    it('returns default value if value does not exist', () => {
      // Get the value of 'foo'
      const { result } = renderHook(() =>
        config.useValue('bar', 'default-value'),
      );

      // Should return the default value
      expect(result.current).toBe('default-value');
    });

    it('returns undefined if value does not exist', () => {
      // Get the value of 'foo'
      const { result } = renderHook(() => config.useValue('bar'));

      // Should return undefined
      expect(result.current).toBeUndefined();
    });

    it('is reactive', () => {
      // Get the value of 'foo.bar.baz'
      const { result } = renderHook(() => config.useValue('foo'));

      // Update the value of 'foo.bar.baz'
      act(() => {
        PersistentConfigsStore.set({
          id: 'test',
          values: { foo: 'new-value' },
        });
      });

      // Should return the value
      expect(result.current).toBe('new-value');
    });
  });

  describe('clearConfigValue', () => {
    it('throws if the config does not exist', () => {
      // Clear configs store to remove the config
      PersistentConfigsStore.clear();

      expect(() => config.clear('foo')).toThrow(NotFoundError);
    });

    it('clears the config value', () => {
      // Load a config
      PersistentConfigsStore.load([{ id: 'test', values: { foo: 'foo' } }]);

      // Clear the value of 'foo'
      config.clear('foo');

      // Should clear the value
      expect(PersistentConfigsStore.get('test').values).toEqual({});
    });

    it('does nothing if value does not exist', () => {
      // @ts-expect-error - Test invalid input
      expect(() => config.clear('test')).not.toThrow();
    });

    it('persists changes', () => {
      // Load a config
      PersistentConfigsStore.load([{ id: 'test', values: { foo: 'foo' } }]);

      // Clear the value of 'foo'
      config.clear('foo');

      // Should call `peristsConfigs`
      expect(persistConfigs).toHaveBeenCalled();
    });
  });
});
