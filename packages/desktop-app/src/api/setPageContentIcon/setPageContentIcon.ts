import { ContentColor } from '@minddrop/core';
import { ContentIconName, UserIconType } from '@minddrop/icons';
import { Pages } from '@minddrop/pages';

/**
 * Sets the provided content-icon as a page's icon.
 *
 * @param path - The page path.
 * @param icon - The name of the content-icon to set.
 * @param color - The icon color.
 */
export function setPageContentIcon(
  path: string,
  icon: ContentIconName,
  color: ContentColor,
): void {
  Pages.setIcon(path, {
    type: UserIconType.ContentIcon,
    icon,
    color,
  });
}
