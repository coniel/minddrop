import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';

export async function onDisableTextDrop(core: Core) {
  // Unregister the text drop type
  Drops.unregister(core, 'text');
}
