import { splitWords } from '@minddrop/utils';

/**
 * Converts a search query into an FTS5 `MATCH` expression. Every
 * word matches as a literal prefix.
 *
 * @param query - The search query.
 * @returns The `MATCH` expression, or null if the query has no words.
 */
export function resolveFtsPrefixQuery(query: string): string | null {
  // Split the query into words
  const words = splitWords(query);

  if (!words.length) {
    return null;
  }

  // Quote each word and double the quotes inside it. FTS5 then
  // reads operators and punctuation as literal text. The trailing
  // `*` makes each word a prefix query.
  return words.map((word) => `"${word.replaceAll('"', '""')}"*`).join(' ');
}
