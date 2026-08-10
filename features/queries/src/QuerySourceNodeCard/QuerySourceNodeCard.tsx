import { Databases } from '@minddrop/databases';
import { QueryNodeCounts, QuerySourceNode } from '@minddrop/queries';
import { ContentIcon, Group, Text } from '@minddrop/ui-primitives';
import { QueryNodeShell } from '../QueryNodeShell';
import { SOURCE_FALLBACK_ICON } from '../constants';
import './QuerySourceNodeCard.css';

export interface QuerySourceNodeCardProps {
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
}

/**
 * Renders a source node showing the database whose entries it
 * emits into the graph.
 */
export const QuerySourceNodeCard: React.FC<QuerySourceNodeCardProps> = ({
  node,
  counts,
  onStartConnection,
  onCompleteConnection,
}) => {
  const database = Databases.use(node.database);

  return (
    <QueryNodeShell
      node={node}
      title="queries.nodes.source"
      outputCount={counts?.output}
      hasInputPort={false}
      hasOutputPort
      onStartConnection={onStartConnection}
      onCompleteConnection={onCompleteConnection}
    >
      <Group gap={2} justify="center" className="queries-source-node-database">
        <ContentIcon icon={database?.icon || SOURCE_FALLBACK_ICON} />
        <Text
          size="sm"
          stringText={database?.name || node.database}
          color={database ? 'regular' : 'muted'}
        />
      </Group>
    </QueryNodeShell>
  );
};
