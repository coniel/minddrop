import { ContentColor } from '@minddrop/core';

export enum CollectionPropertyType {
  Created = 'created',
  Modified = 'modified',
  Markdown = 'markdown',
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

export interface CollectionCreatedPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Created;
}

export interface CollectionLastModifiedPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Modified;
}

export interface CollectionMarkdownPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Markdown;
}

export interface CollectionTextPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Text;
}

export interface CollectionNumberPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Number;
}

export interface CollectionDatePropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Date;
}

export interface CollectionCheckboxPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Checkbox;

  /**
   * Determines the default value of the checkbox property
   * when creating a new entry.
   */
  defaultChecked: boolean;
}

export interface CollectionSelectPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.Select;
  options: CollectionSelectPropertyOption[];
}

export interface CollectionMultiSelectPropertySchema
  extends CollectionPropertySchemaBase {
  type: CollectionPropertyType.MultiSelect;
  options: CollectionSelectPropertyOption[];
}

export interface CollectionSelectPropertyOption
  extends CollectionPropertySchemaBase {
  value: string;
  color: ContentColor;
}

export type CollectionPropertySchema =
  | CollectionCreatedPropertySchema
  | CollectionLastModifiedPropertySchema
  | CollectionMarkdownPropertySchema
  | CollectionTextPropertySchema
  | CollectionNumberPropertySchema
  | CollectionDatePropertySchema
  | CollectionCheckboxPropertySchema
  | CollectionSelectPropertySchema
  | CollectionMultiSelectPropertySchema;

export type CollectionPropertiesSchema = Record<
  string,
  CollectionPropertySchema
>;
