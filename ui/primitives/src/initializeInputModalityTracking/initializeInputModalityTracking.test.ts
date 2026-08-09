import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeInputModalityTracking } from './initializeInputModalityTracking';

describe('initializeInputModalityTracking', () => {
  let cleanup: VoidFunction;

  beforeEach(() => {
    cleanup = initializeInputModalityTracking();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not set an input mode until the user interacts', () => {
    expect(getInputMode()).toBeNull();
  });

  it('sets keyboard mode on key press', () => {
    dispatchKeyDown('a');

    expect(getInputMode()).toBe('keyboard');
  });

  it('ignores lone modifier key presses', () => {
    dispatchKeyDown('Shift');

    expect(getInputMode()).toBeNull();
  });

  it('sets pointer mode when the pointer moves', () => {
    dispatchPointerMove(10, 10);

    expect(getInputMode()).toBe('pointer');
  });

  it('ignores pointer move events which do not change position', () => {
    dispatchPointerMove(10, 10);
    dispatchKeyDown('a');

    // Fires at the position the pointer already occupies, as
    // happens when content shifts beneath a stationary pointer
    dispatchPointerMove(10, 10);

    expect(getInputMode()).toBe('keyboard');
  });

  it('removes the listeners and attribute on cleanup', () => {
    dispatchKeyDown('a');

    cleanup();

    expect(getInputMode()).toBeNull();

    dispatchKeyDown('a');

    expect(getInputMode()).toBeNull();
  });
});

/**
 * Returns the input mode currently set on the document element.
 */
function getInputMode(): string | null {
  return document.documentElement.getAttribute('data-input-mode');
}

/**
 * Dispatches a keydown event for the given key on the document.
 */
function dispatchKeyDown(key: string): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

/**
 * Dispatches a pointermove event at the given position on the document.
 */
function dispatchPointerMove(clientX: number, clientY: number): void {
  document.dispatchEvent(
    new MouseEvent('pointermove', { clientX, clientY, bubbles: true }),
  );
}
