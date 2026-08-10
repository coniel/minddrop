import { QueryNodeCounts, QueryResultsNode } from '@minddrop/queries';
import { ScrollArea } from '@minddrop/ui-primitives';
import { QueryNodeShell } from '../QueryNodeShell';
import { QueryResultsList } from '../QueryResultsList';
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
}

/**
 * Renders the query's permanent results node, showing the
 * entries reaching it as a scrollable list.
 */
export const QueryResultsNodeCard: React.FC<QueryResultsNodeCardProps> = ({
  queryId,
  node,
  counts,
  onStartConnection,
  onCompleteConnection,
}) => (
  <QueryNodeShell
    node={node}
    title="queries.nodes.results"
    inputCount={counts?.input}
    totalInputCount={counts?.inputTotal}
    hasInputPort
    hasOutputPort={false}
    onStartConnection={onStartConnection}
    onCompleteConnection={onCompleteConnection}
  >
    <ScrollArea className="queries-results-node-scroll">
      <QueryResultsList queryId={queryId} />
    </ScrollArea>
  </QueryNodeShell>
);
