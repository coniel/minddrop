import { Paths } from '@minddrop/utils';
import { MockFileDescriptor } from '../../../file-system/src';
import { QueriesDirectory } from '../constants';
import { Query } from '../types';

export const queriesBasePath = `${Paths.workspace}/${QueriesDirectory}`;

export const query1: Query = {
  id: 'query-1',
  name: 'My Query',
  path: `${queriesBasePath}/My Query.query`,
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

export const queries: Query[] = [query1];

export const queryFiles: (string | MockFileDescriptor)[] = [
  queriesBasePath,
  {
    path: query1.path,
    textContent: JSON.stringify(removePath(query1), null, 2),
  },
];

function removePath(query: Query) {
  const { path, ...rest } = query;

  return rest;
}
