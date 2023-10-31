import { FileNotFoundError, JsonParseError } from '@minddrop/core';
import { Workspaces } from '@minddrop/workspaces';
import { AppUiState } from '../../AppUiState';

/**
 * Initializes workspaces by loading them from the workspaces
 * config file.
 *
 * If the file does not exist, could not be parsed, or
 * contains no workspaces, set the view to
 * 'create-first-workspace'.
 *
 * If there is no valid workspace (missing all workspace dirs),
 * sets the view to 'no-valid-workspace'.
 */
export async function initializeWorkspaces() {
  try {
    // Load workspaces from the workspaces config file
    await Workspaces.load();
  } catch (error) {
    // Failed to load workspaces config file. Open the
    // 'create-first-workspace' view which will re-initialize
    // the config file.
    if (error instanceof FileNotFoundError || error instanceof JsonParseError) {
      AppUiState.set('view', 'create-first-workspace');
    }
  }

  if (Workspaces.getAll().length === 0) {
    // No workspaces, open 'create-first-workspace' view
    AppUiState.set('view', 'create-first-workspace');
  } else if (!Workspaces.hasValidWorkspace()) {
    // No valid workspace, open 'no-valid-workspace' view
    AppUiState.set('view', 'no-valid-workspace');
  }
}
