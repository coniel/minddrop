import { EventNameTreeNode } from '../../types';

interface CountedName {
  /**
   * The event name.
   */
  name: string;

  /**
   * How many times the name occurred.
   */
  count: number;
}

/**
 * Builds a tree of the colon separated segments of the given event
 * names, where each node counts the names below it.
 *
 * @param names - The event names to build the tree from.
 * @returns The root nodes of the tree, in the order first seen.
 */
export function buildEventNameTree(names: string[]): EventNameTreeNode[] {
  const counted = countNames(names);
  const roots: EventNameTreeNode[] = [];

  for (const { name, count } of counted) {
    let siblings = roots;
    let path = '';

    // Walk the name's segments, creating the nodes which do not
    // exist yet and counting the name into each of them
    for (const segment of name.split(':')) {
      path = path ? `${path}:${segment}` : segment;

      let node = siblings.find((sibling) => sibling.segment === segment);

      if (!node) {
        node = { segment, path, count: 0, children: [] };
        siblings.push(node);
      }

      node.count += count;
      siblings = node.children;
    }
  }

  return roots;
}

/**
 * Counts how often each name occurs, keeping the order in which
 * the names were first seen.
 */
function countNames(names: string[]): CountedName[] {
  const counts = new Map<string, number>();

  for (const name of names) {
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()].map(([name, count]) => ({ name, count }));
}
