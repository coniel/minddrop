/**
 * Matches a frontmatter block, which must open on the first line of the
 * document. Anchoring matters: an unanchored pattern matches a `---` pair
 * occurring anywhere in the body, such as a thematic break or a setext
 * heading underline.
 */
const FrontmatterPattern =
  /^---[ \t]*\r?\n([\s\S]*?)(?:\r?\n)?^---[ \t]*(?:\r?\n|$)/m;

export interface ParsedFrontmatter {
  /**
   * The raw YAML source between the fences, or null if the document
   * has no frontmatter.
   */
  source: string | null;

  /**
   * The markdown content following the frontmatter block.
   */
  body: string;
}

/**
 * Splits a markdown document into its frontmatter source and its body.
 *
 * @param content - The markdown content.
 * @returns The frontmatter source and the body.
 */
export function parseFrontmatter(content: string): ParsedFrontmatter {
  // Frontmatter must open on the very first line
  if (!content.startsWith('---')) {
    return { source: null, body: content };
  }

  const match = content.match(FrontmatterPattern);

  // An opening fence without a closing one is not frontmatter
  if (!match) {
    return { source: null, body: content };
  }

  const body = content.slice(match[0].length);

  return {
    source: match[1],
    // Drop the blank line separating the frontmatter from the body
    body: body.startsWith('\n') ? body.slice(1) : body,
  };
}
