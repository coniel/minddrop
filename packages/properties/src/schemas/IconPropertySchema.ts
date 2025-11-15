import { PropertySchemaBase } from '../types';

export interface IconPropertySchema extends PropertySchemaBase {
  type: 'icon';
}
export const IconPropertySchema: IconPropertySchema = {
  type: 'icon',
  icon: 'content-icon:smile:default',
  name: 'properties.icon.name',
  description: 'properties.icon.description',
};
