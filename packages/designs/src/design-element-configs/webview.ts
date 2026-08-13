import { EmbedStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface WebviewElement extends DesignElementBase {
  type: 'webview';

  /**
   * The element style.
   */
  style: EmbedStyle;
}

export const WebviewElementConfig: DesignElementConfig<WebviewElement> = {
  type: 'webview',
  icon: 'globe',
  label: 'design-studio.elements.webview',
  group: 'media',
  styleCategory: 'embed',
  compatiblePropertyTypes: ['url'],
  template: {
    type: 'webview',
    style: { height: 'fill' },
  },
};
