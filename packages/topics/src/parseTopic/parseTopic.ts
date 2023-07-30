import { v4 as uuid } from 'uuid';
import { Drops } from '@minddrop/drops';
import { Markdown, RootContent } from '@minddrop/markdown';
import { TopicColumn, TopicContent } from '../types';

export function parseTopic(markdownContent: string): TopicContent {
  let title = '';
  let nodes = Markdown.parse(markdownContent);

  // Remove front matter from MD content
  Markdown.remove(nodes, { type: 'yaml' });

  const columnContents: { seperator?: string; content: RootContent[] }[] = [];
  let currentColumn: RootContent[] = [];
  let currentColumnSeperator = '';

  function terminateColumn() {
    columnContents.push({
      seperator: currentColumnSeperator,
      content: currentColumn,
    });
  }

  nodes.forEach((node, index) => {
    // If the first child is a level 1 heading, use
    // it as the topic title.
    if (index === 0 && Markdown.is(node, { type: 'heading', depth: 1 })) {
      title = Markdown.toString(node);

      return;
    }

    // Node is a column break
    if (node.type === 'thematicBreak') {
      // Create a drop from previous content
      terminateColumn();

      // Get the thematic break's markdown
      currentColumnSeperator =
        (markdownContent.slice(
          node.position?.start.offset || 0,
          node.position?.end.offset || 0,
        ) || '---') + '\n';

      currentColumn = [];

      return;
    }

    // Add the node to the column's content
    currentColumn.push(node);
  });

  // Add the final column to the columns list
  terminateColumn();

  const columns: TopicColumn[] = columnContents.map((column) => ({
    id: uuid(),
    seperator: column.seperator || undefined,
    // Turn column content into drops
    drops: Drops.fromMdast(column.content),
  }));

  return { title, markdown: markdownContent, columns };
}
