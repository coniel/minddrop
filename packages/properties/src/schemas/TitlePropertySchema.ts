import { PropertySchemaBase } from '../types';

export interface TitlePropertySchema extends PropertySchemaBase {
  type: 'title';
}

export const TitlePropertySchema: TitlePropertySchema = {
  type: 'title',
  icon: 'content-icon:type:default',
  name: 'properties.title.name',
  description: 'properties.title.description',
  protected: true,
};
