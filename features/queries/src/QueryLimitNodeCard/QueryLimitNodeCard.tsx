import {
  Queries,
  Query,
  QueryLimitNode,
  QueryNodeCounts,
  updateQueryNode,
} from '@minddrop/queries';
import {
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasNodeConnection,
  CanvasPoint,
} from '@minddrop/ui-canvas';
import { NumberField } from '@minddrop/ui-primitives';
import { QueryNodeShell } from '../QueryNodeShell';

export interface QueryLimitNodeCardProps {
  /**
   * The query being edited.
   */
  query: Query;

  /**
   * The limit node rendered by the card.
   */
  node: QueryLimitNode;

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
 * Renders a limit node with an input for the maximum number of
 * results.
 */
export const QueryLimitNodeCard: React.FC<QueryLimitNodeCardProps> = ({
  query,
  node,
  counts,
  onConnect,
  onConnectRelease,
  resolveConnectTarget,
}) => {
  // Persist a count change, treating cleared inputs as uncapped
  function handleCountChange(count: number | null): void {
    Queries.update(query.id, {
      nodes: updateQueryNode<QueryLimitNode>(query.nodes, node.id, {
        count: count && count > 0 ? Math.floor(count) : 0,
      }),
    });
  }

  return (
    <QueryNodeShell
      queryId={query.id}
      node={node}
      title="queries.nodes.limit"
      inputCount={counts?.input}
      totalInputCount={counts?.inputTotal}
      outputCount={counts?.output}
      hasInputPort
      hasOutputPort
      onConnect={onConnect}
      onConnectRelease={onConnectRelease}
      resolveConnectTarget={resolveConnectTarget}
    >
      {/* Clearable so the empty field, which means uncapped,
          steps up to the minimum and back down to empty */}
      <NumberField
        clearable
        min={1}
        value={node.count > 0 ? node.count : null}
        onValueChange={handleCountChange}
      />
    </QueryNodeShell>
  );
};
