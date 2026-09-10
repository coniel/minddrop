import { useCallback, useEffect, useRef } from 'react';
import { BaseUiPortalAttribute } from '../../constants';

// An open popup, either by the trigger holding it open or by the
// popup itself sitting in a portal. Position-opened popups have no
// trigger to mark, so both are looked for.
const OpenPopupSelector = `[data-popup-open], [${BaseUiPortalAttribute}] [data-open]`;

/**
 * Tracks whether a popup was open when the current press began,
 * which makes that press the one dismissing it.
 *
 * Presses are sampled as they start, before the popup closes and
 * takes its mark out of the document with it.
 *
 * @returns A function reporting whether the current press dismissed a popup.
 */
export function usePopupDismissPress(): () => boolean {
  const dismissingRef = useRef(false);

  useEffect(() => {
    function handlePointerDown(): void {
      dismissingRef.current =
        document.querySelector(OpenPopupSelector) !== null;
    }

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () =>
      document.removeEventListener('pointerdown', handlePointerDown, true);
  }, []);

  return useCallback(() => dismissingRef.current, []);
}
