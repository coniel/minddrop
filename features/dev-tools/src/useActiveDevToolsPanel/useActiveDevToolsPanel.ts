import { useDevToolsPanels } from '../DevToolsPanelsStore';
import { DevToolsUiState } from '../DevToolsUiState';
import { DevToolsPanelConfig } from '../types';

/**
 * Retrieves the active dev tools panel, falling back to the first
 * registered panel when no panel is active or the active panel is
 * no longer registered.
 *
 * @returns The active panel, or null when no panels are registered.
 */
export function useActiveDevToolsPanel(): DevToolsPanelConfig | null {
  const panels = useDevToolsPanels();
  const activePanelId = DevToolsUiState.useValue('activePanelId');

  return (
    panels.find((panel) => panel.id === activePanelId) ?? panels[0] ?? null
  );
}
