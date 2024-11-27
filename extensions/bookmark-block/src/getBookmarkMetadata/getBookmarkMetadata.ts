import { Block, BlockData, MindDropApi } from '@minddrop/extension';

/**
 * Does something useful.
 */
export async function getBookmarkMetadata(
  MindDropApi: MindDropApi,
  block: Block,
): Promise<Pick<BlockData, 'title' | 'description' | 'image' | 'icon'>> {
  const { Utils } = MindDropApi;

  if (!block.url) {
    return {};
  }

  const result = await Utils.getWebpageMetadata(block.url);

  const data: BlockData = {
    title: result.title || block.url,
  };

  if (result.description) {
    data.description = result.description;
  }

  if (result.image) {
    data.image = result.image;
  }

  if (result.icon) {
    data.icon = result.icon;
  }

  return {};
}
