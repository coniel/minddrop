import { TranslationKey } from '@minddrop/i18n';
import { ContentViewConfig, ContentViewType } from '../../types';

function generateViewTypeFixture(type: string): ContentViewType {
  return {
    type,
    name: type as TranslationKey,
    description: `Description for view type ${type}` as TranslationKey,
    icon: 'panels-top-left',
    component: () => null,
    skeletonComponent: () => null,
    defaultOptions: {
      foo: 'bar',
    },
    supportedDataSources: ['database', 'collection', 'query'],
  };
}

// Table renders its entries in a sortable, filterable order
export const contentViewType_table: ContentViewType = {
  ...generateViewTypeFixture('table'),
  sortable: true,
  filterable: true,
};

export const contentViewType_gallery = generateViewTypeFixture('gallery');

// Board only supports collection data source
export const contentViewType_board: ContentViewType = {
  ...generateViewTypeFixture('board'),
  supportedDataSources: ['collection'],
};

// A view type whose data references items via an `items` list
export const contentViewType_referencing: ContentViewType = {
  ...generateViewTypeFixture('referencing'),
  serializeReferences: convertReferencingItems,
  resolveReferences: convertReferencingItems,
};

export const contentViewTypes = [
  contentViewType_table,
  contentViewType_gallery,
  contentViewType_board,
  contentViewType_referencing,
];

// Converts the item list in a referencing view config through the
// supplied conversion function, dropping unconvertible items.
function convertReferencingItems(
  config: ContentViewConfig,
  convert: (value: string) => string | null,
): ContentViewConfig {
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
