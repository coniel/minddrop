import { Queries, QueryNodeCounts, QueryResultsNode } from '@minddrop/queries';
import { Text } from '@minddrop/ui-primitives';
import { QueryNodeOutputList } from '../QueryNodeOutputList';
import { QueryNodeShell } from '../QueryNodeShell';
import './QueryResultsNodeCard.css';

export interface QueryResultsNodeCardProps {
  /**
   * The ID of the query whose results are shown.
   */
  queryId: string;

  /**
   * The results node rendered by the card.
   */
  node: QueryResultsNode;

  /**
   * The node's entry flow counts.
   */
  counts?: QueryNodeCounts;

  /**
   * Callback fired when a connection drag starts from a node's
   * output port. Unused, the results node has no output port.
   */
  onStartConnection(nodeId: string, event: React.MouseEvent): void;

  /**
   * Callback fired when a connection drag is released over the
   * node.
   */
  onCompleteConnection(nodeId: string): void;

  /**
   * Callback fired when a node's remove action is pressed.
   * Unused, the results node is permanent.
   */
  onRemove(nodeId: string): void;

  /**
   * Callback fired when a node's break connections action is
   * pressed. Unused, the results node shows no action bar.
   */
  onBreakConnections(nodeId: string): void;

  /**
   * Callback fired when a node's connect to nearest action is
   * pressed. Unused, the results node shows no action bar.
   */
  onConnectNearest(nodeId: string): void;

  /**
   * Whether the node is selected on the canvas. Unused, the
   * results node shows no action bar.
   */
  selected?: boolean;
}

/**
 * Renders the query's permanent results node, showing the
 * entries reaching it as a searchable list, or a hint while no
 * node is connected into it.
 */
export const QueryResultsNodeCard: React.FC<QueryResultsNodeCardProps> = ({
  queryId,
  node,
  counts,
  onStartConnection,
  onCompleteConnection,
}) => {
  const query = Queries.use(queryId);

  // Whether any node flows into the results node
  const hasInput =
    query?.connections.some((connection) => connection.to === node.id) || false;

  return (
    <QueryNodeShell
      queryId={queryId}
      node={node}
      title="queries.nodes.results"
      inputCount={counts?.input}
      totalInputCount={counts?.inputTotal}
      hasInputPort
      hasOutputPort={false}
      onStartConnection={onStartConnection}
      onCompleteConnection={onCompleteConnection}
    >
      {/* Hint shown before any node is connected */}
      {!hasInput && (
        <Text
          size="sm"
          color="muted"
          text="queries.editor.connectNodes"
          className="queries-results-node-empty"
        />
      )}

      {/* The entries reaching the node */}
      {hasInput && <QueryNodeOutputList queryId={queryId} nodeId={node.id} />}
    </QueryNodeShell>
  );
};
