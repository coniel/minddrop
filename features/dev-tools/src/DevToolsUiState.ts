import { DevToolsNamespace } from '@minddrop/dev-tools';
import { createKeyValueStore } from '@minddrop/stores';

export interface DevToolsUiState {
  /**
   * Whether the dev tools are open.
   */
  open: boolean;

  /**
   * ID of the currently active panel. Falls back to the first
   * registered panel when the panel is no longer registered.
   */
  activePanelId: string | null;

  /**
   * Whether the dev tools render in a floating window rather
   * than as a fullscreen overlay.
   */
  windowed: boolean;

  /**
   * Whether the active panel's sidebar is visible.
   */
  sidebarOpen: boolean;

  /**
   * Horizontal position of the floating window, in pixels.
   */
  windowX: number;

  /**
   * Vertical position of the floating window, in pixels.
   */
  windowY: number;

  /**
   * Width of the floating window, in pixels.
   */
  windowWidth: number;

  /**
   * Height of the floating window, in pixels.
   */
  windowHeight: number;
}

const defaultState: DevToolsUiState = {
  open: false,
  activePanelId: null,
  windowed: false,
  sidebarOpen: true,
  windowX: 80,
  windowY: 80,
  windowWidth: 680,
  windowHeight: 480,
};

export const DevToolsUiState = createKeyValueStore<DevToolsUiState>(
  'DevTools:UiState',
  defaultState,
  {
    persistTo: 'app-config',
    // Shared with the event capture, which leaves out the events
    // persisting this state dispatches
    namespace: DevToolsNamespace,
  },
);
