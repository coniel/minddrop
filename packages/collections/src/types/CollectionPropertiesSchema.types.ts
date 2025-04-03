import { ContentColor } from '@minddrop/core';

export enum CollectionPropertyType {
  Created = 'created',
  LastModified = 'last-modified',
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
  type: CollectionPropertyType.LastModified;
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
  | CollectionLastModifiedPropertySchema
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
