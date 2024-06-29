import { LinkNodeRendererConfig as NodeRendererConfig } from '../../types';
import { LinkNodeRenderer } from './LinkNodeRenderer';

export const LinkNodeRendererConfig: NodeRendererConfig = {
  id: 'link',
  nodeType: 'link',
  component: LinkNodeRenderer,
};
