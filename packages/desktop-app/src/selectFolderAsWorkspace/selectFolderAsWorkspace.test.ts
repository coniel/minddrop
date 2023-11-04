import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Workspaces, WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import { setup, cleanup } from '../test-utils';
import { selectFolderAsWorkspace } from './selectFolderAsWorkspace';

const { workspace1 } = WORKSPACES_TEST_DATA;

// Response returned by the file selection dialog
let dirSelectionDialogResponse: string | null = null;

vi.mock('@tauri-apps/api/dialog', () => ({
  open: async () => dirSelectionDialogResponse,
}));

describe('selectFolderAsWorkspace', () => {
  vi.spyOn(Workspaces, 'add').mockImplementation(async () => workspace1);

  beforeEach(setup);

  afterEach(cleanup);

  it('adds the selected dir as a workspace and returns it', async () => {
    // Pretend user selected a dir
    dirSelectionDialogResponse = '/path/to/workspace';

    // Open (and select) folder selection
    const workspace = await selectFolderAsWorkspace();

    // Should add the folder as a workspace
    expect(Workspaces.add).toHaveBeenCalledWith(dirSelectionDialogResponse);
    // Should return the workspace
    expect(workspace).toEqual(workspace1);
  });

  it('returns null when dir selection is canceled', async () => {
    // Pretend user canceled folder selection
    dirSelectionDialogResponse = null;

    // Open (and cancel) folder selection
    const workspace = await selectFolderAsWorkspace();

    // Should return null
    expect(workspace).toBeNull();
  });
});
