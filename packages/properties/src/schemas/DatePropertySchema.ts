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
  name: 'properties.date.name',
  description: 'properties.date.description',
};
