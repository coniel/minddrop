import { ViewType } from '../../types';

function generateViewTypeFixture(type: string): ViewType {
  return {
    type,
    name: type,
    description: `Description for view type ${type}`,
    icon: 'layout',
    component: () => null,
    skeletonComponent: () => null,
    defaultOptions: {
      foo: 'bar',
    },
    supportedDataSources: ['database'],
  };
}

export const viewType_table = generateViewTypeFixture('table');
export const viewType_gallery = generateViewTypeFixture('gallery');
export const viewType_board = generateViewTypeFixture('board');

export const viewTypes = [viewType_table, viewType_gallery, viewType_board];
