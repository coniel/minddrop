import { ContentColor } from '@minddrop/core';

export enum NodeType {
  /**
   * Text type nodes store text.
   */
  Text = 'text',

  /**
   * File type nodes reference other documents or attachments,
   * such as images, videos, etc.
   */
  File = 'file',

  /**
   * Link type nodes reference a URL.
   */
  Link = 'link',

  /**
   * Group type nodes are used as a visual container for nodes
   * within it.
   */
  Group = 'group',

  /**
   * Widget type nodes are used to render interactive content.
   */
  Widget = 'widget',
}

export interface Node {
  /**
   * A unique identifier for the node.
   */
  id: string;

  /**
   * The type of node.
   */
  type: NodeType;

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

export interface TextNode extends Node {
  type: NodeType.Text;

  /**
   * The text content of the node.
   */
  text: string;
}

export interface FileNode extends Node {
  type: NodeType.File;

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

export interface LinkNode extends Node {
  type: NodeType.Link;

  /**
   * The link URL.
   */
  url: string;
}

export interface GroupNode extends Node {
  type: NodeType.Group;

  /**
   * The IDs of the nodes contained within the group.
   */
  children?: string[];

  /**
   * A text label for the group
   */
  label?: string;
}

export interface WidgetNode extends Node {
  type: NodeType.Widget;

  /**
   * The widget to render.
   */
  display: string;

  /**
   * Stringified JSON data if the widget requires it.
   */
  data?: string;
}
