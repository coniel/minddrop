import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { TextDropConfig } from '../TextDropConfig';

export function onRunTextDrop(core: Core) {
  // Register the 'text' drop type
  Drops.register(core, TextDropConfig);
}
