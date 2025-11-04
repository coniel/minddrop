import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface DatePropertySchema extends PropertySchemaBase {
  type: 'date';
  format?: Intl.DateTimeFormatOptions;
  locale?: Intl.LocalesArgument;
  defaultValue?: Date | 'now';
}

export const DatePropertySchema: DatePropertySchema = {
  type: 'date',
  icon: 'content-icon:calendar:default',
  name: i18n.t('properties.date.name'),
  description: i18n.t('properties.date.description'),
};
