import { createRegistry } from '@minddrop/stores';
import { EntrySerializer } from './types';

export const EntrySerializersRegistry = createRegistry<EntrySerializer>(
  'Databases:EntrySerializers',
  'id',
  {
    label: 'entry serializer',
  },
);
