import { MindDropExtension } from '@minddrop/extension';
import { ImageCard } from './Image';

const CLASSIFIER_ID = 'minddrop-core-extension-image';
const RENDERER_ID = 'image';
const BLOCK_TYPE = 'image';

export const extension: MindDropExtension = {
  id: 'core:image-block',
  initialize: async ({ Blocks }) => {
    Blocks.register({
      id: BLOCK_TYPE,
      defaultVariant: RENDERER_ID,
      icon: 'image',
      description: {
        'en-US': {
          name: 'Image',
          details: 'Embed an image file.',
        },
        'en-GB': {
          name: 'Image',
          details: 'Embed an image file.',
        },
      },
    });

    Blocks.registerFileClassifier({
      id: CLASSIFIER_ID,
      blockType: BLOCK_TYPE,
      fileTypes: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
    });

    Blocks.registerVariant({
      blockType: BLOCK_TYPE,
      id: RENDERER_ID,
      component: ImageCard,
      className: 'image-block',
      description: {
        'en-US': {
          name: 'Image',
        },
        'en-GB': {
          name: 'Image',
        },
      },
    });
  },

  onDisable: async ({ Blocks }) => {
    Blocks.unregister(BLOCK_TYPE);
    Blocks.unregisterClassifier(CLASSIFIER_ID);
    Blocks.unregisterVariant(RENDERER_ID);
  },
};
