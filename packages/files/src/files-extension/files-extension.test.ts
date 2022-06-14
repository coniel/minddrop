import { textFile } from '@minddrop/test-utils';
import { Resources } from '@minddrop/resources';
import { cleanup, core, fileStorageAdapter } from '../test-utils';
import { Files } from '../Files';
import { createFileReference } from '../createFileReference';
import { onRun, onDisable } from './files-extension';
import {
  registerFileStorageAdapter,
  unregisterFileStorageAdapter,
} from '../file-storage';

describe('files extension', () => {
  beforeAll(() => {
    registerFileStorageAdapter(fileStorageAdapter);
  });

  afterAll(() => {
    unregisterFileStorageAdapter();
  });

  afterEach(cleanup);

  describe('onRun', () => {
    it('registers the `files:file-reference` resource', () => {
      // Run the extension
      onRun(core);

      // Get the registered 'files:file-reference' resource config
      const resource = Resources.get('files:file-reference');

      // 'files:file-reference' resource should be registered
      expect(resource).toBeDefined();
    });

    it('deletes files when the last parent is removed', async () => {
      // Run the extension
      onRun(core);

      // Create a couple of file references
      const fileRef1 = await createFileReference(core, textFile);
      const fileRef2 = await createFileReference(core, textFile);

      // Add the first file as a parent on the second
      Files.addParents(core, fileRef2.id, [
        { resource: 'files:file-reference', id: fileRef1.id },
      ]);

      // Listen to 'files:file-reference:update' events
      Files.addEventListener(
        core,
        'files:file-reference:delete',
        ({ data }) => {
          // Should delete the file reference from which the
          // parents were removed.
          expect(data.id).toEqual(fileRef2.id);
          expect(data.deleted).toBe(true);
        },
      );

      // Remove the parent added above
      Files.removeParents(core, fileRef2.id, [
        { resource: 'files:file-reference', id: fileRef1.id },
      ]);
    });
  });

  describe('onDisable', () => {
    it('removes event listeners', () => {
      // Run the extension
      onRun(core);

      // Add an event listener
      Files.addEventListener(core, 'files:file-reference:create', jest.fn());

      // Disable the extension
      onDisable(core);

      // Should have cleared the event listener
      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
