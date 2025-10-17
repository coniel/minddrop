import { BaseDirectory } from '@minddrop/file-system';
import {
  Icons,
  UserIcon,
  UserIconContentIcon,
  UserIconType,
} from '@minddrop/icons';
import {
  CollectionCheckboxPropertySchema,
  CollectionDatePropertySchema,
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
export const CollectionPropertiesDirName = 'properties';
// Relative path to the collection properties directory from the collection root
export const CollectionPropertiesDirPath = `${CollectionConfigDirName}/${CollectionPropertiesDirName}`;

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

export const TextPropertySchema: CollectionTextPropertySchema = {
  name: 'Text',
  type: CollectionPropertyType.Text,
  icon: Icons.stringify({
    icon: 'type',
    color: 'default',
    type: UserIconType.ContentIcon,
  }),
};

export const NumberPropertySchema: CollectionNumberPropertySchema = {
  name: 'Number',
  type: CollectionPropertyType.Number,
  icon: Icons.stringify({
    icon: 'hash',
    color: 'default',
    type: UserIconType.ContentIcon,
  }),
};

export const DatePropertySchema: CollectionDatePropertySchema = {
  name: 'Date',
  type: CollectionPropertyType.Date,
  locale: 'en-GB',
  format: { dateStyle: 'long', timeStyle: 'short' },
  icon: Icons.stringify({
    icon: 'calendar',
    color: 'default',
    type: UserIconType.ContentIcon,
  }),
};

export const CheckboxPropertySchema: CollectionCheckboxPropertySchema = {
  name: 'Checkbox',
  type: CollectionPropertyType.Checkbox,
  icon: Icons.stringify({
    icon: 'check-square',
    color: 'default',
    type: UserIconType.ContentIcon,
  }),
  defaultValue: false,
};

export const SelectPropertySchema: CollectionSelectPropertySchema = {
  name: 'Select',
  type: CollectionPropertyType.Select,
  icon: Icons.stringify({
    icon: 'chevron-down-circle',
    color: 'default',
    type: UserIconType.ContentIcon,
  }),
  options: [],
};

export const MultiSelectPropertySchema: CollectionMultiSelectPropertySchema = {
  name: 'Multi Select',
  type: CollectionPropertyType.MultiSelect,
  icon: Icons.stringify({
    icon: 'list',
    color: 'default',
    type: UserIconType.ContentIcon,
  }),
  options: [],
};

export const CollectionPropertySchemas: Record<
  CollectionPropertyType,
  CollectionPropertySchema
> = {
  [CollectionPropertyType.Text]: TextPropertySchema,
  [CollectionPropertyType.Number]: NumberPropertySchema,
  [CollectionPropertyType.Date]: DatePropertySchema,
  [CollectionPropertyType.Checkbox]: CheckboxPropertySchema,
  [CollectionPropertyType.Select]: SelectPropertySchema,
  [CollectionPropertyType.MultiSelect]: MultiSelectPropertySchema,
};
