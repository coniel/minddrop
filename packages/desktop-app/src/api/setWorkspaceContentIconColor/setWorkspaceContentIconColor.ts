import { ContentColor } from '@minddrop/core';
import { UserIconType } from '@minddrop/icons';
import { Workspace, Workspaces } from '@minddrop/workspaces';

/**
 * Sets the color of a workspace's content-icon if it
 * currently has a content-icon as its icon. Otherwise
 * does nothing.
 *
 * @param workspace - The workspace for which to set the icon color.
 * @param color - The color to set.
 */
export async function setWorkspaceContentIconColor(
  workspace: Workspace,
  color: ContentColor,
): Promise<void> {
  if (workspace.icon.type !== UserIconType.ContentIcon) {
    return;
  }

  Workspaces.setIcon(workspace.path, { ...workspace.icon, color });
}
