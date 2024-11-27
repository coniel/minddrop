import { ContentColor } from '@minddrop/core';

export interface BlockPropertyText {
  name: string;
  type: 'text';
}

export interface BlockPropertyRichText {
  name: string;
  type: 'rich-text';
}

export interface BlockPropertyNumber {
  name: string;
  type: 'number';
}

export interface BlockPropertyFile {
  name: string;
  type: 'file';
  fileTypes?: string[];
}

export interface BlockPropertyAsset {
  name: string;
  type: 'asset';
}

export interface BlockPropertySelect {
  name: string;
  type: 'select';
  options?: SelectOption[];
}

export interface BlockPropertyMultiselect {
  name: string;
  type: 'multiselect';
  options?: SelectOption[];
}

export interface BlockPropertyColor {
  name: string;
  type: 'color';
}

export interface BlockPropertyCheckbox {
  name: string;
  type: 'checkbox';
}

export interface BlockPropertyDate {
  name: string;
  type: 'date';
}

export interface SelectOption {
  value: string;
  color: ContentColor;
}

export type BlockPropertySchema =
  | BlockPropertyText
  | BlockPropertyRichText
  | BlockPropertyNumber
  | BlockPropertyFile
  | BlockPropertyAsset
  | BlockPropertySelect
  | BlockPropertyMultiselect
  | BlockPropertyColor
  | BlockPropertyCheckbox
  | BlockPropertyDate;

export type BlockPropertiesSchema = BlockPropertySchema[];
