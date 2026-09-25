import { vi } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DesignElementConfigs } from '@minddrop/designs-next';
import { DesignElementConfigsRegistry } from '@minddrop/designs-next/test-utils';
import {
  cleanupDesignFixtures,
  setupDesignFixtures,
} from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { StandInElementFixtures } from '@minddrop/ui-designs-next/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

const { elementConfig_value } = StandInElementFixtures;

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load the workspace fixtures
  setupWorkspaceFixtures(MockFs);

  // Load the database and entry fixtures into the stores and the
  // mock file system, and the legacy layouts the entries fall back
  // to.
  DatabaseFixtures.setup(MockFs);
  setupDesignFixtures(MockFs);

  // Register the element type the card designs render
  DesignElementConfigs.register(elementConfig_value);
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  // Clear the stores, registries and fixtures
  DatabaseFixtures.cleanup();
  cleanupDesignFixtures();
  DesignElementConfigsRegistry.clear();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}
