import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface ImagePropertySchema extends PropertySchemaBase {
  type: 'image';
}
export const ImagePropertySchema: PropertySchemaTemplate<ImagePropertySchema> =
  {
    type: 'image',
    icon: 'content-icon:image:default',
    name: 'properties.image.name',
    description: 'properties.image.description',
  };
