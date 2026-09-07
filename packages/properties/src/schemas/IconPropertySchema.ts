import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface IconPropertySchema extends PropertySchemaBase {
  type: 'icon';
}
// Singleton because an entry is displayed with a single icon
export const IconPropertySchema: PropertySchemaTemplate<IconPropertySchema> = {
  type: 'icon',
  icon: 'lucide:face-slightly-smiling:default',
  name: 'properties.icon.name',
  description: 'properties.icon.description',
  singleton: true,
};
