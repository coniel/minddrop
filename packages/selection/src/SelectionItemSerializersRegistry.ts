import { createRegistry } from '@minddrop/stores';
import { SelectionItemSerializer } from './types';

export const SelectionItemSerializersRegistry =
  createRegistry<SelectionItemSerializer>('Selection:ItemSerializers', 'type', {
    label: 'selection item serializer',
  });
