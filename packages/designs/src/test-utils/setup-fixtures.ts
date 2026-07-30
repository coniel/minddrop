import { MockFileSystem } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
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
  // Create the designs directory
  MockFs.createDir(getDesignsDirPath(), { recursive: true });

  if (options.loadDesigns !== false) {
    // Load designs into the store (this also makes their inner layouts
    // queryable via LayoutsStore)
    DesignsStore.load(designs);
  }

  if (options.loadDesignFiles !== false) {
    // Add design files to the file system
    MockFs.addFiles(designFiles);
  }
}

export function cleanupDesignFixtures() {
  // Clear the designs store (LayoutsStore is derived, no explicit clear)
  DesignsStore.clear();
}
