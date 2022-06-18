import { textFile } from '@minddrop/test-utils';
import { core, fileStorageAdapter, textFileRef1 } from '../test-utils';
import {
  registerFileStorageAdapter,
  unregisterFileStorageAdapter,
} from '../file-storage';
import { FileReferencesResource } from '../FileReferencesResource';
import { saveFile } from './saveFile';

describe('saveFile', () => {
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
    // Save a file
    const fileReference = await saveFile(core, textFile);

    // Should return the file reference
    expect(fileReference).toEqual(textFileRef1);
  });

  it('saves the file using the file storage adapter', async () => {
    jest.spyOn(fileStorageAdapter, 'save');

    // Save a file
    await saveFile(core, textFile);

    // Should save the file using the file storage adapter's
    // 'save' method.
    expect(fileStorageAdapter.save).toHaveBeenCalledWith(core, textFile);
  });

  it('dispatches a `files:file:save` event', (done) => {
    // Listen to 'files:file:save' events
    core.addEventListener('files:file:save', (payload) => {
      // Payload data should be the file reference
      expect(payload.data).toEqual(textFileRef1);
      done();
    });

    // Save a file
    saveFile(core, textFile);
  });
});
