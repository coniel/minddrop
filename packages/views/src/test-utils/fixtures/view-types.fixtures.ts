import { TranslationKey } from '@minddrop/i18n';
import { ViewType } from '../../types';

function generateViewTypeFixture(type: string): ViewType {
  return {
    type,
    name: type as TranslationKey,
    description: `Description for view type ${type}` as TranslationKey,
    icon: 'layout',
    component: () => null,
    skeletonComponent: () => null,
    defaultOptions: {
      foo: 'bar',
    },
    supportedDataSources: ['database', 'collection', 'query'],
  };
}

export const viewType_table = generateViewTypeFixture('table');
export const viewType_gallery = generateViewTypeFixture('gallery');

// Board only supports collection data source
export const viewType_board: ViewType = {
  ...generateViewTypeFixture('board'),
  supportedDataSources: ['collection'],
};

export const viewTypes = [viewType_table, viewType_gallery, viewType_board];
