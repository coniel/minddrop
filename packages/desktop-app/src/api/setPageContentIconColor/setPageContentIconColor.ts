import { ContentColor } from '@minddrop/core';
import { UserIconType } from '@minddrop/icons';
import { Page, Pages } from '@minddrop/pages';

/**
 * Sets the color of a page's content-icon if it
 * currently has a content-icon as its icon. Otherwise
 * does nothing.
 *
 * @param page - The page for which to set the icon color.
 * @param color - The color to set.
 */
export async function setPageContentIconColor(
  page: Page,
  color: ContentColor,
): Promise<void> {
  if (page.icon.type !== UserIconType.ContentIcon) {
    return;
  }

  Pages.setIcon(page.path, { ...page.icon, color });
}
