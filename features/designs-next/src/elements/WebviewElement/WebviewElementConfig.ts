import { DesignElementConfig } from '@minddrop/designs-next';
import { WebviewElement } from './WebviewElement.types';
import { WebviewElementRenderer } from './WebviewElementRenderer';

// The element type the config registers under
export const WebviewElementType = 'webview';

/**
 * Config for the webview element: the page at the address of the url
 * property it maps to, embedded in its block. Not listed on the grid
 * palette: an embedded page takes a page's height rather than a
 * block's.
 */
export const WebviewElementConfig: DesignElementConfig<WebviewElement> = {
  type: WebviewElementType,
  label: 'designsNext.elements.webview.label',
  icon: 'globe',
  propertyTypes: ['url'],
  suggestedPropertyTypes: ['url'],
  component: WebviewElementRenderer,
  defaultColumnSpan: 48,
  defaultRowSpan: 48,
  settingControls: ['background', 'corner-radius'],
};
