import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { ImageDropConfig } from '../ImageDropConfig';

/**
 * Disables the image drop extension.
 *
 * @param core - A MindDrop core instance.
 */
export async function onDisableImageDrop(core: Core) {
  // Unregister the 'image' drop type
  Drops.unregister(core, ImageDropConfig);
}
