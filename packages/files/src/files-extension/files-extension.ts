import { Core } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { Files } from '../Files';
import { FileReferencesResource } from '../FileReferencesResource';

export function onRun(core: Core) {
  // Register the 'files:file-reference' resource
  Resources.register(core, FileReferencesResource);

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
