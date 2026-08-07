import { useEffect } from 'react';
import { useDevToolsPanels } from '../DevToolsPanelsStore';
import { DevToolsUiState } from '../DevToolsUiState';
import { closeDevTools } from '../closeDevTools';
import { ReservedShortcutKeys, ToggleDevToolsShortcutKey } from '../constants';
import { openDevTools } from '../openDevTools';
import { snapDevToolsWindow } from '../snapDevToolsWindow';
import { toggleDevTools } from '../toggleDevTools';
import { toggleDevToolsSidebar } from '../toggleDevToolsSidebar';
import { toggleDevToolsWindowed } from '../toggleDevToolsWindowed';
import { useActiveDevToolsPanel } from '../useActiveDevToolsPanel';
import { hasModifierKey, isTypingTarget } from '../utils';

export interface UseDevToolsShortcutsOptions {
  /**
   * Whether the shortcuts help is open.
   */
  helpOpen: boolean;

  /**
   * Callback fired when the shortcuts help is toggled.
   */
  onToggleHelp: () => void;

  /**
   * Callback fired when the shortcuts help is dismissed.
   */
  onCloseHelp: () => void;
}

/**
 * Handles the dev tools keyboard shortcuts: the shell's own keys
 * and the shortcut keys of registered panels.
 *
 * Shortcuts are ignored while a modifier key is held or while
 * typing, leaving app shortcuts and text entry untouched.
 */
export function useDevToolsShortcuts({
  helpOpen,
  onToggleHelp,
  onCloseHelp,
}: UseDevToolsShortcutsOptions): void {
  const panels = useDevToolsPanels();
  const activePanel = useActiveDevToolsPanel();
  const open = DevToolsUiState.useValue('open');
  const windowed = DevToolsUiState.useValue('windowed');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Modified key presses belong to app shortcuts
      if (hasModifierKey(event)) {
        return;
      }

      // Never handle keys typed into a text entry element
      if (isTypingTarget(event.target)) {
        return;
      }

      // Toggle the dev tools
      if (event.key === ToggleDevToolsShortcutKey) {
        event.preventDefault();
        toggleDevTools();

        return;
      }

      const panel = panels.find(
        (item) =>
          item.shortcut === event.key &&
          !ReservedShortcutKeys.includes(item.shortcut),
      );

      // A panel's shortcut key opens its panel, or closes the dev
      // tools when the panel is already active
      if (panel) {
        event.preventDefault();

        if (open && activePanel?.id === panel.id) {
          closeDevTools();
        } else {
          openDevTools(panel.id);
        }

        return;
      }

      // The remaining shortcuts only act on open dev tools
      if (!open) {
        return;
      }

      switch (event.key) {
        // Dismiss the help, or close the dev tools
        case 'Escape':
          event.preventDefault();

          if (helpOpen) {
            onCloseHelp();
          } else {
            closeDevTools();
          }

          break;

        // Toggle the shortcuts help
        case '?':
          event.preventDefault();
          onToggleHelp();

          break;

        // Switch between the fullscreen overlay and the window
        case 'f':
          event.preventDefault();
          toggleDevToolsWindowed();

          break;

        // Toggle the panel sidebar
        case 'a':
          event.preventDefault();
          toggleDevToolsSidebar();

          break;

        // Snap the window to the left of the app window
        case '[':
          if (windowed) {
            event.preventDefault();
            snapDevToolsWindow('left');
          }

          break;

        // Snap the window to the right of the app window
        case ']':
          if (windowed) {
            event.preventDefault();
            snapDevToolsWindow('right');
          }

          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    panels,
    activePanel,
    open,
    windowed,
    helpOpen,
    onToggleHelp,
    onCloseHelp,
  ]);
}
