import { RichText } from '@minddrop/rich-text';
import { RichTextEditorPluginConfig } from '../types';
import { TitleElement } from './TitleElement';

export interface TitleElement {
  type: 'title';
  children: RichText[];
}

export const TitlePlugin: RichTextEditorPluginConfig = {
  elements: [
    {
      type: 'title',
      component: TitleElement,
    },
  ],
};
