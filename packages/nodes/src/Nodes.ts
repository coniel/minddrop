import { v4 as uuid } from 'uuid';
import { Node, NodeType, TextNode } from './types';

const removeUndefied = <T extends Node>(node: T): T => {
  Object.keys(node).forEach(
    (key) =>
      node[key as keyof Node] === undefined && delete node[key as keyof Node],
  );

  return node;
};

/**
 * Generates a new text node.
 *
 * @param text - The text content of the node.
 * @param display - The node renderer type to use.
 * @returns A new text node.
 */
export const generateTextNode = (text = '', display?: string): TextNode =>
  removeUndefied({
    type: NodeType.Text,
    id: uuid(),
    text,
    display,
  });

/**
 * Generates a new file node.
 *
 * @param path - The path to the file within the system.
 * @param display - The node renderer type to use.
 * @returns A new file node.
 */
export const generateFileNode = (path = '', display?: string) =>
  removeUndefied({
    type: NodeType.File,
    id: uuid(),
    path,
    display,
  });

/**
 * Generates a new link node.
 *
 * @param url - The URL to link to.
 * @param display - The node renderer type to use.
 * @returns A new link node.
 */
export const generateLinkNode = (url = '', display?: string) =>
  removeUndefied({
    type: NodeType.Link,
    id: uuid(),
    url,
    display,
  });

/**
 * Generates a new group node.
 *
 * @param children - The IDs of the nodes contained within the group.
 * @param display - The node renderer type to use.
 * @returns A new group node.
 */
export const generateGroupNode = (children?: string[], display?: string) =>
  removeUndefied({
    type: NodeType.Group,
    id: uuid(),
    children,
    display,
  });

/**
 * Generates a new widget node.
 *
 * @param display - The node renderer type to use.
 * @param data - The node's JSON data stringified.
 * @returns A new widget node.
 */
export const generateWidgetNode = (display: string, data?: string) =>
  removeUndefied({
    id: uuid(),
    type: NodeType.Widget,
    display,
    data,
  });
