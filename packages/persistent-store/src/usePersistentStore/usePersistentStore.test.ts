import { renderHook, act } from '@minddrop/test-utils';
import { usePersistentStore } from './usePersistentStore';

describe('usePersistentStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => usePersistentStore((state) => state));
    act(() => {
      result.current.clearAll();
      result.current.set('test', 'foo', 'foo');
      result.current.set('test', 'bar', 'bar');
    });
  });

  it('sets a value', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      result.current.set('app', 'foo', 'foo');
      result.current.set('app', 'bar', 'bar');
    });

    expect(result.current.data.app.foo).toBe('foo');
    expect(result.current.data.app.bar).toBe('bar');
  });

  it('deletes a value', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      result.current.delete('test', 'foo');
      // Should not throw error
      result.current.delete('test-2', 'foo');
    });

    expect(result.current.data.test.foo).not.toBeDefined();
    expect(result.current.data.test.bar).toBe('bar');
  });

  it('clears the data for a namespace', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      result.current.clear('test');
      // Should not throw error
      result.current.clear('test-2');
    });

    expect(result.current.data.test).not.toBeDefined();
  });

  it('clears all data', () => {
    const { result } = renderHook(() => usePersistentStore((state) => state));

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.data).toEqual({});
  });
});
