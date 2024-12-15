import { describe, expect, it, vi } from 'vitest';
import { Workspaces } from '@minddrop/workspaces';
import { promptMoveWorkspace } from './promptMoveWorkspace';

const WORKSPACE_PATH = 'path/to/Workspace';

let openResponse: string | null;

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: () => openResponse,
}));

describe('promptMoveWorkspace', () => {
  it('moves the workspace when a dir is selected', async () => {
    vi.spyOn(Workspaces, 'move');

    // Pretend dir was selected
    openResponse = 'new/path';

    // Run the prompt
    await promptMoveWorkspace(WORKSPACE_PATH);

    // Should move the workspace to the new path
    expect(Workspaces.move).toHaveBeenCalledWith(WORKSPACE_PATH, openResponse);
  });

  it('does nothing if no dir was selected', async () => {
    vi.spyOn(Workspaces, 'move');

    // Pretend dir selection was canceled
    openResponse = null;

    // Run the prompt
    await promptMoveWorkspace(WORKSPACE_PATH);

    // Should not attempt to move the workspace
    expect(Workspaces.move).not.toHaveBeenCalled();
  });
});
