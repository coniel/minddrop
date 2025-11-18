import { PropertyType } from '@minddrop/properties';

export interface DatabaseAutomationTriggerConfig {
  type: string;

  /**
   * The database to which the trigger applies.
   */
  database: string;

  /**
   * The property to which the trigger applies. Only applicable to property
   * based triggers.
   */
  property?: string;
}

export interface CreateEntryTrigger extends DatabaseAutomationTriggerConfig {
  type: 'create-entry';
}

export interface RenameEntryTrigger extends DatabaseAutomationTriggerConfig {
  type: 'rename-entry';
}

export interface DeleteEntryTrigger extends DatabaseAutomationTriggerConfig {
  type: 'delete-entry';
}

export interface UpdatePropertyTrigger extends DatabaseAutomationTriggerConfig {
  type: 'update-property';

  property: string;
}

export type DatabaseAutomationTrigger =
  | CreateEntryTrigger
  | RenameEntryTrigger
  | DeleteEntryTrigger
  | UpdatePropertyTrigger;

export interface UpdatePropertyTriggerSupportConfig {
  type: string;

  supportedPropertyTypes: PropertyType[];
}

export type SupportedTriggerConfig = UpdatePropertyTriggerSupportConfig;

export type PropertyMapping = Record<string, PropertyType | PropertyType[]>;

export interface PropertySetterConfig {
  name: string;
  description?: string;
  supportedPropertyTypes: PropertyType[];
}

export interface DatabaseAutomationActionTypeConfig {
  type: string;

  name: string;

  description: string;

  supportedTriggers: SupportedTriggerConfig[];

  /**
   * A map of value
   */
  propertySetters?: PropertySetterConfig[];
}

export const FetchWebpageMetadataAction: DatabaseAutomationActionTypeConfig = {
  type: 'fetch-webpage-metadata',

  name: 'automations.fetchWebpageMetadata.name',
  description: 'automations.fetchWebpageMetadata.description',

  supportedTriggers: [
    {
      type: 'update-property',
      supportedPropertyTypes: ['url'],
    },
  ],

  /**
   * Map of webpage metadata values to database properties.
   */
  propertySetters: [
    {
      name: 'automations.fetchWebpageMetadata.propertySetters.title.name',
      description:
        'automations.fetchWebpageMetadata.propertySetters.title.description',
      supportedPropertyTypes: ['text', 'title'],
    },
    {
      name: 'automations.fetchWebpageMetadata.propertySetters.description.name',
      description:
        'automations.fetchWebpageMetadata.propertySetters.description.description',
      supportedPropertyTypes: ['text', 'text-formatted'],
    },
    {
      name: 'automations.fetchWebpageMetadata.propertySetters.icon.name',
      description:
        'automations.fetchWebpageMetadata.propertySetters.icon.description',
      supportedPropertyTypes: ['image', 'icon'],
    },
    {
      name: 'automations.fetchWebpageMetadata.propertySetters.image.name',
      description:
        'automations.fetchWebpageMetadata.propertySetters.image.description',
      supportedPropertyTypes: ['image'],
    },
  ],
};

export interface FetchWebpageMetadataAction {
  type: 'fetch-webpage-metadata';

  /**
   * Map of webpage metadata values to database properties.
   */
  propertyMapping: {
    title: string;
    description: string;
    icon: string;
    image: string;
  };
}

export type DatabaseAutomationAction = FetchWebpageMetadataAction;

export interface DatabaseAutomation {
  /**
   * A unique identifier for the automation.
   */
  id: string;

  /**
   * The name of the automation.
   */
  name: string;

  /**
   * The database to which the automation applies.
   */
  database: string;

  /**
   * The automation description.
   */
  description?: string;

  /**
   * The automation triggers.
   */
  triggers: DatabaseAutomationTrigger[];

  /**
   * The automation actions.
   */
  actions: DatabaseAutomationAction[];
}
