import { useEffect } from 'react';
import { ReservedShortcutKeys } from '../constants';
import { hasModifierKey, isTypingTarget } from '../utils';

/**
 * Handles a single key shortcut for as long as the calling panel
 * is mounted, following the same rules as the shell's shortcuts:
 * ignored while a modifier key is held or while typing.
 *
 * Keys reserved by the shell are ignored.
 *
 * @param key - The key which triggers the handler.
 * @param handler - Callback fired when the key is pressed.
 */
export function useDevToolsShortcut(key: string, handler: VoidFunction): void {
  useEffect(() => {
    // The shell's own keys cannot be taken over by a panel
    if (ReservedShortcutKeys.includes(key)) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Modified key presses belong to app shortcuts
      if (hasModifierKey(event)) {
        return;
      }

      // Never handle keys typed into a text entry element
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === key) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, handler]);
}
