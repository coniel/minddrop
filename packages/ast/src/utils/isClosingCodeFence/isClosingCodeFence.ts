// A closing fence: a run of three or more backticks or tildes, with nothing
// after it.
const CodeFenceClosePattern = /^(`{3,}|~{3,})[ \t]*$/;

/**
 * Checks whether a line's content closes the fenced code block opened by a
 * fence marker: a fence of the same character, at least as long. The
 * line's indentation is not checked.
 *
 * @param content - The line with its indentation removed.
 * @param marker - The fence marker which opened the code block, e.g. three backticks.
 * @returns Whether the line closes the code block.
 */
export function isClosingCodeFence(content: string, marker: string): boolean {
  // Match the content as a bare fence
  const closing = content.match(CodeFenceClosePattern);

  // Check the content is a bare fence. If not, it closes nothing.
  if (!closing) {
    return false;
  }

  // Check the fence is the same character and at least as long
  return closing[1][0] === marker[0] && closing[1].length >= marker.length;
}
