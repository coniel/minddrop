import { ContentColor } from '@minddrop/core';

export enum CollectionPropertyType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  Checkbox = 'checkbox',
  Select = 'select',
  MultiSelect = 'multiselect',
}

interface CollectionPropertySchemaBase {
  /**
   * The property name. Also used as the key in the collection
   * properties object.
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

export interface CollectionTextPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Text;
  defaultValue?: string;
}

export interface CollectionNumberPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Number;
  defaultValue?: number;
}

export interface CollectionDatePropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Date;
  format: Intl.DateTimeFormatOptions;
  locale: Intl.LocalesArgument;
  defaultValue?: Date | 'now';
}

export interface CollectionCheckboxPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Checkbox;
  defaultValue?: boolean;
}

export interface CollectionSelectPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Select;
  options: CollectionSelectPropertyOption[];
  defaultValue?: string;
}

export interface CollectionMultiSelectPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.MultiSelect;
  options: CollectionSelectPropertyOption[];
  defaultValue?: string[];
}

export interface CollectionSelectPropertyOption {
  value: string;
  color: ContentColor;
}

export type CollectionPropertySchema =
  | CollectionTextPropertySchema
  | CollectionNumberPropertySchema
  | CollectionDatePropertySchema
  | CollectionCheckboxPropertySchema
  | CollectionSelectPropertySchema
  | CollectionMultiSelectPropertySchema;
