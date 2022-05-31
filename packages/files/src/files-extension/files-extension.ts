import { Core } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { Files } from '../Files';
import { FileReferencesResource } from '../FileReferencesResource';
import { getImageDimensions } from '..';

async function addImageDimensions(core: Core, file: File, id: string) {
  // Get the image dimensions
  const dimensions = await getImageDimensions(file);

  // Update the file reference
  FileReferencesResource.update(core, id, {
    dimensions,
  });
}

export function onRun(core: Core) {
  // Register the 'files:file-reference' resource
  Resources.register(core, FileReferencesResource);

  // When an image file reference is created, we add
  // the image dimensions to it.
  Files.addEventListener(core, 'files:file:save', ({ data }) => {
    if (data.file.type.startsWith('image')) {
      addImageDimensions(core, data.file, data.fileReference.id);
    }
  });

  // Delete a file reference when all of its parents
  // are removed.
  Files.addEventListener(core, 'files:file-reference:update', ({ data }) => {
    if (
      data.before.parents &&
      data.before.parents.length &&
      (!data.after.parents || !data.after.parents.length)
    ) {
      FileReferencesResource.delete(core, data.after.id);
    }
  });
}

export function onDisable(core: Core) {
  // Clear the file references store
  FileReferencesResource.store.clear();
  // Remove event listeners
  core.removeAllEventListeners();
}
