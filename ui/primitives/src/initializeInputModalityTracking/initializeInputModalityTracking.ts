import { INPUT_MODE_ATTRIBUTE } from '../constants';

// Keys which do not indicate an intent to navigate, and so leave
// the current input mode untouched when pressed on their own
const MODIFIER_KEYS = ['Shift', 'Control', 'Alt', 'Meta'];

/**
 * Tracks whether the user is currently interacting via keyboard or
 * pointer, stamping the mode onto the document element as a
 * `data-input-mode` attribute.
 *
 * Returns a cleanup function which removes the listeners and the
 * attribute.
 */
export function initializeInputModalityTracking(): VoidFunction {
  // The last seen pointer position, used to tell real pointer
  // movement from move events fired by content shifting beneath a
  // stationary pointer
  let lastPointerPosition: { x: number; y: number } | null = null;

  // Sets the input mode on the document element
  function setInputMode(mode: 'keyboard' | 'pointer'): void {
    if (document.documentElement.getAttribute(INPUT_MODE_ATTRIBUTE) === mode) {
      return;
    }

    document.documentElement.setAttribute(INPUT_MODE_ATTRIBUTE, mode);
  }

  // Any key press other than a lone modifier switches to keyboard
  // mode. Typing counts: it filters lists beneath a stationary
  // pointer, moving items in and out from under it.
  function handleKeyDown(event: KeyboardEvent): void {
    if (MODIFIER_KEYS.includes(event.key)) {
      return;
    }

    setInputMode('keyboard');
  }

  // Only actual pointer movement switches back to pointer mode
  function handlePointerMove(event: PointerEvent): void {
    const moved =
      !lastPointerPosition ||
      event.clientX !== lastPointerPosition.x ||
      event.clientY !== lastPointerPosition.y;

    lastPointerPosition = { x: event.clientX, y: event.clientY };

    if (!moved) {
      return;
    }

    setInputMode('pointer');
  }

  // Listen in the capture phase so the mode is up to date before
  // any handler which stops propagation runs
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('pointermove', handlePointerMove, true);

  return () => {
    document.removeEventListener('keydown', handleKeyDown, true);
    document.removeEventListener('pointermove', handlePointerMove, true);
    document.documentElement.removeAttribute(INPUT_MODE_ATTRIBUTE);
  };
}
