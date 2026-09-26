import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface VideoPropertySchema extends PropertySchemaBase {
  type: 'video';
}
export const VideoPropertySchema: PropertySchemaTemplate<VideoPropertySchema> =
  {
    type: 'video',
    icon: 'lucide:film:default',
    name: 'properties.video.name',
    description: 'properties.video.description',
  };
