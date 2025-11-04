import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface IconPropertySchema extends PropertySchemaBase {
  type: 'icon';
}
export const IconPropertySchema: IconPropertySchema = {
  type: 'icon',
  icon: 'content-icon:smile:default',
  name: i18n.t('properties.icon.name'),
  description: i18n.t('properties.icon.description'),
};
