import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { TextDropComponent } from '../TextDrop';

export function onRunTextDrop(core: Core) {
  // Register the 'text' drop type
  Drops.register(core, {
    type: 'text',
    component: TextDropComponent,
    name: 'Text',
    description: 'A rich text drop',
    dataTypes: ['text/plain'],
    create: async (core) => {
      return Drops.create(core, { type: 'text', markdown: '' });
    },
  });
}
