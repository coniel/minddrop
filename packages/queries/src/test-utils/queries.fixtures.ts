import { MockFileDescriptor } from '@minddrop/file-system';
import { Query } from '../types';
import { getQueriesDirPath, getQueryFilePath } from '../utils';

function generateQueryFixture(number: number): Query {
  return {
    id: `query-${number}`,
    name: `Query ${number}`,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    filters: [
      {
        property: 'title',
        operator: 'contains',
        value: 'foo',
      },
    ],
    sort: [
      {
        property: 'title',
        direction: 'ascending',
      },
    ],
  };
}

export const query_1 = generateQueryFixture(1);
export const query_2 = generateQueryFixture(2);
export const query_3 = generateQueryFixture(3);

export const queries = [query_1, query_2, query_3];

export const queryFiles: (string | MockFileDescriptor)[] = [
  getQueriesDirPath(),
  ...queries.map((query) => ({
    path: getQueryFilePath(query.id),
    textContent: JSON.stringify(query),
  })),
];
