import { RefObject, useEffect } from 'react';
import { BaseUiPortalAttribute } from '../../constants';

// The portal root every popup surface renders into
const PopupPortalSelector = `[${BaseUiPortalAttribute}]`;

/**
 * Calls the callback on clicks landing outside the referenced
 * element while enabled.
 *
 * Clicks inside a popup surface count as inside, since menus,
 * pickers and dialogs render in a portal rather than within the
 * element that opened them. So do clicks on a control which removed
 * itself in response to them, such as a button which hides once it
 * has nothing left to act on: by the time the click reaches the
 * document its target is detached, and a detached target can no
 * longer be measured against anything.
 *
 * @param ref - Reference to the element the clicks are measured against.
 * @param onOutsideClick - Callback fired on an outside click.
 * @param enabled - Whether the clicks are being watched.
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleDocumentClick(event: MouseEvent): void {
      if (!ref.current || !(event.target instanceof Element)) {
        return;
      }

      // The target left the DOM as the click was handled
      if (!event.target.isConnected) {
        return;
      }

      if (
        ref.current.contains(event.target) ||
        event.target.closest(PopupPortalSelector)
      ) {
        return;
      }

      onOutsideClick();
    }

    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, [ref, onOutsideClick, enabled]);
}
