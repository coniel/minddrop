import { ContentColor } from '@minddrop/core';
import { ContentIconName, UserIconType } from '@minddrop/icons';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Sets the provided content-icon as a workspace's icon.
 *
 * @param path - The workspace path.
 * @param icon - The name of the content-icon to set.
 * @param color - The icon color.
 */
export function setWorkspaceContentIcon(
  path: string,
  icon: ContentIconName,
  color: ContentColor,
): void {
  Workspaces.setIcon(path, {
    type: UserIconType.ContentIcon,
    icon,
    color,
  });
}
