import { EditorPluginConfig, EditorText } from '../types';
import { ParagraphElement } from './ParagraphElement';

export interface ParagraphElement {
  type: 'paragraph';
  children: EditorText;
}

export const ParagraphPlugin: EditorPluginConfig = {
  elements: [
    {
      type: 'paragraph',
      component: ParagraphElement,
    },
  ],
};
