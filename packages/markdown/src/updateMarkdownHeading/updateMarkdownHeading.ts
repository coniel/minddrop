import { mdastNodesToMarkdown } from '../mdastNodesToMarkdown';
import { parseMarkdown } from '../parseMarkdown';

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
  const nodes = parseMarkdown(markdown);

  // If the first node is a level 1 heading
  // replace its text.
  if (nodes[0].type === 'heading' && nodes[0].depth === 1) {
    const [newHeading] = parseMarkdown(`# ${heading}\n`);
    nodes[0] = newHeading;
  }

  // Convert tokens back to markdown
  return mdastNodesToMarkdown(nodes);
}
