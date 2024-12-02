import { describe, afterEach, it, expect, vi } from 'vitest';
import { fetchBookmarkMetadata } from './fetchBookmarkMetadata';
import { Block, MindDropApi } from '@minddrop/extension';

const blockId = 'block-id';
const url = 'https://example.com';

const webpageMetadata = {
  title: 'Test title',
  description: 'Test description',
  image: 'https://example.com/image.png',
  icon: 'https://example.com/icon.png',
};

let block = { id: blockId, url } as Block;

const getWebpageMetadata = vi.fn().mockResolvedValue(webpageMetadata);
const downloadAsset = vi.fn();

const updateBlock = vi
  .fn()
  .mockImplementation((id: string, data: Partial<Block>) => {
    block = { ...block, ...data };
  });

const MockApi = {
  Utils: {
    getWebpageMetadata,
    getFileExtensionFromUrl: () => 'png',
  },
  Assets: {
    download: downloadAsset,
  },
  Blocks: {
    update: updateBlock,
  },
} as unknown as MindDropApi;

describe('fetchBookmarkMetadata', () => {
  afterEach(() => {
    block = { id: blockId, url } as Block;

    vi.clearAllMocks();
  });

  it('updates the title', async () => {
    await fetchBookmarkMetadata(MockApi, block);

    expect(updateBlock).toHaveBeenCalledWith(blockId, expect.any(Object));
    expect(block.title).toBe(webpageMetadata.title);
  });

  it('updates the description', async () => {
    await fetchBookmarkMetadata(MockApi, block);

    expect(block.description).toBe(webpageMetadata.description);
  });

  it('downloads the image and adds it to the block', async () => {
    await fetchBookmarkMetadata(MockApi, block);

    expect(downloadAsset).toHaveBeenCalledWith(
      blockId,
      'image.png',
      webpageMetadata.image,
    );

    expect(block.image).toBe('image.png');
  });

  it('downloads the icon and adds it to the block', async () => {
    // Remove image so that only the icon is downloaded
    getWebpageMetadata.mockResolvedValueOnce({
      ...webpageMetadata,
      image: undefined,
    });

    await fetchBookmarkMetadata(MockApi, block);

    expect(downloadAsset).toHaveBeenCalledWith(
      blockId,
      'icon.png',
      webpageMetadata.icon,
    );

    expect(block.icon).toBe('icon.png');
  });

  it('ignores image if it fails to download', async () => {
    downloadAsset.mockRejectedValueOnce(new Error('Failed to download'));

    await fetchBookmarkMetadata(MockApi, block);

    expect(block.image).toBeUndefined();
  });

  it('ignores icon if it fails to download', async () => {
    // Remove image so that only the icon is downloaded
    getWebpageMetadata.mockResolvedValueOnce({
      ...webpageMetadata,
      image: undefined,
    });
    downloadAsset.mockRejectedValueOnce(new Error('Failed to download'));

    await fetchBookmarkMetadata(MockApi, block);

    expect(block.icon).toBeUndefined();
  });
});
