import { renderHook, act } from '@minddrop/test-utils';
import { topicExtension } from '../test-utils';
import { useExtensionsStore } from './useExtensionsStore';

describe('useExtensionsStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('sets a extension', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.setExtension(topicExtension);
    });

    expect(Object.keys(result.current.extensions).length).toBe(1);
    expect(result.current.extensions[topicExtension.id]).toEqual(
      topicExtension,
    );
  });

  it('removes a extension', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.setExtension(topicExtension);
      result.current.removeExtension(topicExtension.id);
    });

    expect(result.current.extensions[topicExtension.id]).not.toBeDefined();
  });

  it('clears store data', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.setExtension(topicExtension);
      result.current.clear();
    });

    expect(result.current.extensions).toEqual({});
  });
});
