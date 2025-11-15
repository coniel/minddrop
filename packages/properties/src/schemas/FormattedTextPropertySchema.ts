import { PropertySchemaBase } from '../types';

export interface FormattedTextPropertySchema extends PropertySchemaBase {
  type: 'text-formatted';
  defaultValue?: string;
}

export const FormattedTextPropertySchema: FormattedTextPropertySchema = {
  type: 'text-formatted',
  icon: 'content-icon:text-quote:default',
  name: 'properties.textFormatted.name',
  description: 'properties.textFormatted.description',
};
