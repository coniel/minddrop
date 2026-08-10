import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { QueryFixtures, QuerySourceNode } from '@minddrop/queries';
import { cleanup, setup } from '../../test-utils';
import { getQueryUpstreamDatabases } from './getQueryUpstreamDatabases';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// The fixture query's nodes, connected source → filter → results
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

describe('getQueryUpstreamDatabases', () => {
  beforeEach(() => {
    setup();

    // Load the source databases
    Databases.Store.load([objectDatabase, urlDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('returns the databases of upstream source nodes', () => {
    const databases = getQueryUpstreamDatabases(query_1, filterNode.id);

    expect(databases).toEqual([objectDatabase]);
  });

  it('collects sources across parallel upstream branches', () => {
    // A second source connected directly to the results node
    const secondSource: QuerySourceNode = {
      id: 'query-node_source-b',
      type: 'source',
      x: 0,
      y: 0,
      database: urlDatabase.id,
    };
    const query = {
      ...query_1,
      nodes: [...query_1.nodes, secondSource],
      connections: [
        ...query_1.connections,
        {
          id: 'query-connection_c',
          from: secondSource.id,
          to: resultsNode.id,
        },
      ],
    };

    const databases = getQueryUpstreamDatabases(query, resultsNode.id);

    // The directly connected source is encountered first
    expect(databases).toEqual([urlDatabase, objectDatabase]);
  });

  it('skips sources referencing missing databases', () => {
    const query = {
      ...query_1,
      nodes: query_1.nodes.map((node) =>
        node.id === sourceNode.id
          ? { ...node, database: 'database_missing' }
          : node,
      ),
    };

    expect(getQueryUpstreamDatabases(query, filterNode.id)).toEqual([]);
  });

  it('returns no databases for unconnected nodes', () => {
    const query = { ...query_1, connections: [] };

    expect(getQueryUpstreamDatabases(query, filterNode.id)).toEqual([]);
  });
});
