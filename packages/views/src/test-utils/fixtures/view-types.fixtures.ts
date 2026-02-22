import { ViewType } from '../../types';

function generateViewTypeFixture(type: string): ViewType {
  return {
    type,
    name: type,
    description: `Description for view type ${type}`,
    component: () => null,
    defaultOptions: {
      foo: 'bar',
    },
  };
}

export const viewType_gallery = generateViewTypeFixture('gallery');
export const viewType_board = generateViewTypeFixture('board');

export const viewTypes = [viewType_gallery, viewType_board];
