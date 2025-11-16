import { Properties } from '@minddrop/properties';
import { DatabaseEntrySerializer } from '../types';

export const yamlEntrySerializer: DatabaseEntrySerializer = {
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
