import { Query, QueryConnection, addQueryConnection } from '@minddrop/queries';
import { QUERY_NODE_WIDTHS } from '../../constants';

// Horizontal slack within which candidates count as part of the
// same stack as the nearest node
const STACK_TOLERANCE = 80;

interface NearestCandidate {
  /**
   * The candidate node's ID.
   */
  id: string;

  /**
   * The horizontal gap between the candidate's port and the
   * node's port on the facing side.
   */
  distance: number;
}

/**
 * Connects a node to its nearest neighbours on both sides: the
 * closest node whose output port sits left of the node's input
 * port, and the closest node whose input port sits right of the
 * node's output port. Neighbours within a horizontal tolerance
 * of the nearest one connect along with it as a stack.
 *
 * Connections that would be invalid (into a source, out of the
 * results node, duplicates, cycles) are skipped.
 *
 * @param query - The query to connect the node in.
 * @param nodeId - The ID of the node to connect.
 *
 * @returns The updated connections.
 */
export function connectQueryNodeToNearest(
  query: Query,
  nodeId: string,
): QueryConnection[] {
  const node = query.nodes.find((queryNode) => queryNode.id === nodeId);

  // Nothing to connect without the node
  if (!node) {
    return query.connections;
  }

  let connections = query.connections;

  // Input side: nodes with an output port ending left of the
  // node's input port
  if (node.type !== 'source') {
    const candidates = query.nodes
      .filter(
        (candidate) => candidate.id !== nodeId && candidate.type !== 'results',
      )
      .map((candidate) => ({
        id: candidate.id,
        distance: node.x - (candidate.x + QUERY_NODE_WIDTHS[candidate.type]),
      }))
      .filter((candidate) => candidate.distance >= 0);

    // Connect each stacked neighbour into the node
    connections = connectStack(query, connections, candidates, (id) => ({
      from: id,
      to: nodeId,
    }));
  }

  // Output side: nodes with an input port starting right of the
  // node's output port
  if (node.type !== 'results') {
    const outputX = node.x + QUERY_NODE_WIDTHS[node.type];

    const candidates = query.nodes
      .filter(
        (candidate) => candidate.id !== nodeId && candidate.type !== 'source',
      )
      .map((candidate) => ({
        id: candidate.id,
        distance: candidate.x - outputX,
      }))
      .filter((candidate) => candidate.distance >= 0);

    // Connect the node into each stacked neighbour
    connections = connectStack(query, connections, candidates, (id) => ({
      from: nodeId,
      to: id,
    }));
  }

  return connections;
}

/**
 * Connects the candidates within the stack tolerance of the
 * nearest candidate, returning the updated connections.
 */
function connectStack(
  query: Query,
  connections: QueryConnection[],
  candidates: NearestCandidate[],
  endpoints: (candidateId: string) => { from: string; to: string },
): QueryConnection[] {
  // No neighbours on this side
  if (candidates.length === 0) {
    return connections;
  }

  // The gap to the nearest neighbour, anchoring the stack window
  const nearest = Math.min(
    ...candidates.map((candidate) => candidate.distance),
  );

  let updated = connections;

  // Connect every candidate within the stack window, skipping
  // invalid connections
  candidates
    .filter((candidate) => candidate.distance <= nearest + STACK_TOLERANCE)
    .forEach((candidate) => {
      const { from, to } = endpoints(candidate.id);

      updated = addQueryConnection(
        { ...query, connections: updated },
        from,
        to,
      );
    });

  return updated;
}
