import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { createTextDrop } from '../createTextDrop';
import { TextDropComponent } from '../TextDrop';

export function onRunTextDrop(core: Core) {
  // Register the 'text' drop type
  Drops.register(core, {
    type: 'text',
    component: TextDropComponent,
    name: 'Text',
    description: 'A rich text drop',
    dataTypes: ['text/plain'],
    create: createTextDrop,
  });
}
