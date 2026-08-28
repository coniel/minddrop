import { PropertyFileStorage } from '@minddrop/databases';
import { SelectOption } from '@minddrop/ui-primitives';
import { ViewOpenMode } from '@minddrop/views';

/**
 * The ways entries can be opened when clicked, offered as entry
 * open mode options in settings.
 */
export const entryOpenModeOptions: SelectOption<ViewOpenMode>[] = [
  {
    label: 'databases.settings.entryOpenMode.options.dialog.label',
    description: 'databases.settings.entryOpenMode.options.dialog.description',
    value: 'dialog',
  },
  {
    label: 'databases.settings.entryOpenMode.options.panel.label',
    description: 'databases.settings.entryOpenMode.options.panel.description',
    value: 'panel',
  },
  {
    label: 'databases.settings.entryOpenMode.options.inPlace.label',
    description: 'databases.settings.entryOpenMode.options.inPlace.description',
    value: 'in-place',
  },
  {
    label: 'databases.settings.entryOpenMode.options.newTab.label',
    description: 'databases.settings.entryOpenMode.options.newTab.description',
    value: 'new-tab',
  },
  {
    label: 'databases.settings.entryOpenMode.options.split.label',
    description: 'databases.settings.entryOpenMode.options.split.description',
    value: 'split',
  },
];

/**
 * The ways property files can be stored on disk, offered as
 * property file storage options in settings.
 */
export const propertyFileStorageOptions: SelectOption<PropertyFileStorage>[] = [
  {
    label: 'databases.settings.propertyFileStorage.options.root.label',
    description:
      'databases.settings.propertyFileStorage.options.root.description',
    value: 'root',
  },
  {
    label: 'databases.settings.propertyFileStorage.options.common.label',
    description:
      'databases.settings.propertyFileStorage.options.common.description',
    value: 'common',
  },
  {
    label: 'databases.settings.propertyFileStorage.options.property.label',
    description:
      'databases.settings.propertyFileStorage.options.property.description',
    value: 'property',
  },
  {
    label: 'databases.settings.propertyFileStorage.options.entry.label',
    description:
      'databases.settings.propertyFileStorage.options.entry.description',
    value: 'entry',
  },
];
