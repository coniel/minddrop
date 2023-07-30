import { is, Test } from 'unist-util-is';
import { RootContent } from '../types';

/**
 * Checks if a node pass a test.
 *
 * @param node - The node to test.
 * @test - unist-util-is compatible test.
 */
export function isMdastNode(node: RootContent, test?: Test): boolean {
  return is(node, test);
}
