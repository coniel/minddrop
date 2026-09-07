import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface DatePropertySchema extends PropertySchemaBase {
  type: 'date';
  format?: Intl.DateTimeFormatOptions;
  locale?: Intl.LocalesArgument;
  defaultValue?: Date | 'now';
}

export const DatePropertySchema: PropertySchemaTemplate<DatePropertySchema> = {
  type: 'date',
  icon: 'lucide:calendar:default',
  name: 'properties.date.name',
  description: 'properties.date.description',
};
