import { Block, MindDropApi } from '@minddrop/extension';

/**
 * Fethces metadata from the block URL and updates the
 * block title, description, image, and icon.
 *
 * @param API - The MindDrop API.
 * @param block - The block to fetch metadata for.
 */
export async function fetchBookmarkMetadata(
  API: MindDropApi,
  block: Block,
): Promise<void> {
  const { Utils, Assets, Blocks } = API;

  if (!block.url) {
    return;
  }

  // Fetch metadata from the URL
  const metadata = await Utils.getWebpageMetadata(block.url);

  const updates: Partial<Block> = {};
  const assets: Promise<void>[] = [];
  const image = metadata.image;
  const icon = metadata.icon;

  // Add title if present
  if (metadata.title) {
    updates.title = metadata.title;
  }

  // Add description if present
  if (metadata.description) {
    updates.description = metadata.description;
  }

  // If the metadata contains an image URL, download the image
  // to assets and add it as the block image.
  if (image) {
    assets.push(
      new Promise(async (resolve) => {
        const extension = Utils.getFileExtensionFromUrl(image);
        const filename = `image.${extension}`;

        try {
          await Assets.download(block.id, filename, image);

          updates.image = filename;
        } catch (error) {
          console.error(error);
        }

        resolve();
      }),
    );
  }

  // If the metadata contains an icon URL, download the icon
  // to assets and add it as the block icon.
  if (icon) {
    assets.push(
      new Promise(async (resolve) => {
        const extension = Utils.getFileExtensionFromUrl(icon);
        const filename = `icon.${extension}`;

        try {
          await Assets.download(block.id, filename, icon);

          updates.icon = filename;
        } catch (error) {
          console.error(error);
        }

        resolve();
      }),
    );
  }

  // Wait for all asset downloads
  await Promise.all(assets);

  // Update the block
  Blocks.update(block.id, updates);
}
