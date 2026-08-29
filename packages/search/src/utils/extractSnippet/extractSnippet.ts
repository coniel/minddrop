import { highlightAllMatches } from '../highlightAllMatches';

// Number of words to show before and after the matched term
const SNIPPET_CONTEXT_WORDS = 5;

/**
 * Extracts a snippet of text around the first occurrence of
 * the matched term, with a few words of context on each side.
 * Wraps the matched portions in highlight markers. Returns the
 * full text unchanged when no term matches.
 *
 * @param text - The text to extract the snippet from.
 * @param terms - The matching terms to centre and highlight.
 * @returns The highlighted snippet.
 */
export function extractSnippet(text: string, terms: string[]): string {
  const lowerText = text.toLowerCase();

  // Find the position of the first matching term for snippet centering
  const matchIndex = terms.reduce((earliest, term) => {
    const index = lowerText.indexOf(term);

    if (index === -1) {
      return earliest;
    }

    return earliest === -1 ? index : Math.min(earliest, index);
  }, -1);

  // No term matched, return the text as-is
  if (matchIndex === -1) {
    return text;
  }

  // Split the full text into words, tracking each word's
  // start position so we can find which word contains the match
  const words: { word: string; start: number }[] = [];
  const wordPattern = /\S+/g;
  let wordMatch: RegExpExecArray | null;

  while ((wordMatch = wordPattern.exec(text)) !== null) {
    words.push({ word: wordMatch[0], start: wordMatch.index });
  }

  // Find the word index that contains the match start position
  let matchWordIndex = 0;

  for (let i = 0; i < words.length; i++) {
    if (words[i].start + words[i].word.length > matchIndex) {
      matchWordIndex = i;
      break;
    }
  }

  // Calculate the window of words to include
  const windowStart = Math.max(0, matchWordIndex - SNIPPET_CONTEXT_WORDS);
  const windowEnd = Math.min(
    words.length,
    matchWordIndex + SNIPPET_CONTEXT_WORDS + 1,
  );

  // Build the snippet from the word window
  const snippetWords = words
    .slice(windowStart, windowEnd)
    .map((entry) => entry.word);
  const snippet = snippetWords.join(' ');

  // Highlight all matching terms within the snippet
  return highlightAllMatches(snippet, terms);
}
