import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { ICONS_TEST_DATA } from '@minddrop/icons';
import { WORKSPACES_TEST_DATA, Workspaces } from '@minddrop/workspaces';
import { cleanup } from '../../test-utils';
import { setWorkspaceContentIconColor } from './setWorkspaceContentIconColor';

const { workspace1, workspace1Icon } = WORKSPACES_TEST_DATA;
const { emojiIconString } = ICONS_TEST_DATA;

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
      ...workspace1Icon,
      color: 'cyan',
    });
  });

  it('does nothing if the workspace does not have a content-icon', async () => {
    // Set the icon color on a workspace with a default icon
    // as its icon.
    await setWorkspaceContentIconColor(
      { ...workspace1, icon: emojiIconString },
      'cyan',
    );

    // Should do nothing
    expect(Workspaces.setIcon).not.toHaveBeenCalled();
  });
});
