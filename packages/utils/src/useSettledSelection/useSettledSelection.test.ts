import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useSettledSelection } from './useSettledSelection';

// The paragraph whose text is selected
let paragraph: HTMLParagraphElement;

/**
 * Resolves a selection to its text, or null when it is collapsed.
 *
 * @param selection - The DOM selection.
 * @returns The selected text, or null for none.
 */
function resolveText(selection: Selection | null): string | null {
  return selection && !selection.isCollapsed ? selection.toString() : null;
}

/**
 * Selects the paragraph's first `length` characters and dispatches a
 * `selectionchange` event, as the browser does when a selection grows.
 *
 * @param length - The number of characters to select.
 */
function selectText(length: number) {
  const range = document.createRange();

  range.setStart(paragraph.firstChild!, 0);
  range.setEnd(paragraph.firstChild!, length);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
}

/**
 * Clears the selection and dispatches a `selectionchange` event.
 */
function clearSelection() {
  window.getSelection()!.removeAllRanges();
  document.dispatchEvent(new Event('selectionchange'));
}

describe('useSettledSelection', () => {
  beforeEach(() => {
    paragraph = document.createElement('p');
    paragraph.textContent = 'Selected text';
    document.body.appendChild(paragraph);
  });

  afterEach(() => {
    window.getSelection()!.removeAllRanges();
    paragraph.remove();
  });

  it('returns a selection made without the mouse as it changes', () => {
    const { result } = renderHook(() => useSettledSelection(resolveText));

    act(() => selectText(8));

    expect(result.current).toBe('Selected');
  });

  it('returns no selection while the mouse button is held', () => {
    const { result } = renderHook(() => useSettledSelection(resolveText));

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
      selectText(8);
    });

    expect(result.current).toBeNull();
  });

  it('returns the selection once the mouse button is released', () => {
    const { result } = renderHook(() => useSettledSelection(resolveText));

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
      selectText(8);
      document.dispatchEvent(new MouseEvent('mouseup'));
    });

    expect(result.current).toBe('Selected');
  });

  it('returns a cleared selection while the mouse button is held', () => {
    const { result } = renderHook(() => useSettledSelection(resolveText));

    act(() => selectText(8));
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
      clearSelection();
    });

    expect(result.current).toBeNull();
  });
});
