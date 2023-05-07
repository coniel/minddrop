import { parseMarkdown } from '../parseMarkdown';
import { tokensToMarkdown } from '../tokensToMarkdown';

/**
 * Updates the heading of a markdown document.
 *
 * @param markdown - The markdown document.
 * @param heading - The new heading text.
 * @returns The updated markdown document.
 */
export function updateMarkdownHeading(
  markdown: string,
  heading: string,
): string {
  // Parse the markdown
  const tokens = parseMarkdown(markdown);

  // If the first token is a level 1 heading
  // replace its text.
  if (tokens[0].type === 'heading') {
    tokens[0].raw = `# ${heading}\n\n`;
  }

  // Convert tokens back to markdown
  return tokensToMarkdown(tokens);
}
