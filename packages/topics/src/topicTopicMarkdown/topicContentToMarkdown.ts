import { Markdown, RootContent } from '@minddrop/markdown';
import { TopicContent } from '../types';

/**
 * Converts a topic's content into markdown.
 *
 * @property content - The topic's content.
 * @returns The topic content as markdown.
 */
export function topicContentToMarkdown(content: TopicContent): string {
  // Extract all MD AST nodes from columns into a
  // single array.
  const contentNodes = content.columns.reduce((drops, column) => {
    let content = [...drops];

    // If the column has a seperator (i.e. is not
    // the first column), add a thematic break to
    // the content.
    if (column.seperator) {
      content.push(Markdown.parse('---')[0]);
    }

    // Extract the column's drops' nodes into a
    // single array.
    const dropNodes = column.drops.reduce(
      (dropNodes, drop) => [...dropNodes, ...drop.children],
      [] as RootContent[],
    );

    return [...content, ...dropNodes];
  }, [] as RootContent[]);

  // Convert content nodes into markdown
  const contentMarkdown = Markdown.fromMdast(contentNodes);

  // Add topic title as markdown heading
  return `# ${content.title}\n\n${contentMarkdown}`;
}
