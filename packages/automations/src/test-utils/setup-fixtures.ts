import { MockFileSystem } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { AutomationsStore } from '../AutomationsStore';
import { resolveAutomationsDirPath } from '../utils';
import { automations, getAutomationFiles } from './automations.fixtures';

const { workspace_1 } = WorkspaceFixtures;

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
  MockFs.createDir(resolveAutomationsDirPath(workspace_1.path), {
    recursive: true,
  });

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
