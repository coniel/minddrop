import { MockFileSystem } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { defaultDesigns } from '../default-designs';
import { designFiles, designs, designsRootPath } from './fixtures';

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
  // Set the designs root path
  Paths.designs = designsRootPath;

  // Add the designs root path to the mock file system
  MockFs.createDir(designsRootPath, { recursive: true });

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
