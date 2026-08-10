import { DatabaseId, Databases } from '@minddrop/databases';
import {
  Queries,
  QueryNodeCounts,
  QuerySourceNode,
  updateQueryNode,
} from '@minddrop/queries';
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
 * Renders a source node showing the database whose entries it
 * emits into the graph, or a database search until a database
 * is picked.
 */
export const QuerySourceNodeCard: React.FC<QuerySourceNodeCardProps> = ({
  queryId,
  node,
  counts,
  onStartConnection,
  onCompleteConnection,
  onRemove,
  onBreakConnections,
  onConnectNearest,
  selected,
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
      selected={selected}
      onStartConnection={onStartConnection}
      onCompleteConnection={onCompleteConnection}
      onRemove={onRemove}
      onBreakConnections={onBreakConnections}
      onConnectNearest={onConnectNearest}
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
