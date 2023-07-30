import { RootContent } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmToMarkdown } from 'mdast-util-gfm';
import { mathToMarkdown } from 'mdast-util-math';

/**
 * Processes MD AST nodes into markdown.
 *
 * @nodes - MD AST nodes
 * @returns Markdown
 */
export function mdastNodesToMarkdown(nodes: RootContent[]): string {
  return toMarkdown(
    { type: 'root', children: nodes },
    { extensions: [gfmToMarkdown(), mathToMarkdown()], bullet: '-', rule: '-' },
  );
}
