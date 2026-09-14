import { useMemo } from 'react';
import {
  Filters,
  PropertyFilterOperator,
  PropertyFilterValue,
} from '@minddrop/filters';
import {
  Queries,
  Query,
  QueryFilterNode,
  QueryNodeCounts,
} from '@minddrop/queries';
import {
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasNodeConnection,
  CanvasPoint,
} from '@minddrop/ui-canvas';
import {
  PropertyFilterOperatorSelect,
  PropertyFilterValueInput,
} from '@minddrop/ui-filters';
import { Select, Stack } from '@minddrop/ui-primitives';
import { QueryNodeMismatchWarning } from '../QueryNodeMismatchWarning';
import { QueryNodeShell } from '../QueryNodeShell';
import { getQueryUpstreamProperties } from '../utils';

export interface QueryFilterNodeCardProps {
  /**
   * The query being edited.
   */
  query: Query;

  /**
   * The filter node rendered by the card.
   */
  node: QueryFilterNode;

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
 * Renders a filter node with property, operator and value
 * inputs.
 */
export const QueryFilterNodeCard: React.FC<QueryFilterNodeCardProps> = ({
  query,
  node,
  counts,
  onConnect,
  onConnectRelease,
  resolveConnectTarget,
}) => {
  // Properties of the databases feeding the node
  const properties = useMemo(
    () => getQueryUpstreamProperties(query, node.id),
    [query, node.id],
  );

  // The schema of the selected property
  const propertySchema = properties.find(
    (property) => property.name === node.property,
  );

  // Properties selectable as the filter target
  const propertyOptions = properties.map((property) => ({
    stringLabel: property.name,
    value: property.name,
  }));

  // Persist a property change
  function handlePropertyChange(propertyName: string): void {
    // Find the picked property and its operators
    const property = properties.find(
      (propertyOption) => propertyOption.name === propertyName,
    );
    const propertyOperators = property
      ? Filters.resolveOperators(property)
      : [];

    // Persist the property with its first operator and no value
    Queries.update(query.id, {
      nodes: Queries.updateNode<QueryFilterNode>(query.nodes, node.id, {
        property: propertyName,
        propertyType: property?.type || '',
        operator: propertyOperators[0] || '',
        value: undefined,
      }),
    });
  }

  // Persist an operator change, clearing the value when the new
  // operator takes no value.
  function handleOperatorChange(operator: PropertyFilterOperator): void {
    Queries.update(query.id, {
      nodes: Queries.updateNode<QueryFilterNode>(query.nodes, node.id, {
        operator,
        value: Filters.constants.ValueLessOperators.has(operator)
          ? undefined
          : node.value,
      }),
    });
  }

  // Persist a value change
  function handleValueChange(value: PropertyFilterValue | undefined): void {
    Queries.update(query.id, {
      nodes: Queries.updateNode<QueryFilterNode>(query.nodes, node.id, {
        value,
      }),
    });
  }

  return (
    <QueryNodeShell
      queryId={query.id}
      node={node}
      title="queries.nodes.filter"
      inputCount={counts?.input}
      totalInputCount={counts?.inputTotal}
      outputCount={counts?.output}
      hasInputPort
      hasOutputPort
      onConnect={onConnect}
      onConnectRelease={onConnectRelease}
      resolveConnectTarget={resolveConnectTarget}
      warning={<QueryNodeMismatchWarning query={query} nodeId={node.id} />}
    >
      <Stack gap={2}>
        {/* Property picker */}
        <Select
          placeholder="queries.editor.selectProperty"
          options={propertyOptions}
          emptyMessage="queries.editor.noProperties"
          value={node.property || undefined}
          onValueChange={handlePropertyChange}
        />

        {/* Operator picker for the selected property */}
        {propertySchema && (
          <PropertyFilterOperatorSelect
            property={propertySchema}
            value={node.operator}
            onValueChange={handleOperatorChange}
          />
        )}

        {/* Value input for the selected operator */}
        {propertySchema && (
          <PropertyFilterValueInput
            key={node.property}
            property={propertySchema}
            operator={node.operator}
            value={node.value}
            onChange={handleValueChange}
          />
        )}
      </Stack>
    </QueryNodeShell>
  );
};
