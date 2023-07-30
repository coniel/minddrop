import { Test } from 'unist-util-is';
import { remove } from 'unist-util-remove';
import { RootContent } from '../types';

/**
 * Removes all nodes that pass a test from the given nodes.
 *
 * @param nodes - The nodes from which to remove.
 * @test - unist-util-is compatible test.
 */
export function removeMdastNodes(nodes: RootContent[], test?: Test): void {
  const tree = { type: 'root', children: nodes };

  remove(tree, test);
}
