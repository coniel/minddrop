import { i18n } from '@minddrop/i18n';
import { fuzzySearch } from '@minddrop/utils';
import { BlockMenuItem } from '../getBlockMenuItems';

/**
 * Filters block menu entries by a search query, matched against
 * their translated labels and ranked by match quality.
 *
 * @param menuItems The entries to filter.
 * @param query The search query.
 * @returns The matching entries.
 */
export function filterBlockMenuItems(
  menuItems: BlockMenuItem[],
  query: string,
): BlockMenuItem[] {
  // An empty query matches everything
  if (!query) {
    return menuItems;
  }

  const labels = menuItems.map((menuItem) => i18n.t(menuItem.label));

  // Fuzzy search returns the matched labels in ranked order
  const matches = fuzzySearch(labels, query);

  // Map the matched labels back onto their entries
  return matches.reduce<BlockMenuItem[]>((result, match) => {
    const index = labels.indexOf(match);

    if (index !== -1) {
      result.push(menuItems[index]);
    }

    return result;
  }, []);
}
