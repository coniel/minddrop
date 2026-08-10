import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import {
  Query,
  QueryConnection,
  QueryFilterNode,
  QueryFixtures,
  QueryNode,
} from '@minddrop/queries';
import { cleanup, setup } from '../../test-utils';
import { getQueryMismatchedConnectionIds } from './getQueryMismatchedConnectionIds';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// The fixture query's nodes, connected source → filter → results
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

// A filter matching a property of the object database
const matchingFilter: QueryFilterNode = {
  ...(filterNode as QueryFilterNode),
  property: 'Content',
  propertyType: 'formatted-text',
};

// A filter for a property missing from the object database
const invalidFilter: QueryFilterNode = {
  ...matchingFilter,
  id: 'query-node_filter-invalid',
  property: 'Domain',
  propertyType: 'text',
};

// Builds a query fixture from nodes and connections
function graphQuery(
  nodes: QueryNode[],
  connections: Omit<QueryConnection, 'id'>[],
): Query {
  return {
    ...query_1,
    nodes,
    connections: connections.map((connection) => ({
      ...connection,
      id: `${connection.from}--${connection.to}`,
    })),
  };
}

describe('getQueryMismatchedConnectionIds', () => {
  beforeEach(() => {
    setup();

    // Load the source databases
    Databases.Store.load([objectDatabase, urlDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('flags the entire trail into a chained invalid filter', () => {
    // source → matching filter → invalid filter → results
    const query = graphQuery(
      [sourceNode, matchingFilter, invalidFilter, resultsNode],
      [
        { from: sourceNode.id, to: matchingFilter.id },
        { from: matchingFilter.id, to: invalidFilter.id },
        { from: invalidFilter.id, to: resultsNode.id },
      ],
    );

    const mismatched = getQueryMismatchedConnectionIds(query);

    // The trail up to the invalid filter is flagged, the
    // connection out of it is not
    expect(mismatched).toEqual(
      new Set([
        `${sourceNode.id}--${matchingFilter.id}`,
        `${matchingFilter.id}--${invalidFilter.id}`,
      ]),
    );
  });

  it('leaves parallel matching branches unflagged', () => {
    // A second source whose database contains the filter's
    // property, connected into the same filter
    const urlSource: QueryNode = {
      id: 'query-node_source-url',
      type: 'source',
      x: 0,
      y: 0,
      database: urlDatabase.id,
    };
    const urlFilter: QueryFilterNode = {
      ...matchingFilter,
      id: 'query-node_filter-url',
      property: 'URL',
      propertyType: 'url',
    };

    // Both branches merge into a filter matching only the URL
    // database's property
    const query = graphQuery(
      [sourceNode, urlSource, urlFilter, resultsNode],
      [
        { from: sourceNode.id, to: urlFilter.id },
        { from: urlSource.id, to: urlFilter.id },
        { from: urlFilter.id, to: resultsNode.id },
      ],
    );

    const mismatched = getQueryMismatchedConnectionIds(query);

    // Only the object database branch mismatches the URL filter
    expect(mismatched).toEqual(new Set([`${sourceNode.id}--${urlFilter.id}`]));
  });

  it('flags only the mismatched branch of a merge before the filter', () => {
    // A second source whose database contains the filter's
    // property, and an unconfigured filter merging both sources
    // ahead of the URL filter
    const urlSource: QueryNode = {
      id: 'query-node_source-url',
      type: 'source',
      x: 0,
      y: 0,
      database: urlDatabase.id,
    };
    const mergeFilter: QueryFilterNode = {
      ...matchingFilter,
      id: 'query-node_filter-merge',
      property: '',
      propertyType: '',
      operator: '',
    };
    const urlFilter: QueryFilterNode = {
      ...matchingFilter,
      id: 'query-node_filter-url',
      property: 'URL',
      propertyType: 'url',
    };

    // Both sources merge into a filter, which feeds the filter
    // matching only the URL database's property
    const query = graphQuery(
      [sourceNode, urlSource, mergeFilter, urlFilter, resultsNode],
      [
        { from: sourceNode.id, to: mergeFilter.id },
        { from: urlSource.id, to: mergeFilter.id },
        { from: mergeFilter.id, to: urlFilter.id },
        { from: urlFilter.id, to: resultsNode.id },
      ],
    );

    const mismatched = getQueryMismatchedConnectionIds(query);

    // The merged connection and the object database branch are
    // flagged, the URL branch is not
    expect(mismatched).toEqual(
      new Set([
        `${mergeFilter.id}--${urlFilter.id}`,
        `${sourceNode.id}--${mergeFilter.id}`,
      ]),
    );
  });

  it('flags the trail into a mismatched sort node', () => {
    // A sort on a property missing from the source database
    const sortNode: QueryNode = {
      id: 'query-node_sort',
      type: 'sort',
      x: 0,
      y: 0,
      property: 'Domain',
      propertyType: 'text',
      direction: 'ascending',
    };

    const query = graphQuery(
      [sourceNode, sortNode, resultsNode],
      [
        { from: sourceNode.id, to: sortNode.id },
        { from: sortNode.id, to: resultsNode.id },
      ],
    );

    const mismatched = getQueryMismatchedConnectionIds(query);

    expect(mismatched).toEqual(new Set([`${sourceNode.id}--${sortNode.id}`]));
  });

  it('returns no connections when all filters match', () => {
    const query = graphQuery(
      [sourceNode, matchingFilter, resultsNode],
      [
        { from: sourceNode.id, to: matchingFilter.id },
        { from: matchingFilter.id, to: resultsNode.id },
      ],
    );

    expect(getQueryMismatchedConnectionIds(query)).toEqual(new Set());
  });
});
