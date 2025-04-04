import { BaseDirectory } from '@minddrop/file-system';
import { UserIcon, UserIconContentIcon, UserIconType } from '@minddrop/icons';
import {
  CollectionCheckboxPropertySchema,
  CollectionCreatedPropertySchema,
  CollectionDatePropertySchema,
  CollectionLastModifiedPropertySchema,
  CollectionMarkdownPropertySchema,
  CollectionMultiSelectPropertySchema,
  CollectionNumberPropertySchema,
  CollectionPropertySchema,
  CollectionPropertyType,
  CollectionSelectPropertySchema,
  CollectionTextPropertySchema,
  CollectionsConfig,
} from './types';

export const CollectionsConfigDir = BaseDirectory.AppConfig;
export const CollectionsConfigFileName = 'collections.json';
export const CollectionConfigDirName = '.minddrop';
export const CollectionConfigFileName = 'collection.json';
export const CollectionHistoryDirName = 'History';
export const CollectionAnnotationsDirName = 'Annotations';

export const DefaultCollectionIcon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'folder',
  color: 'default',
};
export const MissingCollectionIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'alert-circle',
  color: 'red',
};

export const InitialCollectionsConfig: CollectionsConfig = {
  paths: [],
};

export const CreatedPropertySchema: CollectionCreatedPropertySchema = {
  type: CollectionPropertyType.Created,
};

export const LastModifiedPropertySchema: CollectionLastModifiedPropertySchema =
  {
    type: CollectionPropertyType.Modified,
  };

export const MarkdownPropertySchema: CollectionMarkdownPropertySchema = {
  type: CollectionPropertyType.Markdown,
};

export const TextPropertySchema: CollectionTextPropertySchema = {
  type: CollectionPropertyType.Text,
};

export const NumberPropertySchema: CollectionNumberPropertySchema = {
  type: CollectionPropertyType.Number,
};

export const DatePropertySchema: CollectionDatePropertySchema = {
  type: CollectionPropertyType.Date,
};

export const CheckboxPropertySchema: CollectionCheckboxPropertySchema = {
  type: CollectionPropertyType.Checkbox,
  defaultChecked: false,
};

export const SelectPropertySchema: CollectionSelectPropertySchema = {
  type: CollectionPropertyType.Select,
  options: [],
};

export const MultiSelectPropertySchema: CollectionMultiSelectPropertySchema = {
  type: CollectionPropertyType.MultiSelect,
  options: [],
};

export const CollectionPropertySchemas: Record<
  CollectionPropertyType,
  CollectionPropertySchema
> = {
  [CollectionPropertyType.Created]: CreatedPropertySchema,
  [CollectionPropertyType.Modified]: LastModifiedPropertySchema,
  [CollectionPropertyType.Markdown]: MarkdownPropertySchema,
  [CollectionPropertyType.Text]: TextPropertySchema,
  [CollectionPropertyType.Number]: NumberPropertySchema,
  [CollectionPropertyType.Date]: DatePropertySchema,
  [CollectionPropertyType.Checkbox]: CheckboxPropertySchema,
  [CollectionPropertyType.Select]: SelectPropertySchema,
  [CollectionPropertyType.MultiSelect]: MultiSelectPropertySchema,
};
