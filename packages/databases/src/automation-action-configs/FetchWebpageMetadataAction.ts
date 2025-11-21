import { PropertyValue } from '@minddrop/properties';
import { getWebpageMetadata } from '@minddrop/utils';
import { downloadDatabaseEntryAsset } from '../downloadDatabaseEntryAsset';
import { ensureDatabaseEntryAssetsDirExists } from '../ensureDatabaseEntryAssetsDirExists';
import {
  DatabaseAutomationAction,
  DatabaseAutomationUpdatePropertyActionConfig,
  DatabaseEntry,
} from '../types';
import { updateDatabaseEntry } from '../updateDatabaseEntry';

interface MetadataPropertyMapping {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
}

// Translation key roots
const fetchWebpageMetadata = 'automations.fetchWebpageMetadata';
const propertySetters = `${fetchWebpageMetadata}.propertySetters`;

export const FetchWebpageMetadataActionConfig: DatabaseAutomationUpdatePropertyActionConfig =
  {
    type: 'fetch-webpage-metadata',

    name: `${fetchWebpageMetadata}.name`,
    description: `${fetchWebpageMetadata}.description`,

    supportedTriggers: ['update-property'],

    supportedTriggerPropertyTypes: ['url'],

    run: updateDatabaseEntryWithMetadata,

    /**
     * Map of webpage metadata values to database properties.
     */
    propertySetters: [
      {
        name: `${propertySetters}.title.name`,
        description: `${propertySetters}.title.description`,
        supportedPropertyTypes: ['text', 'title'],
      },
      {
        name: `${propertySetters}.description.name`,
        description: `${propertySetters}.description.description`,
        supportedPropertyTypes: ['text', 'text-formatted'],
      },
      {
        name: `${propertySetters}.icon.name`,
        description: `${propertySetters}.icon.description`,
        supportedPropertyTypes: ['image', 'icon'],
      },
      {
        name: `${propertySetters}.image.name`,
        description: `${propertySetters}.image.description`,
        supportedPropertyTypes: ['image'],
      },
    ],
  };

async function updateDatabaseEntryWithMetadata(
  action: DatabaseAutomationAction,
  entry: DatabaseEntry,
  updatedPropertyValue: PropertyValue,
): Promise<void> {
  const propertyMapping = action.propertyMapping as MetadataPropertyMapping;

  // Ensure the updated property value is a string and the action has a property mapping
  if (typeof updatedPropertyValue !== 'string' || !propertyMapping) {
    return;
  }

  let updatedDatabaseEntry = entry;
  // Fetch webpage metadata
  const metadata = await getWebpageMetadata(updatedPropertyValue);

  // Update the entry's properties with the fetched metadata.
  // If an icon or image is provided in the metadata, download them.
  const properties: Record<string, string> = {};
  const downloads: Promise<string | false>[] = [];
  let iconPromise: Promise<string | false> | undefined;
  let imageAsset: Promise<string | false> | undefined;

  // Rename the entry using the webpage title if available
  if (metadata.title && propertyMapping.title) {
    properties[propertyMapping.title] = metadata.title;
  }

  if (metadata.description && propertyMapping.description) {
    properties[propertyMapping.description] = metadata.description;
  }

  // Ensure the entry's assets directory exists. This is done internally by
  // downloadDatabaseEntryAsset, but because we may be downloading multiple assets
  // concurrently, the internal calls may conflict with each other.
  await ensureDatabaseEntryAssetsDirExists(updatedDatabaseEntry.id);

  if (metadata.icon) {
    // TODO: Check property type and save image to appropriate location
    iconPromise = downloadDatabaseEntryAsset(
      updatedDatabaseEntry.id,
      metadata.icon,
      'icon',
    );

    downloads.push(iconPromise);
  }

  if (metadata.image) {
    // TODO: Check property type and save image to appropriate location
    imageAsset = downloadDatabaseEntryAsset(
      updatedDatabaseEntry.id,
      metadata.image,
      'image',
    );

    downloads.push(imageAsset);
  }

  await Promise.all(downloads);

  if (iconPromise && propertyMapping.icon) {
    const iconName = await iconPromise;
    properties[propertyMapping.icon] = `asset:${iconName}`;
  }

  if (imageAsset && propertyMapping.image) {
    const imageName = await imageAsset;
    properties[propertyMapping.image] = imageName || '';
  }

  await updateDatabaseEntry(updatedDatabaseEntry.id, {
    properties,
  });
}
