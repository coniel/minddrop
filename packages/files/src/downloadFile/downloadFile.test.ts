import { core, fileStorageAdapter, textFileRef1 } from '../test-utils';
import {
  registerFileStorageAdapter,
  unregisterFileStorageAdapter,
} from '../file-storage';
import { FileReferencesResource } from '../FileReferencesResource';
import { downloadFile } from './downloadFile';

describe('downloadFile', () => {
  beforeEach(() => {
    // Register a test file storage adapter
    registerFileStorageAdapter(fileStorageAdapter);
  });

  afterEach(() => {
    // Clear the file resources store
    FileReferencesResource.store.clear();
    // Unregister the test file storage adapter
    unregisterFileStorageAdapter();
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('returns the file reference', async () => {
    // Download a file
    const fileReference = await downloadFile(core, 'file-url');

    // Should return the file reference
    expect(fileReference).toEqual(textFileRef1);
  });

  it('downloads the file using the file storage adapter', async () => {
    jest.spyOn(fileStorageAdapter, 'download');

    // Download a file
    await downloadFile(core, 'file-url');

    // Should download the file using the file storage adapter's
    // 'download' method.
    expect(fileStorageAdapter.download).toHaveBeenCalledWith(core, 'file-url');
  });

  it('dispatches a `files:file:save` event', (done) => {
    // Listen to 'files:file:save' events
    core.addEventListener('files:file:save', (payload) => {
      // Payload data should be the file reference
      expect(payload.data).toEqual(textFileRef1);
      done();
    });

    // Download a file
    downloadFile(core, 'file-url');
  });
});
