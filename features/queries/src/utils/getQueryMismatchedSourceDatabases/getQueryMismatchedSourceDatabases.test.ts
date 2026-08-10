import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { QueryFilterNode, QueryFixtures, QueryNode } from '@minddrop/queries';
import { cleanup, setup } from '../../test-utils';
import { getQueryMismatchedSourceDatabases } from './getQueryMismatchedSourceDatabases';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// The fixture query's filter node
const filterNode = query_1.nodes[1] as QueryFilterNode;

// Returns the fixture query with its filter node reconfigured
function queryWithFilter(data: Partial<QueryFilterNode>) {
  return {
    ...query_1,
    nodes: query_1.nodes.map((node) =>
      node.id === filterNode.id ? { ...filterNode, ...data } : node,
    ),
  };
}

describe('getQueryMismatchedSourceDatabases', () => {
  beforeEach(() => {
    setup();

    // Load the query's source database
    Databases.Store.load([objectDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('returns the sources lacking the filter property', () => {
    // A filter for a property missing from the source database
    const query = queryWithFilter({
      property: 'Domain',
      propertyType: 'text',
    });

    expect(getQueryMismatchedSourceDatabases(query, filterNode.id)).toEqual([
      objectDatabase,
    ]);
  });

  it('returns no sources when the connections match', () => {
    // A filter for a property of the source database
    const query = queryWithFilter({
      property: 'Content',
      propertyType: 'formatted-text',
    });

    expect(getQueryMismatchedSourceDatabases(query, filterNode.id)).toEqual([]);
  });

  it('returns the sources lacking a sort node property', () => {
    // A sort node on a property missing from the source
    // database, fed directly by the source
    const sortNode: QueryNode = {
      id: 'query-node_sort',
      type: 'sort',
      x: 0,
      y: 0,
      property: 'Domain',
      propertyType: 'text',
      direction: 'ascending',
    };
    const query = {
      ...query_1,
      nodes: [query_1.nodes[0], sortNode, query_1.nodes[2]],
      connections: [
        {
          id: 'query-connection_sort',
          from: query_1.nodes[0].id,
          to: sortNode.id,
        },
      ],
    };

    expect(getQueryMismatchedSourceDatabases(query, sortNode.id)).toEqual([
      objectDatabase,
    ]);
  });

  it('returns only the lacking sources when inputs are mixed', () => {
    // Load a second database containing the filter's property
    Databases.Store.load([urlDatabase]);

    // A second source connected into the same filter, whose
    // database contains the filter's property
    const urlSource: QueryNode = {
      id: 'query-node_source-url',
      type: 'source',
      x: 0,
      y: 0,
      database: urlDatabase.id,
    };

    // The filter matches only the URL database's property
    const base = queryWithFilter({ property: 'URL', propertyType: 'url' });
    const query = {
      ...base,
      nodes: [...base.nodes, urlSource],
      connections: [
        ...base.connections,
        {
          id: 'query-connection_url',
          from: urlSource.id,
          to: filterNode.id,
        },
      ],
    };

    expect(getQueryMismatchedSourceDatabases(query, filterNode.id)).toEqual([
      objectDatabase,
    ]);
  });
});
