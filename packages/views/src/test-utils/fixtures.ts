import { Paths } from '@minddrop/utils';
import { MockFileDescriptor } from '../../../file-system/src';
import { ViewsDirectory } from '../constants';
import { View } from '../types';

export const viewsBasePath = `${Paths.workspace}/${ViewsDirectory}`;

export const queriesView1: View = {
  id: 'query-view-1',
  name: 'Query View 1',
  type: 'list',
  contentType: 'query',
  path: `${viewsBasePath}/Query View 1.view`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  content: ['query-1'],
};

export const entriesView1: View = {
  id: 'curated-view-1',
  name: 'Curated View 1',
  type: 'list',
  contentType: 'entry',
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  path: `${viewsBasePath}/Curated View 1.view`,
  content: ['entry-1', 'entry-2'],
};

export const views: View[] = [queriesView1, entriesView1];

export const viewFiles: (string | MockFileDescriptor)[] = [
  viewsBasePath,
  {
    path: queriesView1.path,
    textContent: JSON.stringify(removePath(queriesView1), null, 2),
  },
  {
    path: entriesView1.path,
    textContent: JSON.stringify(removePath(entriesView1), null, 2),
  },
];

function removePath(view: View) {
  const { path, ...rest } = view;

  return rest;
}
