import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@minddrop/test-utils';
import { MAX_LIST_COLUMN_WIDTH, MIN_LIST_COLUMN_WIDTH } from '../constants';
import { useListPanelResize } from './useListPanelResize';

const InitialWidth = 300;

describe('useListPanelResize', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('starts at the initial width', () => {
    const { result } = renderResizeHook();

    expect(result.current.width).toBe(InitialWidth);
    expect(result.current.isDragging).toBe(false);
  });

  it('flags dragging while the handle is held', () => {
    const { result } = renderResizeHook();

    act(() => result.current.startResize(mouseEvent(InitialWidth)));

    expect(result.current.isDragging).toBe(true);
  });

  it('resizes by the distance the pointer moves', () => {
    const { result } = renderResizeHook();

    // Grab the handle at the panel's right edge, so the pointer
    // position and the width stay in step
    act(() => result.current.startResize(mouseEvent(InitialWidth)));
    act(() => moveMouseTo(InitialWidth + 50));

    expect(result.current.width).toBe(InitialWidth + 50);
  });

  it('clamps the width to the minimum', () => {
    const { result } = renderResizeHook();

    act(() => result.current.startResize(mouseEvent(InitialWidth)));
    act(() => moveMouseTo(MIN_LIST_COLUMN_WIDTH - 100));

    expect(result.current.width).toBe(MIN_LIST_COLUMN_WIDTH);
  });

  it('clamps the width to the maximum', () => {
    const { result } = renderResizeHook();

    act(() => result.current.startResize(mouseEvent(InitialWidth)));
    act(() => moveMouseTo(MAX_LIST_COLUMN_WIDTH + 100));

    expect(result.current.width).toBe(MAX_LIST_COLUMN_WIDTH);
  });

  it('reports the final width when the drag ends', () => {
    let resizedWidth = 0;

    const { result } = renderResizeHook((width) => {
      resizedWidth = width;
    });

    act(() => result.current.startResize(mouseEvent(InitialWidth)));
    act(() => moveMouseTo(InitialWidth + 50));
    act(() => endDrag());

    expect(resizedWidth).toBe(InitialWidth + 50);
    expect(result.current.isDragging).toBe(false);
  });

  it('stops resizing once the drag has ended', () => {
    const { result } = renderResizeHook();

    act(() => result.current.startResize(mouseEvent(InitialWidth)));
    act(() => endDrag());

    // Pointer movement after the drag no longer resizes the panel
    act(() => moveMouseTo(InitialWidth + 50));

    expect(result.current.width).toBe(InitialWidth);
  });

  it('restores text selection when the drag ends', () => {
    const { result } = renderResizeHook();

    act(() => result.current.startResize(mouseEvent(InitialWidth)));

    expect(document.body.style.userSelect).toBe('none');

    act(() => endDrag());

    expect(document.body.style.userSelect).toBe('');
  });
});

/**
 * Renders the hook at the initial width, reporting resizes to
 * the given callback.
 */
function renderResizeHook(onResizeEnd: (width: number) => void = () => {}) {
  return renderHook(() =>
    useListPanelResize({ initialWidth: InitialWidth, onResizeEnd }),
  );
}

/**
 * A mouse event carrying only the pointer position the hook reads.
 */
function mouseEvent(clientX: number): React.MouseEvent {
  return { clientX } as React.MouseEvent;
}

/**
 * Moves the pointer to a horizontal position on the document.
 */
function moveMouseTo(clientX: number): void {
  document.dispatchEvent(new MouseEvent('mousemove', { clientX }));
}

/**
 * Releases the resize handle.
 */
function endDrag(): void {
  document.dispatchEvent(new MouseEvent('mouseup'));
}
