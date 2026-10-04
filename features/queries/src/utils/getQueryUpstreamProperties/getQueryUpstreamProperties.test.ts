import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Query } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { getQueryUpstreamProperties } from './getQueryUpstreamProperties';

const { objectDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// The fixture query's filter and results nodes, fed by its source
const [, filterNode, resultsNode] = query_1.nodes;

describe('getQueryUpstreamProperties', () => {
  beforeEach(() => {
    Databases.Store.load([objectDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
  });

  it("returns the query database's properties with metadata properties", () => {
    expect(getQueryUpstreamProperties(query_1, resultsNode.id)).toEqual(
      Databases.withImplicitMetadataProperties(objectDatabase.properties),
    );
  });

  it('returns no properties when the source does not flow into the node', () => {
    const query = { ...query_1, connections: [] };

    expect(getQueryUpstreamProperties(query, filterNode.id)).toEqual([]);
  });

  it('returns no properties when no source is picked', () => {
    const query: Query = {
      ...query_1,
      nodes: query_1.nodes.map((node) =>
        node.type === 'source'
          ? { ...node, source: { type: 'database', id: '' } }
          : node,
      ),
    };

    expect(getQueryUpstreamProperties(query, filterNode.id)).toEqual([]);
  });
});
