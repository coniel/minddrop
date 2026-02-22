import { MockFileSystem } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { defaultDesigns } from '../default-designs';
import { getDesignsDirPath } from '../utils';
import { designFiles, designs } from './fixtures';

export interface SetupDesignFixturesOptions {
  loadDesigns?: boolean;
  loadDesignFiles?: boolean;
}

export function setupDesignFixtures(
  MockFs: MockFileSystem,
  options: SetupDesignFixturesOptions = {
    loadDesigns: true,
    loadDesignFiles: true,
  },
) {
  // Create the deisgns directory
  MockFs.createDir(getDesignsDirPath(), { recursive: true });

  if (options.loadDesigns !== false) {
    // Load default designs into the store
    DesignsStore.load(defaultDesigns);
    // Load designs into the store
    DesignsStore.load(designs);
  }

  if (options.loadDesignFiles !== false) {
    // Add design file to the file system
    MockFs.addFiles(designFiles);
  }
}

export function cleanupDesignFixtures() {
  // Clear stores
  DesignsStore.clear();
}
