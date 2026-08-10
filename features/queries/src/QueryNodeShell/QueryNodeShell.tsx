import { useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { Queries, QueryNode } from '@minddrop/queries';
import {
  Group,
  IconButton,
  Spacer,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { QueryNodeOutputList } from '../QueryNodeOutputList';
import './QueryNodeShell.css';

export interface QueryNodeShellProps {
  /**
   * The ID of the query containing the node.
   */
  queryId: string;

  /**
   * The graph node rendered by the shell.
   */
  node: QueryNode;

  /**
   * The translation key of the node's type label.
   */
  title: TranslationKey;

  /**
   * The number of unique entries flowing into the node. Hidden
   * while counts are loading or when the node has no input port.
   */
  inputCount?: number;

  /**
   * The summed size of the node's incoming flows, counting
   * duplicates arriving over parallel connections. When it
   * exceeds the unique count, the badge reads "total (unique)".
   */
  totalInputCount?: number;

  /**
   * The number of entries flowing out of the node. Hidden while
   * counts are loading or when the node has no output port.
   */
  outputCount?: number;

  /**
   * Whether the node accepts incoming connections, rendering an
   * input port on its left edge.
   */
  hasInputPort: boolean;

  /**
   * Whether the node emits outgoing connections, rendering an
   * output port on its right edge and a toggle for the node's
   * output entries list.
   */
  hasOutputPort: boolean;

  /**
   * Callback fired when a connection drag starts from the
   * node's output port.
   */
  onStartConnection(nodeId: string, event: React.MouseEvent): void;

  /**
   * Callback fired when a connection drag is released over the
   * node, completing the connection into it.
   */
  onCompleteConnection(nodeId: string): void;

  /**
   * Whether the node is selected on the canvas, revealing the
   * action bar above the card.
   */
  selected?: boolean;

  /**
   * Callback fired when the action bar's remove action is
   * pressed. The action bar is hidden when omitted (the results
   * node is permanent).
   */
  onRemove?(nodeId: string): void;

  /**
   * Callback fired when the action bar's break connections
   * action is pressed. Shown while the node has connections.
   */
  onBreakConnections?(nodeId: string): void;

  /**
   * Callback fired when the action bar's connect to nearest
   * action is pressed. Shown while the node has no connections.
   */
  onConnectNearest?(nodeId: string): void;

  /**
   * Warning content rendered at the bottom of the node's body.
   */
  warning?: React.ReactNode;

  /**
   * The node's body content.
   */
  children?: React.ReactNode;
}

/**
 * Renders the shared frame of a query graph node: a header with
 * flow count badges, the type label and an output entries list
 * toggle, connection ports on the node's edges, and the node's
 * body content.
 */
export const QueryNodeShell: React.FC<QueryNodeShellProps> = ({
  queryId,
  node,
  title,
  inputCount,
  totalInputCount,
  outputCount,
  hasInputPort,
  hasOutputPort,
  selected,
  onStartConnection,
  onCompleteConnection,
  onRemove,
  onBreakConnections,
  onConnectNearest,
  warning,
  children,
}) => {
  // Whether the node's output entries list is shown
  const [showOutput, setShowOutput] = useState(false);

  const query = Queries.use(queryId);

  // Whether the node has any connections, switching the action
  // bar between breaking and creating connections
  const hasConnections =
    query?.connections.some(
      (connection) => connection.from === node.id || connection.to === node.id,
    ) || false;

  // Start a connection drag from the output port
  function handleOutputPortMouseDown(event: React.MouseEvent): void {
    // Keep the press from dragging the node or panning the canvas
    event.preventDefault();
    event.stopPropagation();

    onStartConnection(node.id, event);
  }

  // Complete an in-progress connection released over the node
  function handleMouseUp(): void {
    onCompleteConnection(node.id);
  }

  // Toggle the output entries list
  function handleToggleOutput(): void {
    setShowOutput((current) => !current);
  }

  // Remove the node from the graph
  function handleRemove(): void {
    onRemove?.(node.id);
  }

  // Break all of the node's connections
  function handleBreakConnections(): void {
    onBreakConnections?.(node.id);
  }

  // Connect the node to its nearest neighbours
  function handleConnectNearest(): void {
    onConnectNearest?.(node.id);
  }

  return (
    <div className="queries-node" onMouseUp={handleMouseUp}>
      {/* Floating action bar shown while the node is selected */}
      {selected && onRemove && (
        <Group gap={1} className="queries-node-actions">
          {/* Break the node's connections */}
          {hasConnections && (
            <IconButton
              icon="unlink"
              size="sm"
              color="muted"
              label="queries.editor.breakConnections"
              tooltip={{ title: 'queries.editor.breakConnections' }}
              onClick={handleBreakConnections}
            />
          )}

          {/* Connect the unconnected node to its neighbours */}
          {!hasConnections && (
            <IconButton
              icon="link"
              size="sm"
              color="muted"
              label="queries.editor.connectNearest"
              tooltip={{ title: 'queries.editor.connectNearest' }}
              onClick={handleConnectNearest}
            />
          )}

          <IconButton
            icon="trash"
            size="sm"
            color="muted"
            danger="on-hover"
            label="queries.editor.removeNode"
            tooltip={{ title: 'queries.editor.removeNode' }}
            onClick={handleRemove}
          />
        </Group>
      )}

      <Group gap={2} className="queries-node-header">
        {/* The node's type label, centered to the card */}
        <Text
          size="xs"
          weight="semibold"
          color="muted"
          className="queries-node-title"
          text={title}
        />

        {/* Entries flowing into the node */}
        {hasInputPort && inputCount !== undefined && (
          <Text size="xs" color="muted" className="queries-node-count">
            {formatInputCount(inputCount, totalInputCount)}
          </Text>
        )}

        <Spacer />

        {/* Output entries list toggle */}
        {hasOutputPort && (
          <IconButton
            icon={showOutput ? 'eye-closed' : 'eye'}
            size="sm"
            color="muted"
            label="queries.editor.outputEntries"
            active={showOutput}
            className="queries-node-output-toggle"
            onClick={handleToggleOutput}
          />
        )}

        {/* Entries flowing out of the node */}
        {hasOutputPort && outputCount !== undefined && (
          <Text size="xs" color="muted" className="queries-node-count">
            {outputCount}
          </Text>
        )}
      </Group>

      {/* The node's content */}
      {(children || showOutput || warning) && (
        <Stack gap={2} className="queries-node-body">
          {children}

          {/* Entries flowing out of the node */}
          {showOutput && (
            <QueryNodeOutputList queryId={queryId} nodeId={node.id} />
          )}

          {warning}
        </Stack>
      )}

      {/* Incoming connection port */}
      {hasInputPort && (
        <div
          className="queries-node-port queries-node-port-input"
          data-query-node-port="input"
        />
      )}

      {/* Outgoing connection port */}
      {hasOutputPort && (
        <div
          className="queries-node-port queries-node-port-output"
          data-query-node-port="output"
          onMouseDown={handleOutputPortMouseDown}
        />
      )}
    </div>
  );
};

/**
 * Formats an input count badge, appending the unique count when
 * parallel connections deliver duplicate entries.
 */
function formatInputCount(
  inputCount: number,
  totalInputCount?: number,
): string {
  // Duplicates arrived over parallel connections
  if (totalInputCount !== undefined && totalInputCount > inputCount) {
    return `${totalInputCount} (${inputCount})`;
  }

  return `${inputCount}`;
}
