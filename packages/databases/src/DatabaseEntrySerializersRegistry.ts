import { createRegistry } from '@minddrop/stores';
import { DatabaseEntrySerializer } from './types';

export const DatabaseEntrySerializersRegistry =
  createRegistry<DatabaseEntrySerializer>('Databases:EntrySerializers', 'id', {
    label: 'entry serializer',
  });
