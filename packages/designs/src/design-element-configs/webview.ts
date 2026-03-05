import { DefaultWebviewElementStyle, WebviewElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface WebviewElement extends DesignElementBase {
  type: 'webview';

  /**
   * The element style.
   */
  style: WebviewElementStyle;
}

export const WebviewElementConfig: DesignElementConfig = {
  type: 'webview',
  icon: 'globe',
  label: 'design-studio.elements.webview',
  group: 'media',
  styleCategory: 'webview',
  compatiblePropertyTypes: ['url'],
  template: {
    type: 'webview',
    style: { ...DefaultWebviewElementStyle },
  },
};
