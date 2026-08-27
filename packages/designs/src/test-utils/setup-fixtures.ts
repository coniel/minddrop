import { DataViewTypes } from '@minddrop/data-views';
import { dataViewTypes } from '@minddrop/data-views/test-utils';
import { MockFileSystem } from '@minddrop/file-system';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignsStore } from '../DesignsStore';
import { BuiltInDesignRoles } from '../roles';
import { resolveDesignsDirPath } from '../utils';
import { designs, getDesignFiles } from './fixtures';

export interface SetupDesignFixturesOptions {
  loadDesigns?: boolean;
  loadDesignFiles?: boolean;
  loadRoles?: boolean;
}

export function setupDesignFixtures(
  MockFs: MockFileSystem,
  options: SetupDesignFixturesOptions = {},
) {
  // Create the designs directory
  MockFs.createDir(resolveDesignsDirPath(), { recursive: true });

  if (options.loadDesigns !== false) {
    // Load designs into the store
    DesignsStore.load(designs);
  }

  if (options.loadDesignFiles !== false) {
    // Add design files to the file system
    MockFs.addFiles(getDesignFiles());
  }

  if (options.loadRoles !== false) {
    // Load the built-in roles into the registry
    DesignRolesStore.load(BuiltInDesignRoles);
  }

  // Load the data view types the collection element's variants
  // derive from
  DataViewTypes.Store.load(dataViewTypes);
}

export function cleanupDesignFixtures() {
  // Clear the designs store
  DesignsStore.clear();

  // Clear the role registry
  DesignRolesStore.clear();

  // Clear the data view type registry
  DataViewTypes.Store.clear();
}
