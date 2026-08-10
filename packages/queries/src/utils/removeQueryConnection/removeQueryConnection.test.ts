import { describe, expect, it } from 'vitest';
import { query_1 } from '../../test-utils/queries.fixtures';
import { removeQueryConnection } from './removeQueryConnection';

describe('removeQueryConnection', () => {
  it('removes the target connection', () => {
    const connections = removeQueryConnection(
      query_1.connections,
      query_1.connections[0].id,
    );

    expect(connections).toEqual([query_1.connections[1]]);
  });

  it('returns the connections unchanged when the target does not exist', () => {
    const connections = removeQueryConnection(query_1.connections, 'missing');

    expect(connections).toEqual(query_1.connections);
  });
});
