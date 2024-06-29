import { v4 as uuid } from 'uuid';
import {
  FileNode,
  GroupNode,
  LinkNode,
  Node,
  TextNode,
  WidgetNode,
} from './types';
import { TextNodeRendererConfig } from './node-renderer-configs';
import {
  FileNodeRendererConfig,
  LinkNodeRendererConfig,
  TextNodeRendererConfig,
} from './node-renderer-configs';
import { registerNodeRendererConfig } from './NodeRendererConfigsStore';

export { generateNodesFromDataTransfer as fromDataTransfer } from './generateNodesFromDataTransfer';

/**
 * Registers the default node renderer configurations.
 */
export const registerDefaultNodeRendererConfigs = () => {
  registerNodeRendererConfig(FileNodeRendererConfig);
  registerNodeRendererConfig(LinkNodeRendererConfig);
  registerNodeRendererConfig(TextNodeRendererConfig);
};

export {
  registerNodeRendererConfig,
  unregisterNodeRendererConfig,
} from './NodeRendererConfigsStore';

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
    type: 'text',
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
    type: 'file',
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
    type: 'link',
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
    type: 'group',
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
    type: 'widget',
    display,
    data,
  });

/**
 * Checks if a node is a `text` node.
 *
 * @param node - The node to check.
 * @returns `true` if the node is a `text` node, `false` otherwise.
 */
export const isTextNode = (node: Node): node is TextNode =>
  node.type === 'text';

/**
 * Checks if a node is a `file` node.
 *
 * @param node - The node to check.
 * @returns `true` if the node is a `file` node, `false` otherwise.
 */
export const isFileNode = (node: Node): node is FileNode =>
  node.type === 'file';

/**
 * Checks if a node is a `link` node.
 *
 * @param node - The node to check.
 * @returns `true` if the node is a `link` node, `false` otherwise.
 */
export const isLinkNode = (node: Node): node is LinkNode =>
  node.type === 'link';

/**
 * Checks if a node is a `group` node.
 *
 * @param node - The node to check.
 * @returns `true` if the node is a `group` node, `false` otherwise.
 */
export const isGroupNode = (node: Node): node is GroupNode =>
  node.type === 'group';

/**
 * Checks if a node is a `widget` node.
 *
 * @param node - The node to check.
 * @returns `true` if the node is a `widget` node, `false` otherwise.
 */
export const isWidgetNode = (node: Node): node is WidgetNode =>
  node.type === 'widget';
