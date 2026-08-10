import {
  Queries,
  Query,
  QueryLimitNode,
  QueryNodeCounts,
  updateQueryNode,
} from '@minddrop/queries';
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
   * Callback fired when a connection drag starts from the
   * node's output port.
   */
  onStartConnection(nodeId: string, event: React.MouseEvent): void;

  /**
   * Callback fired when a connection drag is released over the
   * node.
   */
  onCompleteConnection(nodeId: string): void;

  /**
   * Callback fired when the node's remove action is pressed.
   */
  onRemove(nodeId: string): void;

  /**
   * Callback fired when the node's break connections action is
   * pressed.
   */
  onBreakConnections(nodeId: string): void;

  /**
   * Callback fired when the node's connect to nearest action
   * is pressed.
   */
  onConnectNearest(nodeId: string): void;

  /**
   * Whether the node is selected on the canvas.
   */
  selected?: boolean;
}

/**
 * Renders a limit node with an input for the maximum number of
 * results.
 */
export const QueryLimitNodeCard: React.FC<QueryLimitNodeCardProps> = ({
  query,
  node,
  counts,
  onStartConnection,
  onCompleteConnection,
  onRemove,
  onBreakConnections,
  onConnectNearest,
  selected,
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
      selected={selected}
      onStartConnection={onStartConnection}
      onCompleteConnection={onCompleteConnection}
      onRemove={onRemove}
      onBreakConnections={onBreakConnections}
      onConnectNearest={onConnectNearest}
    >
      <NumberField
        defaultValue={node.count > 0 ? node.count : undefined}
        onValueChange={handleCountChange}
      />
    </QueryNodeShell>
  );
};
