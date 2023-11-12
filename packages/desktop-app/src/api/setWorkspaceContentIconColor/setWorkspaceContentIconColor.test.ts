import { describe, afterEach, it, expect, vi, beforeAll } from 'vitest';
import { setWorkspaceContentIconColor } from './setWorkspaceContentIconColor';
import { WORKSPACES_TEST_DATA, Workspaces } from '@minddrop/workspaces';
import { UserIconType } from '@minddrop/icons';
import { cleanup } from '../../test-utils';

const { workspace1 } = WORKSPACES_TEST_DATA;

describe('setWorkspaceContentIconColor', () => {
  beforeAll(() => {
    vi.spyOn(Workspaces, 'setIcon').mockResolvedValue();
  });

  afterEach(cleanup);

  it('sets the icon color if the workspace has a content-icon', async () => {
    // Set the icon color on a workspace with a content-icon
    // as its icon.
    await setWorkspaceContentIconColor(workspace1, 'cyan');

    // Should set the new icon color
    expect(Workspaces.setIcon).toHaveBeenCalledWith(workspace1.path, {
      ...workspace1.icon,
      color: 'cyan',
    });
  });

  it('does nothing if the workspace does not have a content-icon', async () => {
    // Set the icon color on a workspace with a default icon
    // as its icon.
    await setWorkspaceContentIconColor(
      { ...workspace1, icon: { type: UserIconType.Default } },
      'cyan',
    );

    // Should do nothing
    expect(Workspaces.setIcon).not.toHaveBeenCalled();
  });
});
