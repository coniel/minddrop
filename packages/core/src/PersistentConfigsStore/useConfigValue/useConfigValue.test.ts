import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useConfigValue } from './useConfigValue';
import { NotFoundError } from '../../errors';
import { PersistentConfigsStore } from '../PersistentConfigsStore';

describe('useConfigValue', () => {
  it('throws if the config does not exist', () => {
    expect(() =>
      renderHook(() => useConfigValue('missing', 'foo')),
    ).toThrowError(NotFoundError);
  });

  it('gets the config value', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: { foo: 'bar' } }]);

    // Get the value of 'foo'
    const { result } = renderHook(() => useConfigValue('test', 'foo'));

    // Should return the value
    expect(result.current).toBe('bar');
  });

  it('gets nested config value', () => {
    // Load a config
    PersistentConfigsStore.load([
      { id: 'test', values: { foo: { bar: { baz: 1 } } } },
    ]);

    // Get the value of 'foo.bar.baz'
    const { result } = renderHook(() => useConfigValue('test', 'foo.bar.baz'));

    // Should return the value
    expect(result.current).toBe(1);
  });

  it('returns default value if value does not exist', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    // Get the value of 'foo'
    const { result } = renderHook(() => useConfigValue('test', 'foo', 'bar'));

    // Should return the default value
    expect(result.current).toBe('bar');
  });

  it('returns undefined if value does not exist', () => {
    // Load a config
    PersistentConfigsStore.load([{ id: 'test', values: {} }]);

    // Get the value of 'foo'
    const { result } = renderHook(() => useConfigValue('test', 'foo'));

    // Should return undefined
    expect(result.current).toBeUndefined();
  });

  it('is reactive', () => {
    // Load a config
    PersistentConfigsStore.load([
      { id: 'test', values: { foo: { bar: { baz: 1 } } } },
    ]);

    // Get the value of 'foo.bar.baz'
    const { result } = renderHook(() => useConfigValue('test', 'foo.bar.baz'));

    // Update the value of 'foo.bar.baz'
    act(() => {
      PersistentConfigsStore.set({
        id: 'test',
        values: { foo: { bar: { baz: 2 } } },
      });
    });

    // Should return the value
    expect(result.current).toBe(2);
  });
});
