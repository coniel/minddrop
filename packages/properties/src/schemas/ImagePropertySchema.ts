import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface ImagePropertySchema extends PropertySchemaBase {
  type: 'image';
  storage: 'asset' | 'attachment' | 'item';
}
export const ImagePropertySchema: ImagePropertySchema = {
  type: 'image',
  icon: 'content-icon:image:default',
  name: i18n.t('properties.image.name'),
  description: i18n.t('properties.image.description'),
  storage: 'asset',
};
