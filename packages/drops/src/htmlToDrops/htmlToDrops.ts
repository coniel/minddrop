import { Markdown } from '@minddrop/markdown';
import { mdastNodesToDrops } from '../mdastNodesToDrops';
import { Drop } from '../types';

/**
 * Parses HTML into drops.
 *
 * @param html - The HTML to parse.
 * @returns Drops.
 */
export function htmlToDrops(html: string): Drop[] {
  // Parse HTML to markdown
  const markdown = Markdown.fromHtml(html);

  // Parse markdown into MD AST nodes
  const nodes = Markdown.parse(markdown);

  // Convert MD AST to drops
  return mdastNodesToDrops(nodes);
}
