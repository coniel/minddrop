import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface CreatedPropertySchema extends PropertySchemaBase {
  type: 'created';
}

export const CreatedPropertySchema: CreatedPropertySchema = {
  type: 'created',
  icon: 'content-icon:clock:default',
  name: i18n.t('properties.created.name'),
  description: i18n.t('properties.created.description'),
  meta: true,
};
