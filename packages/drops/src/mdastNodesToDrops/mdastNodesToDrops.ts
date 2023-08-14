import { v4 as uuid } from 'uuid';
import { Markdown, RootContent } from '@minddrop/markdown';
import { Drop } from '../types';
import { getDropType } from '../getDropType';

/**
 * Generats drops from MD AST nodes.
 *
 * @param nodes - The MD AST nodes.
 * @returns Drops
 */
export function mdastNodesToDrops(nodes: RootContent[]): Drop[] {
  const drops: Drop[] = [];
  let currentDropChildren: RootContent[] = [];
  let previousLine = 0;

  // Turns `currentDropChildren` into a drop
  function terminateDrop() {
    if (currentDropChildren.length) {
      const dropType = getDropType(currentDropChildren);

      // If a text drops does not begin with a header,
      // prepend one to it.
      if (dropType === 'text' && currentDropChildren[0].type === 'paragraph') {
        currentDropChildren.unshift(Markdown.parse('### ')[0]);
      }

      // Create a drop from its contents
      drops.push({
        id: uuid(),
        type: dropType,
        children: currentDropChildren,
        markdown: Markdown.fromMdast(currentDropChildren),
      });

      // Clear current drop children
      currentDropChildren = [];
    }
  }

  nodes.forEach((node) => {
    // When `true`, the drop is terminated immdiately after
    // node insertion.
    let isSingleNodeDrop = false;

    if (node.type === 'thematicBreak') {
      // Create a drop from previous content
      terminateDrop();

      return;
    }

    // The number of empty lines between this node and
    // the previous one.
    const emptyLinesAbove = (node.position?.start.line || 0) - previousLine - 1;

    // If the node is a level 3 heading, start a new drop
    if (node.type === 'heading' && node.depth === 3) {
      terminateDrop();
    }

    // If there are multiple empty lines above the node,
    // start a new drop.
    if (emptyLinesAbove > 1) {
      terminateDrop();
    }

    // If the node is a level 1 or 2 heading, start a new drop
    if (node.type === 'heading' && node.depth < 3) {
      isSingleNodeDrop = true;
      terminateDrop();
    }

    // If the node is a table, start a new drop
    if (node.type === 'table') {
      isSingleNodeDrop = true;
      terminateDrop();
    }

    if (node.type === 'paragraph') {
      const { children } = node;

      // If the paragraph begins with an image, start a new drop.
      if (children[0].type === 'image') {
        isSingleNodeDrop = true;
        terminateDrop();
      }

      // If the paragraph contains only a single link element as
      // its children, start a new drop.
      if (children[0].type === 'link' && children.length === 1) {
        isSingleNodeDrop = true;
        terminateDrop();
      }
    }

    // Add node to current drop's content
    currentDropChildren.push(node);

    // If the drop is a single node drop, start a new one
    if (isSingleNodeDrop) {
      terminateDrop();
    }

    // Set the last line of the current node as the
    // previous last line.
    previousLine = node.position?.end.line || previousLine;
  });

  // Add the final drop contents to the column
  terminateDrop();

  return drops;
}
