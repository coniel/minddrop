import { ExtensionConfig } from '@minddrop/extensions';
import { onDisableBookmarkDrop } from '../onDisableBookmarkDrop';
import { onRunBookmarkDrop } from '../onRunBookmarkDrop';

export const Extension: ExtensionConfig = {
  id: 'minddrop:drop:bookmark',
  name: 'Bookmark',
  description: 'Save a link as a visual bookmark',
  scopes: ['topic'],
  onRun: onRunBookmarkDrop,
  onDisable: onDisableBookmarkDrop,
};
