import { Properties } from '@minddrop/properties';
import { EntrySerializer } from '../types';

export const yamlEntrySerializer: EntrySerializer = {
  id: 'yaml',
  name: 'databases.entrySerializers.yaml.name',
  description: 'databases.entrySerializers.yaml.description',
  fileExtension: 'yaml',
  serialize: (schema, properties) => {
    return Properties.toYaml(schema, properties);
  },
  deserialize: (schema, serializedProperties) => {
    return Properties.fromYaml(schema, serializedProperties);
  },
};
