import uFuzzy from '@leeoniya/ufuzzy';

const fuzzy = new uFuzzy();

/**
 * Does something useful.
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
