import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionFixtures, Collections } from '@minddrop/collections';
import { query_1 } from '../../test-utils/queries.fixtures';
import {
  Query,
  QueryCollectionFilterNode,
  QueryConnection,
  QueryFilterNode,
  QueryNode,
} from '../../types';
import { compileQueryGraph } from './compileQueryGraph';

const { collection_1, collection_2, collection_virtual_1 } = CollectionFixtures;

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

// A filter node keeping the fixture collection's members
const collectionFilter: QueryCollectionFilterNode = {
  id: 'query-node_collection',
  type: 'collection-filter',
  x: 0,
  y: 0,
  source: 'collection',
  collection: collection_1.id,
  operator: 'is-in',
};

// Builds a graph running the fixture source through the given
// collection filter configuration
function collectionFilterQuery(data: Partial<QueryCollectionFilterNode>) {
  return graphQuery(
    [sourceNode, { ...collectionFilter, ...data }, resultsNode],
    [
      { from: sourceNode.id, to: collectionFilter.id },
      { from: collectionFilter.id, to: resultsNode.id },
    ],
  );
}

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
  beforeEach(() => {
    // Collection filters compile the collection's current items
    Collections.Store.load([collection_1]);
  });

  afterEach(() => {
    Collections.Store.clear();
  });

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

  it('ANDs a collection membership test onto its input scopes', () => {
    const compiled = compileQueryGraph(collectionFilterQuery({}));

    expect(compiled[collectionFilter.id].outputScopes).toEqual([
      {
        databaseId: 'database_objects',
        filter: {
          combinator: 'and',
          filters: [{ operator: 'id-is-one-of', entryIds: collection_1.items }],
        },
      },
    ]);
  });

  it('compiles is-not-in collection filters to a negated membership test', () => {
    const compiled = compileQueryGraph(
      collectionFilterQuery({ operator: 'is-not-in' }),
    );
    const scope = compiled[collectionFilter.id].outputScopes[0];

    expect(scope.filter).toEqual({
      combinator: 'and',
      filters: [{ operator: 'id-is-not-one-of', entryIds: collection_1.items }],
    });
  });

  it('pools every collection for any-collection filters', () => {
    // Virtual collections count as membership, so entries held
    // by another entry's collection property are not orphans.
    // The virtual fixture shares the first collection's items,
    // so give it its own.
    const virtualCollection = {
      ...collection_virtual_1,
      items: ['database-entry_virtual-member'],
    };

    Collections.Store.load([collection_2, virtualCollection]);

    const compiled = compileQueryGraph(
      collectionFilterQuery({ source: 'any-collection', collection: '' }),
    );
    const scope = compiled[collectionFilter.id].outputScopes[0];

    expect(scope.filter).toEqual({
      combinator: 'and',
      filters: [
        {
          operator: 'id-is-one-of',
          entryIds: [
            ...collection_1.items,
            ...collection_2.items,
            ...virtualCollection.items,
          ],
        },
      ],
    });
  });

  it('deduplicates entries held by several collections', () => {
    // A collection holding the same entries as the first
    Collections.Store.load([{ ...collection_2, items: collection_1.items }]);

    const compiled = compileQueryGraph(
      collectionFilterQuery({ source: 'any-collection', collection: '' }),
    );
    const scope = compiled[collectionFilter.id].outputScopes[0];

    expect(scope.filter).toEqual({
      combinator: 'and',
      filters: [{ operator: 'id-is-one-of', entryIds: collection_1.items }],
    });
  });

  it('passes entries through a collection filter without a collection', () => {
    const compiled = compileQueryGraph(
      collectionFilterQuery({ collection: '' }),
    );

    expect(compiled[collectionFilter.id].outputScopes).toEqual([
      { databaseId: 'database_objects', filter: null },
    ]);
  });

  it('passes entries through a collection filter referencing a missing collection', () => {
    const compiled = compileQueryGraph(
      collectionFilterQuery({ collection: 'collection_missing' }),
    );

    expect(compiled[collectionFilter.id].outputScopes).toEqual([
      { databaseId: 'database_objects', filter: null },
    ]);
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
