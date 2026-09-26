import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface AudioPropertySchema extends PropertySchemaBase {
  type: 'audio';
}
export const AudioPropertySchema: PropertySchemaTemplate<AudioPropertySchema> =
  {
    type: 'audio',
    icon: 'lucide:file-music:default',
    name: 'properties.audio.name',
    description: 'properties.audio.description',
  };
