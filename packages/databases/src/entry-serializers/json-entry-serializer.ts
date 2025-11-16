import { Properties } from '@minddrop/properties';
import { DatabaseEntrySerializer } from '../types';

export const jsonEntrySerializer: DatabaseEntrySerializer = {
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
