import uFuzzy from '@leeoniya/ufuzzy';

const fuzzy = new uFuzzy();

/**
 * Perform fuzzy search on a list of strings.
 *
 * @param haystack - List of strings to search through.
 * @param needle - The search query.
 * @returns A list of strings that match the search query.
 */
export function fuzzySearch(haystack: string[], needle: string): string[] {
  const [, info, order] = fuzzy.search(haystack, needle);

  if (!order) {
    return [];
  }

  const filtered: string[] = [];

  for (let i = 0; i < order.length; i++) {
    filtered.push(haystack[info.idx[order[i]]]);
  }

  return filtered;
}
