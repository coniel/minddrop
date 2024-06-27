import { ContentColor } from '@minddrop/core';

export type NodeType = 'text' | 'file' | 'link' | 'group' | 'widget';

export interface BaseNode {
  /**
   * A unique identifier for the node.
   */
  id: string;

  /**
   * The type of node.
   */
  type: 'text' | 'file' | 'link' | 'group' | 'widget';

  /**
   * Controls how the node is rendered. If absent,
   * the default rendering behavior is used.
   */
  display?: string;

  /**
   * The node color.
   */
  color?: ContentColor;
}

/**
 * Text type nodes store text.
 */
export interface TextNode extends BaseNode {
  type: 'text';

  /**
   * The text content of the node.
   */
  text: string;
}

/**
 * File type nodes reference other documents or attachments,
 * such as images, videos, etc.
 */
export interface FileNode extends BaseNode {
  type: 'file';

  /**
   * The path to the file within the system.
   */
  path: string;

  /**
   * A subpath that may link to a heading or a block.
   * Always starts with a '#'.
   */
  subpath?: string;
}

/**
 * Link type nodes reference a URL.
 */
export interface LinkNode extends BaseNode {
  type: 'link';

  /**
   * The link URL.
   */
  url: string;
}

/**
 * Group type nodes are used as a visual container for nodes
 * within it.
 */
export interface GroupNode extends BaseNode {
  type: 'group';

  /**
   * The IDs of the nodes contained within the group.
   */
  children?: string[];

  /**
   * A text label for the group
   */
  label?: string;
}

/**
 * Widget type nodes are used to render interactive content.
 */
export interface WidgetNode extends BaseNode {
  type: 'widget';

  /**
   * The widget to render.
   */
  display: string;

  /**
   * Stringified JSON data if the widget requires it.
   */
  data?: string;
}

export type Node = TextNode | FileNode | LinkNode | GroupNode | WidgetNode;
