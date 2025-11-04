import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface TogglePropertySchema extends PropertySchemaBase {
  type: 'toggle';
  defaultValue?: boolean;
}

export const TogglePropertySchema: TogglePropertySchema = {
  type: 'toggle',
  icon: 'content-icon:check-square:default',
  name: i18n.t('properties.toggle.name'),
  description: i18n.t('properties.toggle.description'),
};
