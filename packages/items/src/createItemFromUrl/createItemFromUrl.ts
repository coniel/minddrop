import { getWebpageMetadata, titleFromUrl } from '@minddrop/utils';
import { createItem } from '../createItem';
import { downloadItemAsset } from '../downloadItemAsset';
import { ensureItemAssetsDirExists } from '../ensureItemAssetsDirExists';
import { renameItem } from '../renameItem';
import { Item } from '../types';
import { updateItem } from '../updateItem';

/**
 * Creates a new item of the specified type from a URL.
 *
 * The item is created with the URL as a property. If `skipMetadataFetch`
 * is false, the function fetches metadata from the webpage at the URL
 * (such as title, description, icon, and image) and updates the item
 * accordingly.
 *
 * @param type - The type of item to create.
 * @param url - The URL to create the item from.
 * @param skipMetadataFetch - Whether to skip fetching metadata from the webpage.
 * @returns A promise that resolves to the newly created item.
 */
export async function createItemFromUrl(
  type: string,
  url: string,
  skipMetadataFetch = false,
): Promise<Item> {
  // Create the item
  let item = await createItem(type, titleFromUrl(url), { url });

  if (!skipMetadataFetch) {
    // Fetch and update the item with webpage metadata
    updateItemWithMetadata(item);
  }

  // Return the created item. The item may be updated asynchronously
  // after being returned to add the fetched metadata.
  return item;
}

async function updateItemWithMetadata(
  item: Item<{ url: string }>,
): Promise<void> {
  let updatedItem = item;
  // Fetch webpage metadata
  const metadata = await getWebpageMetadata(item.properties.url);

  // Rename the item using the webpage title if available
  if (metadata.title) {
    updatedItem = await renameItem(item.path, metadata.title, true);
  }

  // Update the item's properties with the fetched metadata.
  // If an icon or image is provided in the metadata, download and
  // set them as the item's icon and image.
  const coreProperties: Record<string, string> = {};
  const properties: Record<string, string> = {};
  const downloads: Promise<string | false>[] = [];
  let iconPromise: Promise<string | false> | undefined;
  let imageAsset: Promise<string | false> | undefined;

  if (metadata.description) {
    properties.description = metadata.description;
  }

  // Ensure the item's assets directory exists. This is done internally by
  // downloadItemAsset, but because we may be downloading multiple assets
  // concurrently, the internal calls may conflict with each other.
  await ensureItemAssetsDirExists(updatedItem.path);

  if (metadata.icon) {
    iconPromise = downloadItemAsset(updatedItem.path, metadata.icon, 'icon');

    downloads.push(iconPromise);
  }

  if (metadata.image) {
    imageAsset = downloadItemAsset(updatedItem.path, metadata.image, 'image');

    downloads.push(imageAsset);
  }

  await Promise.all(downloads);

  if (iconPromise) {
    const iconName = await iconPromise;
    coreProperties.icon = `asset:${iconName}`;
  }

  if (imageAsset) {
    const imageName = await imageAsset;
    coreProperties.image = imageName || '';
  }

  await updateItem(updatedItem.path, { ...coreProperties, properties });
}
