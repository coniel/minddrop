import { initializeCore } from '@minddrop/core';
import { textFile } from '@minddrop/test-utils';
import { FileReferencesResource } from '../FileReferencesResource';
import { FileReference } from '../types';
import { saveFile } from './saveFile';

const core = initializeCore({ appId: 'app', extensionId: 'files' });

describe('createFile', () => {
  afterEach(() => {
    // Clear the file resources store
    FileReferencesResource.store.clear();
  });

  it('creates a file reference', () => {
    // Save a file
    const fileReference = saveFile(core, textFile);

    // File reference should be in the store
    expect(FileReferencesResource.get(fileReference.id)).toEqual(fileReference);
    // File reference should contain the file data
    expect(fileReference.name).toEqual(textFile.name);
    expect(fileReference.type).toEqual(textFile.type);
    expect(fileReference.size).toEqual(textFile.size);
  });

  it('dispatches a `files:file:save` event', (done) => {
    let fileReference: FileReference;

    // Listen to 'files:file:save' events
    core.addEventListener('files:file:save', (payload) => {
      // Payload data should contain the file
      expect(payload.data.file).toEqual(textFile);
      // Payload data should contain the file reference
      expect(payload.data.fileReference).toEqual(fileReference);
      done();
    });

    // Save a file
    fileReference = saveFile(core, textFile);
  });
});
