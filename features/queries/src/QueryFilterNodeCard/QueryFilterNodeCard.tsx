import { useMemo } from 'react';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import {
  MULTISELECT_QUERY_OPERATORS,
  QUERY_OPERATORS_BY_PROPERTY_TYPE,
  Queries,
  Query,
  QueryFilterNode,
  QueryFilterValue,
  QueryNodeCounts,
  QueryOperator,
  VALUE_LESS_QUERY_OPERATORS,
  updateQueryNode,
} from '@minddrop/queries';
import { Select, Stack } from '@minddrop/ui-primitives';
import { QueryNodeMismatchWarning } from '../QueryNodeMismatchWarning';
import { QueryNodeShell } from '../QueryNodeShell';
import { QueryNodeValueInput } from '../QueryNodeValueInput';
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

// Builds operator label translation keys
const operatorI18nKey = createI18nKeyBuilder('queries.operators.');

/**
 * Renders a filter node with property, operator and value
 * inputs. Selectable properties come from the databases
 * upstream of the node.
 */
export const QueryFilterNodeCard: React.FC<QueryFilterNodeCardProps> = ({
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

  // Operators available for the selected property's type
  const operators = getPropertyOperators(propertySchema);

  const operatorOptions = operators.map((operator) => ({
    label: operatorI18nKey(operator),
    value: operator,
  }));

  // Persist a property change, resetting the operator to the
  // new property type's first operator and clearing the value
  function handlePropertyChange(propertyName: string): void {
    const property = properties.find(
      (propertyOption) => propertyOption.name === propertyName,
    );
    const propertyOperators = getPropertyOperators(property);

    Queries.update(query.id, {
      nodes: updateQueryNode<QueryFilterNode>(query.nodes, node.id, {
        property: propertyName,
        propertyType: property?.type || '',
        operator: propertyOperators[0] || '',
        value: undefined,
      }),
    });
  }

  // Persist an operator change, clearing the value when the new
  // operator takes no value
  function handleOperatorChange(operator: QueryOperator): void {
    Queries.update(query.id, {
      nodes: updateQueryNode<QueryFilterNode>(query.nodes, node.id, {
        operator,
        value: VALUE_LESS_QUERY_OPERATORS.has(operator)
          ? undefined
          : node.value,
      }),
    });
  }

  // Persist a value change
  function handleValueChange(value: QueryFilterValue | undefined): void {
    Queries.update(query.id, {
      nodes: updateQueryNode<QueryFilterNode>(query.nodes, node.id, { value }),
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
      selected={selected}
      onStartConnection={onStartConnection}
      onCompleteConnection={onCompleteConnection}
      onRemove={onRemove}
      onBreakConnections={onBreakConnections}
      onConnectNearest={onConnectNearest}
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
          <Select<QueryOperator>
            placeholder="queries.editor.selectOperator"
            options={operatorOptions}
            value={node.operator || undefined}
            onValueChange={handleOperatorChange}
          />
        )}

        {/* Value input for the selected operator */}
        {propertySchema && (
          <QueryNodeValueInput
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

/**
 * Returns the operators available for a property, using the
 * multiselect operator set for multiselect select properties.
 */
function getPropertyOperators(property?: PropertySchema): QueryOperator[] {
  if (!property) {
    return [];
  }

  // Multiselect select properties use membership operators
  if (property.type === 'select' && property.multiselect) {
    return MULTISELECT_QUERY_OPERATORS;
  }

  return QUERY_OPERATORS_BY_PROPERTY_TYPE[property.type];
}
