import { FileNodeRendererConfig as NodeRendererConfig } from '../../types';
import { FileNodeRenderer } from './FileNodeRenderer';

export const FileNodeRendererConfig: NodeRendererConfig = {
  id: 'file',
  nodeType: 'file',
  component: FileNodeRenderer,
};
