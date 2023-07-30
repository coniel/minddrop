import { toString } from 'mdast-util-to-string';
import { RootContent } from '../types';

/**
 * Converts MD AST node(s) into string content.
 *
 *  @param node - A single or array of MD AST nodes.
 *  @returns The string content of the node(s).
 */
export function mdastToString(node: RootContent | RootContent[]): string {
  return toString(node);
}
