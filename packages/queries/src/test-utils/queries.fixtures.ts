import { MockFileDescriptor } from '@minddrop/file-system';
import { Query } from '../types';
import { resolveQueriesDirPath, resolveQueryFilePath } from '../utils';

function generateQueryFixture(number: number): Query {
  return {
    id: `query_${number}`,
    name: `Query ${number}`,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    nodes: [
      {
        id: `query-node_source-${number}`,
        type: 'source',
        x: 0,
        y: 0,
        sources: [{ type: 'database', id: 'database_objects' }],
      },
      {
        id: `query-node_filter-${number}`,
        type: 'filter',
        x: 300,
        y: 0,
        property: 'Title',
        propertyType: 'title',
        operator: 'contains',
        value: 'foo',
      },
      {
        id: `query-node_results-${number}`,
        type: 'results',
        x: 600,
        y: 0,
      },
    ],
    connections: [
      {
        id: `query-connection_a-${number}`,
        from: `query-node_source-${number}`,
        to: `query-node_filter-${number}`,
      },
      {
        id: `query-connection_b-${number}`,
        from: `query-node_filter-${number}`,
        to: `query-node_results-${number}`,
      },
    ],
  };
}

export const query_1 = generateQueryFixture(1);
export const query_2 = generateQueryFixture(2);
export const query_3 = generateQueryFixture(3);

export const queries = [query_1, query_2, query_3];

export function getQueryFiles(): (string | MockFileDescriptor)[] {
  return [
    resolveQueriesDirPath(),
    ...queries.map((query) => ({
      path: resolveQueryFilePath(query.id),
      textContent: JSON.stringify(query),
    })),
  ];
}
