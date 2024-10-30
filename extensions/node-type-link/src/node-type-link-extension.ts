import { MindDropExtension } from '@minddrop/extension';
import { LinkNodeRenderer } from './LinkNodeRenderer';

const CLASSIFIER_ID = 'minddrop-core-extension-link';
const RENDERER_ID = 'web-bookmark';

export const extension: MindDropExtension = {
  initialize: async ({ Nodes }) => {
    // Classify web bookmark nodes
    Nodes.registerClassifier({
      id: CLASSIFIER_ID,
      nodeType: 'link',
      display: 'web-bookmark',
      callback: () => true,
    });
    // Render link nodes
    Nodes.registerNodeRendererConfig({
      nodeType: 'link',
      id: RENDERER_ID,
      component: LinkNodeRenderer,
    });
  },

  onDisable: async ({ Nodes }) => {
    Nodes.unregisterClassifier(CLASSIFIER_ID);
    Nodes.unregisterNodeRendererConfig(RENDERER_ID);
  },
};
