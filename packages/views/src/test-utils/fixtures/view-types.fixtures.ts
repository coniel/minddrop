import { TranslationKey } from '@minddrop/i18n';
import { DataViewConfig, DataViewType } from '../../types';

function generateViewTypeFixture(type: string): DataViewType {
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
export const viewType_board: DataViewType = {
  ...generateViewTypeFixture('board'),
  supportedDataSources: ['collection'],
};

// A view type whose data references items via an `items` list
export const viewType_referencing: DataViewType = {
  ...generateViewTypeFixture('referencing'),
  serializeReferences: convertReferencingItems,
  resolveReferences: convertReferencingItems,
};

export const viewTypes = [
  viewType_table,
  viewType_gallery,
  viewType_board,
  viewType_referencing,
];

// Converts the item list in a referencing view config through the
// supplied conversion function, dropping unconvertible items
function convertReferencingItems(
  config: DataViewConfig,
  convert: (value: string) => string | null,
): DataViewConfig {
  const data = config.data as { items?: string[] } | undefined;

  return {
    ...config,
    data: {
      items: (data?.items ?? []).flatMap((item) => {
        const converted = convert(item);

        return converted === null ? [] : [converted];
      }),
    },
  };
}
