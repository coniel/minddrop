import { useMemo } from 'react';
import { MULTI_VALUE_PROPERTY_TYPES } from '@minddrop/databases';
import {
  Queries,
  Query,
  QueryNodeCounts,
  QuerySortNode,
  updateQueryNode,
} from '@minddrop/queries';
import { Group, Select, SelectOption } from '@minddrop/ui-primitives';
import { QueryNodeMismatchWarning } from '../QueryNodeMismatchWarning';
import { QueryNodeShell } from '../QueryNodeShell';
import { getQueryUpstreamProperties } from '../utils';

export interface QuerySortNodeCardProps {
  /**
   * The query being edited.
   */
  query: Query;

  /**
   * The sort node rendered by the card.
   */
  node: QuerySortNode;

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

// The selectable sort directions
const DIRECTION_OPTIONS: SelectOption<'ascending' | 'descending'>[] = [
  { label: 'queries.editor.ascending', value: 'ascending' },
  { label: 'queries.editor.descending', value: 'descending' },
];

/**
 * Renders a sort node with property and direction pickers.
 * Selectable properties come from the databases upstream of the
 * node, excluding multi-value properties which have no single
 * sortable value.
 */
export const QuerySortNodeCard: React.FC<QuerySortNodeCardProps> = ({
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
  // Sortable properties of the databases feeding the node
  const properties = useMemo(
    () =>
      getQueryUpstreamProperties(query, node.id).filter(
        (property) => !MULTI_VALUE_PROPERTY_TYPES.has(property.type),
      ),
    [query, node.id],
  );

  // Properties selectable as the sort target
  const propertyOptions = properties.map((property) => ({
    stringLabel: property.name,
    value: property.name,
  }));

  // Persist a property change along with its type
  function handlePropertyChange(propertyName: string): void {
    const property = properties.find(
      (propertyOption) => propertyOption.name === propertyName,
    );

    Queries.update(query.id, {
      nodes: updateQueryNode<QuerySortNode>(query.nodes, node.id, {
        property: propertyName,
        propertyType: property?.type || '',
      }),
    });
  }

  // Persist a direction change
  function handleDirectionChange(direction: 'ascending' | 'descending'): void {
    Queries.update(query.id, {
      nodes: updateQueryNode<QuerySortNode>(query.nodes, node.id, {
        direction,
      }),
    });
  }

  return (
    <QueryNodeShell
      queryId={query.id}
      node={node}
      title="queries.nodes.sort"
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
      warning={<QueryNodeMismatchWarning query={query} nodeId={node.id} />}
    >
      <Group gap={2}>
        {/* Property picker */}
        <Select
          placeholder="queries.editor.selectProperty"
          options={propertyOptions}
          emptyMessage="queries.editor.noProperties"
          value={node.property || undefined}
          onValueChange={handlePropertyChange}
        />

        {/* Direction picker */}
        <Select<'ascending' | 'descending'>
          options={DIRECTION_OPTIONS}
          value={node.direction}
          onValueChange={handleDirectionChange}
        />
      </Group>
    </QueryNodeShell>
  );
};
