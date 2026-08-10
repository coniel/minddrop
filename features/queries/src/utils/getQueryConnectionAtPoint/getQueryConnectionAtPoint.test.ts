import { describe, expect, it } from 'vitest';
import { QueryFixtures } from '@minddrop/queries';
import { getQueryConnectionAtPoint } from './getQueryConnectionAtPoint';

const { query_1 } = QueryFixtures;

// The fixture's source → filter and filter → results edges,
// both running horizontally along port height y 19
const [sourceToFilter, filterToResults] = query_1.connections;

describe('getQueryConnectionAtPoint', () => {
  it('returns the connection under the point', () => {
    // A point on the source → filter edge
    const connection = getQueryConnectionAtPoint(query_1, { x: 260, y: 19 });

    expect(connection).toEqual(sourceToFilter);
  });

  it('returns the connection within tolerance of the point', () => {
    // A point 9 canvas units above the source → filter edge
    const connection = getQueryConnectionAtPoint(query_1, { x: 260, y: 10 });

    expect(connection).toEqual(sourceToFilter);
  });

  it('returns null when no edge is within tolerance', () => {
    // A point far below the edges
    const connection = getQueryConnectionAtPoint(query_1, { x: 260, y: 60 });

    expect(connection).toBeNull();
  });

  it('returns the closest of multiple nearby connections', () => {
    // A point next to the filter → results edge
    const connection = getQueryConnectionAtPoint(query_1, { x: 590, y: 21 });

    expect(connection).toEqual(filterToResults);
  });

  it('skips connections with missing endpoints', () => {
    // A query whose only connection references a removed node
    const query = {
      ...query_1,
      connections: [{ ...sourceToFilter, from: 'missing' }],
    };

    const connection = getQueryConnectionAtPoint(query, { x: 260, y: 19 });

    expect(connection).toBeNull();
  });
});
