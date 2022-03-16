import { ExtensionConfig } from '@minddrop/extensions';
import { onDisableTextDrop } from '../onDisableTextDrop';
import { onRunTextDrop } from '../onRunTextDrop';

export const Extension: ExtensionConfig = {
  id: 'minddrop/text-drop',
  name: 'Text drop',
  description: 'Adds a rich text drop type.',
  scopes: ['topic'],
  onRun: onRunTextDrop,
  onDisable: onDisableTextDrop,
};
