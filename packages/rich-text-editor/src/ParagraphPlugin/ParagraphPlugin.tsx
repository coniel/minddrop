import { RichTextFragment } from '@minddrop/rich-text';
import { RichTextEditorPluginConfig } from '../types';
import { ParagraphElement } from './ParagraphElement';

export interface ParagraphElement {
  type: 'paragraph';
  children: RichTextFragment;
}

export const ParagraphPlugin: RichTextEditorPluginConfig = {
  elements: [
    {
      type: 'paragraph',
      component: ParagraphElement,
    },
  ],
};
