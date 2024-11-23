import { ContentColor } from '@minddrop/core';

export type NodeType = 'text' | 'file' | 'link' | 'group' | 'widget';

export interface BaseNodeData {
  /**
   * A unique identifier for the node.
   */
  id: string;

  /**
   * The node type.
   */
  type: NodeType;

  /**
   * Controls how the node is rendered. If absent,
   * the default rendering behavior is used.
  layout?: string;
   */

  /**
   * The node color.
   */
  color?: ContentColor;
}

/**
 * Text type nodes store text.
 */
export interface TextNode extends BaseNodeData {
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
export interface FileNode extends BaseNodeData {
  type: 'file';

  /**
   * The file name.
   */
  file: string;

  /**
   * A subpath that may link to a heading or a block.
   * Always starts with a '#'.
   */
  subpath?: string;
}

export interface LinkNodeMetadata {
  /**
   * The linked web page title.
   */
  title?: string;

  /**
   * The linked web page description.
   */
  description?: string;

  /**
   * The linked web page image file name.
   */
  image?: string;

  /**
   * The linked web page icon file name.
   */
  icon?: string;
}

/**
 * Link type nodes reference a URL.
 */
export interface LinkNode<TMetadata extends LinkNodeMetadata = LinkNodeMetadata>
  extends BaseNodeData {
  type: 'link';

  /**
   * The link URL.
   */
  url: string;

  /**
   * Linked web page meta data.
   */
  metadata?: TMetadata;
}

/**
 * Group type nodes are used as a visual container for nodes
 * within it.
 */
export interface GroupNode extends BaseNodeData {
  type: 'group';

  /**
   * The IDs of the nodes contained within the group.
   */
  children: string[];

  /**
   * A text label for the group
   */
  label?: string;
}

/**
 * Widget type nodes are used to render interactive content.
 */
export interface WidgetNode extends BaseNodeData {
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
