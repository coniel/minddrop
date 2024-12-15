import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseDirectory, initializeMockFileSystem } from '@minddrop/file-system';
import { render, userEvent } from '@minddrop/test-utils';
import { WORKSPACES_TEST_DATA, Workspaces } from '@minddrop/workspaces';
import { cleanup, setup } from '../../../test-utils';
import { QuickStartCard } from './QuickStartCard';

const DOCUMENTS_DIR = BaseDirectory.Documents;
const WORKSPACE_NAME = 'MindDrop Workspace';
const WORKSPACE_PATH = `${DOCUMENTS_DIR}/${WORKSPACE_NAME}`;

const appWindow = {
  close: vi.fn(),
};

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => appWindow,
}));

vi.mock('@tauri-apps/api/path', () => ({
  documentDir: async () => BaseDirectory.Documents,
}));

const MockFs = initializeMockFileSystem([
  // Workspaces config file
  WORKSPACES_TEST_DATA.workspcesConfigFileDescriptor,
  // Docuemnts dir
  DOCUMENTS_DIR,
]);

function renderTest() {
  return render(<QuickStartCard />, {
    translationKeyPrefix: 'workspaces.actions.quickstart',
  });
}

describe('QuickStartCard', () => {
  vi.spyOn(appWindow, 'close');

  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Reset mock file system
    MockFs.reset();
  });

  it('creates default workspace and closes the window', async () => {
    const { getByTranslatedText } = renderTest();

    // Click the start button
    await userEvent.click(getByTranslatedText('action'));

    // Creates a 'MindDrop Workspace' workspace in the
    // documents folder.
    expect(MockFs.exists(WORKSPACE_PATH)).toBeTruthy();

    // Closes the window
    expect(appWindow.close).toHaveBeenCalled();
  });

  describe('workspace dir already exists', () => {
    it('does not create the directory but adds the existing dir as the workspace', async () => {
      // Pretend that workspace dir exists
      MockFs.addFiles([WORKSPACE_NAME]);

      const { getByTranslatedText } = renderTest();

      // Click the start button
      await userEvent.click(getByTranslatedText('action'));

      // Adds the folder as a workspace
      expect(Workspaces.get(WORKSPACE_PATH)).not.toBeNull();
      // Closes the window
      expect(appWindow.close).toHaveBeenCalled();
    });
  });
});
