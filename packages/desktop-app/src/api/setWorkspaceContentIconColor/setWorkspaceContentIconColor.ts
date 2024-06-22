import { ContentColor } from '@minddrop/core';
import { Icons } from '@minddrop/icons';
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
  const icon = Icons.parse(workspace.icon);

  if (!icon || !Icons.isContentIcon(icon)) {
    return;
  }

  Workspaces.setIcon(workspace.path, { ...icon, color });
}
