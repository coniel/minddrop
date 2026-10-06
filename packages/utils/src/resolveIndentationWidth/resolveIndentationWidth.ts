/**
 * Resolves the width of a line's indentation in columns. Tabs advance to
 * the next multiple of the tab width.
 *
 * @param line - The line.
 * @param tabWidth - The spacing of the tab stops, in columns.
 * @param startColumn - The column the line starts at, which tab stops are measured from.
 * @returns The width of the line's leading whitespace.
 */
export function resolveIndentationWidth(
  line: string,
  tabWidth: number,
  startColumn = 0,
): number {
  // The column the indentation reaches so far
  let column = startColumn;

  // Measure the leading whitespace one character at a time
  for (const character of line) {
    // Advance a space by one column
    if (character === ' ') {
      column += 1;

      continue;
    }

    // Advance a tab to the next tab stop
    if (character === '\t') {
      column += tabWidth - (column % tabWidth);

      continue;
    }

    // Stop at the first other character
    break;
  }

  return column - startColumn;
}
