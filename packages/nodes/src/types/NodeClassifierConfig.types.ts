import { FileNode, LinkNode, Node, TextNode } from './Node.types';

export interface BaseNodeClassifierConfig<TNode extends Node = Node> {
  /**
   * The ID of the config. Useful for unregistering.
   */
  id: string;

  /**
   * The node type this classifier will be applied to.
   */
  nodeType: TNode['type'];

  /**
   * The display value applied to a node when the classifier
   * returns a match.
   */
  display: string;
}

export interface FileNodeClassifierConfig
  extends BaseNodeClassifierConfig<FileNode> {
  /**
   * The file extensions that the classifier will match.
   */
  fileTypes: string[];
}

export interface LinkNodeClassifierConfig
  extends BaseNodeClassifierConfig<LinkNode> {
  /**
   * Links containing one of these patterns will return a match.
   *
   * Patterns should make use of wildcards to match non-specific parts of the URL.
   * E.g. `*.google.com/maps/*` will match any URL containing `google.com/maps/`.
   */
  patterns?: string[];

  /**
   * A function that can be used for more advanced matching.
   *
   * @param node - The link node to match.
   * @returns True if the node matches the classifier, false otherwise.
   */
  callback?: (node: LinkNode) => boolean;
}

export interface TextNodeClassifierConfig
  extends BaseNodeClassifierConfig<TextNode> {
  /**
   * A funtion which receives a text node and returns true if the node
   * matches the classifier, false otherwise.
   *
   * @param node - The text node to match.
   * @returns True if the node matches the classifier, false otherwise.
   */
  callback: (node: TextNode) => boolean;
}

export type NodeClassifierConfig =
  | FileNodeClassifierConfig
  | LinkNodeClassifierConfig
  | TextNodeClassifierConfig;
