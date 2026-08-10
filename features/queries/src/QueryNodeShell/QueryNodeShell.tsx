import { TranslationKey } from '@minddrop/i18n';
import { QueryNode } from '@minddrop/queries';
import { Group, Spacer, Text } from '@minddrop/ui-primitives';
import './QueryNodeShell.css';

export interface QueryNodeShellProps {
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
   * output port on its right edge.
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
   * The node's body content.
   */
  children?: React.ReactNode;
}

/**
 * Renders the shared frame of a query graph node: a header with
 * flow count badges and the type label, connection ports on the
 * node's edges, and the node's body content.
 */
export const QueryNodeShell: React.FC<QueryNodeShellProps> = ({
  node,
  title,
  inputCount,
  totalInputCount,
  outputCount,
  hasInputPort,
  hasOutputPort,
  onStartConnection,
  onCompleteConnection,
  children,
}) => {
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

  return (
    <div className="queries-node" onMouseUp={handleMouseUp}>
      <Group gap={2} className="queries-node-header">
        {/* Entries flowing into the node */}
        {hasInputPort && inputCount !== undefined && (
          <Text size="xs" color="muted" className="queries-node-count">
            {formatInputCount(inputCount, totalInputCount)}
          </Text>
        )}

        <Spacer />

        {/* The node's type label */}
        <Text
          size="xs"
          weight="semibold"
          color="muted"
          className="queries-node-title"
          text={title}
        />

        <Spacer />

        {/* Entries flowing out of the node */}
        {hasOutputPort && outputCount !== undefined && (
          <Text size="xs" color="muted" className="queries-node-count">
            {outputCount}
          </Text>
        )}
      </Group>

      {/* The node's content */}
      {children && <div className="queries-node-body">{children}</div>}

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
