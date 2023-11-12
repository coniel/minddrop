import { UserIcon, UserIconType } from '@minddrop/icons';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { getWorkspace } from '../getWorkspace';
import { setup, cleanup, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import * as WRITE_WORKSPACE_CONFIG from '../writeWorkspaceConfig';
import { writeWorkspaceConfig } from '../writeWorkspaceConfig';
import { setWorkpaceIcon } from './setWorkpaceIcon';

const icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'blue',
};

describe('setWorkpaceIcon', () => {
  beforeEach(() => {
    setup();

    vi.spyOn(
      WRITE_WORKSPACE_CONFIG,
      'writeWorkspaceConfig',
    ).mockResolvedValue();

    // Load a test workspace into the store
    WorkspacesStore.getState().add(workspace1);
  });

  afterEach(cleanup);

  it('updates the workspace in the store', async () => {
    // Set the icon on a workspace
    await setWorkpaceIcon(workspace1.path, icon);

    // Should update the workspace in the store
    expect(getWorkspace(workspace1.path)?.icon).toEqual(icon);
  });

  it('writes the changes to the workspace config file', async () => {
    // Set the icon on a workspace
    await setWorkpaceIcon(workspace1.path, icon);

    // Should write the config to file
    expect(writeWorkspaceConfig).toHaveBeenCalledWith(workspace1.path);
  });
});
