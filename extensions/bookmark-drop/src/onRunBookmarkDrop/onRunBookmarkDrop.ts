import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { BookmarkDropConfig } from '../BookmarkDropConfig';

/**
 * Enables the bookmark drop extension.
 *
 * @param core - A MindDrop core instance.
 */
export function onRunBookmarkDrop(core: Core) {
  // Register the 'bookmark' drop type
  Drops.register(core, BookmarkDropConfig);
}
