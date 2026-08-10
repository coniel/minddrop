import { PropertyType } from '@minddrop/properties';
import { EntityId } from '@minddrop/utils';
import { QueryOperator } from './QueryOperator.types';

export type QueryId = EntityId<'query'>;

export interface Query {
  /**
   * A unique identifier for the query.
   */
  id: QueryId;

  /**
   * The user defined name of the query.
   */
  name: string;

  /**
   * The date the query was created.
   */
  created: Date;

  /**
   * The date the query was last modified.
   */
  lastModified: Date;

  /**
   * The nodes making up the query graph. Always contains a
   * results node.
   */
  nodes: QueryNode[];

  /**
   * The connections between the graph's nodes.
   */
  connections: QueryConnection[];
}

export type QueryNodeType = 'source' | 'filter' | 'sort' | 'limit' | 'results';

interface QueryNodeBase {
  /**
   * A unique identifier for the node, used as the edit target
   * when modifying the graph and as the connection endpoints.
   */
  id: string;

  /**
   * The node's horizontal position on the query canvas.
   */
  x: number;

  /**
   * The node's vertical position on the query canvas.
   */
  y: number;
}

/**
 * A node emitting all entries of a database into the graph.
 */
export interface QuerySourceNode extends QueryNodeBase {
  type: 'source';

  /**
   * The ID of the database whose entries the node emits.
   */
  database: string;
}

/**
 * A node narrowing its input entries by a single property
 * comparison.
 */
export interface QueryFilterNode extends QueryNodeBase {
  type: 'filter';

  /**
   * The property name the filter compares. An empty string
   * until the user picks a property.
   */
  property: string;

  /**
   * The picked property's type, used to compile the comparison.
   * An empty string until the user picks a property.
   */
  propertyType: PropertyType | '';

  /**
   * The comparison operator. An empty string until the user
   * picks an operator.
   */
  operator: QueryOperator | '';

  /**
   * The comparison value. Undefined until set, and unused by
   * value-less operators.
   */
  value?: QueryFilterValue;
}

/**
 * A node adding a sort criterion to its input entries.
 * Successive sort nodes sort by the earlier criteria first.
 */
export interface QuerySortNode extends QueryNodeBase {
  type: 'sort';

  /**
   * The property name to sort by. An empty string until the
   * user picks a property.
   */
  property: string;

  /**
   * The picked property's type, used to compile the sort. An
   * empty string until the user picks a property.
   */
  propertyType: PropertyType | '';

  /**
   * The sort direction.
   */
  direction: 'ascending' | 'descending';
}

/**
 * A node capping the number of query results.
 */
export interface QueryLimitNode extends QueryNodeBase {
  type: 'limit';

  /**
   * The maximum number of results. Zero means no limit.
   */
  count: number;
}

/**
 * The node collecting the query's final results. Every query
 * has exactly one, which cannot be removed.
 */
export interface QueryResultsNode extends QueryNodeBase {
  type: 'results';
}

export type QueryNode =
  | QuerySourceNode
  | QueryFilterNode
  | QuerySortNode
  | QueryLimitNode
  | QueryResultsNode;

/**
 * A directed connection between two query graph nodes, from an
 * output port to an input port.
 */
export interface QueryConnection {
  /**
   * A unique identifier for the connection.
   */
  id: string;

  /**
   * The ID of the node the connection starts from.
   */
  from: string;

  /**
   * The ID of the node the connection leads to.
   */
  to: string;
}

export type QueryFilterValue = string | number | QueryDateValue;

export type QueryDateValue =
  | { type: 'absolute'; date: Date }
  | { type: 'relative'; preset: QueryRelativeDatePreset };

export type QueryRelativeDatePreset =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'one-week-ago'
  | 'one-week-from-now'
  | 'one-month-ago'
  | 'one-month-from-now';
