import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspace } from '../getWorkspace';
import { getWorkspaceConfig } from '../getWorkspaceConfig';
import {
  cleanup,
  setup,
  workspace1,
  workspace1ConfigPath,
} from '../test-utils';
import { setWorkpaceIcon } from './setWorkpaceIcon';

const icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'blue',
};
const iconString = Icons.stringify(icon);

const MockFs = initializeMockFileSystem([
  // Workspace 1 config file
  workspace1ConfigPath,
]);

describe('setWorkpaceIcon', () => {
  beforeEach(() => {
    setup();

    // Load a test workspace into the store
    WorkspacesStore.getState().add(workspace1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('updates the workspace in the store', async () => {
    // Set the icon on a workspace
    await setWorkpaceIcon(workspace1.path, icon);

    // Should update the workspace in the store
    expect(getWorkspace(workspace1.path)?.icon).toEqual(iconString);
  });

  it('writes the changes to the workspace config file', async () => {
    // Set the icon on a workspace
    await setWorkpaceIcon(workspace1.path, icon);

    // Get the workspace config
    const config = await getWorkspaceConfig(workspace1.path);

    // Config should contain new icon
    expect(config.icon).toEqual(iconString);
  });
});
