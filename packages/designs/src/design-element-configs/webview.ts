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
  supportsStaticContent: false,
  // An entry with no URL has no page to embed, so the element is
  // left out entirely
  emptyBehavior: 'hide',
  template: {
    type: 'webview',
    style: { height: 'fill' },
  },
};
