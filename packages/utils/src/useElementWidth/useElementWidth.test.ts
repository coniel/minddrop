import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useElementWidth } from './useElementWidth';

// Observer callbacks registered during a test, so that resizes can
// be simulated without a layout engine.
let resizeCallbacks: (() => void)[] = [];

class MockResizeObserver {
  constructor(callback: () => void) {
    resizeCallbacks.push(callback);
  }

  observe() {}

  unobserve() {}

  disconnect() {}
}

// Renders the hook against an element of the given layout width
function renderWithWidth(elementWidth: number) {
  const element = document.createElement('div');

  const setWidth = (width: number) => {
    Object.defineProperty(element, 'offsetWidth', {
      value: width,
      configurable: true,
    });
  };

  setWidth(elementWidth);

  return {
    setWidth,
    ...renderHook(() => useElementWidth(element)),
  };
}

describe('useElementWidth', () => {
  beforeEach(() => {
    resizeCallbacks = [];
    window.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
  });

  it("returns the element's width", () => {
    const { result } = renderWithWidth(320);

    expect(result.current).toBe(320);
  });

  it('updates the width as the element resizes', () => {
    const { result, setWidth } = renderWithWidth(320);

    setWidth(480);

    act(() => {
      resizeCallbacks.forEach((callback) => callback());
    });

    expect(result.current).toBe(480);
  });

  it('returns 0 while there is no element', () => {
    const { result } = renderHook(() => useElementWidth(null));

    expect(result.current).toBe(0);
  });

  it('measures an element which takes the place of the measured one', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');

    Object.defineProperty(first, 'offsetWidth', { value: 320 });
    Object.defineProperty(second, 'offsetWidth', { value: 640 });

    const { result, rerender } = renderHook(
      ({ element }) => useElementWidth(element),
      { initialProps: { element: first } },
    );

    rerender({ element: second });

    expect(result.current).toBe(640);
  });
});
