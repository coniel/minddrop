import {
  BaseNode,
  FileNode,
  GroupNode,
  LinkNode,
  TextNode,
  WidgetNode,
} from './Node.types';

export interface BaseNodeRendererConfig<TNode extends BaseNode = BaseNode> {
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

export interface NodeRendererProps<TNode extends BaseNode = BaseNode> {
  /**
   * The node to render.
   */
  node: TNode;

  /**
   * Callback to update the node.
   */
  onChange: (node: TNode) => void;
}

export type TextNodeRendererConfig = BaseNodeRendererConfig<TextNode>;
export type TextNodeRendererProps = NodeRendererProps<TextNode>;
export type FileNodeRendererConfig = BaseNodeRendererConfig<FileNode>;
export type FileNodeRendererProps = NodeRendererProps<FileNode>;
export type LinkNodeRendererConfig = BaseNodeRendererConfig<LinkNode>;
export type LinkNodeRendererProps = NodeRendererProps<LinkNode>;
export type GroupNodeRendererConfig = BaseNodeRendererConfig<GroupNode>;
export type GroupNodeRendererProps = NodeRendererProps<GroupNode>;
export type WidgetNodeRendererConfig = BaseNodeRendererConfig<WidgetNode>;
export type WidgetNodeRendererProps = NodeRendererProps<WidgetNode>;

export type NodeRendererConfig =
  | TextNodeRendererConfig
  | FileNodeRendererConfig
  | LinkNodeRendererConfig
  | GroupNodeRendererConfig
  | WidgetNodeRendererConfig;
