import { DefaultWebviewElementStyle } from '../styles';
import { WebviewElement } from '../types';

export type WebviewElementTemplate = Omit<WebviewElement, 'id'>;

export const WebviewElementTemplate: WebviewElementTemplate = {
  type: 'webview',
  style: { ...DefaultWebviewElementStyle },
};
