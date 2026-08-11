import { DatabaseId, Databases } from '@minddrop/databases';
import {
  Queries,
  QueryNodeCounts,
  QuerySourceNode,
  updateQueryNode,
} from '@minddrop/queries';
import {
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasNodeConnection,
  CanvasPoint,
} from '@minddrop/ui-canvas';
import { ContentIcon, Group, Text } from '@minddrop/ui-primitives';
import { QueryNodeShell } from '../QueryNodeShell';
import { QuerySourcePicker } from '../QuerySourcePicker';
import { SOURCE_FALLBACK_ICON } from '../constants';
import './QuerySourceNodeCard.css';

export interface QuerySourceNodeCardProps {
  /**
   * The ID of the query containing the node.
   */
  queryId: string;

  /**
   * The source node rendered by the card.
   */
  node: QuerySourceNode;

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
 * Renders a source node showing the database whose entries it
 * emits into the graph, or a database search until a database
 * is picked.
 */
export const QuerySourceNodeCard: React.FC<QuerySourceNodeCardProps> = ({
  queryId,
  node,
  counts,
  onConnect,
  onConnectRelease,
  resolveConnectTarget,
}) => {
  const query = Queries.use(queryId);
  const database = Databases.use(node.database);

  // Persist the picked database on the node
  function handleSelectDatabase(databaseId: DatabaseId): void {
    if (!query) {
      return;
    }

    Queries.update(queryId, {
      nodes: updateQueryNode<QuerySourceNode>(query.nodes, node.id, {
        database: databaseId,
      }),
    });
  }

  return (
    <QueryNodeShell
      queryId={queryId}
      node={node}
      title="queries.nodes.source"
      outputCount={counts?.output}
      hasInputPort={false}
      hasOutputPort
      onConnect={onConnect}
      onConnectRelease={onConnectRelease}
      resolveConnectTarget={resolveConnectTarget}
    >
      {/* Database search shown until a database is picked */}
      {!node.database && <QuerySourcePicker onSelect={handleSelectDatabase} />}

      {/* The picked database */}
      {node.database && (
        <Group
          gap={2}
          justify="center"
          className="queries-source-node-database"
        >
          <ContentIcon icon={database?.icon || SOURCE_FALLBACK_ICON} />
          <Text
            size="sm"
            stringText={database?.name || node.database}
            color={database ? 'regular' : 'muted'}
          />
        </Group>
      )}
    </QueryNodeShell>
  );
};
