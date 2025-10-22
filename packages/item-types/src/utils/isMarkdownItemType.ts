import { ItemTypeConfig } from '../types';

/**
 * Determines whether the given item type uses a markdown file as its primary
 * data file.
 *
 * @param itemType - The item type to check.
 * @returns True if the item type uses a markdown file, false otherwise.
 */
export function isMarkdownItemType(itemType: ItemTypeConfig): boolean {
  return ['markdown', 'url'].includes(itemType.dataType);
}
