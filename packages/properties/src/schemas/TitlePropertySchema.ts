import { PropertySchemaBase } from '../types';

export interface TitlePropertySchema extends PropertySchemaBase {
  type: 'title';
}

export const TitlePropertySchema: TitlePropertySchema = {
  type: 'title',
  icon: 'content-icon:title:default',
  name: 'properties.title.name',
  description: 'properties.title.description',
  protected: true,
};
