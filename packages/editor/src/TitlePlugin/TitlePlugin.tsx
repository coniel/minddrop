import { EditorPluginConfig, EditorText } from '../types';
import { TitleElement } from './TitleElement';

export interface TitleElement {
  type: 'title';
  children: EditorText;
}

export const TitlePlugin: EditorPluginConfig = {
  elements: [
    {
      type: 'title',
      component: TitleElement,
    },
  ],
};
