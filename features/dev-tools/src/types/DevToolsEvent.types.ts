/**
 * A dispatched event captured by the dev tools.
 */
export interface DevToolsEventEntry {
  /**
   * Unique identifier of the captured event.
   */
  id: string;

  /**
   * Name the event was dispatched under.
   */
  name: string;

  /**
   * Data the event was dispatched with.
   */
  data: unknown;

  /**
   * Timestamp of the dispatch.
   */
  timestamp: number;
}

/**
 * A node of the tree of event names, where each node is one
 * colon separated segment of the names below it.
 */
export interface EventNameTreeNode {
  /**
   * The node's own name segment.
   */
  segment: string;

  /**
   * Full event name path up to and including this node.
   */
  path: string;

  /**
   * How many events fall under this node, including those of
   * its children.
   */
  count: number;

  /**
   * Nodes for the next segment of the names below this one.
   */
  children: EventNameTreeNode[];
}
