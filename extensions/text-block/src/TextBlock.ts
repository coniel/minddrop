import { MindDropExtension } from '@minddrop/extension';
import { TextBlockEditor } from './TextBlockEditor';

const BLOCK_TYPE = 'text';
const CLASSIFIER_ID = 'minddrop-core-extension-text';
const EDITOR_VARIANT_ID = 'editor';

export const extension: MindDropExtension = {
  initialize: async ({ Blocks }) => {
    Blocks.register({
      id: BLOCK_TYPE,
      defaultVariant: EDITOR_VARIANT_ID,
      propertiesSchema: [{ type: 'text', name: 'text' }],
      icon: 'text',
      description: {
        'en-US': {
          name: 'Text',
          details: 'A simple text block.',
        },
        'en-GB': {
          name: 'Text',
          details: 'A simple text block.',
        },
      },
      initialProperties: { text: '' },
    });

    Blocks.registerTextClassifier({
      id: CLASSIFIER_ID,
      blockType: BLOCK_TYPE,
      match: () => true,
      initializeData: (text) => ({ text }),
    });

    Blocks.registerVariant({
      blockType: BLOCK_TYPE,
      id: EDITOR_VARIANT_ID,
      component: TextBlockEditor,
      description: {
        'en-US': {
          name: 'Editor',
        },
        'en-GB': {
          name: 'Editor',
        },
      },
    });
  },

  onDisable: async ({ Blocks }) => {
    Blocks.unregister(BLOCK_TYPE);
    Blocks.unregisterClassifier(CLASSIFIER_ID);
    Blocks.unregisterVariant(EDITOR_VARIANT_ID);
  },
};
