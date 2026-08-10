import { describe, expect, it } from 'vitest';
import { query_1 } from '../../test-utils/queries.fixtures';
import {
  Query,
  QueryConnection,
  QueryFilterNode,
  QueryNode,
} from '../../types';
import { compileQueryGraph } from './compileQueryGraph';

// A second filter node comparing a number property
const amountFilter: QueryFilterNode = {
  id: 'query-node_amount',
  type: 'filter',
  x: 0,
  y: 0,
  property: 'Amount',
  propertyType: 'number',
  operator: 'greater-than',
  value: 5,
};

// Builds a query fixture from nodes and connections
function graphQuery(
  nodes: QueryNode[],
  connections: Omit<QueryConnection, 'id'>[],
): Query {
  return {
    ...query_1,
    nodes,
    connections: connections.map((connection, index) => ({
      ...connection,
      id: `query-connection_${index}`,
    })),
  };
}

// The fixture query's nodes, for composing test graphs
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

describe('compileQueryGraph', () => {
  it('emits a source node database as an unfiltered scope', () => {
    const compiled = compileQueryGraph(query_1);

    expect(compiled[sourceNode.id].outputScopes).toEqual([
      { databaseId: 'database_objects', filter: null },
    ]);
  });

  it('ANDs a filter node condition onto its input scopes', () => {
    const compiled = compileQueryGraph(query_1);

    expect(compiled[filterNode.id].outputScopes).toEqual([
      {
        databaseId: 'database_objects',
        filter: {
          combinator: 'and',
          filters: [
            {
              property: 'Title',
              propertyType: 'title',
              operator: 'text-contains',
              value: 'foo',
            },
          ],
        },
      },
    ]);
  });

  it('chains successive filter nodes with AND', () => {
    const query = graphQuery(
      [sourceNode, filterNode, amountFilter, resultsNode],
      [
        { from: sourceNode.id, to: filterNode.id },
        { from: filterNode.id, to: amountFilter.id },
        { from: amountFilter.id, to: resultsNode.id },
      ],
    );

    const compiled = compileQueryGraph(query);
    const scope = compiled[resultsNode.id].outputScopes[0];

    // The second filter wraps the first filter's group with AND
    expect(scope.filter).toEqual({
      combinator: 'and',
      filters: [
        {
          combinator: 'and',
          filters: [
            {
              property: 'Title',
              propertyType: 'title',
              operator: 'text-contains',
              value: 'foo',
            },
          ],
        },
        {
          property: 'Amount',
          propertyType: 'number',
          operator: 'number-greater-than',
          value: 5,
        },
      ],
    });
  });

  it('ORs parallel branches merging into a node', () => {
    const query = graphQuery(
      [sourceNode, filterNode, amountFilter, resultsNode],
      [
        { from: sourceNode.id, to: filterNode.id },
        { from: sourceNode.id, to: amountFilter.id },
        { from: filterNode.id, to: resultsNode.id },
        { from: amountFilter.id, to: resultsNode.id },
      ],
    );

    const compiled = compileQueryGraph(query);
    const scope = compiled[resultsNode.id].inputScopes[0];

    // Both branch filters combine into a single OR group
    expect(scope.filter).toEqual({
      combinator: 'or',
      filters: [
        {
          combinator: 'and',
          filters: [
            {
              property: 'Title',
              propertyType: 'title',
              operator: 'text-contains',
              value: 'foo',
            },
          ],
        },
        {
          combinator: 'and',
          filters: [
            {
              property: 'Amount',
              propertyType: 'number',
              operator: 'number-greater-than',
              value: 5,
            },
          ],
        },
      ],
    });
  });

  it('keeps scopes of multiple sources separate', () => {
    const secondSource: QueryNode = {
      id: 'query-node_source-b',
      type: 'source',
      x: 0,
      y: 0,
      database: 'database_urls',
    };

    const query = graphQuery(
      [sourceNode, secondSource, resultsNode],
      [
        { from: sourceNode.id, to: resultsNode.id },
        { from: secondSource.id, to: resultsNode.id },
      ],
    );

    const compiled = compileQueryGraph(query);

    expect(compiled[resultsNode.id].outputScopes).toEqual([
      { databaseId: 'database_objects', filter: null },
      { databaseId: 'database_urls', filter: null },
    ]);
  });

  it('passes incomplete filter nodes through unchanged', () => {
    const incompleteFilter: QueryFilterNode = {
      ...amountFilter,
      value: undefined,
    };

    const query = graphQuery(
      [sourceNode, incompleteFilter, resultsNode],
      [
        { from: sourceNode.id, to: incompleteFilter.id },
        { from: incompleteFilter.id, to: resultsNode.id },
      ],
    );

    const compiled = compileQueryGraph(query);

    expect(compiled[resultsNode.id].outputScopes).toEqual([
      { databaseId: 'database_objects', filter: null },
    ]);
  });

  it('accumulates successive sort nodes primary first', () => {
    const primarySort: QueryNode = {
      id: 'query-node_sort-a',
      type: 'sort',
      x: 0,
      y: 0,
      property: 'Title',
      propertyType: 'title',
      direction: 'ascending',
    };
    const secondarySort: QueryNode = {
      id: 'query-node_sort-b',
      type: 'sort',
      x: 0,
      y: 0,
      property: 'Amount',
      propertyType: 'number',
      direction: 'descending',
    };

    const query = graphQuery(
      [sourceNode, primarySort, secondarySort, resultsNode],
      [
        { from: sourceNode.id, to: primarySort.id },
        { from: primarySort.id, to: secondarySort.id },
        { from: secondarySort.id, to: resultsNode.id },
      ],
    );

    const compiled = compileQueryGraph(query);

    expect(compiled[resultsNode.id].sorts).toEqual([
      { property: 'Title', propertyType: 'title', direction: 'ascending' },
      { property: 'Amount', propertyType: 'number', direction: 'descending' },
    ]);
  });

  it('carries the smallest limit along the path', () => {
    const looseLimit: QueryNode = {
      id: 'query-node_limit-a',
      type: 'limit',
      x: 0,
      y: 0,
      count: 20,
    };
    const tightLimit: QueryNode = {
      id: 'query-node_limit-b',
      type: 'limit',
      x: 0,
      y: 0,
      count: 5,
    };

    const query = graphQuery(
      [sourceNode, looseLimit, tightLimit, resultsNode],
      [
        { from: sourceNode.id, to: looseLimit.id },
        { from: looseLimit.id, to: tightLimit.id },
        { from: tightLimit.id, to: resultsNode.id },
      ],
    );

    const compiled = compileQueryGraph(query);

    expect(compiled[resultsNode.id].limit).toBe(5);
  });

  it('compiles unconnected nodes with empty flows', () => {
    const query = graphQuery([sourceNode, filterNode, resultsNode], []);

    const compiled = compileQueryGraph(query);

    expect(compiled[filterNode.id].inputScopes).toEqual([]);
    expect(compiled[filterNode.id].outputScopes).toEqual([]);
    expect(compiled[resultsNode.id].outputScopes).toEqual([]);
  });
});
