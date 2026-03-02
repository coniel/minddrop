import { UiIconName } from '@minddrop/icons';

export const DesignElementTemplatesDataKey = 'design-element-templates';
export const DesignElementsDataKey = 'design-elements';

export const elementIconMap: Record<string, UiIconName> = {
  root: 'layout',
  container: 'box',
  text: 'align-left',
  'formatted-text': 'file-text',
  number: 'hash',
  url: 'link',
  image: 'image',
  icon: 'smile',
  webview: 'globe',
};

export const elementLabelMap: Record<string, string> = {
  container: 'design-studio.elements.container',
  text: 'design-studio.elements.text',
  'formatted-text': 'design-studio.elements.formatted-text',
  number: 'design-studio.elements.number',
  url: 'design-studio.elements.url',
  image: 'design-studio.elements.image',
  icon: 'design-studio.elements.icon',
  webview: 'design-studio.elements.webview',
};
