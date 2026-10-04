import { Properties } from '@minddrop/properties';
import { EntrySerializer } from '../types';

export const jsonEntrySerializer: EntrySerializer = {
  id: 'json',
  name: 'databases.entrySerializers.json.name',
  description: 'databases.entrySerializers.json.description',
  fileExtension: 'json',
  serialize: (schema, properties) => {
    return Properties.toJson(schema, properties);
  },
  deserialize: (schema, serializedProperties) => {
    return Properties.fromJson(schema, serializedProperties);
  },
};
