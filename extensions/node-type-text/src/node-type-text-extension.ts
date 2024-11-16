import { MindDropExtension } from '@minddrop/extension';
import { TextNodeRenderer } from './TextNodeEditorRenderer';

const CLASSIFIER_ID = 'minddrop-core-extension-text';
const EDITOR_RENDERER_ID = 'editor';

export const extension: MindDropExtension = {
  initialize: async ({ Nodes }) => {
    // Classify text nodes
    Nodes.registerClassifier({
      id: CLASSIFIER_ID,
      nodeType: 'text',
      display: 'editor',
      // Text nodes are used as a fallback text content
      // when no other node types matched.
      callback: () => true,
    });
    // Render text nodes
    Nodes.registerNodeRendererConfig({
      nodeType: 'text',
      id: EDITOR_RENDERER_ID,
      component: TextNodeRenderer,
    });
  },

  onDisable: async ({ Nodes }) => {
    Nodes.unregisterClassifier(CLASSIFIER_ID);
    Nodes.unregisterNodeRendererConfig(EDITOR_RENDERER_ID);
  },
};
