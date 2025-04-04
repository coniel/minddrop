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

export interface CollectionCreatedPropertySchema {
  type: CollectionPropertyType.Created;
}

export interface CollectionLastModifiedPropertySchema {
  type: CollectionPropertyType.Modified;
}

export interface CollectionMarkdownPropertySchema {
  type: CollectionPropertyType.Markdown;
}

export interface CollectionTextPropertySchema {
  type: CollectionPropertyType.Text;
}

export interface CollectionNumberPropertySchema {
  type: CollectionPropertyType.Number;
}

export interface CollectionDatePropertySchema {
  type: CollectionPropertyType.Date;
}

export interface CollectionCheckboxPropertySchema {
  type: CollectionPropertyType.Checkbox;

  /**
   * Determines the default value of the checkbox property
   * when creating a new entry.
   */
  defaultChecked: boolean;
}

export interface CollectionSelectPropertySchema {
  type: CollectionPropertyType.Select;
  options: CollectionSelectPropertyOption[];
}

export interface CollectionMultiSelectPropertySchema {
  type: CollectionPropertyType.MultiSelect;
  options: CollectionSelectPropertyOption[];
}

export interface CollectionSelectPropertyOption {
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
