import { createRegistry } from '@minddrop/stores';
import { ItemReferenceAdapter } from './types';

// Registration order determines the order in which adapters are
// offered references during resolution.
export const ItemReferenceAdaptersRegistry =
  createRegistry<ItemReferenceAdapter>('ItemReferences:Adapters', 'type', {
    label: 'item reference adapter',
  });
