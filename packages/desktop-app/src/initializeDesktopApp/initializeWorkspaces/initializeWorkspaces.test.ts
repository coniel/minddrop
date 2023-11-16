import { afterEach, describe, expect, it, vi } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Workspaces, WORKSPACES_TEST_DATA } from '@minddrop/workspaces';
import { CORE_TEST_DATA } from '@minddrop/core';
import { AppUiState } from '../../AppUiState';
import { initializeWorkspaces } from './initializeWorkspaces';

const { configsFileDescriptor } = CORE_TEST_DATA;
const { workspace1, workspacesConfig, workspcesConfigFileDescriptor } =
  WORKSPACES_TEST_DATA;

vi.mock('@tauri-apps/api/window', () => ({
  getAll: () => [],
  WebviewWindow: vi.fn(),
}));

const MockFs = initializeMockFileSystem([
  // Persistant configs file
  configsFileDescriptor,
  // Workspaces config file
  workspcesConfigFileDescriptor,
  // Workspace 1
  workspace1.path,
]);

describe('initializeWorkspaces', () => {
  afterEach(() => {
    // Reset view
    AppUiState.set('view', null);

    // Clear workspaces
    Workspaces._clear();

    // Reset mock file system
    MockFs.reset();
  });

  it('sets view to null if load throw FileNotFoundError', async () => {
    // Pretend workspaces config file does not exist
    MockFs.removeFile(
      workspcesConfigFileDescriptor.path,
      workspcesConfigFileDescriptor.options,
    );

    // Initialize workspaces
    await initializeWorkspaces();

    // Should set view to 'create-first-workspace'
    expect(AppUiState.get('view')).toBeNull();
  });

  it('sets view to null if load throw JsonParseError', async () => {
    // Pretend workspaces config could not be parsed
    MockFs.setFiles([
      configsFileDescriptor,
      { ...workspcesConfigFileDescriptor, textContent: 'foo' },
    ]);

    // Initialize workspaces
    await initializeWorkspaces();

    // Should set view to 'create-first-workspace'
    expect(AppUiState.get('view')).toBeNull();
  });

  it('sets view to null if config contains no workspaces', async () => {
    // Pretend workspaces config contains no workspaces
    MockFs.setFiles([
      configsFileDescriptor,
      {
        ...workspcesConfigFileDescriptor,
        textContent: JSON.stringify({ ...workspacesConfig, paths: [] }),
      },
    ]);

    // Initialize workspaces
    await initializeWorkspaces();

    // Should set view to 'create-first-workspace'
    expect(AppUiState.get('view')).toBeNull();
  });

  it('sets view to `no-valid-workspace` if config contains no workspaces', async () => {
    // Pretend that there are no workspaces despite some being listed
    // in the workspaces config.
    vi.spyOn(Workspaces, 'hasValidWorkspace').mockReturnValue(false);

    // Initialize workspaces
    await initializeWorkspaces();

    // Should set view to 'no-valid-workspace'
    expect(AppUiState.get('view')).toBe('no-valid-workspace');
  });
});
