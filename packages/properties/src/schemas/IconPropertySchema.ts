import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface IconPropertySchema extends PropertySchemaBase {
  type: 'icon';
}
export const IconPropertySchema: PropertySchemaTemplate<IconPropertySchema> = {
  type: 'icon',
  icon: 'lucide:face-slightly-smiling:default',
  name: 'properties.icon.name',
  description: 'properties.icon.description',
};
