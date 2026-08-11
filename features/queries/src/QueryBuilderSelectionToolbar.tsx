import { Query } from '@minddrop/queries';
import { CanvasSelection } from '@minddrop/ui-canvas';
import { FloatingToolbar, ToolbarIconButton } from '@minddrop/ui-primitives';

export interface QueryBuilderSelectionToolbarProps {
  /**
   * The query being built.
   */
  query: Query;

  /**
   * The canvas selection the toolbar acts on.
   */
  selection: CanvasSelection;

  /**
   * Callback fired when the remove action is pressed.
   */
  onRemove(selection: CanvasSelection): void;

  /**
   * Callback fired with the node's ID when the break
   * connections action is pressed.
   */
  onBreakConnections(nodeId: string): void;

  /**
   * Callback fired with the node's ID when the connect to
   * nearest action is pressed.
   */
  onConnectNearest(nodeId: string): void;
}

/**
 * Renders the actions for the query builder's canvas selection:
 * connection management for a single selected node, and removal
 * of the selected nodes or connections. The permanent results
 * node offers only its connection actions.
 */
export const QueryBuilderSelectionToolbar: React.FC<
  QueryBuilderSelectionToolbarProps
> = ({ query, selection, onRemove, onBreakConnections, onConnectNearest }) => {
  // The single selected node, driving its connection actions
  const singleNodeId =
    selection.type === 'nodes' && selection.ids.length === 1
      ? selection.ids[0]
      : null;

  // Whether the single selected node has any connections,
  // switching between breaking and creating connections
  const hasConnections = query.connections.some(
    (connection) =>
      connection.from === singleNodeId || connection.to === singleNodeId,
  );

  // The permanent results node cannot be removed
  const removable = !(
    selection.type === 'nodes' &&
    selection.ids.every(
      (nodeId) =>
        query.nodes.find((node) => node.id === nodeId)?.type === 'results',
    )
  );

  // Break all of the single selected node's connections
  function handleBreakConnections(): void {
    if (singleNodeId) {
      onBreakConnections(singleNodeId);
    }
  }

  // Connect the single selected node to its neighbours
  function handleConnectNearest(): void {
    if (singleNodeId) {
      onConnectNearest(singleNodeId);
    }
  }

  // Remove the selection from the graph
  function handleRemove(): void {
    onRemove(selection);
  }

  return (
    <FloatingToolbar size="sm" visible>
      {/* Break the single selected node's connections */}
      {singleNodeId && hasConnections && (
        <ToolbarIconButton
          icon="unlink"
          label="queries.editor.breakConnections"
          tooltip={{ title: 'queries.editor.breakConnections' }}
          onClick={handleBreakConnections}
        />
      )}

      {/* Connect the unconnected single selected node */}
      {singleNodeId && !hasConnections && (
        <ToolbarIconButton
          icon="link"
          label="queries.editor.connectNearest"
          tooltip={{ title: 'queries.editor.connectNearest' }}
          onClick={handleConnectNearest}
        />
      )}

      {/* Remove the selected nodes or connections */}
      {removable && (
        <ToolbarIconButton
          icon="trash"
          danger="on-hover"
          label={
            selection.type === 'connections'
              ? 'queries.editor.removeConnection'
              : 'queries.editor.removeNode'
          }
          tooltip={{
            title:
              selection.type === 'connections'
                ? 'queries.editor.removeConnection'
                : 'queries.editor.removeNode',
          }}
          onClick={handleRemove}
        />
      )}
    </FloatingToolbar>
  );
};
