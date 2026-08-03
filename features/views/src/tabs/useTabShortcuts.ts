import { useEffect } from 'react';
import { activateTabByIndex } from './activateTabByIndex';
import { closeActiveTab } from './closeActiveTab';
import { newTab } from './newTab';

/**
 * Binds global tab keyboard shortcuts for the given set while enabled:
 * new tab (mod+t), close tab (mod+w) and activate the Nth tab
 * (mod+1-9). Unbinds them on unmount or when disabled.
 *
 * @param viewAreaId - The id of the view area the shortcuts act on.
 * @param enabled - Whether the shortcuts are bound.
 */
export function useTabShortcuts(viewAreaId: string, enabled: boolean): void {
  useEffect(() => {
    // Do not bind anything while disabled
    if (!enabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      // Only handle shortcuts modified by the meta or ctrl key
      if (!event.metaKey && !event.ctrlKey) {
        return;
      }

      // Mod+T opens a new tab
      if (event.key === 't') {
        event.preventDefault();
        newTab(viewAreaId);

        return;
      }

      // Mod+W closes the active tab
      if (event.key === 'w') {
        event.preventDefault();
        closeActiveTab(viewAreaId);

        return;
      }

      // Mod+1-9 activates the Nth tab
      const digit = Number(event.key);

      if (Number.isInteger(digit) && digit >= 1 && digit <= 9) {
        event.preventDefault();
        activateTabByIndex(viewAreaId, digit - 1);
      }
    }

    // Bind the handler globally while enabled
    window.addEventListener('keydown', handleKeyDown);

    // Unbind it on unmount or when disabled
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewAreaId, enabled]);
}
