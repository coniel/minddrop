import { QueryNodeType } from '@minddrop/queries';

// Drag data key carried by the filter/sort/limit toolbar cards,
// holding the node type to create
export const QueryNodeCardDataKey = 'query-node-card';

// Drag data key marking the source toolbar card, which spawns a
// source picker on drop
export const QuerySourceCardDataKey = 'query-source-card';

// The width of each node type's card on the canvas
export const QUERY_NODE_WIDTHS: Record<QueryNodeType, number> = {
  source: 280,
  filter: 280,
  'collection-filter': 280,
  sort: 280,
  limit: 200,
  results: 300,
};

// The vertical center of a node's ports and edge anchors,
// aligned with the header's flow count labels (8px header
// padding plus half the 16.8px xs text line)
export const QUERY_NODE_PORT_Y = 16;
