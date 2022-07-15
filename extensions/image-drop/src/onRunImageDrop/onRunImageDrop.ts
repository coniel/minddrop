import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { ImageDropConfig } from '../ImageDropConfig';

/**
 * Enables the image drop extension.
 *
 * @param core - A MindDrop core instance.
 */
export function onRunImageDrop(core: Core) {
  // Register the 'image' drop type
  Drops.register(core, ImageDropConfig);
}
