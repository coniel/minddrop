import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMeasuredImageWidth } from './useMeasuredImageWidth';

// Observer callbacks registered during a test, so that resizes can
// be simulated without a layout engine
let resizeCallbacks: (() => void)[] = [];

class MockResizeObserver {
  constructor(callback: () => void) {
    resizeCallbacks.push(callback);
  }

  observe() {}

  unobserve() {}

  disconnect() {}
}

// Triggers every registered observer callback
function resize() {
  act(() => {
    resizeCallbacks.forEach((callback) => callback());
  });
}

// Advances past the wait for a resize to settle
function settle() {
  act(() => {
    vi.advanceTimersByTime(2000);
  });
}

// Renders the hook against an element of the given css pixel width
function renderWithWidth(elementWidth: number) {
  const element = document.createElement('div');

  element.getBoundingClientRect = () => ({ width: elementWidth }) as DOMRect;

  const elementRef = { current: element };

  const setWidth = (width: number) => {
    element.getBoundingClientRect = () => ({ width }) as DOMRect;
  };

  return {
    setWidth,
    ...renderHook(() => useMeasuredImageWidth(elementRef)),
  };
}

describe('useMeasuredImageWidth', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resizeCallbacks = [];
    window.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
    window.devicePixelRatio = 1;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.devicePixelRatio = 1;
  });

  it('reports the bracketed width of the measured element', () => {
    const { result } = renderWithWidth(320);

    expect(result.current).toEqual({ width: 400, isMeasured: true });
  });

  it('scales the measured width by the device pixel ratio', () => {
    window.devicePixelRatio = 2;

    const { result } = renderWithWidth(320);

    expect(result.current.width).toBe(800);
  });

  it('is unmeasured while the element has no width', () => {
    const { result } = renderWithWidth(0);

    expect(result.current).toEqual({ width: undefined, isMeasured: false });
  });

  it('applies the first measurement without waiting', () => {
    const { result, setWidth } = renderWithWidth(0);

    setWidth(320);
    resize();

    expect(result.current.width).toBe(400);
  });

  it('grows the requested width once a resize settles', () => {
    const { result, setWidth } = renderWithWidth(320);

    setWidth(1000);
    resize();
    settle();

    expect(result.current.width).toBe(1000);
  });

  it('ignores sizes passed through while resizing', () => {
    const { result, setWidth } = renderWithWidth(320);

    // Sizes seen mid-drag, none of which settle
    [500, 700, 900].forEach((elementWidth) => {
      setWidth(elementWidth);
      resize();
    });

    expect(result.current.width).toBe(400);

    setWidth(1000);
    resize();
    settle();

    expect(result.current.width).toBe(1000);
  });

  it('keeps the largest width when the element shrinks', () => {
    const { result, setWidth } = renderWithWidth(1000);

    setWidth(320);
    resize();
    settle();

    expect(result.current.width).toBe(1000);
  });

  it('uses the original image above the resize cap', () => {
    const { result } = renderWithWidth(4000);

    expect(result.current).toEqual({ width: undefined, isMeasured: true });
  });
});
