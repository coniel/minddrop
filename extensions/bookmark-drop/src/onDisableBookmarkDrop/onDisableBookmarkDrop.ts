import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { BookmarkDropConfig } from '../BookmarkDropConfig';

/**
 * Disables the bookmark drop extension.
 *
 * @param core - A MindDrop core instance.
 */
export async function onDisableBookmarkDrop(core: Core) {
  // Unregister the 'bookmark' drop type
  Drops.unregister(core, BookmarkDropConfig);
}
