// An inline code span: a run of backticks, closed by the next run of the
// same length.
const CodeSpanPattern = /(?<!`)(`+)(?!`).*?(?<!`)\1(?!`)/g;

/**
 * Resolves the runs of a line of markdown text either side of its inline
 * code spans. Empty runs are left out.
 *
 * @param text - The line of text.
 * @returns The runs of text outside code spans.
 */
export function resolveTextRunsOutsideCodeSpans(text: string): string[] {
  // Split the text around the code spans
  return text.split(CodeSpanPattern).filter(
    // Skip the captured backtick runs and empty text. Splitting on a
    // pattern with a capture group returns the captured runs at the odd
    // indexes.
    (run, index) => index % 2 === 0 && run !== '',
  );
}
