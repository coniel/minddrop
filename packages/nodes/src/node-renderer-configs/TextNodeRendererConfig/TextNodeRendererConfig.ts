import { TextNodeRendererConfig as NodeRendererConfig } from '../../types';
import { TextNodeRenderer } from './TextNodeRenderer';

export const TextNodeRendererConfig: NodeRendererConfig = {
  id: 'text',
  nodeType: 'text',
  component: TextNodeRenderer,
};
