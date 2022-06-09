import { imageFile, textFile } from '@minddrop/test-utils';
import { Resources } from '@minddrop/resources';
import { cleanup, core } from '../test-utils';
import { Files } from '../Files';
import { onRun, onDisable } from './files-extension';
import { saveFile } from '../saveFile';

describe('files extension', () => {
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

    it('adds dimensions to image file references', (done) => {
      // Run the extension
      onRun(core);

      // Listen to 'files:file-references:update' events
      Files.addEventListener(core, 'files:file-reference:update', (payload) => {
        expect(payload.data.after.dimensions).toBeDefined();
        done();
      });

      // Save an image file
      saveFile(core, imageFile);
    });

    it('deletes files when the last parent is removed', () => {
      // Run the extension
      onRun(core);

      // Save a couple of files
      const fileRef1 = Files.save(core, textFile);
      const fileRef2 = Files.save(core, imageFile);

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
