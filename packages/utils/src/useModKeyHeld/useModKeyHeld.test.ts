import { act, cleanup, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useModKeyHeld } from './useModKeyHeld';

const DELAY = 300;

describe('useModKeyHeld', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('reports the modifier being held and released', () => {
    const { result } = renderHook(() => useModKeyHeld(true));

    expect(result.current).toBe(false);

    act(() => {
      fireEvent.keyDown(window, { key: 'Meta', metaKey: true });
      vi.runAllTimers();
    });

    expect(result.current).toBe(true);

    act(() => {
      fireEvent.keyUp(window, { key: 'Meta', metaKey: false });
    });

    expect(result.current).toBe(false);
  });

  it('waits for the delay before reporting the hold', () => {
    const { result } = renderHook(() => useModKeyHeld(true, DELAY));

    act(() => {
      fireEvent.keyDown(window, { key: 'Meta', metaKey: true });
      vi.advanceTimersByTime(DELAY - 1);
    });

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe(true);
  });

  it('does not report a hold released within the delay', () => {
    const { result } = renderHook(() => useModKeyHeld(true, DELAY));

    act(() => {
      fireEvent.keyDown(window, { key: 'Meta', metaKey: true });
      fireEvent.keyUp(window, { key: 'Meta', metaKey: false });
      vi.runAllTimers();
    });

    expect(result.current).toBe(false);
  });

  it('releases the modifier when the window loses focus', () => {
    const { result } = renderHook(() => useModKeyHeld(true));

    act(() => {
      fireEvent.keyDown(window, { key: 'Control', ctrlKey: true });
      vi.runAllTimers();
    });

    expect(result.current).toBe(true);

    act(() => {
      fireEvent.blur(window);
    });

    expect(result.current).toBe(false);
  });

  it('ignores key events while disabled', () => {
    const { result } = renderHook(() => useModKeyHeld(false));

    act(() => {
      fireEvent.keyDown(window, { key: 'Meta', metaKey: true });
      vi.runAllTimers();
    });

    expect(result.current).toBe(false);
  });
});
