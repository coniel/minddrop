import { renderHook, act } from '@minddrop/test-utils';
import { viewInstance1, staticView } from '../tests';
import { useViewsStore } from './useViewsStore';

describe('useViewsStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useViewsStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('sets a view', () => {
    const { result } = renderHook(() => useViewsStore((state) => state));

    act(() => {
      result.current.setView(staticView);
    });

    expect(Object.keys(result.current.views).length).toBe(1);
    expect(result.current.views[staticView.id]).toEqual(staticView);
  });

  it('removes a view', () => {
    const { result } = renderHook(() => useViewsStore((state) => state));

    act(() => {
      result.current.setView(staticView);
      result.current.removeView(staticView.id);
    });

    expect(result.current.views[staticView.id]).not.toBeDefined();
  });

  it('sets a view instance', () => {
    const { result } = renderHook(() => useViewsStore((state) => state));

    act(() => {
      result.current.setInstance(viewInstance1);
    });

    expect(Object.keys(result.current.instances).length).toBe(1);
    expect(result.current.instances[viewInstance1.id]).toEqual(viewInstance1);
  });

  it('removes a view instance', () => {
    const { result } = renderHook(() => useViewsStore((state) => state));

    act(() => {
      result.current.setInstance(viewInstance1);
      result.current.removeInstance(viewInstance1.id);
    });

    expect(result.current.instances[viewInstance1.id]).not.toBeDefined();
  });

  it('loads in views instance', () => {
    const { result } = renderHook(() => useViewsStore((state) => state));

    act(() => {
      result.current.loadInstances([viewInstance1]);
    });

    expect(result.current.instances[viewInstance1.id]).toEqual(viewInstance1);
  });

  it('clears store data', () => {
    const { result } = renderHook(() => useViewsStore((state) => state));

    act(() => {
      result.current.setInstance(viewInstance1);
      result.current.setView(staticView);
      result.current.clear();
    });

    expect(Object.keys(result.current.instances).length).toBe(0);
    expect(Object.keys(result.current.views).length).toBe(0);
  });
});
