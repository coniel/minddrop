import { ExtensionConfig } from '@minddrop/extensions';
import { onDisableImageDrop } from '../onDisableImageDrop';
import { onRunImageDrop } from '../onRunImageDrop';

export const Extension: ExtensionConfig = {
  id: 'minddrop:drop:image',
  name: 'Image',
  description: 'Create a drop from an image',
  scopes: ['topic'],
  onRun: onRunImageDrop,
  onDisable: onDisableImageDrop,
};
