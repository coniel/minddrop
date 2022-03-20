import { renderHook, act } from '@minddrop/test-utils';
import { usePersistentStore } from './usePersistentStore';

describe('usePersistentStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => usePersistentStore((state) => state));
    act(() => {
      result.current.set('global', 'test', 'foo', 'foo');
      result.current.set('global', 'test', 'bar', 'bar');
      result.current.set('local', 'test', 'foo', 'foo');
      result.current.set('local', 'test', 'bar', 'bar');
    });
  });

  afterEach(() => {
    const { result } = renderHook(() => usePersistentStore((state) => state));
    act(() => {
      result.current.clearScope('global');
      result.current.clearScope('local');
    });
  });

  it('loads in data', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));
    const store = { id: 'doc-id', data: { app: { loaded: 'loaded' } } };

    act(() => {
      // Global
      result.current.load('global', store);
      // Local
      result.current.load('local', store);
    });

    // Global
    expect(result.current.global).toEqual({
      id: 'doc-id',
      data: {
        app: { loaded: 'loaded' },
      },
    });
    // Local
    expect(result.current.local).toEqual({
      id: 'doc-id',
      data: {
        app: { loaded: 'loaded' },
      },
    });
  });

  it('sets a value', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      // Global
      result.current.set('global', 'app', 'foo', 'foo');
      result.current.set('global', 'app', 'bar', 'bar');
      // Local
      result.current.set('local', 'app', 'foo', 'foo');
      result.current.set('local', 'app', 'bar', 'bar');
    });

    // Global
    expect(result.current.global.data.app.foo).toBe('foo');
    expect(result.current.global.data.app.bar).toBe('bar');
    // Local
    expect(result.current.local.data.app.foo).toBe('foo');
    expect(result.current.local.data.app.bar).toBe('bar');
  });

  it('deletes a value', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      // Global
      result.current.delete('global', 'test', 'foo');
      // Should not throw error
      result.current.delete('global', 'test-2', 'foo');

      // Local
      result.current.delete('local', 'test', 'foo');
      // Should not throw error
      result.current.delete('local', 'test-2', 'foo');
    });

    // Global
    expect(result.current.global.data.test.foo).not.toBeDefined();
    expect(result.current.global.data.test.bar).toBe('bar');
    // Local
    expect(result.current.local.data.test.foo).not.toBeDefined();
    expect(result.current.local.data.test.bar).toBe('bar');
  });

  it('clears the data for a namespace', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      // Global
      result.current.clear('global', 'test');
      // Should not throw error
      result.current.clear('global', 'test-2');

      // Local
      result.current.clear('local', 'test');
      // Should not throw error
      result.current.clear('local', 'test-2');
    });

    // Global
    expect(result.current.global.data.test).not.toBeDefined();
    // Local
    expect(result.current.local.data.test).not.toBeDefined();
  });

  it('clears all data', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      // Global
      result.current.clearScope('global');
      // Local
      result.current.clearScope('local');
    });

    // Global
    expect(result.current.global).toEqual({ id: null, data: {} });
    // Local
    expect(result.current.local).toEqual({ id: null, data: {} });
  });
});
