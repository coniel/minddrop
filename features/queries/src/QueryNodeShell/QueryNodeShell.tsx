import { useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { QueryNode } from '@minddrop/queries';
import {
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasNodeConnection,
  CanvasPoint,
  useCanvasConnectionDrag,
} from '@minddrop/ui-canvas';
import {
  Group,
  IconButton,
  Spacer,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { QueryNodeOutputList } from '../QueryNodeOutputList';
import { QUERY_NODE_PORT_Y } from '../constants';
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
   * Callback fired when a connection drag from the output port
   * is dropped on a target node.
   */
  onConnect?(connection: CanvasNodeConnection): void;

  /**
   * Callback fired when a connection drag from the output port
   * is released with no target node.
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
  onConnect,
  onConnectRelease,
  resolveConnectTarget,
  warning,
  children,
}) => {
  // Whether the node's output entries list is shown
  const [showOutput, setShowOutput] = useState(false);

  // Drag-to-connect behaviour for the output port. Releases on
  // the empty canvas open the node type picker, so the preview
  // edge is held until the picker resolves.
  const { getConnectionHandleProps } = useCanvasConnectionDrag({
    nodeId: node.id,
    onConnect,
    onConnectRelease,
    holdPreviewOnRelease: true,
    resolveTarget: resolveConnectTarget,
  });

  // Toggle the output entries list
  function handleToggleOutput(): void {
    setShowOutput((current) => !current);
  }

  return (
    <div className="queries-node">
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

      {/* Outgoing connection port, doubling as the drag-to-connect
          handle anchored at the port height */}
      {hasOutputPort && (
        <div
          className="queries-node-port queries-node-port-output"
          data-query-node-port="output"
          {...getConnectionHandleProps('right', QUERY_NODE_PORT_Y)}
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
