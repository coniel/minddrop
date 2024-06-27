import {
  FileNode,
  GroupNode,
  LinkNode,
  Node,
  TextNode,
  WidgetNode,
} from './Node.types';

export interface NodeRendererConfig<TNode extends Node = Node> {
  /**
   * A unique id for the renderer. Nodes will use this as their
   * 'display' property to select the renderer to use.
   */
  id: string;

  /**
   * The node type that this renderer will be used for.
   */
  nodeType: TNode['type'];

  /**
   * The component used to render the node.
   */
  component: React.ComponentType<NodeRendererProps<TNode>>;
}

export interface NodeRendererProps<TNode extends Node = Node> {
  /**
   * The node to render.
   */
  node: TNode;
}

export type TextNodeRendererConfig = NodeRendererConfig<TextNode>;
export type TextNodeRendererProps = NodeRendererProps<TextNode>;
export type FileNodeRendererConfig = NodeRendererConfig<FileNode>;
export type FileNodeRendererProps = NodeRendererProps<FileNode>;
export type LinkNodeRendererConfig = NodeRendererConfig<LinkNode>;
export type LinkNodeRendererProps = NodeRendererProps<LinkNode>;
export type GroupNodeRendererConfig = NodeRendererConfig<GroupNode>;
export type GroupNodeRendererProps = NodeRendererProps<GroupNode>;
export type WidgetNodeRendererConfig = NodeRendererConfig<WidgetNode>;
export type WidgetNodeRendererProps = NodeRendererProps<WidgetNode>;
