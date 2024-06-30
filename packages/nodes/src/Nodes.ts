import { v4 as uuid } from 'uuid';
import {
  FileNode,
  GroupNode,
  LinkNode,
  Node,
  TextNode,
  WidgetNode,
} from './types';
import {
  FileNodeRendererConfig,
  LinkNodeRendererConfig,
  TextNodeRendererConfig,
} from './node-renderer-configs';
import { registerNodeRendererConfig } from './NodeRendererConfigsStore';
import { classifyFileNode } from './classifyFileNode';
import { classifyTextNode } from './classifyTextNode';
import { classifyLinkNode } from './classifyLinkNode';

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

export {
  registerNodeClassifierConfig as registerClassifier,
  unregisterNodeClassifierConfig as unregisterClassifier,
} from './NodeClassifierConfigsStore';

const removeUndefied = <T extends Node>(node: T): T => {
  Object.keys(node).forEach(
    (key) =>
      node[key as keyof Node] === undefined && delete node[key as keyof Node],
  );

  return node;
};

/**
 * Generates a new text node. If no 'display' value is provided, it will be
 * classified using registered text node classifiers.
 *
 * @param text - The text content of the node.
 * @param display - The node renderer type to use.
 * @returns A new text node.
 */
export const generateTextNode = (text = '', display = 'text'): TextNode => {
  const node: TextNode = {
    type: 'text',
    id: uuid(),
    text,
    display,
  };

  if (node.display === 'text') {
    node.display = classifyTextNode(node);
  }

  return node;
};

/**
 * Generates a new file node. If no 'display' value is provided, it will be
 * classified using registered file node classifiers.
 *
 *
 * @param path - The path to the file within the system.
 * @param display - The node renderer type to use.
 * @returns A new file node.
 */
export const generateFileNode = (
  path: string | null = null,
  display = 'file',
): FileNode => {
  const node: FileNode = {
    type: 'file',
    id: uuid(),
    path,
    display,
  };

  if (node.display === 'file') {
    node.display = classifyFileNode(node);
  }

  return node;
};

/**
 * Generates a new link node. If no 'display' value is provided, it will be
 * classified using registered link node classifiers.
 *
 * @param url - The URL to link to.
 * @param display - The node renderer type to use.
 * @returns A new link node.
 */
export const generateLinkNode = (
  url: string | null = null,
  display = 'link',
): LinkNode => {
  const node: LinkNode = {
    type: 'link',
    id: uuid(),
    url,
    display,
  };

  if (node.display === 'link') {
    node.display = classifyLinkNode(node);
  }

  return node;
};

/**
 * Generates a new group node.
 *
 * @param children - The IDs of the nodes contained within the group.
 * @param display - The node renderer type to use.
 * @returns A new group node.
 */
export const generateGroupNode = (
  children: string[],
  display = 'group',
): GroupNode => ({
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
export const generateWidgetNode = (
  display: string,
  data?: string,
): WidgetNode =>
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
