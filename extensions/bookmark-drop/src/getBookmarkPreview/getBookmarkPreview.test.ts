import { Drop, Drops } from '@minddrop/drops';
import {
  DownloadFileError,
  FileReference,
  Files,
  FileStorageApi,
  onRun as onRunFiles,
} from '@minddrop/files';
import { Resources } from '@minddrop/resources';
import { getWebpageMedata } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { BookmarkDropData } from '../types';
import { getBookmarkPreview } from './getBookmarkPreview';

jest.mock('@minddrop/utils', () => ({
  ...(jest.requireActual('@minddrop/utils') as Object),
  getWebpageMedata: jest.fn().mockResolvedValue({
    domain: 'minddrop.app',
    title: 'title',
    description: 'description',
    image: 'image-url',
  }),
}));

// Create a test preview image file reference
const image: FileReference = Resources.generateDocument(
  'files:file-reference',
  {},
);

// Create a test drop
const drop: Drop<BookmarkDropData> = Resources.generateDocument('drops:drop', {
  type: 'bookmark',
  url: 'https://minddrop.app',
  hasPreview: false,
});

describe('getBookmarkPreview', () => {
  beforeEach(() => {
    setup();

    // Run the files extension
    onRunFiles(core);

    // Load test image file reference
    Files.store.load(core, [image]);
    // Load test drop
    Drops.store.load(core, [drop]);

    // Register a mock files storage adapter
    Files.registerStorageAdapter({
      // Return the test image file reference
      download: async () => image,
    } as unknown as FileStorageApi);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('fetches the preview data', async () => {
    // Get the preview
    await getBookmarkPreview(core, drop.id, drop.url, jest.fn());

    // Should call 'getWebpagePreview' with the drop's URL
    expect(getWebpageMedata).toHaveBeenCalledWith(drop.url);
  });

  it('downloads the preview image', async () => {
    jest.spyOn(Files, 'download');

    // Get the preview
    await getBookmarkPreview(core, drop.id, drop.url, jest.fn());

    // Should call 'Files.download' with the preview image URL
    expect(Files.download).toHaveBeenCalledWith(expect.anything(), 'image-url');
  });

  it('updates the drop with the preview data', async () => {
    // Get the preview
    await getBookmarkPreview(core, drop.id, drop.url, jest.fn());

    // Get the updated drop
    const updated = Drops.get<BookmarkDropData>(drop.id);

    // Drop should contain preview data
    expect(updated.title).toEqual('title');
    expect(updated.description).toBe('description');
    expect(updated.image).toBe(image.id);
    expect(updated.hasPreview).toBe(true);
  });

  it('calls the callback', async () => {
    // The callback function
    const callback = jest.fn();

    // Get the preview
    await getBookmarkPreview(core, drop.id, drop.url, callback);

    // Should call 'callback'
    expect(callback).toHaveBeenCalled();
  });

  it('handles image download failure', async () => {
    // The callback function
    const callback = jest.fn();
    // Throw an error when calling 'Files.download'
    jest.spyOn(Files, 'download').mockImplementation(() => {
      throw new DownloadFileError('error');
    });

    // Get the preview
    await getBookmarkPreview(core, drop.id, drop.url, callback);

    // Get the updated drop
    const updated = Drops.get<BookmarkDropData>(drop.id);

    // Drop should contain preview data
    expect(updated.title).toEqual('title');
    expect(updated.description).toBe('description');
    expect(updated.hasPreview).toBe(true);
    // Should call 'callback'
    expect(callback).toHaveBeenCalled();
    // Image should be undefined
    expect(updated.image).toBeUndefined();
  });
});
