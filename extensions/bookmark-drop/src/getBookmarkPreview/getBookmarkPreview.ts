import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { getWebpageMedata } from '@minddrop/utils';
import { Drops } from '@minddrop/drops';
import { UpdateBookmarkDropData } from '../types';

/**
 * Fetches the preview data for a URL and updates
 * the drop, adding the preview data.
 *
 * @param core - A MindDrop core instance.
 * @param dropId - The ID of the drop.
 * @param url - The URL from which to fetch the preview.
 * @param callback - Callback fired when the preview has been fetched.
 */
export async function getBookmarkPreview(
  core: Core,
  dropId: string,
  url: string,
  callback: VoidFunction,
) {
  // Get the webpage metadata
  const metadata = await getWebpageMedata(url);

  // Drop update data containing the preview data
  const updateData: UpdateBookmarkDropData = {
    hasPreview: true,
    title: metadata.title,
  };

  if (metadata.description) {
    // Add the description if present
    updateData.description = metadata.description;
  }

  try {
    if (metadata.image) {
      // If the metadata contains an image URL,
      // download the image.
      const reference = await Files.download(core, metadata.image);

      // Set the image file reference ID as the
      // bookmark preview image.
      updateData.image = reference.id;
    }
  } catch (error) {
    //
  }

  // Update the drop, adding the preview data
  Drops.update<UpdateBookmarkDropData>(core, dropId, updateData);

  // Call the ending callback
  callback();
}
