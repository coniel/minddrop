import { MindDropExtension } from '@minddrop/extension';
import { ImageNodeRenderer } from './ImageNodeRenderer';

const CLASSIFIER_ID = 'minddrop-core-extension-image';
const RENDERER_ID = 'image';

export const extension: MindDropExtension = {
  initialize: async ({ Nodes }) => {
    // Classify image nodes
    Nodes.registerClassifier({
      id: CLASSIFIER_ID,
      nodeType: 'file',
      display: 'image',
      fileTypes: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
    });

    // Render image nodes
    Nodes.registerNodeRendererConfig({
      nodeType: 'file',
      id: RENDERER_ID,
      component: ImageNodeRenderer,
    });
  },

  onDisable: async ({ Nodes }) => {
    Nodes.unregisterClassifier(CLASSIFIER_ID);
    Nodes.unregisterNodeRendererConfig(RENDERER_ID);
  },
};
