import { MindDropExtension } from '@minddrop/extension';
import { fetchBookmarkMetadata } from './fetchBookmarkMetadata';
import { BookmarkCardHorizontal } from './variants';

const CLASSIFIER_ID = 'minddrop-core-extension-link';
const VARIANT_HORIZONTAL_CARD_ID = 'horizontal-card';
const BLOCK_TYPE = 'web-bookmark';

export const extension: MindDropExtension = {
  id: 'core:bookmark-block',
  initialize: async (MindDropApi) => {
    const { Blocks } = MindDropApi;

    Blocks.register({
      id: BLOCK_TYPE,
      defaultVariant: VARIANT_HORIZONTAL_CARD_ID,
      icon: 'bookmark',
      description: {
        'en-US': {
          name: 'Web Bookmark',
          details: 'A bookmark to a web page.',
        },
        'en-GB': {
          name: 'Web Bookmark',
          details: 'A bookmark to a web page.',
        },
      },
      propertiesSchema: [
        { name: 'url', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'image', type: 'asset' },
        { name: 'icon', type: 'asset' },
      ],
      onCreate: async (block) => fetchBookmarkMetadata(MindDropApi, block),
    });

    Blocks.registerLinkClassifier({
      id: CLASSIFIER_ID,
      blockType: BLOCK_TYPE,
      match: () => true,
      initializeData: (url) => ({ url }),
    });

    Blocks.registerVariant({
      blockType: BLOCK_TYPE,
      id: VARIANT_HORIZONTAL_CARD_ID,
      component: BookmarkCardHorizontal,
      className: 'bookmark-card-horizontal',
      description: {
        'en-US': {
          name: 'Horizontal Card',
        },
        'en-GB': {
          name: 'Horizontal Card',
        },
      },
    });
  },

  onDisable: async ({ Blocks }) => {
    Blocks.unregisterClassifier(CLASSIFIER_ID);
    Blocks.unregisterVariant(VARIANT_HORIZONTAL_CARD_ID);
  },
};
