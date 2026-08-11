import { Queries, QueryNodeCounts, QueryResultsNode } from '@minddrop/queries';
import {
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasNodeConnection,
  CanvasPoint,
} from '@minddrop/ui-canvas';
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
   * Callback fired when a connection drag from the node's
   * output port is dropped on a target node.
   */
  onConnect?(connection: CanvasNodeConnection): void;

  /**
   * Callback fired when a connection drag from the node's
   * output port is released with no target node.
   */
  onConnectRelease?(point: CanvasPoint, from: CanvasConnectionEnd): void;

  /**
   * Resolves connection drag drop targets against the graph's
   * validity rules, re-anchoring accepted targets onto their
   * input port.
   */
  resolveConnectTarget?(
    from: CanvasConnectionEnd,
    target: CanvasConnectionDragTarget,
  ): CanvasConnectionDragTarget | null;
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
  onConnect,
  onConnectRelease,
  resolveConnectTarget,
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
      onConnect={onConnect}
      onConnectRelease={onConnectRelease}
      resolveConnectTarget={resolveConnectTarget}
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
