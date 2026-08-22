import { MockFileSystem } from '@minddrop/file-system';
import { AutomationsStore } from '../AutomationsStore';
import { resolveAutomationsDirPath } from '../utils';
import { automations, getAutomationFiles } from './automations.fixtures';

export interface SetupAutomationFixturesOptions {
  loadAutomations?: boolean;
  loadAutomationFiles?: boolean;
}

export function setupAutomationFixtures(
  MockFs: MockFileSystem,
  options: SetupAutomationFixturesOptions = {
    loadAutomations: true,
    loadAutomationFiles: true,
  },
) {
  // Create the automations directory
  MockFs.createDir(resolveAutomationsDirPath(), { recursive: true });

  if (options.loadAutomations !== false) {
    // Load automations into the store
    AutomationsStore.load(automations);
  }

  if (options.loadAutomationFiles !== false) {
    // Load automation files into the mock file system
    MockFs.addFiles(getAutomationFiles());
  }
}

export function cleanupAutomationFixtures() {
  AutomationsStore.clear();
}
