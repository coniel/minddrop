import { v4 as uuid } from 'uuid';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { toString } from 'mdast-util-to-string';
import { RootContent } from 'mdast';
import { TopicColumn, TopicContent } from '../types';
import { remove } from 'unist-util-remove';
import { is } from 'unist-util-is';
import { Drop, Drops } from '@minddrop/drops';

export function parseTopic(markdownContent: string): TopicContent {
  let title = '';

  let tree = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(markdownContent);

  // Remove front matter from MD content
  remove(tree, { type: 'yaml' });

  const columnContents: { seperator?: string; content: RootContent[] }[] = [];
  let currentColumn: RootContent[] = [];
  let currentColumnSeperator = '';

  function terminateColumn() {
    columnContents.push({
      seperator: currentColumnSeperator,
      content: currentColumn,
    });
  }

  (tree.children as RootContent[]).forEach((node, index) => {
    // If the first child is a level 1 heading, use
    // it as the topic title.
    if (index === 0 && is(node, { type: 'heading', depth: 1 })) {
      title = toString(node);

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
