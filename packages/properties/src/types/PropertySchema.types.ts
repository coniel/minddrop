import { ContentColor } from '@minddrop/core';

export enum PropertyType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Checkbox = 'checkbox',
  Select = 'select',
  MultiSelect = 'multiselect',
}

interface PropertySchemaBase {
  /**
   * The property name. Also used as the key in the properties object.
   */
  name: string;

  /**
   * The property icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;

  /**
   * Description of the property.
   */
  description?: string;
}

export interface TextPropertySchema extends PropertySchemaBase {
  type: PropertyType.Text;
  defaultValue?: string;
}

export interface NumberPropertySchema extends PropertySchemaBase {
  type: PropertyType.Number;
  defaultValue?: number;
}

export interface DatePropertySchema extends PropertySchemaBase {
  type: PropertyType.Date;
  format: Intl.DateTimeFormatOptions;
  locale: Intl.LocalesArgument;
  defaultValue?: Date | 'now';
}

export interface CheckboxPropertySchema extends PropertySchemaBase {
  type: PropertyType.Checkbox;
  defaultValue?: boolean;
}

export interface SelectPropertySchema extends PropertySchemaBase {
  type: PropertyType.Select;
  options: SelectPropertyOption[];
  defaultValue?: string;
}

export interface MultiSelectPropertySchema extends PropertySchemaBase {
  type: PropertyType.MultiSelect;
  options: SelectPropertyOption[];
  defaultValue?: string[];
}

export interface SelectPropertyOption {
  value: string;
  color: ContentColor;
}

export type PropertySchema =
  | TextPropertySchema
  | NumberPropertySchema
  | DatePropertySchema
  | CheckboxPropertySchema
  | SelectPropertySchema
  | MultiSelectPropertySchema;
