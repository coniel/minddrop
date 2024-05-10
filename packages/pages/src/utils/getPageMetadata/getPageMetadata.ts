import { Page, PageMetadata } from '../../types';

/**
 * Returns a page's metadata.
 *
 * @page - The page.
 * @returns The page metadata.
 */
export function getPageMetadata(page: Page): PageMetadata {
  return {
    icon: page.icon,
  };
}
