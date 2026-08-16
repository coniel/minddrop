import { i18n } from '@minddrop/i18n';
import { fuzzySearch } from '@minddrop/utils';
import { BlockMenuItem } from '../getBlockMenuItems';

/**
 * Filters block menu entries by a search query, matched against their
 * translated labels and keywords and ranked by match quality.
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

  const terms = menuItems.map(resolveSearchTerms);

  // Entries are matched back by their search terms, which two entries can
  // share, so each match takes the next entry those terms belong to
  const entries = new Map<string, BlockMenuItem[]>();

  terms.forEach((term, index) => {
    entries.set(term, [...(entries.get(term) || []), menuItems[index]]);
  });

  // Fuzzy search returns the matched terms in ranked order
  return fuzzySearch(terms, query).reduce<BlockMenuItem[]>((result, match) => {
    const matched = entries.get(match)?.shift();

    if (matched) {
      result.push(matched);
    }

    return result;
  }, []);
}

/**
 * Returns the text a menu entry is searched by, being its label along with
 * the other terms it goes by.
 *
 * @param menuItem The menu entry.
 * @returns The entry's search terms.
 */
function resolveSearchTerms(menuItem: BlockMenuItem): string {
  const label = i18n.t(menuItem.label);

  if (!menuItem.keywords) {
    return label;
  }

  return `${label} ${i18n.t(menuItem.keywords)}`;
}
