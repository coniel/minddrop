import { PropertySchemaBase } from '../types';

export interface FormattedTextPropertySchema extends PropertySchemaBase {
  type: 'formatted-text';
  defaultValue?: string;
}

export const FormattedTextPropertySchema: FormattedTextPropertySchema = {
  type: 'formatted-text',
  icon: 'content-icon:text-quote:default',
  name: 'properties.textFormatted.name',
  description: 'properties.textFormatted.description',
};
