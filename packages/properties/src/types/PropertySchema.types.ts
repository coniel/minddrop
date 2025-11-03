import { ContentColor } from '@minddrop/core';
import { PropertyType } from './Properties.types';

interface PropertySchemaBase {
  /**
   * The property type.
   */
  type: PropertyType;

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
  type: 'text';
  defaultValue?: string;
}

export interface UrlPropertySchema extends PropertySchemaBase {
  type: 'url';
  defaultValue?: string;
}

export interface NumberPropertySchema extends PropertySchemaBase {
  type: 'number';
  defaultValue?: number;
}

export interface MarkdownPropertySchema extends PropertySchemaBase {
  type: 'markdown';
  defaultValue?: string;
}

export interface DatePropertySchema extends PropertySchemaBase {
  type: 'date';
  format?: Intl.DateTimeFormatOptions;
  locale?: Intl.LocalesArgument;
  defaultValue?: Date | 'now';
}

export interface TogglePropertySchema extends PropertySchemaBase {
  type: 'toggle';
  defaultValue?: boolean;
}

export interface SelectPropertySchema extends PropertySchemaBase {
  type: 'select';
  options: SelectPropertyOption[];
  defaultValue?: string;
  multiselect?: boolean;
}

export interface ImagePropertySchema extends PropertySchemaBase {
  type: 'image';
  stroage: 'asset' | 'attachment' | 'item';
}

export interface IconPropertySchema extends PropertySchemaBase {
  type: 'icon';
}

export interface SelectPropertyOption {
  value: string;
  color: ContentColor;
}

export type PropertySchema =
  | TextPropertySchema
  | UrlPropertySchema
  | NumberPropertySchema
  | DatePropertySchema
  | TogglePropertySchema
  | SelectPropertySchema
  | ImagePropertySchema
  | IconPropertySchema;

export type PropertiesSchema = PropertySchema[];
