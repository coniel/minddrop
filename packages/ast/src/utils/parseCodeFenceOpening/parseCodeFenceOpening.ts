// A fence opening a code block: a run of three or more backticks or tildes,
// followed by its info string
const CodeFenceOpenPattern = /^(`{3,}|~{3,})(.*)$/;

/**
 * Parses the marker of the fence a line opens a code block with. A backtick
 * fence whose info string contains a backtick opens none.
 *
 * @param content - The line with its indentation removed.
 * @returns The fence marker, e.g. three backticks, or null if the line opens no code block.
 */
export function parseCodeFenceOpening(content: string): string | null {
  // Match the fence and the info string after it
  const match = content.match(CodeFenceOpenPattern);

  // Check the line starts with a fence. If not, it opens no code block.
  if (!match) {
    return null;
  }

  const [, marker, infoString] = match;

  // Check if a backtick fence's info string contains a backtick. If so,
  // the line is text rather than a fence.
  if (marker[0] === '`' && infoString.includes('`')) {
    return null;
  }

  return marker;
}
