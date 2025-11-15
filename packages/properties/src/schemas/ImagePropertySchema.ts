import { PropertySchemaBase } from '../types';

export interface ImagePropertySchema extends PropertySchemaBase {
  type: 'image';
  storage: 'asset' | 'attachment' | 'item';
}
export const ImagePropertySchema: ImagePropertySchema = {
  type: 'image',
  icon: 'content-icon:image:default',
  name: 'properties.image.name',
  description: 'properties.image.description',
  storage: 'asset',
};
