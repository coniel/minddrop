// The markdown inline link spelling, matched where it has just been
// completed. The destination takes no whitespace or brackets, which is what
// keeps an ordinary bracketed aside from being read as a link.
const InlineLinkPattern = /\[([^[\]]*)\]\(([^\s()]+)\)$/;

export interface TypedLink {
  /**
   * The link's text.
   */
  label: string;

  /**
   * The link's destination.
   */
  url: string;

  /**
   * The length of the markdown which was typed, which is replaced by the
   * link itself.
   */
  length: number;
}

/**
 * Resolves the link a run of text has just been completed with, being
 * markdown's `[text](url)` spelling typed at its end.
 *
 * @param text - The text up to and including the character just typed.
 * @returns The link, or null if the text does not end in one.
 */
export function resolveTypedLink(text: string): TypedLink | null {
  const match = InlineLinkPattern.exec(text);

  if (!match) {
    return null;
  }

  const [source, label, url] = match;

  return {
    // A link typed with no text of its own shows its destination
    label: label || url,
    url,
    length: source.length,
  };
}
